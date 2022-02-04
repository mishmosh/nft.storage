/* eslint-env serviceworker, browser */
/* global Response caches */

import pAny from 'p-any'
import pSettle from 'p-settle'

import { getCidFromSubdomainUrl } from './utils/cid.js'
import {
  CIDS_TRACKER_ID,
  SUMMARY_METRICS_ID,
  CF_CACHE_MAX_OBJECT_SIZE,
  HTTP_STATUS_RATE_LIMITED,
  REQUEST_PREVENTED_RATE_LIMIT_CODE,
} from './constants.js'

/**
 * @typedef {Object} GatewayResponse
 * @property {Response} [response]
 * @property {string} url
 * @property {number} [responseTime]
 * @property {string} [requestPreventedCode]
 *
 * @typedef {import('./env').Env} Env
 */

/**
 * Handle gateway request
 *
 * @param {Request} request
 * @param {Env} env
 * @param {import('./index').Ctx} ctx
 */
export async function gatewayGet(request, env, ctx) {
  const startTs = Date.now()
  const cache = caches.default
  let res = await cache.match(request.url)

  if (res) {
    // Update cache metrics in background
    const responseTime = Date.now() - startTs

    ctx.waitUntil(updateSummaryCacheMetrics(request, env, res, responseTime))
    return res
  }

  const reqUrl = new URL(request.url)
  const cid = getCidFromSubdomainUrl(reqUrl)
  const pathname = reqUrl.pathname

  const gatewayReqs = env.ipfsGateways.map((gwUrl) =>
    gatewayFetch(gwUrl, cid, request, env, {
      pathname,
      timeout: env.REQUEST_TIMEOUT,
    })
  )

  try {
    /** @type {GatewayResponse} */
    const winnerGwResponse = await pAny(gatewayReqs, {
      filter: (res) => res.response?.ok,
    })

    async function settleGatewayRequests() {
      // Wait for remaining responses
      const responses = await pSettle(gatewayReqs)
      const successFullResponses = responses.filter(
        (r) => r.value?.response?.ok
      )

      await Promise.all([
        // Filter out winner and update remaining gateway metrics
        ...responses
          .filter((r) => r.value?.url !== winnerGwResponse.url)
          .map((r) => updateGatewayMetrics(request, env, r.value, false)),
        updateCidsTracker(request, env, successFullResponses, cid),
      ])
    }

    ctx.waitUntil(
      (async () => {
        const contentLengthMb = Number(
          winnerGwResponse.response.headers.get('content-length')
        )

        await Promise.all([
          storeWinnerGwResponse(request, env, winnerGwResponse),
          settleGatewayRequests(),
          // Cache request URL in Cloudflare CDN if smaller than CF_CACHE_MAX_OBJECT_SIZE
          contentLengthMb <= CF_CACHE_MAX_OBJECT_SIZE &&
            cache.put(request.url, winnerGwResponse.response.clone()),
        ])
      })()
    )

    // forward winner gateway response
    return winnerGwResponse.response
  } catch (err) {
    const responses = await pSettle(gatewayReqs)

    ctx.waitUntil(
      (async () => {
        // Update metrics as all requests failed
        await Promise.all(
          responses.map((r) =>
            updateGatewayMetrics(request, env, r.value, false)
          )
        )
      })()
    )

    // Redirect if all failed with rate limited error
    const wasRateLimited = responses.every(
      (r) =>
        r.value?.response?.status === HTTP_STATUS_RATE_LIMITED ||
        r.value?.requestPreventedCode === REQUEST_PREVENTED_RATE_LIMIT_CODE
    )

    if (!wasRateLimited) {
      const ipfsUrl = new URL('ipfs', env.IPFS_GATEWAYS[0])
      return Response.redirect(`${ipfsUrl.toString()}/${cid}${pathname}`, 302)
    }

    throw err
  }
}

/**
 * Store metrics for winner gateway response
 *
 * @param {Request} request
 * @param {Env} env
 * @param {GatewayResponse} winnerGwResponse
 */
async function storeWinnerGwResponse(request, env, winnerGwResponse) {
  await Promise.all([
    updateGatewayMetrics(request, env, winnerGwResponse, true),
    updateSummaryWinnerMetrics(request, env, winnerGwResponse),
  ])
}

/**
 * Fetches given CID from given IPFS gateway URL.
 *
 * @param {string} gwUrl
 * @param {string} cid
 * @param {Request} request
 * @param {Env} env
 * @param {Object} [options]
 * @param {string} [options.pathname]
 * @param {number} [options.timeout]
 */
async function gatewayFetch(
  gwUrl,
  cid,
  request,
  env,
  { pathname = '', timeout = 20000 } = {}
) {
  // Block before hitting rate limit if needed
  const { shouldBlock } = await getGatewayRateLimitState(request, env, gwUrl)

  if (shouldBlock) {
    /** @type {GatewayResponse} */
    return {
      url: gwUrl,
      requestPreventedCode: REQUEST_PREVENTED_RATE_LIMIT_CODE,
    }
  }

  const ipfsUrl = new URL('ipfs', gwUrl)
  const controller = new AbortController()
  const startTs = Date.now()
  const timer = setTimeout(() => controller.abort(), timeout)

  let response
  try {
    response = await fetch(`${ipfsUrl.toString()}/${cid}${pathname}`, {
      signal: controller.signal,
      headers: getHeaders(request),
    })
  } finally {
    clearTimeout(timer)
  }

  /** @type {GatewayResponse} */
  const gwResponse = {
    response,
    url: gwUrl,
    responseTime: Date.now() - startTs,
  }
  return gwResponse
}

/**
 * @param {Request} request
 */
function getHeaders(request) {
  const existingProxies = request.headers['X-Forwarded-For']
    ? `, ${request.headers['X-Forwarded-For']}`
    : ''
  return {
    'X-Forwarded-For': `${request.headers['cf-connecting-ip']}${existingProxies}`,
  }
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {Response} response
 * @param {number} responseTime
 */
async function updateSummaryCacheMetrics(request, env, response, responseTime) {
  // Get durable object for gateway
  const id = env.summaryMetricsDurable.idFromName(SUMMARY_METRICS_ID)
  const stub = env.summaryMetricsDurable.get(id)

  /** @type {import('./durable-objects/summary-metrics').FetchStats} */
  const contentLengthStats = {
    contentLength: Number(response.headers.get('content-length')),
    responseTime,
  }

  await stub.fetch(
    getDurableRequestUrl(request, 'metrics/cache', contentLengthStats)
  )
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {string} gwUrl
 */
async function getGatewayRateLimitState(request, env, gwUrl) {
  // Get durable object for gateway rate limits
  const id = env.gatewayRateLimitsDurable.idFromName(gwUrl)
  const stub = env.gatewayRateLimitsDurable.get(id)

  const stubResponse = await stub.fetch(
    getDurableRequestUrl(request, 'request')
  )

  /** @type {import('./durable-objects/gateway-rate-limits').RateLimitResponse} */
  const rateLimitResponse = await stubResponse.json()
  return rateLimitResponse
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {GatewayResponse} gwResponse
 */
async function updateSummaryWinnerMetrics(request, env, gwResponse) {
  // Get durable object for gateway
  const id = env.summaryMetricsDurable.idFromName(SUMMARY_METRICS_ID)
  const stub = env.summaryMetricsDurable.get(id)

  /** @type {import('./durable-objects/summary-metrics').FetchStats} */
  const fetchStats = {
    responseTime: gwResponse.responseTime,
    contentLength: Number(gwResponse.response.headers.get('content-length')),
  }

  await stub.fetch(getDurableRequestUrl(request, 'metrics/winner', fetchStats))
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {GatewayResponse} gwResponse
 * @param {boolean} [isWinner = false]
 */
async function updateGatewayMetrics(
  request,
  env,
  gwResponse,
  isWinner = false
) {
  // Get durable object for gateway
  const id = env.gatewayMetricsDurable.idFromName(gwResponse.url)
  const stub = env.gatewayMetricsDurable.get(id)

  /** @type {import('./durable-objects/gateway-metrics').FetchStats} */
  const fetchStats = {
    status: gwResponse.response?.status,
    winner: isWinner,
    responseTime: gwResponse.responseTime,
    requestPreventedCode: gwResponse.requestPreventedCode,
  }

  await stub.fetch(getDurableRequestUrl(request, 'update', fetchStats))
}

/**
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {import('p-settle').PromiseResult<GatewayResponse>[]} responses
 * @param {string} cid
 */
async function updateCidsTracker(request, env, responses, cid) {
  const id = env.cidsTrackerDurable.idFromName(CIDS_TRACKER_ID)
  const stub = env.cidsTrackerDurable.get(id)

  /** @type {import('./durable-objects/cids').CidUpdateRequest} */
  const updateRequest = {
    cid,
    urls: responses.filter((r) => r.isFulfilled).map((r) => r?.value?.url),
  }

  await stub.fetch(getDurableRequestUrl(request, 'update', updateRequest))
}

/**
 * Get a Request to update a durable object
 *
 * @param {Request} request
 * @param {string} route
 * @param {any} [data]
 */
function getDurableRequestUrl(request, route, data) {
  const reqUrl = new URL(
    route,
    request.url.startsWith('http') ? request.url : `http://${request.url}`
  )
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  return new Request(reqUrl.toString(), {
    headers,
    method: 'PUT',
    body: data && JSON.stringify(data),
  })
}

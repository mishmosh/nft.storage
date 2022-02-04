/* global Response caches */

import pMap from 'p-map'

import {
  METRICS_CACHE_MAX_AGE,
  SUMMARY_METRICS_ID,
  REDIRECT_COUNTER_METRICS_ID,
  HTTP_STATUS_SUCCESS,
} from './constants.js'
import { histogram } from './durable-objects/gateway-metrics.js'
import { contentLengthHistogram } from './durable-objects/summary-metrics.js'

/**
 * @typedef {import('./durable-objects/gateway-metrics').GatewayMetrics} GatewayMetrics
 * @typedef {import('./durable-objects/summary-metrics').SummaryMetrics} SummaryMetrics
 *
 * @typedef MetricsDurable
 * @property {SummaryMetrics} summaryMetrics
 * @property {Record<string,GatewayMetrics>} ipfsGateways
 * @property {number} gatewayRedirectCount
 */

/**
 * Retrieve metrics in prometheus exposition format.
 * https://prometheus.io/docs/instrumenting/exposition_formats/
 * @param {Request} request
 * @param {import('./env').Env} env
 * @param {import('./index').Ctx} ctx
 * @returns {Promise<Response>}
 */
export async function metricsGet(request, env, ctx) {
  // TODO: Set cache
  // const cache = caches.default
  // let res = await cache.match(request)

  // if (res) {
  //   return res
  // }
  let res

  const [summaryMetrics, ipfsGateways, gatewayRedirectCount] =
    await Promise.all([
      (async () => {
        const id = env.summaryMetricsDurable.idFromName(SUMMARY_METRICS_ID)
        const stub = env.summaryMetricsDurable.get(id)

        const stubResponse = await stub.fetch(request)
        /** @type {SummaryMetrics} */
        const summaryMetrics = await stubResponse.json()

        return summaryMetrics
      })(),
      pMap(env.ipfsGateways, async (gw) => {
        const id = env.gatewayMetricsDurable.idFromName(gw)
        const stub = env.gatewayMetricsDurable.get(id)

        const stubResponse = await stub.fetch(request)
        /** @type {GatewayMetrics} */
        const gwMetrics = await stubResponse.json()

        return {
          gwMetrics,
          gw,
        }
      }),
      (async () => {
        const id = env.gatewayRedirectCounter.idFromName(
          REDIRECT_COUNTER_METRICS_ID
        )
        const stub = env.gatewayRedirectCounter.get(id)

        const stubResponse = await stub.fetch(request)
        const { gatewayRedirectCount } = await stubResponse.json()

        return gatewayRedirectCount
      })(),
    ])

  /** @type {MetricsDurable} */
  const metricsCollected = {
    summaryMetrics,
    ipfsGateways: ipfsGateways.reduce(
      (obj, item) => Object.assign(obj, { [item.gw]: item.gwMetrics }),
      {}
    ),
    gatewayRedirectCount,
  }

  const totalResponsesPerGateway = []
  env.ipfsGateways.forEach((gw) => {
    totalResponsesPerGateway[gw] = Object.values(
      metricsCollected.ipfsGateways[gw].totalResponsesByStatus
    ).reduce((acc, v) => acc + v, 0)
  })

  const metrics = [
    `# HELP nftgateway_cache_hit_responses_total Total cached responses returned.`,
    `# TYPE nftgateway_cache_hit_responses_total counter`,
    `nftgateway_cache_hit_responses_total{env="${env.ENV}"} ${metricsCollected.summaryMetrics.totalCachedResponses}`,
    `# HELP nftgateway_winner_requests_total Total winner requests.`,
    `# TYPE nftgateway_winner_requests_total counter`,
    `nftgateway_winner_requests_total{env="${env.ENV}"} ${metricsCollected.summaryMetrics.totalWinnerSuccessfulRequests}`,
    `# HELP nftgateway_winner_response_time_seconds_total Accumulated winner response time.`,
    `# TYPE nftgateway_winner_response_time_seconds_total summary`,
    `nftgateway_winner_response_time_seconds_total{env="${env.ENV}"} ${msToS(
      metricsCollected.summaryMetrics.totalWinnerResponseTime
    )}`,
    `# HELP nftgateway_response_time_seconds_total Accumulated response time of each gateway.`,
    `# TYPE nftgateway_response_time_seconds_total summary`,
    ...env.ipfsGateways.map(
      (gw) =>
        `nftgateway_response_time_seconds_total{gateway="${gw}",env="${
          env.ENV
        }"} ${msToS(metricsCollected.ipfsGateways[gw].totalResponseTime) || 0}`
    ),
    `# HELP nftgateway_requests_total Total requests performed to each gateway.`,
    `# TYPE nftgateway_requests_total counter`,
    ...env.ipfsGateways.map(
      (gw) =>
        `nftgateway_requests_total{gateway="${gw}",env="${env.ENV}"} ${totalResponsesPerGateway[gw]}`
    ),
    `# HELP nftgateway_successful_requests_total Total successful requests performed to each gateway.`,
    `# TYPE nftgateway_successful_requests_total counter`,
    ...env.ipfsGateways.map(
      (gw) =>
        `nftgateway_successful_requests_total{gateway="${gw}",env="${
          env.ENV
        }"} ${
          metricsCollected.ipfsGateways[gw].totalResponsesByStatus[
            HTTP_STATUS_SUCCESS
          ] || 0
        }`
    ),
    `# HELP nftgateway_failed_requests_total Total failed requests performed to each gateway.`,
    `# TYPE nftgateway_failed_requests_total counter`,
    ...env.ipfsGateways.map(
      (gw) =>
        `nftgateway_failed_requests_total{gateway="${gw}",env="${env.ENV}"} ${
          totalResponsesPerGateway[gw] -
          (metricsCollected.ipfsGateways[gw].totalResponsesByStatus[
            HTTP_STATUS_SUCCESS
          ] || 0)
        }`
    ),
    `# HELP nftgateway_requests_by_status_total Total requests by status code performed to each gateway.`,
    `# TYPE nftgateway_requests_by_status_total counter`,
    ...env.ipfsGateways
      .map((gw) => {
        return Object.keys(
          metricsCollected.ipfsGateways[gw].totalResponsesByStatus
        )
          .filter(
            (s) => metricsCollected.ipfsGateways[gw].totalResponsesByStatus[s]
          )
          .map(
            (status) =>
              `nftgateway_requests_by_status_total{gateway="${gw}",env="${
                env.ENV
              }",status="${status}"} ${
                metricsCollected.ipfsGateways[gw].totalResponsesByStatus[
                  status
                ] || 0
              }`
          )
          .join('\n')
      })
      .filter((e) => !!e),
    `# HELP nftgateway_prevented_requests_by_reason_total Total prevented requests by reason code performed to each gateway.`,
    `# TYPE nftgateway_prevented_requests_by_reason_total counter`,
    ...env.ipfsGateways
      .map((gw) => {
        return Object.keys(
          metricsCollected.ipfsGateways[gw].totalRequestsPreventedByReason
        )
          .filter(
            (reason) =>
              metricsCollected.ipfsGateways[gw].totalRequestsPreventedByReason[
                reason
              ]
          )
          .map(
            (reason) =>
              `nftgateway_prevented_requests_by_reason_total{gateway="${gw}",env="${
                env.ENV
              }",reason="${reason}"} ${
                metricsCollected.ipfsGateways[gw]
                  .totalRequestsPreventedByReason[reason] || 0
              }`
          )
          .join('\n')
      })
      .filter((e) => !!e),
    `# HELP nftgateway_winner_requests_total Total requests with winner response to each gateway.`,
    `# TYPE nftgateway_winner_requests_total counter`,
    ...env.ipfsGateways.map(
      (gw) =>
        `nftgateway_winner_requests_total{gateway="${gw}",env="${env.ENV}"} ${metricsCollected.ipfsGateways[gw].totalWinnerRequests}`
    ),
    `# HELP nftgateway_requests_per_time_total`,
    `# TYPE nftgateway_requests_per_time_total histogram for total of requests per response time bucket`,
    ...histogram.map((t) => {
      return env.ipfsGateways
        .map(
          (gw) =>
            `nftgateway_requests_per_time_total{gateway="${gw}",le="${t}",env="${env.ENV}"} ${metricsCollected.ipfsGateways[gw].responseTimeHistogram[t]}`
        )
        .join('\n')
    }),
    ...env.ipfsGateways.map(
      (gw) =>
        `nftgateway_requests_per_time_total{gateway="${gw}",le="+Inf",env="${
          env.ENV
        }"} ${
          metricsCollected.ipfsGateways[gw].totalResponsesByStatus[
            HTTP_STATUS_SUCCESS
          ] || 0
        }`
    ),
    `# HELP nftgateway_responses_content_length_total`,
    `# TYPE nftgateway_responses_content_length_total content length delivered histogram`,
    ...contentLengthHistogram.map(
      (t) =>
        `nftgateway_responses_content_length_total{le="${t}",env="${env.ENV}"} ${metricsCollected.summaryMetrics.contentLengthHistogram[t]}`
    ),
    `nftgateway_responses_content_length_total{le="+Inf",env="${env.ENV}"} ${metricsCollected.summaryMetrics.totalWinnerSuccessfulRequests}`,
    `# HELP nftgateway_responses_content_length_bytes_total`,
    `# TYPE nftgateway_responses_content_length_bytes_total content length of delivered cached responses`,
    `nftgateway_responses_content_length_bytes_total{env="${env.ENV}"} ${metricsCollected.summaryMetrics.totalContentLengthBytes}`,
    `# HELP nftgateway_cached_responses_content_length_bytes_total`,
    `# TYPE nftgateway_cached_responses_content_length_bytes_total content length of delivered cached responses`,
    `nftgateway_cached_responses_content_length_bytes_total{env="${env.ENV}"} ${metricsCollected.summaryMetrics.totalCachedContentLengthBytes}`,
    `# HELP nftgateway_redirect_total Total redirects to gateway.`,
    `# TYPE nftgateway_redirect_total counter`,
    `nftgateway_redirect_total{env="${env.ENV}"} ${metricsCollected.gatewayRedirectCount}`,
  ].join('\n')

  res = new Response(metrics, {
    headers: {
      'Cache-Control': `public, max-age=${METRICS_CACHE_MAX_AGE}`,
    },
  })

  // ctx.waitUntil(cache.put(request, res.clone()))

  return res
}

/**
 * Convert milliseconds to seconds.
 * @param {number} ms
 */
function msToS(ms) {
  return ms / 1000
}

import Toucan from 'toucan-js'
import pkg from '../package.json'
import { Logging } from './logs.js'

// TODO: Get Durable object typedef
/**
 * @typedef {Object} EnvInput
 * @property {string} IPFS_GATEWAYS
 * @property {string} VERSION
 * @property {string} COMMITHASH
 * @property {string} BRANCH
 * @property {string} DEBUG
 * @property {string} ENV
 * @property {string} [SENTRY_DSN]
 * @property {string} [LOGTAIL_TOKEN]
 * @property {number} [REQUEST_TIMEOUT]
 * @property {Object} GATEWAYMETRICS
 * @property {Object} SUMMARYMETRICS
 * @property {Object} CIDSTRACKER
 * @property {Object} GATEWAYRATELIMITS
 * @property {Object} GATEWAYREDIRECTCOUNTER
 *
 * @typedef {Object} EnvTransformed
 * @property {Array<string>} ipfsGateways
 * @property {Object} gatewayMetricsDurable
 * @property {Object} summaryMetricsDurable
 * @property {Object} cidsTrackerDurable
 * @property {Object} gatewayRateLimitsDurable
 * @property {Object} gatewayRedirectCounter
 * @property {Toucan} [sentry]
 * @property {Logging} [log]
 *
 * @typedef {EnvInput & EnvTransformed} Env
 */

/**
 * @param {Request} request
 * @param {Env} env
 * @param {import('./').Ctx} ctx
 */
export function envAll(request, env, ctx) {
  env.sentry = getSentry(request, env)
  env.ipfsGateways = JSON.parse(env.IPFS_GATEWAYS)
  env.gatewayMetricsDurable = env.GATEWAYMETRICS
  env.summaryMetricsDurable = env.SUMMARYMETRICS
  env.cidsTrackerDurable = env.CIDSTRACKER
  env.gatewayRateLimitsDurable = env.GATEWAYRATELIMITS
  env.gatewayRedirectCounter = env.GATEWAYREDIRECTCOUNTER
  env.REQUEST_TIMEOUT = env.REQUEST_TIMEOUT || 20000

  env.log = new Logging(request, env, ctx)
  env.log.time('request')
}

/**
 * Get sentry instance if configured
 *
 * @param {Request} request
 * @param {Env} env
 */
function getSentry(request, env) {
  if (!env.SENTRY_DSN) {
    return
  }

  return new Toucan({
    request,
    dsn: env.SENTRY_DSN,
    allowedHeaders: ['user-agent'],
    allowedSearchParams: /(.*)/,
    debug: false,
    environment: env.ENV || 'dev',
    rewriteFrames: {
      root: '/',
    },
    release: env.VERSION,
    pkg,
  })
}

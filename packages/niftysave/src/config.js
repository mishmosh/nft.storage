import dotenv from 'dotenv'
import yargs from 'yargs'

/**
 * @typedef {{url: URL, headers?: Record<string, string>}} Endpoint
 * @typedef {Object} Config
 * @property {number} budget
 * @property {number} batchSize
 * @property {number} fetchTimeout
 * @property {number} fetchRetryLimit
 * @property {boolean} dryRun
 * @property {number} retryLimit
 * @property {number} retryInterval
 * @property {number} retryMaxInterval
 * @property {number} ingestRetryThrottle
 * @property {number} ingestHighWatermark
 * @property {string} ingestLastUpdatedDate
 * @property {number} ingestScraperBatchSize
 * @property {number} ingestScraperRetryLimit
 * @property {number} ingestScraperRetryInterval
 * @property {number} ingestScraperRetryMaxInterval
 * @property {number} ingestWriterBatchSize
 * @property {number} ingestWriterRetryLimit
 * @property {number} ingestWriterRetryInterval
 * @property {number} ingestWriterRetryMaxInterval
 * @property {number} queueSize
 * @property {number} concurrency
 * @property {string} ingestRangeStartDate
 * @property {string} ingestRangeEndDate
 * @property {string} analyzerRangeStartDate
 * @property {string} analyzerRangeEndDate
 * @property {string} pinnerRangeStartDate
 * @property {string} pinnerRangeEndDate
 * @property {import('./cluster').Config} cluster
 * @property {import('./ipfs').Config} ipfs
 * @property {Endpoint} erc721
 * @property {Endpoint} hasura
 * @property {import('nft.storage/src/lib/interface').Service} nftStorage
 *
 * @returns {Promise<Config>}
 */
export const configure = async () => {
  dotenv.config()
  const config = await yargs(process.argv.slice(2))
    .option({
      'dry-run': {
        type: 'boolean',
        default: false,
      },
      'batch-size': {
        type: 'number',
        default: parseInt(process.env['BATCH_SIZE'] || '100'),
        description: 'Number of items to process at once',
      },
      'retry-limit': {
        type: 'number',
        default: Number(process.env['RETRY_LIMIT'] || '100'),
        description: 'Max number of retries to perform on errors',
      },
      'retry-interval': {
        type: 'number',
        default: parseInt(process.env['RETRY_INTERVAL'] || '500'),
        description: 'Interval to space out retries by',
      },
      'retry-max-interval': {
        type: 'number',
        default: Number(process.env['RETRY_MAX_INTERVAL'] || 'Infinity'),
        description: 'Max sleep frame between retries',
      },
      'queue-size': {
        type: 'number',
        default: Number(process.env['QUEUE_SIZE'] || '300'),
        description: 'Number of items to queue before applying backpressure',
      },
      budget: {
        type: 'number',
        default: Number(process.env['TIME_BUDGET'] || 30) * 1000,
      },
      'fetch-timeout': {
        type: 'number',
        default: Number(process.env['FETCH_TIMEOUT'] || 30 * 60 * 1000),
        description: 'Time given to each request before it is aborted',
      },
      'fetch-retry-limit': {
        type: 'number',
        default: Number(process.env['FETCH_RETRY_LIMIT'] || 10),
        description: 'Max number of fetch attempts to make',
      },
      concurrency: {
        type: 'number',
        default: Number(process.env['CONCURRENCY']) || 50,
        description: 'Number of concurrent tasks to use',
      },
      'cluster-endpoint': {
        alias: 'clusterEndpoint',
        type: 'string',
        default:
          process.env['NIFTYSAVE_CLUSTER_ENDPOINT'] ||
          'https://nft2.storage.ipfscluster.io/api/',
      },
      'cluster-key': {
        type: 'string',
        default: process.env['NIFTYSAVE_CLUSTER_KEY'],
        alias: 'clusterKey',
        demandOption: true,
      },
      'ipfs-api-endpoint': {
        alias: 'ipfsAPIEndpoint',
        type: 'string',
        default:
          process.env['NIFTYSAVE_IPFS_API_ENDPOINT'] ||
          'https://nft2.storage.ipfscluster.io/api/v0/',
      },
      'ipfs-api-key': {
        alias: 'ipfsAPIKey',
        type: 'string',
        default: process.env['NIFTYSAVE_IPFS_API_KEY'],
        demandOption: true,
      },
      'subgraph-endpoint': {
        type: 'string',
        default:
          process.env['SUBGRAPH_ENDPOINT'] ||
          'https://api.thegraph.com/subgraphs/name/nftstorage/eip721-subgraph',
      },
      'hasura-endpoint': {
        alias: 'hasuraEndpoint',
        type: 'string',
        default:
          process.env['HASURA_ENDPOINT'] ||
          'https://niftysave.hasura.app/v1/graphql',
      },
      'hasura-key': {
        alias: 'hasuraKey',
        type: 'string',
        default: process.env['HASURA_KEY'],
        demandOption: true,
      },
      'nftstorage-enpoint': {
        alias: 'nftStorageEndpoint',
        type: 'string',
        default:
          process.env['NFT_STORAGE_ENDPOINT'] || 'https://api.nft.storage',
      },
      'nftstorage-key': {
        alias: 'nftStorageKey',
        type: 'string',
        default: process.env['NFT_STORAGE_KEY'],
        demandOption: true,
      },
      'ingest-retry-throttle': {
        alias: 'ingestRetryThrottle',
        type: 'number',
        default: Number(process.env['INGEST_RETRY_THROTTLE']) || 10 * 1000,
        description: `The rate(ms) at which the ingestor will recheck to see if there are more blockchain entries when a scrape is performed but notrhing returned`,
      },
      'ingest-high-watermark': {
        alias: 'ingestHighWatermark',
        type: 'number',
        default: Number(process.env['INGEST_HIGH_WATERMARK']) || 10000,
        description: `The max number of records the ingestion buffer will hold in memory. Going below this line will trigger additional scraping`,
      },
      'ingest-last-updated-date': {
        alias: 'ingestLastUpdatedDate',
        type: 'string',
        default: process.env['INGEST_LAST_UPDATED_DATE'] || '',
        description: `The last known date based on inserted_at to resume scraping from. defaults to 'today'`,
      },
      'ingest-range-start-date': {
        alias: 'ingestRangeStartDate',
        type: 'string',
        default: process.env['INGEST_RANGE_START_DATE'] || '',
        description: `The start date, based on mintTime of when to begin scraping a time-slice of the blockchain. Must provide a beginning and end date when time-slicing`,
      },
      'ingest-range-end-date': {
        alias: 'ingestRangeEndDate',
        type: 'string',
        default: process.env['INGEST_RANGE_END_DATE'] || '',
        description: `The end date, based on mintTime of when to begin scraping a time-slice of the blockchain. Must provide a beginning and end date when time-slicing`,
      },
      'ingest-scraper-batch-size': {
        alias: 'ingestScraperBatchSize',
        type: 'number',
        default: Number(process.env['INGEST_SCRAPER_BATCH_SIZE']) || 1000,
        description: `The number of records the ingestor tries to pull of the blockchain per-scrape`,
      },
      'ingest-scraper-retry-limit': {
        type: 'number',
        default: Number(process.env['INGEST_SCRAPER_RETRY_LIMIT'] || '100'),
        description:
          'Max number of retries to perform when scraping the blockchain and an error is encountered (eg. as network is down)',
      },
      'ingest-scraper-retry-interval': {
        type: 'number',
        default: parseInt(
          process.env['INGEST_SCRAPER_RETRY_INTERVAL'] || '500'
        ),
        description:
          'Interval to space out retries by when scraping the blockchain',
      },
      'ingest-scraper-retry-max-interval': {
        type: 'number',
        default: Number(
          process.env['INGEST_SCRAPER_RETRY_MAX_INTERVAL'] || 'Infinity'
        ),
        description:
          'Max sleep frame between retries when scraping the blockchain',
      },
      'ingest-writer-batch-size': {
        alias: 'ingestWriterBatchSize',
        type: 'number',
        default: Number(process.env['INGEST_WRITER_BATCH_SIZE']) || 1000,
        description: `The number of records the ingestor tries write into the database as a batch`,
      },
      'ingest-writer-retry-limit': {
        type: 'number',
        default: Number(process.env['INGEST_WRITER_RETRY_LIMIT'] || '50'),
        description:
          'Max number of retries to perform when writing scraped records aquired from the blockchain and an error is encountered (eg. as network is down)',
      },
      'ingest-writer-retry-interval': {
        type: 'number',
        default: parseInt(process.env['INGEST_WRITER_RETRY_INTERVAL'] || '500'),
        description:
          'Interval to space out retries by when writing scraped records aquired from the blockchain',
      },
      'ingest-writer-retry-max-interval': {
        type: 'number',
        default: Number(
          process.env['INGEST_WRITER_RETRY_MAX_INTERVAL'] || 'Infinity'
        ),
        description:
          'Max sleep frame between retrieswhen writing scraped records aquired from the blockchain',
      },
      'analyzer-range-start-date': {
        alias: 'analyzerRangeStartDate',
        type: 'string',
        default: process.env['ANALYZER_RANGE_START_DATE'] || '',
        description: `The start date, of an analyzer slice. Must provide a beginning and end date when time-slicing`,
      },
      'analyzer-range-end-date': {
        alias: 'analyzerRangeEndDate',
        type: 'string',
        default: process.env['ANALYZER_RANGE_END_DATE'] || '',
        description: `The end date, of an analyzer slice. Must provide a beginning and end date when time-slicing`,
      },
      'pinner-range-start-date': {
        alias: 'pinnerRangeStartDate',
        type: 'string',
        default: process.env['PINNER_RANGE_START_DATE'] || '',
        description: `The start date, of a pinner slice. Must provide a beginning and end date when time-slicing`,
      },
      'pinner-range-end-date': {
        alias: 'pinnerRangeEndDate',
        type: 'string',
        default: process.env['PINNER_RANGE_END_DATE'] || '',
        description: `The end date, of a pinner slice. Must provide a beginning and end date when time-slicing`,
      },
    })
    .parse()

  return {
    batchSize: config['batch-size'],
    budget: config.budget,
    fetchTimeout: config['fetch-timeout'],
    fetchRetryLimit: config['fetch-retry-limit'],
    dryRun: config['dry-run'],
    retryLimit: config['retry-limit'],
    retryInterval: config['retry-interval'],
    retryMaxInterval: config['retry-max-interval'],
    queueSize: config['queue-size'],
    concurrency: config.concurrency,

    ingestRetryThrottle: config['ingest-retry-throttle'],
    ingestHighWatermark: config['ingest-high-watermark'],
    ingestScraperBatchSize: config['ingest-scraper-batch-size'],
    ingestLastUpdatedDate: config['ingest-last-updated-date'],

    ingestScraperRetryLimit: config['ingest-scraper-retry-limit'],
    ingestScraperRetryInterval: config['ingest-scraper-retry-interval'],
    ingestScraperRetryMaxInterval: config['ingest-scraper-retry-max-interval'],

    ingestWriterBatchSize: config['ingest-writer-batch-size'],
    ingestWriterRetryLimit: config['ingest-writer-retry-limit'],
    ingestWriterRetryInterval: config['ingest-writer-retry-interval'],
    ingestWriterRetryMaxInterval: config['ingest-writer-retry-max-interval'],

    ingestRangeStartDate: config['ingest-range-start-date'],
    ingestRangeEndDate: config['ingest-range-end-date'],
    analyzerRangeStartDate: config['analyzer-range-start-date'],
    analyzerRangeEndDate: config['analyzer-range-end-date'],
    pinnerRangeStartDate: config['pinner-range-start-date'],
    pinnerRangeEndDate: config['pinner-range-end-date'],

    cluster: {
      url: new URL(config['cluster-endpoint']),
      headers: { Authorization: `Basic ${config['cluster-key']}` },
    },

    ipfs: {
      url: new URL(config['ipfs-api-endpoint']),
      secret: config['ipfs-api-key'],
    },

    erc721: {
      url: new URL(config['subgraph-endpoint']),
    },

    hasura: {
      url: new URL(config['hasura-endpoint']),
      headers: {
        'x-hasura-admin-secret': config['hasura-key'],
      },
    },

    nftStorage: {
      endpoint: new URL(config['nftstorage-enpoint']),
      token: config['nftstorage-key'],
    },
  }
}

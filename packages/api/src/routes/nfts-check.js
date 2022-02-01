/* global caches */

import { JSONResponse } from '../utils/json-response.js'
import { HTTPError } from '../errors.js'
import { secrets, database } from '../constants.js'
import { DBClient } from '../utils/db-client'
import { parseCid } from '../utils/utils.js'
import { toCheckNftResponse } from '../utils/db-transforms.js'

const CACHE_MAX_AGE = 10 * 60 // in seconds (10 minutes)
const db = new DBClient(database.url, secrets.database)

/** @type {import('../bindings').Handler} */
export const nftCheck = async (event, { params }) => {
  const cache = caches.default
  let res = await cache.match(event.request)

  if (res) {
    return res
  }

  const cid = parseCid(params.cid)
  const content = await db.getContent(cid.contentCid)

  if (!content) {
    throw new HTTPError('NFT not found', 404)
  }

  res = new JSONResponse(
    {
      ok: true,
      value: toCheckNftResponse(cid.sourceCid, content),
    },
    {
      headers: {
        // cache status response
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
      },
    }
  )

  event.waitUntil(cache.put(event.request, res.clone()))

  return res
}

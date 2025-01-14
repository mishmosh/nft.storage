import * as IPFSURL from './ipfs-url.js'

import IPLD from 'ipld'
// @ts-expect-error - has no type defs
import InMemory from 'ipld-in-memory'
import Multihash from 'multihashing-async'
import { importer } from 'ipfs-unixfs-importer'
import multicodec from 'multicodec'
import pb from 'ipld-dag-pb'

/**
 * @typedef {Object} Config
 * @property {URL} url
 * @property {string} secret
 */

/**
 * @typedef { import('ipfs-unixfs-importer').ImportResult } ImportResult
 */

/**
 * Returns content for the given ipfs:// url from the remote ipfs node that
 * corresponds to provided configuration. If `v0` option is true request will
 * be use CIDv0 as opposed to CIDv1 (that will be in the URL). AbortSignal may
 * be provided to abort request if necessary.
 *
 * @param {Config} config
 * @param {import('./ipfs-url').IPFSURL} url
 * @param {Object} [options]
 * @param {boolean} [options.v0=false]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<Blob>}
 */
export const cat = async (config, url, { v0 = false, signal } = {}) => {
  const path = v0
    ? IPFSURL.formatIPFSPathWithCIDv0(url)
    : IPFSURL.formatIPFSPath(url)
  const { href } = new URL(`/api/v0/cat?arg=${path}`, config.url)

  const response = await fetch(href, {
    method: 'POST',
    headers: { Authorization: `Basic ${config.secret}` },
    signal,
  })

  if (response.ok) {
    return await response.blob()
  } else {
    throw new Error(
      `Fetch error: Status ${response.status} ${response.statusText}`
    )
  }
}

/**
 * @typedef {import('multiformats').CID} CID
 * @param {Blob} content
 * @returns {Promise<ImportResult>}
 */
export const importBlob = async (content) => {
  const buffer = await content.arrayBuffer()
  const results = importer(
    [{ content: new Uint8Array(buffer) }],
    // @ts-expect-error - 'Block' instance is not a valid 'Blockstore'
    new Block(),
    {
      onlyHash: true,
      cidVersion: 1,
      rawLeaves: true,
    }
  )
  for await (const result of results) {
    return result
  }
  throw new Error(`Import failed`)
}

const DagPB = pb.util

/** @type {(T:typeof IPLD) => IPLD} */
const inMemory = InMemory
const { multihash } = Multihash

/**
 * @typedef {import('ipfs-unixfs-importer').Blockstore} BlockAPI
 * @implements {BlockAPI}
 */
// @ts-expect-error - must implement has, delete, putMany, getMany, ... methods
class Block {
  /**
   * @param {Object} [options]
   * @param {IPLD} [options.ipld]
   * @param {typeof multihash} [options.mh]
   */
  constructor({ ipld = inMemory(IPLD), mh = multihash } = {}) {
    this.ipld = ipld
    this.mh = mh
  }
  open() {
    return Promise.resolve()
  }
  close() {
    return Promise.resolve()
  }

  /**
   * @param {import('multiformats').CID} cid
   * @param {Uint8Array} bytes
   * @returns { Promise<void> }
   */
  async put(cid, bytes) {
    const multihash = this.mh.decode(cid.bytes)
    const node = DagPB.deserialize(bytes)

    await this.ipld.put(node, multicodec.DAG_PB, {
      cidVersion: cid.version,
      hashAlg: multihash.code,
    })
  }

  /**
   * @param {import('multiformats').CID} cid
   * @param {any} options
   * @returns { Promise<Uint8Array> }
   */
  async get(cid, options) {
    // @ts-expect-error - CID is incompatible
    const node = await this.ipld.get(cid, options)
    if (node instanceof Uint8Array) {
      return node
    } else {
      return DagPB.serialize(node)
    }
  }
}

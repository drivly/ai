/**
 * ai-database
 * Direct interface to Payload CMS with database.do compatibility
 */

import { CollectionHandler } from './collectionHandler'
import { DBOptions, DatabaseClientType, PayloadInstance } from './types'
import { getPayloadInstance } from './utils'

export * from './types'
export * from './adapters/node'
export * from './adapters/edge'
export * from './embedding'

/**
 * Creates a database client with the provided options
 * @param options Configuration options for the database client
 * @returns A proxy-based database client that provides collection-based access
 * @example
 * const db = DB({ payload }) // Node.js with Payload instance
 * const db = DB({ apiUrl: 'https://api.example.com' }) // Edge with REST API
 */
export const DB = (options: DBOptions = {}): DatabaseClientType => {
  const payload = getPayloadInstance(options)

  return new Proxy({} as DatabaseClientType, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop !== 'then') {
        const collectionName = prop === 'resources' ? 'things' : String(prop)
        return new CollectionHandler({ payload, collectionName })
      }
      return target[prop as keyof typeof target]
    },
  })
}

/**
 * Default database client instance
 * Note: This will attempt to use a global Payload instance if available,
 * otherwise it will throw an error. In most cases, you should use the DB
 * function directly with explicit options.
 */
export const db = DB()

export default DB

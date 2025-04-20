/**
 * Node.js adapter for ai-database
 */

import { DBOptions, DatabaseClientType, PayloadInstance } from '../types'
import { DB } from '../index'

/**
 * Creates a database client for Node.js environments
 * @param options Configuration options
 * @returns Database client instance
 * @example
 * import { getPayload } from 'payload'
 * import config from '@payload-config'
 * import { createNodeClient } from 'ai-database/adapters'
 *
 * const payload = await getPayload({ config })
 * const db = createNodeClient({ payload })
 */
export const createNodeClient = (options: DBOptions = {}): DatabaseClientType => {
  return DB(options)
}

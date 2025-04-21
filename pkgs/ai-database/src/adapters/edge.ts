/**
 * Edge runtime adapter for ai-database
 */

import { DBOptions, DatabaseClientType } from '../types'
import { DB } from '../index'

/**
 * Creates a database client for Edge runtime environments
 * @param options Configuration options (must include apiUrl)
 * @returns Database client instance
 * @example
 * import { createEdgeClient } from 'ai-database/adapters'
 *
 * const db = createEdgeClient({
 *   apiUrl: 'https://your-payload-api.com/api',
 *   apiKey: 'your-api-key'
 * })
 */
export const createEdgeClient = (options: DBOptions = {}): DatabaseClientType => {
  if (!options.apiUrl) {
    throw new Error('apiUrl is required for Edge environments')
  }

  return DB(options)
}

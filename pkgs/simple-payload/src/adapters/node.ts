import { PayloadDB, PayloadClientOptions } from '../types'
import { createPayloadClient } from '../createPayloadClient'

/**
 * Creates a Payload client for Node.js environments
 * @param options - Payload CMS instance or connection options
 * @returns A proxy object for database operations
 */
export const createNodePayloadClient = (options: PayloadClientOptions): PayloadDB => {
  return createPayloadClient(options)
}

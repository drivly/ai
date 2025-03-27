import { PayloadDB } from '../types'
import { createPayloadClient } from '../createPayloadClient'

/**
 * Creates a Payload client for Node.js environments
 * @param payload - Payload CMS instance
 * @returns A proxy object for database operations
 */
export const createNodePayloadClient = (payload: any): PayloadDB => {
  return createPayloadClient(payload)
}

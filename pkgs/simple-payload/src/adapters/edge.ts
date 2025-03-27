import { PayloadDB, RestPayloadClientConfig } from '../types'
import { createRestPayloadClient } from '../createRestPayloadClient'

/**
 * Creates a Payload client for Edge runtime environments
 * @param config - REST client configuration
 * @returns A proxy object for database operations via REST API
 */
export const createEdgePayloadClient = (config: RestPayloadClientConfig): PayloadDB => {
  return createRestPayloadClient(config)
}

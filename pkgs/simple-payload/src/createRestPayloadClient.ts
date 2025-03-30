import { PayloadDB, RestPayloadClientConfig } from './types'
import { createClient } from 'payload-rest-client'
import { createPayloadClient } from './createPayloadClient'

/**
 * Creates a REST client for Payload that works in edge environments
 * @param config - REST client configuration
 * @returns A proxy object for database operations via REST API
 */
export const createRestPayloadClient = (config: RestPayloadClientConfig): PayloadDB => {
  // Use payload-rest-client to create a REST client
  const restClient = createClient({
    url: config.apiUrl,
    apiKey: config.apiKey,
    headers: config.headers,
    fetchOptions: config.fetchOptions,
  })

  // Pass the rest client to our standard payload client creator
  // This ensures consistent behavior across different client types
  return createPayloadClient(restClient)
}

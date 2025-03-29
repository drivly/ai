import { PayloadDB, PayloadClientOptions, PayloadInstance } from '../types'
import { createRestPayloadClient } from '../createRestPayloadClient'
import { createPayloadClient } from '../createPayloadClient'

/**
 * Determines if a provided value is a payload instance
 * @param value - Value to check
 * @returns True if the value appears to be a payload instance
 */
const isPayloadInstance = (value: any): value is PayloadInstance => {
  return value && 
    typeof value === 'object' && 
    !('apiUrl' in value) && 
    (
      (typeof value.find === 'function') ||
      (typeof value.findByID === 'function') ||
      (typeof value.create === 'function') ||
      (typeof value.update === 'function') ||
      (typeof value.delete === 'function')
    )
}

/**
 * Creates a Payload client for Edge runtime environments
 * Uses payload-rest-client for API connectivity in edge environments
 * @param options - Payload CMS instance or REST client configuration
 * @returns A proxy object for database operations
 */
export const createEdgePayloadClient = (options: PayloadClientOptions): PayloadDB => {
  // If options is a payload instance, use createPayloadClient directly
  if (isPayloadInstance(options)) {
    return createPayloadClient(options)
  }
  
  // Otherwise, use the REST client with payload-rest-client
  return createRestPayloadClient(options)
}

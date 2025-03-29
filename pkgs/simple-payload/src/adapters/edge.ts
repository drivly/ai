import { PayloadDB, PayloadClientOptions, PayloadInstance } from '../types'
import { createRestPayloadClient } from '../createRestPayloadClient'
import { createPayloadClient } from '../createPayloadClient'

/**
 * Determines if a provided value is a payload instance
 * @param value - Value to check
 * @returns True if the value appears to be a payload instance
 */
const isPayloadInstance = (value: any): value is PayloadInstance => {
  return value && typeof value === 'object' && (
    // Check for common payload properties
    ('find' in value && typeof value.find === 'function') ||
    ('findByID' in value && typeof value.findByID === 'function') ||
    ('create' in value && typeof value.create === 'function') ||
    ('update' in value && typeof value.update === 'function') ||
    ('delete' in value && typeof value.delete === 'function')
  )
}

/**
 * Creates a Payload client for Edge runtime environments
 * @param options - Payload CMS instance or REST client configuration
 * @returns A proxy object for database operations
 */
export const createEdgePayloadClient = (options: PayloadClientOptions): PayloadDB => {
  // If options is a payload instance, use createPayloadClient directly
  if (isPayloadInstance(options)) {
    return createPayloadClient(options)
  }
  
  // Otherwise, use the REST client
  return createRestPayloadClient(options)
}

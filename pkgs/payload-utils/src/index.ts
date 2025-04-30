// Export types
export * from './types'

// Export core utilities
export { createPayloadClient } from './createPayloadClient'
export { createApiHandler } from './createApiHandler'

// Export environment-specific adapters
export { createNextApiHandler } from './adapters/next'
export { createCloudflareApiHandler } from './adapters/cloudflare'

export { simplerJSON } from './fields/simplerJSON'
export { json5Field } from './fields/json5Field'
export { urlField } from './fields/urlField'

// Re-export as a convenience alias for Next.js (the most common use case)
export { createNextApiHandler as API } from './adapters/next'

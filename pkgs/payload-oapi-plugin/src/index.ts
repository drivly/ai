import type { Config, Plugin } from 'payload'
import { openapi } from 'payload-oapi'

export interface PayloadOapiPluginOptions {
  enabled?: boolean
  title?: string
  description?: string
  version?: string
  specEndpoint?: string
  authEndpoint?: string
  openapiVersion?: '3.0' | '3.1'
}

export const payloadOapiPlugin = (options: PayloadOapiPluginOptions = {}): Plugin => {
  if (options.enabled === false) {
    return (config) => config
  }

  return openapi({
    enabled: options.enabled,
    specEndpoint: options.specEndpoint || '/api/docs/openapi.json',
    authEndpoint: options.authEndpoint,
    openapiVersion: options.openapiVersion || '3.0',
    metadata: {
      title: options.title || 'Payload CMS API',
      description: options.description || 'API documentation for Payload CMS',
      version: options.version || '1.0.0',
    },
  })
}

export default payloadOapiPlugin

import { Auth } from './auth'

export * from './auth'

export interface WorkOSPluginConfig {
  /**
   * WorkOS API key
   */
  apiKey?: string
  /**
   * WorkOS client ID
   */
  clientId?: string
  /**
   * Redirect URI for OAuth callbacks
   */
  redirectUri?: string
  /**
   * Name of the collection that contains organizations
   */
  organizationCollection?: string
  /**
   * Name of the collection that contains users
   */
  userCollection?: string
  /**
   * Feature flags for WorkOS services
   */
  features?: {
    sso?: boolean
    directorySync?: boolean
    mfa?: boolean
    adminPortal?: boolean
    magicAuth?: boolean
    secrets?: boolean
    webhooks?: boolean
  }
  /**
   * Options for SSO integration
   */
  sso?: {
    callbackPath?: string
    defaultConnection?: string
  }
  /**
   * Options for Admin Portal
   */
  adminPortal?: {
    callbackPath?: string
  }
  /**
   * Options for Magic Auth
   */
  magicAuth?: {
    callbackPath?: string
    emailField?: string
  }
  /**
   * Options for webhooks
   */
  webhooks?: {
    endpointSecret?: string
    path?: string
  }
  /**
   * Custom express endpoints
   */
  endpoints?: Auth['endpoints']
}

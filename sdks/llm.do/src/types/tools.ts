import { toolAuthorizationModes } from '../constants'

/**
 * Defines the authentication modes supported by tools in the LLM.do platform
 *
 * Possible values:
 * - OAUTH2: OAuth 2.0 authorization flow
 * - OAUTH1: OAuth 1.0 authorization flow
 * - OAUTH1A: OAuth 1.0a authorization flow
 * - API_KEY: Simple API key authentication
 * - BASIC: HTTP Basic authentication
 * - BEARER_TOKEN: Bearer token authentication
 * - GOOGLE_SERVICE_ACCOUNT: Google service account credentials
 * - NO_AUTH: No authentication required
 * - BASIC_WITH_JWT: Basic authentication with JWT token
 */
export type ToolAuthorizationMode = (typeof toolAuthorizationModes)[number]

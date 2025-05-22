/**
 * All possible error types that can be returned by the API
 *
 * - MODEL_NOT_FOUND: The requested model doesn't exist
 * - MODEL_INCOMPATIBLE: The model doesn't support the requested capabilities
 * - TOOL_AUTHORIZATION: A tool requires user authorization
 * - UNSUPPORTED_AUTH_SCHEME: The authentication scheme is not supported
 * - UNKNOWN_AUTH_SCHEME: The authentication scheme is not recognized
 */
export const ERROR_TYPES = ['MODEL_NOT_FOUND', 'MODEL_INCOMPATIBLE', 'TOOL_AUTHORIZATION', 'UNSUPPORTED_AUTH_SCHEME', 'UNKNOWN_AUTH_SCHEME'] as const

/**
 * Valid roles for messages in a chat conversation
 *
 * - user: Message from the end user
 * - assistant: Message from the AI assistant
 * - system: System instruction message
 */
export const messageResponseRoles = ['user', 'assistant', 'system'] as const

/**
 * Supported output formats for model responses
 *
 * - JSON: Structured JSON data
 * - Markdown: Formatted Markdown text
 * - Code: Generic code output
 * - Python: Python-specific code output
 * - TypeScript: TypeScript-specific code output
 * - JavaScript: JavaScript-specific code output
 */
export const outputFormats = ['JSON', 'Markdown', 'Code', 'Python', 'TypeScript', 'JavaScript'] as const

/**
 * Model selection priority criteria
 *
 * - cost: Prioritize models with lower cost
 * - throughput: Prioritize models with higher throughput
 * - latency: Prioritize models with lower latency
 */
export const providerPriorities = ['cost', 'throughput', 'latency'] as const

/**
 * Authentication modes supported by tools
 *
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
export const toolAuthorizationModes = ['OAUTH2', 'OAUTH1', 'OAUTH1A', 'API_KEY', 'BASIC', 'BEARER_TOKEN', 'GOOGLE_SERVICE_ACCOUNT', 'NO_AUTH', 'BASIC_WITH_JWT'] as const

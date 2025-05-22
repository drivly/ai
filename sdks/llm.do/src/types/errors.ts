import { ERROR_TYPES } from '../constants'
import { Prettify } from '@/types/helper-types'
import { ToolAuthorizationMode } from './tools'

/**
 * Union of all possible error type string literals
 */
type ErrorType = (typeof ERROR_TYPES)[number]

/**
 * Error types excluding tool authorization errors
 */
type BaseErrorType = Exclude<ErrorType, 'TOOL_AUTHORIZATION'>

/**
 * Error type specific to tool authorization
 */
type ToolAuthorizationErrorType = Extract<ErrorType, 'TOOL_AUTHORIZATION'>

/**
 * Base error interface that all API errors extend
 * @property success - Always false for error responses
 * @property type - The specific error type
 * @property error - Human-readable error message
 */
interface GenericChatCompletionError extends Error {
  success: false
  type: string
  error: string
}

/**
 * Base error for general API errors (non-tool related)
 * @property type - One of the base error types:
 *  - MODEL_NOT_FOUND: The requested model doesn't exist
 *  - MODEL_INCOMPATIBLE: The model doesn't support the requested capabilities
 *  - UNSUPPORTED_AUTH_SCHEME: The authentication scheme is not supported
 *  - UNKNOWN_AUTH_SCHEME: The authentication scheme is not recognized
 */
export interface BaseCompletionError extends GenericChatCompletionError {
  type: BaseErrorType
}

/**
 * Union of all possible BaseCompletionError types with specific type discriminators
 */
type AllBaseCompletionErrors = {
  [K in BaseErrorType]: BaseCompletionError & { type: K }
}[BaseErrorType]

/**
 * Information about a tool that requires user authorization
 * @property app - The name of the application/tool
 * @property icon - URL to the tool's icon
 * @property description - Description of the tool
 * @property methods - Available authentication methods
 */
export interface ToolConnectionRequest {
  app: string
  icon: string
  description: string
  methods: ToolConnectionMethod[]
}

/**
 * Authentication method for a tool
 * @property type - The type of authentication (OAuth, API Key, etc.)
 * @property redirectUrl - URL for OAuth redirects
 * @property fields - Additional fields required for authentication
 */
export interface ToolConnectionMethod {
  type: ToolAuthorizationMode
  redirectUrl?: string
  fields?: Record<string, any>
}

/**
 * Error returned when a tool requires authorization
 * @property type - Always 'TOOL_AUTHORIZATION'
 * @property connectionRequests - Information about the tools that need authorization
 * @property apps - List of app names that need authorization
 */
export interface ToolAuthorizationError extends GenericChatCompletionError {
  type: ToolAuthorizationErrorType
  connectionRequests: ToolConnectionRequest[]
  apps: string[]
}

/**
 * Union of all possible chat completion errors
 * Use the 'type' property to discriminate between different error types
 */
export type ChatCompletionError = Prettify<AllBaseCompletionErrors | ToolAuthorizationError>

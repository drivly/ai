// Chat completion errors
type ToolAuthorizationMode = 'OAUTH' | 'OAUTH2' | 'API_KEY' | 'BEARER_TOKEN'

interface GenericChatCompletionError extends Error {
  success: false
  type: string
  error: string
}

// Thrown when a model does not exist
export interface ModelNotFoundError extends GenericChatCompletionError {
  type: 'MODEL_NOT_FOUND'
}

// Thrown when a model exists, but that the capabilities requested are not supported
// tools, reasoning, etc.
export interface ModelIncompatibleError extends GenericChatCompletionError {
  type: 'MODEL_INCOMPATIBLE'
}

export interface ToolAuthorizationError extends GenericChatCompletionError {
  type: 'TOOL_AUTHORIZATION'
  connectionRequests: {
    app: string
    icon: string
    description: string
    methods: {
      type: ToolAuthorizationMode
      redirectUrl?: string
      fields?: Record<string, any>
    }[]
  }[]
  apps: string[]
}

export interface ToolUnsupportedError extends GenericChatCompletionError {
  type: 'UNSUPPORTED_AUTH_SCHEME'
}

export interface ToolUnknownAuthError extends GenericChatCompletionError {
  type: 'UNKNOWN_AUTH_SCHEME'
}

// Discriminated union with all of our errors
export type ChatCompletionError = ModelNotFoundError | ModelIncompatibleError | ToolAuthorizationError

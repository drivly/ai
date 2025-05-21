// Chat completion errors

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

// Tools based errors
export interface ToolRedirectError extends GenericChatCompletionError {
  type: 'TOOL_REDIRECT'
  connectionRequests: {
    app: string
    type: 'API_KEY' | 'OAUTH' | 'OAUTH2'
    redirectUrl?: string
    fields?: Record<
      string,
      {
        type: 'string' | 'number' | 'boolean'
        required: boolean
        name: string
        [key: string]: any
      }
    >
  }[]
}

// Discriminated union with all of our errors
export type ChatCompletionError = ModelNotFoundError | ModelIncompatibleError | ToolRedirectError

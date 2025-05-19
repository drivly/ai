// Chat completion errors

type GenericChatCompletionError = {
  success: false
  type: string
  error: string
} & Error

// Thrown when a model does not exist
export type ModelNotFoundError = {
  type: 'MODEL_NOT_FOUND'
} & GenericChatCompletionError

// Thrown when a model exists, but that the capabilities requested are not supported
// tools, reasoning, etc.
export type ModelIncompatibleError = {
  type: 'MODEL_INCOMPATIBLE'
} & GenericChatCompletionError

// Tools based errors
export type ToolAuthorizationError = {
  type: 'TOOL_AUTHORIZATION'
  connectionRequests: {
    type: 'API_KEY' | 'OAUTH' | 'OAUTH2' | 'BEARER_TOKEN'
    mode: 'REDIRECT' | 'FIELDS' // Redirect is used for OAuth, Fields is used for anything that needs a form.
    redirectUrl?: string
    fields?: Record<string, {
      type: 'string' | 'number' | 'boolean'
      required: boolean
      name: string
      [key: string]: any
    }>
  }[]
} & GenericChatCompletionError

// Union with all of our errors
export type ChatCompletionError =
  ModelNotFoundError |
  ModelIncompatibleError |
  ToolAuthorizationError
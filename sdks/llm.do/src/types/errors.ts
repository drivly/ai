import {
  ToolAuthorizationMode
} from './tools'

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
} & GenericChatCompletionError

export type ToolUnsupportedError = {
  type: 'UNSUPPORTED_AUTH_SCHEME'
} & GenericChatCompletionError

export type ToolUnknownAuthError = {
  type: 'UNKNOWN_AUTH_SCHEME'
} & GenericChatCompletionError

// Union with all of our errors
export type ChatCompletionError =
  ModelNotFoundError |
  ModelIncompatibleError |
  ToolAuthorizationError
import type { ChatCompletionError } from '../errors'
import type { API_PATHS, GetRoute, PostRoute } from './base'
import type { LLMChatCompletionBody } from './requests'
import type { LLMChatCompletionResponseNonStreaming, ListModelsResponse } from './responses'

// -------------------------
// Chat Routes
// -------------------------

export type ChatCompletionNonStreamingRequest = PostRoute<
  typeof API_PATHS.CHAT.COMPLETIONS,
  LLMChatCompletionBody & { stream: false },
  LLMChatCompletionResponseNonStreaming,
  ChatCompletionError
>

export type ChatCompletionStreamingRequest = PostRoute<typeof API_PATHS.CHAT.COMPLETIONS, LLMChatCompletionBody & { stream: true }, {}, ChatCompletionError>

// -------------------------
// Tool Routes
// -------------------------

type ToolIdPath = `/tools/${string}`
type ToolOAuthPath = `/tools/${string}/oauth`

// Define error types that can be thrown by tool routes
type ToolAuthThrows = Extract<ChatCompletionError, { type: 'UNSUPPORTED_AUTH_SCHEME' | 'UNKNOWN_AUTH_SCHEME' }>

export type ToolSetupRequest = PostRoute<
  ToolIdPath,
  {
    type: string
    fields: Record<string, any>
  },
  undefined,
  ToolAuthThrows
>

export type ToolOAuthRequest = GetRoute<ToolOAuthPath, undefined, ToolAuthThrows>

// -------------------------
// Model Routes
// -------------------------

export type ListModelsRequest = GetRoute<typeof API_PATHS.MODELS.LIST, ListModelsResponse>

// -------------------------
// Image Routes
// -------------------------

type ModelImagePath = `/images/models/${string}`
type ToolImagePath = `/images/tools/${string}`

export type ModelImageRequest = GetRoute<ModelImagePath>
export type ToolImageRequest = GetRoute<ToolImagePath>

// -------------------------
// Union of all routes
// -------------------------

export type Route =
  | ChatCompletionNonStreamingRequest
  | ChatCompletionStreamingRequest
  | ToolSetupRequest
  | ToolOAuthRequest
  | ListModelsRequest
  | ModelImageRequest
  | ToolImageRequest

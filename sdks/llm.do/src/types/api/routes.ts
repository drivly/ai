import type { ChatCompletionError } from '../errors'
import type { API_PATHS, GetRoute, PostRoute } from './base'
import type { LLMChatCompletionBody } from './requests'
import type { LLMChatCompletionResponseNonStreaming, ListModelsResponse } from './responses'

// -------------------------
// Chat Routes
// -------------------------

/**
 * Request type for non-streaming chat completions
 *
 * @route POST /chat/completions
 * @param stream Must be false for non-streaming
 * @returns LLMChatCompletionResponseNonStreaming
 * @throws ChatCompletionError
 *   - MODEL_NOT_FOUND: If the specified model doesn't exist
 *   - MODEL_INCOMPATIBLE: If the model doesn't support requested features
 *   - TOOL_AUTHORIZATION: If the request uses tools that require authorization
 */
export type ChatCompletionNonStreamingRequest = PostRoute<
  typeof API_PATHS.CHAT.COMPLETIONS,
  LLMChatCompletionBody & { stream: false },
  LLMChatCompletionResponseNonStreaming,
  ChatCompletionError
>

/**
 * Request type for streaming chat completions
 *
 * @route POST /chat/completions
 * @param stream Must be true for streaming
 * @returns Stream of completion chunks
 * @throws ChatCompletionError
 *   - MODEL_NOT_FOUND: If the specified model doesn't exist
 *   - MODEL_INCOMPATIBLE: If the model doesn't support requested features
 *   - TOOL_AUTHORIZATION: If the request uses tools that require authorization
 */
export type ChatCompletionStreamingRequest = PostRoute<typeof API_PATHS.CHAT.COMPLETIONS, LLMChatCompletionBody & { stream: true }, {}, ChatCompletionError>

// -------------------------
// Tool Routes
// -------------------------

type ToolIdPath = `/tools/${string}`
type ToolOAuthPath = `/tools/${string}/oauth`

// Define error types that can be thrown by tool routes
type ToolAuthThrows = Extract<ChatCompletionError, { type: 'UNSUPPORTED_AUTH_SCHEME' | 'UNKNOWN_AUTH_SCHEME' }>

/**
 * Request type for setting up a tool connection
 *
 * @route POST /tools/{toolId}
 * @param type The authentication type for the tool
 * @param fields Authentication fields specific to the tool
 * @throws
 *   - UNSUPPORTED_AUTH_SCHEME: If the authentication scheme isn't supported
 *   - UNKNOWN_AUTH_SCHEME: If the authentication scheme isn't recognized
 */
export type ToolSetupRequest = PostRoute<
  ToolIdPath,
  {
    type: string
    fields: Record<string, any>
  },
  undefined,
  ToolAuthThrows
>

/**
 * Request type for initiating OAuth flow for a tool
 *
 * @route GET /tools/{toolId}/oauth
 * @throws
 *   - UNSUPPORTED_AUTH_SCHEME: If OAuth isn't supported for this tool
 *   - UNKNOWN_AUTH_SCHEME: If the authentication scheme isn't recognized
 */
export type ToolOAuthRequest = GetRoute<ToolOAuthPath, undefined, ToolAuthThrows>

// -------------------------
// Model Routes
// -------------------------

/**
 * Request type for listing available models
 *
 * @route GET /models
 * @returns ListModelsResponse - List of available models
 */
export type ListModelsRequest = GetRoute<typeof API_PATHS.MODELS.LIST, ListModelsResponse>

// -------------------------
// Image Routes
// -------------------------

type ModelImagePath = `/images/models/${string}`
type ToolImagePath = `/images/tools/${string}`

/**
 * Request type for getting a model's image
 *
 * @route GET /images/models/{modelId}
 * @returns Image data for the specified model
 */
export type ModelImageRequest = GetRoute<ModelImagePath>

/**
 * Request type for getting a tool's image
 *
 * @route GET /images/tools/{toolId}
 * @returns Image data for the specified tool
 */
export type ToolImageRequest = GetRoute<ToolImagePath>

// -------------------------
// Union of all routes
// -------------------------

/**
 * Union type of all API routes
 * Use the route and method properties to discriminate
 */
export type Route =
  | ChatCompletionNonStreamingRequest
  | ChatCompletionStreamingRequest
  | ToolSetupRequest
  | ToolOAuthRequest
  | ListModelsRequest
  | ModelImageRequest
  | ToolImageRequest

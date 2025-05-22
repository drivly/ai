/**
 * @deprecated Use the modular imports from './api' instead
 */

// Re-export everything from the new structure
export * from './api'

import type { ParsedModelIdentifier } from '@/pkgs/language-models/src'
import type { CoreMessage } from 'ai'
import type { ChatCompletionError } from './errors'
import { outputFormats, providerPriorities, messageResponseRoles } from '../constants'

// -----------------------------
// Request Types
// -----------------------------

export interface OpenAICompatibleRequest {
  model: string
  messages?: CoreMessage[]
  prompt?: string
  system?: string
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
  response_format?: any
  tools?: any
}

export interface LLMCompatibleRequest {
  /**
   * If true, the response will be streamed as a data stream response
   * This is used by the useChat hook in the client
   */
  useChat?: boolean

  /**
   * Object used to represent mixins for the getModel function.
   * Allows you to control the model via JS rather than a string.
   */
  modelOptions?: {
    providerPriorities?: (typeof providerPriorities)[number][]
    tools?: string[]
    outputFormat?: (typeof outputFormats)[number]
    // JSON Schema, schema.org type, or basic schema supported
    outputSchema?: any
  }
}

export type LLMChatCompletionBody = OpenAICompatibleRequest & LLMCompatibleRequest

// -----------------------------
// Response Types
// -----------------------------

// OpenAI compatible response to list all of the models llm.do supports.
export type ListModelsResponse = {
  object: 'list'
  data: {
    id: string
    object: 'model'
    created: number
    owned_by: string
    permission: string[]
  }[]
}

export type LLMChatCompletionResponseNonStreaming = {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  provider: {
    name: string
  }
  parsed: ParsedModelIdentifier
  choices: {
    index: number
    message: {
      role: (typeof messageResponseRoles)[number]
      content: string
      tool_calls?: {
        id: string
        type: 'function'
        function: {
          name: string
          arguments: string
        }
      }[]
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// -----------------------------
// API Route Types
// -----------------------------

type LLMHeaders = {
  Authorization?: string
  Cookie?: string
  [key: string]: any
}

// Chat completion routes
export type ChatCompletionNonStreamingRequest = {
  method: 'POST'
  route: '/chat/completions'
  body: LLMChatCompletionBody & {
    stream: false
  }
  headers: LLMHeaders
  response?: LLMChatCompletionResponseNonStreaming
  throws?: ChatCompletionError
}

export type ChatCompletionStreamingRequest = {
  method: 'POST'
  route: '/chat/completions'
  body: LLMChatCompletionBody & {
    stream: true
  }
  headers: LLMHeaders
  // Response is not used for streaming requests
  response?: {}
  throws?: ChatCompletionError
}

// Tool routes

// Define error types that can be thrown by tool routes
type ToolAuthThrows = Extract<ChatCompletionError, { type: 'UNSUPPORTED_AUTH_SCHEME' | 'UNKNOWN_AUTH_SCHEME' }>
export type ToolSetupRequest = {
  method: 'POST'
  route: `/tools/${string}`
  body: {
    type: string
    fields: Record<string, any>
  }
  headers: LLMHeaders
  throws?: ToolAuthThrows
}

export type ToolOAuthRequest = {
  method: 'GET'
  route: `/tools/${string}/oauth`
  throws?: ToolAuthThrows
}

// Model routes
export type ListModelsRequest = {
  method: 'GET'
  route: '/models'
  response?: ListModelsResponse
}

// Image routes
export type ModelImageRequest = {
  method: 'GET'
  route: `/images/models/${string}`
}

export type ToolImageRequest = {
  method: 'GET'
  route: `/images/tools/${string}`
}

// Union of all route types
export type Route =
  | ChatCompletionNonStreamingRequest
  | ChatCompletionStreamingRequest
  | ToolSetupRequest
  | ModelImageRequest
  | ToolImageRequest
  | ListModelsRequest
  | ToolOAuthRequest

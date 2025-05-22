import type { CoreMessage } from 'ai'
import { outputFormats, providerPriorities } from '../../constants'

/**
 * Request payload compatible with OpenAI chat API format
 * This is the standard format for chat and completion requests
 */
export interface OpenAICompatibleRequest {
  /** The model identifier to use for the request */
  model: string
  /** Array of conversation messages for chat requests */
  messages?: CoreMessage[]
  /** Text prompt for completion requests (legacy) */
  prompt?: string
  /** System message for single-turn chat requests */
  system?: string
  /** Controls randomness (0.0 to 1.0, where 0 is deterministic) */
  temperature?: number
  /** Maximum number of tokens to generate */
  max_tokens?: number
  /** Nucleus sampling parameter (0.0 to 1.0) */
  top_p?: number
  /** Whether to stream the response */
  stream?: boolean
  /** Response format specification */
  response_format?: any
  /** Tool specifications for function calling */
  tools?: any
}

/**
 * LLM.do-specific extensions to the OpenAI format
 * These options provide additional control over the request
 */
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
    /** Prioritize models based on these criteria (in order) */
    providerPriorities?: (typeof providerPriorities)[number][]
    /** Tool capabilities required for the model */
    tools?: string[]
    /** Format specification for the model output */
    outputFormat?: (typeof outputFormats)[number]
    /** Schema for structured output */
    outputSchema?: any
  }
}

/**
 * Combined request type used for chat completion API calls
 * Includes both OpenAI-compatible and LLM.do-specific fields
 */
export type LLMChatCompletionBody = OpenAICompatibleRequest & LLMCompatibleRequest

/**
 * HTTP headers for API requests
 */
export type LLMHeaders = {
  /** Bearer token for authentication */
  Authorization?: string
  /** Cookie for session-based authentication */
  Cookie?: string
  /** Any additional headers */
  [key: string]: any
}

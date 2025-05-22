import type { CoreMessage } from 'ai'
import { outputFormats, providerPriorities } from '../../constants'

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

export type LLMHeaders = {
  Authorization?: string
  Cookie?: string
  [key: string]: any
}

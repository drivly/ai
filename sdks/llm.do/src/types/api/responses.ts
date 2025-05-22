import type { ParsedModelIdentifier } from '@/pkgs/language-models/src'
import { messageResponseRoles } from '../../constants'

/**
 * OpenAI-compatible response format for listing all available models
 * This format is compatible with OpenAI's /models endpoint
 */
export type ListModelsResponse = {
  /** Indicates this is a list response */
  object: 'list'
  /** Array of model information */
  data: {
    /** Model identifier */
    id: string
    /** Object type */
    object: 'model'
    /** Timestamp when the model was created/added */
    created: number
    /** Provider or owner of the model */
    owned_by: string
    /** Permissions associated with the model */
    permission: string[]
  }[]
}

/**
 * Complete response from a non-streaming chat completion request
 * Contains the generated content as well as metadata about the request
 */
export type LLMChatCompletionResponseNonStreaming = {
  /** Unique identifier for this completion */
  id: string
  /** Object type */
  object: 'chat.completion'
  /** Timestamp when the completion was created */
  created: number
  /** Model ID used for the completion */
  model: string
  /** Information about the model provider */
  provider: {
    /** Name of the provider (e.g., "openai", "anthropic") */
    name: string
  }
  /** Parsed model identifier with additional metadata */
  parsed: ParsedModelIdentifier
  /** Array of completion choices (usually just one) */
  choices: {
    /** Index of this choice */
    index: number
    /** The message containing the completion */
    message: {
      /** Role of the message author */
      role: (typeof messageResponseRoles)[number]
      /** Text content of the message */
      content: string
      /** Tool calls made by the assistant, if any */
      tool_calls?: {
        /** Unique identifier for this tool call */
        id: string
        /** Type of tool call */
        type: 'function'
        /** Function call details */
        function: {
          /** Name of the function to call */
          name: string
          /** JSON string of arguments for the function */
          arguments: string
        }
      }[]
    }
    /** Reason why the generation stopped */
    finish_reason: string
  }[]
  /** Token usage statistics */
  usage: {
    /** Number of tokens in the prompt */
    prompt_tokens: number
    /** Number of tokens in the completion */
    completion_tokens: number
    /** Total tokens used (prompt + completion) */
    total_tokens: number
  }
}

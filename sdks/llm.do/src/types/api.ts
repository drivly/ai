import { ParsedModelIdentifier } from '@/pkgs/language-models/src'
import { CoreMessage } from 'ai'

import {
  ChatCompletionError,
  ModelIncompatibleError,
  ModelNotFoundError,
  ToolAuthorizationError
} from './errors'

export type OpenAICompatibleRequest = {
  model: string;
  messages?: CoreMessage[];
  prompt?: string;
  system?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  response_format?: any;
  tools?: any;
}

export type LLMCompatibleRequest = {
  /*
  * If true, the response will be streamed as a data stream response
  * This is used by the useChat hook in the client
  */
  useChat?: boolean;
  /**
   * Object used to represent mixins for the getModel function.
   * Allows you to control the model via JS rather than a string.
   */
  modelOptions?: {
    providerPriorities?: ('cost' | 'throughput' | 'latency')[],
    tools?: string[],
    outputFormat?: 'JSON' | 'Markdown' | 'Code' | 'Python' | 'TypeScript' | 'JavaScript',
    // JSON Schema, schema.org type, or basic schema supported
    outputSchema?: any
  }
}

// OpenAI compatible response to list all of the models llm.do supports.
export type ListModelsResponse = {
  object: 'list',
  data: {
    id: string,
    object: 'model',
    created: number,
    owned_by: string,
    permission: string[]
  }[]
}

export type LLMChatCompletionResponseNonStreaming = {
  id: string,
  object: 'chat.completion',
  created: number,
  model: string,
  provider: {
    name: string
  },
  parsed: ParsedModelIdentifier,
  choices: {
    index: number,
    message: {
      role: 'user' | 'assistant' | 'system',
      content: string
      tool_calls?: {
        id: string,
        type: 'function',
        function: {
          name: string,
          arguments: string
        }
      }[]
    },
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}

/*
* This is the body of the request for the LLM.do chat completions API
* It is a combination of the OpenAI compatible request and the LLM.do compatible request
* since our API is a superset of the OpenAI API.
* 
* route: POST https://llm.do/chat/completions
*/
export type LLMChatCompletionBody = OpenAICompatibleRequest & LLMCompatibleRequest

type LLMHeaders = {
  Authorization?: string
  Cookie?: string
  [key: string]: any
}

export type ChatCompletionNonStreamingRequest = {
  method: 'POST',
  route: '/chat/completions',
  body: LLMChatCompletionBody & {
    stream: false
  },
  headers: LLMHeaders,
  response?: LLMChatCompletionResponseNonStreaming,
  throws?: ChatCompletionError
    | ModelIncompatibleError
    | ModelNotFoundError
    | ToolAuthorizationError
}

export type ChatCompletionStreamingRequest = {
  method: 'POST',
  route: '/chat/completions',
  body: LLMChatCompletionBody & {
    stream: true
  },
  headers: LLMHeaders,
  // Response is not used for streaming requests
  response?: {},
  throws?: ChatCompletionError
    | ModelIncompatibleError
    | ModelNotFoundError
    | ToolAuthorizationError
}

/*
* Connects a tool to the users account via API key authentication.
* The body contains all of the fields needed to authenticate the tool with the service.
* 
* route: POST https://llm.do/tools/{string}
*/
export type ToolSetupRequest = {
  method: 'POST',
  route: `/tools/${string}`,
  body: Record<string, any>
  headers: LLMHeaders
}

export type ListModelsRequest = {
  method: 'GET',
  route: '/models',
  response?: ListModelsResponse
}

export type ModelImageRequest = {
  method: 'GET',
  route: `/images/models/${string}`
}

export type ToolImageRequest = {
  method: 'GET',
  route: `/images/tools/${string}`
}

export type Route = ChatCompletionNonStreamingRequest
  | ChatCompletionStreamingRequest
  | ToolSetupRequest
  | ModelImageRequest
  | ToolImageRequest
  | ListModelsRequest
  
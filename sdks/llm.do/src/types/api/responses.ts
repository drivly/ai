import type { ParsedModelIdentifier } from '@/pkgs/language-models/src'
import { messageResponseRoles } from '../../constants'

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

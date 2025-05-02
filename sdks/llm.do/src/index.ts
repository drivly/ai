import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
  ProviderErrorStructure,
} from '@ai-sdk/openai-compatible'
import {
  EmbeddingModelV1,
  ImageModelV1,
  LanguageModelV1,
  ProviderV1,
} from '@ai-sdk/provider'
import {
  FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils'
import { z } from 'zod'

type LLMProviderOptions = {
  baseURL?: string
  apiKey?: string
  headers?: Record<string, string>
}

type LLMProviderSettings = {}

// TODO: Ask Nathan about the route.
export const defaultBaseURL = 'https://llm.do/v1'

export const createLLMProvider = (options: LLMProviderOptions) => {
  const baseURL = withoutTrailingSlash(options.baseURL ?? defaultBaseURL)

  let apiKey: string | null = options.apiKey ?? null

  const tryLoadApiKey = (apiKeyName: string) => {
    try {
      return loadApiKey({
        apiKey: options.apiKey,
        environmentVariableName: apiKeyName,
        description: `llm.do API key (${apiKeyName})`,
      })
    } catch (error) {
      return null
    }
  }

  const apiKeyNames = [
    'LLM_DO_API_KEY',
    'AI_GATEWAY_TOKEN'
  ]

  for (const apiKeyName of apiKeyNames) {
    apiKey = tryLoadApiKey(apiKeyName)
    if (apiKey) {
      break
    }
  }

  if (!apiKey) {
    throw new Error(`No API key provided. Please provide a key in one of the following environment variables: ${apiKeyNames.join(', ')}, or pass an apiKey option to the createLLMProvider function.`)
  }

  const getHeaders = () => ({
    Authorization: `Bearer ${apiKey}`,
    ...options.headers,
  })

  return (
    modelId: string,
    settings?: LLMProviderSettings,
  ) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings ?? {}, {
      provider: 'llm.do',
      url: ({ path }) => `${baseURL}/${path}`,
      headers: getHeaders,
      errorStructure: {
        errorSchema: z.any(),
        errorToMessage: (error) => error.message,
      },
      defaultObjectGenerationMode: 'tool',
    })
  }
}
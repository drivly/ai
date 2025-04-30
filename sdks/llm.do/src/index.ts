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
  apiKey: string
  headers?: Record<string, string>
}

type LLMProviderSettings = {}

// TODO: Ask Nathan about the route.
export const defaultBaseURL = 'https://llm.do/v1'

export const createLLMProvider = (options: LLMProviderOptions) => {
  const baseURL = withoutTrailingSlash(options.baseURL ?? defaultBaseURL);
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'LLM_DO_API_KEY',
      description: 'llm.do API key',
    })}`,
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
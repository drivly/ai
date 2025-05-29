import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleChatSettings,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
  ProviderErrorStructure,
} from '@ai-sdk/openai-compatible'
import {
  createOpenAI
} from '@ai-sdk/openai'

import { EmbeddingModelV1, ImageModelV1, LanguageModelV1, ProviderV1 } from '@ai-sdk/provider'
import { FetchFunction, loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils'
import { ParsedModelIdentifier } from '@/pkgs/language-models/src'

import { z } from 'zod'

export * from './types/api'
export * from './types/errors'

type LLMProviderOptions = {
  baseURL?: string
  apiKey?: string
  headers?: Record<string, string>
}

type LLMProviderSettings = OpenAICompatibleChatSettings &
  ParsedModelIdentifier & {
    tools?: string[] | undefined
  }

// Define explicit provider options interface to prevent deep type inference
interface LLMProviderConstructorOptions {
  provider: 'llm.do'
  url: (params: { path: string }) => string
  headers: () => Record<string, string>
  errorStructure: {
    errorSchema: z.ZodType<any>
    errorToMessage: (error: any) => string
  }
  defaultObjectGenerationMode: 'tool'
  fetch: (url: URL | RequestInfo, init: RequestInit | undefined) => Promise<Response>
}

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

  const apiKeyNames = ['LLM_DO_API_KEY', 'AI_GATEWAY_TOKEN', 'OPENROUTER_API_KEY']

  for (const apiKeyName of apiKeyNames) {
    apiKey = tryLoadApiKey(apiKeyName)
    if (apiKey) {
      break
    }
  }

  if (!apiKey) {
    throw new Error(
      `No API key provided. Please provide a key in one of the following environment variables: ${apiKeyNames.join(', ')}, or pass an apiKey option to the createLLMProvider function.`,
    )
  }

  const getHeaders = () => ({
    Authorization: `Bearer ${apiKey}`,
    ...options.headers,
  })

  return (modelId: string, settings?: LLMProviderSettings) => {
    // Create provider options with explicit type
    const providerOptions: LLMProviderConstructorOptions = {
      provider: 'llm.do',
      url: ({ path }) => `${baseURL}/${path}`,
      headers: getHeaders,
      errorStructure: {
        errorSchema: z.any(),
        errorToMessage: (error) => error.message,
      },
      // @ts-expect-error - This is ok. No clue why TS is complaining.
      defaultObjectGenerationMode: 'json',
      supportsStructuredOutputs: true,
      fetch: async (url, init) => {
        // Mixin our model options into the body.
        // By default, AI SDK wont let us add properties that are not inside the OpenAI schema.
        // So we're doing this to use our superset standard.

        const newBody = {
          ...JSON.parse((init?.body as string) ?? '{}'),
          modelOptions: settings,
        }

        const response = await fetch(url, {
          ...init,
          body: JSON.stringify(newBody),
        })

        console.dir(
          (await response.clone().json()),
          { depth: null }
        )

        return response
      },
    }

    const openai = createOpenAI({
      baseURL,
      apiKey,
      fetch: providerOptions.fetch,
      headers: getHeaders()
    })

    const model = openai(modelId)

    return model

    //return new OpenAICompatibleChatLanguageModel(modelId, (settings ?? {}) as LLMProviderSettings, providerOptions as any)
  }
}

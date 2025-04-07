import type { AnthropicMessagesModelId } from '@ai-sdk/anthropic/internal'
import { DeepSeekProvider } from '@ai-sdk/deepseek'
import { GoogleGenerativeAILanguageModel } from '@ai-sdk/google/internal'
import type { OpenAIChatModelId } from '@ai-sdk/openai/internal'
import { APICallError, generateObject, generateText, LoadAPIKeyError, Output, type CoreMessage, type LanguageModelV1, type Schema, type Tool } from 'ai'
import { JSONObject } from 'hono/utils/types'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { registry } from './registry'

export async function llm<T extends JSONObject = JSONObject>({
  modelName = 'gpt-4o',
  provider = modelName.includes('/')
    ? modelName.split('/')[0]
    : isOpenAIChatModelId(modelName)
      ? 'openai'
      : isGoogleGenerativeAIModelId(modelName)
        ? 'google'
        : isAnthropicMessagesModelId(modelName)
          ? 'anthropic'
          : isDeepSeekChatModelId(modelName)
            ? 'deepseek'
            : 'compatible',
  schema,
  tools,
  toolsUsed = [],
  maxSteps = 1,
  maxRetries = 2,
  messages = [],
  model = registry.languageModel((modelName.includes('/') ? modelName : `${provider}/${modelName}`) as Parameters<typeof registry.languageModel>[0]),
  seed,
  system,
  toolsOnly = false,
}: {
  provider?: string
  maxSteps?: number
  maxRetries?: number
  messages?: CoreMessage[]
  model?: LanguageModelV1
  modelName?: AnthropicMessagesModelId | OpenAIChatModelId | Parameters<DeepSeekProvider['languageModel']>[0] | GoogleGenerativeAILanguageModel['modelId']
  schema?: z.ZodSchema<T> | Schema<T>
  seed?: number
  system?: string
  tools?: Record<string, Tool>
  toolsOnly?: boolean
  toolsUsed?: string[]
}) {
  if (system) {
    messages.unshift({
      role: 'system',
      content: system,
    })
  }

  try {
    let objectCall
    if (isOpenAIChatModelId(model.modelId) && versionedOpenaiModelIdMap[model.modelId] && !versionedOpenaiModelIdMap[model.modelId].tools) {
      if (toolsUsed?.length) {
        // TODO: retrofit
        toolsUsed = []
      }
      messages.push({
        role: 'user',
        content: `Format the response to this schema and only return the object:
${JSON.stringify(schema instanceof z.ZodType ? zodToJsonSchema(schema) : schema)}`,
      })
      const call = await generateText({
        maxSteps,
        maxRetries,
        messages,
        model,
        seed,
        experimental_continueSteps: true,
        tools,
        toolChoice: toolsOnly ? 'required' : 'auto',
        experimental_activeTools: toolsUsed,
      })
      objectCall = {
        ...call,
        experimental_output: JSON.parse(call.text.replaceAll(/^```(json)?\n|```\n?$/g, '')),
      }
    } else {
      if (schema) {
        objectCall = await generateText({
          maxSteps,
          maxRetries,
          experimental_continueSteps: maxSteps > 1,
          messages,
          model,
          experimental_output: Output.object({ schema }),
          seed,
          tools,
          toolChoice: toolsOnly ? 'required' : 'auto',
          experimental_activeTools: toolsUsed,
        })
      } else {
        objectCall = await generateObject({
          messages,
          maxRetries,
          model,
          seed,
          output: 'no-schema',
        })
      }
    }
    if ('experimental_output' in objectCall) {
      const { experimental_output: object, ...retval } = objectCall

      return {
        ...retval,
        object: object as T,
        messages,
      }
    }
    return {
      ...objectCall,
      object: objectCall.object as T,
      messages,
    }
  } catch (e) {
    console.error(e)
    throw e instanceof Error
      ? new Error(e.message, {
          cause: e instanceof APICallError ? 502 : e instanceof LoadAPIKeyError ? 503 : e,
        })
      : e
  }
}

export const deepSeekChatModelIds = ['deepseek-chat', 'deepseek-reasoner'] as const

function isDeepSeekChatModelId(id: Parameters<DeepSeekProvider>[0]) {
  return deepSeekChatModelIds.some((m) => m === id)
}

function isAnthropicMessagesModelId(id: AnthropicMessagesModelId) {
  return anthropicModelIds.includes(id)
}

function isOpenAIChatModelId(id: OpenAIChatModelId) {
  return openaiModelIds.includes(id)
}

function isGoogleGenerativeAIModelId(id: GoogleGenerativeAILanguageModel['modelId']) {
  return googleGenerativeAIModelIds.includes(id)
}

export const googleGenerativeAIModelIds: GoogleGenerativeAILanguageModel['modelId'][] = [
  'gemini-2.0-flash-001',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-001',
  'gemini-1.5-flash-002',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-8b-latest',
  'gemini-1.5-flash-8b-001',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro-001',
  'gemini-1.5-pro-002',
  'gemini-2.5-pro-exp-03-25',
  'gemini-2.0-flash-lite-preview-02-05',
  'gemini-2.0-pro-exp-02-05',
  'gemini-2.0-flash-thinking-exp-01-21',
  'gemini-2.0-flash-exp',
  'gemini-exp-1206',
  'gemma-3-27b-it',
  'learnlm-1.5-pro-experimental',
]

export const latestAnthropicModelIds: AnthropicMessagesModelId[] = ['claude-3-opus-latest', 'claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest', 'claude-3-7-sonnet-latest']

export const versionedAnthropicModelIds: AnthropicMessagesModelId[] = [
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-7-sonnet-20250219',
]

export const anthropicModelIds: AnthropicMessagesModelId[] = [...versionedAnthropicModelIds, ...latestAnthropicModelIds]

export const latestOpenaiModelIds: OpenAIChatModelId[] = [
  'gpt-3.5-turbo',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-4o',
  'gpt-4o-audio-preview',
  'gpt-4o-mini',
  'gpt-4.5-preview',
  'o1',
  'o1-mini',
  'o1-preview',
  'o3-mini',
]

export const versionedOpenaiModelIdMap: Record<string, { structuredOutputs?: boolean; tools?: boolean }> = {
  'gpt-3.5-turbo-1106': { structuredOutputs: false, tools: true },
  'gpt-3.5-turbo-0125': { structuredOutputs: false, tools: true },
  'gpt-4-0613': { structuredOutputs: false, tools: true },
  'gpt-4-1106-preview': { structuredOutputs: false, tools: true },
  'gpt-4-0125-preview': { structuredOutputs: false, tools: true },
  'gpt-4-turbo-preview': { structuredOutputs: false, tools: true },
  'gpt-4-turbo-2024-04-09': { structuredOutputs: false, tools: true },
  'gpt-4o-2024-05-13': { structuredOutputs: false, tools: true },
  'gpt-4o-2024-08-06': { structuredOutputs: true, tools: true },
  'gpt-4o-2024-11-20': { structuredOutputs: true, tools: true },
  'gpt-4o-mini-2024-07-18': { structuredOutputs: true, tools: true },
  'o1-2024-12-17': { structuredOutputs: true, tools: true },
  'o1-mini-2024-09-12': { structuredOutputs: false, tools: false },
  'o1-preview-2024-09-12': { structuredOutputs: false, tools: false },
  'o3-mini-2025-01-31': { structuredOutputs: true, tools: true },
  // TODO: test capabilities
  'gpt-4o-audio-preview-2024-10-01': { structuredOutputs: true, tools: true },
  'gpt-4o-audio-preview-2024-12-17': { structuredOutputs: true, tools: true },
  'gpt-4.5-preview-2025-02-27': { structuredOutputs: true, tools: true },
  'chatgpt-4o-latest': { structuredOutputs: true, tools: true },
}

export const versionedOpenaiModelIds: OpenAIChatModelId[] = Object.keys(versionedOpenaiModelIdMap) as OpenAIChatModelId[]

export const openaiModelIds: OpenAIChatModelId[] = [...versionedOpenaiModelIds, ...latestOpenaiModelIds]

export const versionedModelIds: (OpenAIChatModelId | AnthropicMessagesModelId | Parameters<DeepSeekProvider>[0])[] = [
  ...versionedOpenaiModelIds,
  ...versionedAnthropicModelIds,
  ...deepSeekChatModelIds,
]

export const latestModelIds: (OpenAIChatModelId | AnthropicMessagesModelId | Parameters<DeepSeekProvider>[0])[] = [
  ...latestOpenaiModelIds,
  ...latestAnthropicModelIds,
  ...deepSeekChatModelIds,
]

export const modelIds: (OpenAIChatModelId | AnthropicMessagesModelId | Parameters<DeepSeekProvider>[0])[] = [...versionedModelIds, ...latestModelIds]

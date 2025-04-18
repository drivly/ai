import type { AnthropicMessagesModelId } from '@ai-sdk/anthropic/internal/dist'
import { DeepSeekProvider } from '@ai-sdk/deepseek'
import { GoogleGenerativeAILanguageModel } from '@ai-sdk/google/internal/dist'
import type { OpenAIChatModelId } from '@ai-sdk/openai/internal/dist'
import { getModels } from 'language-models'

export type ModelId = AnthropicMessagesModelId | OpenAIChatModelId | Parameters<DeepSeekProvider>[0] | GoogleGenerativeAILanguageModel['modelId']

// export function getModels(models: string[], config?: ModelConfig) {
//   return models.map((m) => getModel(m, config)?.slug).filter((m) => m !== undefined)
// }

export function getRequiredCapabilities({
  tools,
  reasoning,
  response_format,
}: {
  tools?: (string | { type: string })[]
  reasoning?: { effort: 'low' | 'medium' | 'high' }
  response_format?: { type: 'json_schema' | 'json_object' }
}) {
  const requiredCapabilities: string[] = []
  if (reasoning?.effort) {
    requiredCapabilities.push('reasoning', `reasoning-${reasoning?.effort}`)
  }
  if (tools?.find((t) => typeof t !== 'string' && typeof t.type === 'string' && t.type.startsWith('web_search'))) {
    requiredCapabilities.push('online')
  }
  if (tools?.find((t) => typeof t === 'string' || t.type === 'function')) {
    requiredCapabilities.push('tools')
  }
  if (response_format?.type === 'json_schema') {
    requiredCapabilities.push('structuredOutput')
  } else if (response_format?.type === 'json_object') {
    requiredCapabilities.push('responseFormat')
  }
  return requiredCapabilities
}

export const deepSeekChatModelIds: Parameters<DeepSeekProvider>[0][] = ['deepseek-chat', 'deepseek-reasoner']

export function isDeepSeekChatModelId(id: Parameters<DeepSeekProvider>[0] | `deepseek/${Parameters<DeepSeekProvider>[0]}`) {
  return deepSeekChatModelIds.includes(id.startsWith('deepseek/') ? id.slice('deepseek/'.length) : id)
}

export function isAnthropicMessagesModelId(id: AnthropicMessagesModelId | `anthropic/${AnthropicMessagesModelId}`) {
  return anthropicModelIds.includes(id.startsWith('anthropic/') ? id.slice('anthropic/'.length) : id)
}

export function isOpenAIChatModelId(id: OpenAIChatModelId | `openai/${OpenAIChatModelId}`) {
  return openaiModelIds.includes(id.startsWith('openai/') ? id.slice('openai/'.length) : id)
}

export function isGoogleGenerativeAIModelId(id: GoogleGenerativeAILanguageModel['modelId'] | `google/${GoogleGenerativeAILanguageModel['modelId']}`) {
  return googleGenerativeAIModelIds.includes(id.startsWith('google/') ? id.slice('google/'.length) : id)
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

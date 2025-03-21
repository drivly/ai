import { Capability, LanguageModel, Provider, ThinkingLevel } from './types'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import rawModels from './models'
import camelCase from 'camelcase'

export type Model = {
  isComposite?: boolean
  name: string
  author: string
  parentModel?: string
  modelIdentifier?: string
  provider: Provider
  capabilities?: Capability[]
  capabilityRouting?: {
    [key in Capability]?: string
  }
  callbacks?: {
    /**
     * Return an object to deep-merge into the generateObject args.
     */
    [key in Capability]?: (generateArgs: Parameters<typeof generateObject>[0]) => Partial<Parameters<typeof generateObject>[0]>
  }
  defaults?: Capability[]
  childPriority?: 'first' | 'random'
  childrenModels?: Model['name'][]
}

export function getModelOrGateway(provider: Provider, model: string, useGateway: boolean): LanguageModel {
  let baseURL = useGateway ? `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_USER_ID}/ai-experiments/${provider}` : undefined

  // Cloudflare's gateway has a bug where it doesnt route the model correctly.
  if (provider == 'google' && useGateway) {
    baseURL += '/v1beta'
  }

  // We need to do this as unknown as LanguageModel because the SDKs all have
  // different types, which dont match the LanguageModel type.
  // however, they fundimentally have the same shape. So this is to keep TS from complaining.

  let providerInstance: LanguageModel | null = null

  switch (provider) {
    case 'openai':
      providerInstance = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL,
      }) as unknown as LanguageModel
      break
    case 'anthropic':
      providerInstance = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      }) as unknown as LanguageModel
      break
    case 'google':
      providerInstance = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        baseURL,
      }) as unknown as LanguageModel
      break
    default:
      throw new Error(`Provider ${provider} not supported`)
  }

  if (!providerInstance) {
    throw new Error(`Provider ${provider} not supported`)
  }

  // @ts-expect-error - TS weirdness.
  return providerInstance(model) as LanguageModel
}

const providerRewrites = {
  'Google AI Studio': 'google',
}

let models: Model[] = rawModels.models.map((x) => {
  const provider = providerRewrites[x.endpoint?.providerName as keyof typeof providerRewrites] ?? x.endpoint?.providerName

  const model: Model = {
    name: x.name,
    author: x.author,
    provider: camelCase(provider ?? 'unknown') as Provider,
    capabilities: x.endpoint?.supportedParameters.map((p) => camelCase(p) as Capability),
    modelIdentifier: x.permaslug.replace(x.author + '/', ''), // Fixes cases where the modelId was google/google/google-gemini-2.0-flash-001
  }

  return model
})

models = models.map((x) => {
  if (x.name.includes('Flash Thinking')) {
    // We need to manually add the reasoning capability
    x.capabilities = [...(x.capabilities ?? []), 'reasoning']
  }

  return x
})

// Virtual model to get any model that supports these capabilities
models.push({
  isComposite: true,
  name: 'frontier',
  author: 'drivly',
  provider: 'drivly',
  capabilities: ['reasoning', 'code', 'online'],
  modelIdentifier: 'frontier',
  // Array of children models that will be checked for compatibility
  // in order. First most compatible will be used.
  childrenModels: ['google/gemini-2.0-flash-001', 'google/gemini-2.0-flash-thinking-exp-01-21', 'anthropic/claude-3-7-sonnet-20250219', 'openai/gpt-4o'],
  childPriority: 'random',
})

export { models }

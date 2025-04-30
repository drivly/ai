import { LanguageModelV1, LanguageModelV1CallWarning, LanguageModelV1FinishReason, LanguageModelV1StreamPart } from '@ai-sdk/provider'

import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { getModel, getModels, Model } from 'language-models'



const providerRegistry: Record<string, any> = {
  openrouter: createOpenAI({
    baseURL: 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter',
    apiKey: process.env.OPENROUTER_API_KEY || process.env.AI_GATEWAY_TOKEN,
    headers: {
      'HTTP-Referer': 'http://workflows.do',
      'X-Title': 'Workflows.do'
    }
  }),
  google: createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
  }),
  anthropic: createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  }),
  cloudflare: createOpenAI({
    baseURL: `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID || '<account_id>'}/${process.env.CLOUDFLARE_PROJECT_NAME || '<project_name>'}/workersai`,
    apiKey: process.env.CLOUDFLARE_API_KEY || process.env.AI_GATEWAY_TOKEN,
  }),
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
}

type ProviderOptions = {
  /**
   * If true, our provider will try to fix the schema of an output
   * using gemini-2.0-lite, taking the output of the model and
   * rewriting it to match the schema.
   */
  allowFixingSchema?: boolean
  /**
   * Tools to be used by the model
   */
  tools?: Record<string, string | number | boolean | Record<string, unknown>>
  /**
   * Priorities for model selection
   */
  priorities?: string[]
  /**
   * Enable reasoning capability
   */
  reasoning?: boolean
  /**
   * Maximum price constraint
   */
  maxPrice?: number
}

type LLMProviderConfig = {
  // For now, it will be empty.
}

export const createLLMProvider = (config: LLMProviderConfig) => (model: string, options?: ProviderOptions) => {
  const augments: Record<string, any> = {}

  if (options?.tools) augments.tools = options.tools
  if (options?.priorities) augments.priorities = options.priorities
  if (options?.reasoning) {
    augments.capabilities ??= {}
    augments.capabilities = { ...augments.capabilities, reasoning: true }
  }
  if (options?.maxPrice) augments.providerConstraints = [{ field: 'cost', value: options.maxPrice.toString(), type: 'lt' }]

  return new LLMProvider(model, options ?? {}, augments)
}

export const model = createLLMProvider({})

/**
 * Returns an array of LLMProvider instances for the given model identifiers
 * @param modelIdentifiers Comma-separated string of model identifiers
 * @param options Provider options
 * @returns Array of LLMProvider instances
 */
export const models = (modelIdentifiers: string, options?: ProviderOptions) => {
  const modelInstances = getModels(modelIdentifiers)
  return modelInstances.map((model) => new LLMProvider(model.slug, options ?? {}))
}

class LLMProvider implements LanguageModelV1 {
  // For signalling to our ai.ts overwrites that this is the LLMProvider
  readonly _name: string = 'LLMProvider'
  readonly specificationVersion = 'v1'
  readonly resolvedModel: Model

  constructor(
    public modelId: string,
    public options: ProviderOptions,
    private augments?: Record<string, any>,
  ) {
    this.modelId = modelId
    this.options = options ?? {}

    this.resolvedModel = getModel(modelId, this.augments || {})

    if (!this.resolvedModel.slug) {
      throw new Error(`Model ${modelId} not found`)
    }
  }

  get provider() {
    let provider = 'openrouter'

    // Access provider property which is added by getModel but not in the Model type
    const providerSlug = this.resolvedModel.provider?.slug

    return provider

    switch (providerSlug) {
      case 'openAi':
        provider = 'openai'
        break
      case 'aiStudioNonThinking':
      case 'aiStudio':
      case 'google':
        provider = 'openrouter'
        break
      case 'anthropic':
        provider = 'anthropic'
        break
      case 'cloudflare':
        provider = 'cloudflare'
        break
      default:
        provider = 'openrouter'
        break
    }

    return provider
  }

  get supportsImageUrls() {
    // Depending on the model, we may or may not support image urls
    return this.resolvedModel.inputModalities.includes('image')
  }

  // Fix Anthropic's default object generation mode.
  get defaultObjectGenerationMode() {
    // Access provider property which is added by getModel but not in the Model type
    return (this.resolvedModel as any).provider?.supportedParameters.includes('tools') ? 'tool' : 'json'
  }

  async doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>> {
    // Access providerModelId which is added by getModel but not in the Model type
    const modelSlug = this.provider == 'openrouter' ? this.resolvedModel.slug : (this.resolvedModel as any).provider?.providerModelId

    let modelConfigMixin = {}

    if (options.responseFormat?.type == 'json') {
      // Force Google and OpenAI to use structured outputs.
      if (this.provider == 'google' || this.provider == 'openai') {
        modelConfigMixin = {
          structuredOutputs: true,
        }
      }
    }

    return await providerRegistry[this.provider](modelSlug, modelConfigMixin).doGenerate(options)
  }

  async doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>> {
    // Access providerModelId which is added by getModel but not in the Model type
    const modelSlug = this.provider == 'openrouter' ? this.resolvedModel.slug : (this.resolvedModel as any).provider?.providerModelId

    let modelConfigMixin = {}

    if (options.responseFormat?.type == 'json') {
      // Force Google and OpenAI to use structured outputs.
      if (this.provider == 'google' || this.provider == 'openai') {
        modelConfigMixin = {
          structuredOutputs: true,
        }
      }
    }

    return await providerRegistry[this.provider](modelSlug, modelConfigMixin).doStream(options)
  }
}

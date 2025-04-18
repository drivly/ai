import {
  LanguageModelV1,
  LanguageModelV1CallWarning,
  LanguageModelV1FinishReason,
  LanguageModelV1StreamPart,
} from '@ai-sdk/provider'

import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { getModel, Model } from 'language-models'

const providerRegistry: Record<string, any> = {
  openrouter: createOpenAI({
    baseURL: 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter',
    apiKey: process.env.OPENROUTER_API_KEY || process.env.AI_GATEWAY_TOKEN,
  }),
  google: createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
  }),
  anthropic: createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  }),
}

type ProviderOptions = {
  /**
   * If true, our provider will try to fix the schema of an output
   * using gemini-2.0-lite, taking the output of the model and 
   * rewriting it to match the schema.
   */
  allowFixingSchema?: boolean
}

type LLMProviderConfig = {
  // For now, it will be empty.
}

export const createLLMProvider = (config: LLMProviderConfig) => (model: string, options?: ProviderOptions) => {
  return new LLMProvider(model, options ?? {})
}

export const llmProvider = createLLMProvider({})

class LLMProvider implements LanguageModelV1 {
  readonly specificationVersion = 'v1'
  readonly resolvedModel: Model

  constructor(
    public modelId: string,
    public options: ProviderOptions
  ) {
    this.modelId = modelId
    this.options = options ?? {}

    this.resolvedModel = getModel(modelId)

    if (!this.resolvedModel.slug) {
      throw new Error(`Model ${modelId} not found`)
    }
  }

  get provider() {
    let provider = 'openrouter'

    switch (this.resolvedModel.provider?.slug) {
      case 'openai':
        provider = 'openai'
        break
      case 'google':
        provider = 'google'
        break
      case 'anthropic':
        provider = 'anthropic'
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
    return this.resolvedModel.provider?.supportedParameters.includes('tools') ? 'tool' : 'json'
  }

  async doGenerate(
    options: Parameters<LanguageModelV1['doGenerate']>[0],
  ): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>> {
    // @ts-expect-error - providerModelId is a recent addition and i need to fix the types.
    const modelSlug = this.provider == 'openrouter' ? this.resolvedModel.slug : this.resolvedModel.provider?.providerModelId

    let modelConfigMixin = {}

    if (options.responseFormat?.type == 'json') {
      // Force Google and OpenAI to use structured outputs.
      if (this.provider == 'google' || this.provider == 'openai') {
        modelConfigMixin = {
          structuredOutputs: true
        }
      }
    }

    return await providerRegistry[this.provider](modelSlug, modelConfigMixin).doGenerate(options)
  }

  async doStream(
    options: Parameters<LanguageModelV1['doStream']>[0],
  ): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>> {

    // @ts-expect-error - providerModelId is a recent addition and i need to fix the types.
    const modelSlug = this.provider == 'openrouter' ? this.resolvedModel.slug : this.resolvedModel.provider?.providerModelId

    return await providerRegistry[this.provider](this.resolvedModel.slug).doStream(options)
  }
}

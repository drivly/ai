import { LanguageModelV1 } from '@ai-sdk/provider'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { getModel, getModels, Model } from 'language-models'

// Not in use for the inital release.
const providerRegistry: Record<string, any> = {
  openrouter: createOpenAI({
    baseURL: 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter',
    apiKey: process.env.OPENROUTER_API_KEY || process.env.AI_GATEWAY_TOKEN,
    headers: {
      'HTTP-Referer': 'http://workflows.do',
      'X-Title': 'Workflows.do',
    },
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
  /**
   * OpenRouter API key
   * Uses this key if defined, otherwise uses the default key at env.OPENROUTER_API_KEY
   */
  apiKey?: string
}

type LLMProviderConfig = {
  baseURL?: string
  apiKey?: string
  headers?: Record<string, string>
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

  if (!config.apiKey) {
    // Use fallback if no api key is provided via the create config
    config.apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_GATEWAY_TOKEN || ''
  }

  return new LLMProvider(model, options ?? {}, config)
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
  readonly apiKey: string

  constructor(
    public modelId: string,
    public options: ProviderOptions,
    private config?: Record<string, any>,
  ) {
    this.modelId = modelId
    this.options = options ?? {}
    this.config = config ?? {}
    this.resolvedModel = getModel(modelId)

    this.apiKey = this.config?.apiKey

    if (!this.apiKey) {
      throw new Error(`AI Provider found no API key. Please either provide an apiKey in the createLLMProvider config, or set the OPENROUTER_API_KEY environment variable.`)
    }
  }

  get provider() {
    let provider = 'openrouter'

    // // Access provider property which is added by getModel but not in the Model type
    // const providerSlug = this.resolvedModel.provider?.slug

    // switch (providerSlug) {
    //   case 'openAi':
    //     provider = 'openai'
    //     break
    //   case 'aiStudioNonThinking':
    //   case 'aiStudio':
    //   case 'google':
    //     provider = 'openrouter'
    //     break
    //   case 'anthropic':
    //     provider = 'anthropic'
    //     break
    //   case 'cloudflare':
    //     provider = 'cloudflare'
    //     break
    //   default:
    //     provider = 'openrouter'
    //     break
    // }

    // return provider
  }

  get supportsImageUrls() {
    // Depending on the model, we may or may not support image urls
    return this.resolvedModel.inputModalities?.includes('image')
  }

  // Fix Anthropic's default object generation mode.
  get defaultObjectGenerationMode() {
    // Access provider property which is added by getModel but not in the Model type
    return (this.resolvedModel as any).provider?.supportedParameters.includes('tools') ? 'tool' : 'json'
  }

  async doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>> {
    // Access providerModelId which is added by getModel but not in the Model type
    const modelSlug = this.provider == 'openrouter' ? this.resolvedModel.slug || this.modelId : (this.resolvedModel as any).provider?.providerModelId

    let modelConfigMixin = {}

    if (options.responseFormat?.type == 'json') {
      // Force Google and OpenAI to use structured outputs.
      if (this.provider == 'google' || this.provider == 'openai') {
        modelConfigMixin = {
          structuredOutputs: true,
        }
      }
    }

    const provider = createOpenAI({
      baseURL: this.config?.baseURL || 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter',
      apiKey: this.apiKey,
      headers: this.config?.headers,
      headers: this.config?.headers,
    })

    return await provider(modelSlug, modelConfigMixin).doGenerate(options)

    //return await providerRegistry[this.provider](modelSlug, modelConfigMixin).doGenerate(options)
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

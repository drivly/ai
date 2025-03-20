declare module 'models-json' {
  export type Models = {
    models: Model[]
  }

  export type Endpoint = {
    id: string
    name: string
    contextLength: number
    model: Model
    modelVariantSlug: string
    modelVariantPermaslug: string
    providerName: string
    providerInfo: ProviderInfo
    providerDisplayName: string
    providerModelID: string
    providerGroup: string
    isCloaked: boolean
    quantization: Quantization | null
    variant: Variant
    isSelfHosted: boolean
    canAbort: boolean
    maxPromptTokens: number | null
    maxCompletionTokens: number | null
    maxPromptImages: null
    maxTokensPerImage: null
    supportedParameters: SupportedParameter[]
    isByokRequired: boolean
    moderationRequired: boolean
    dataPolicy: DataPolicy
    pricing: Pricing
    isHidden: boolean
    isDeranked: boolean
    isDisabled: boolean
    supportsToolParameters: boolean
    supportsReasoning: boolean
    supportsMultipart: boolean
    limitRPM: number | null
    limitRpd: number | null
    hasCompletions: boolean
    hasChatCompletions: boolean
    features: Features
    providerRegion: null
  }

  export type Model = {
    slug: string
    hfSlug: null | string
    updatedAt: Date
    createdAt: Date
    hfUpdatedAt: null
    name: string
    shortName: string
    author: string
    description: string
    modelVersionGroupID: null | string
    contextLength: number
    modality: Modality
    hasTextOutput: boolean
    group: Group
    instructType: null | string
    defaultSystem: null
    defaultStops: string[]
    hidden: boolean
    router: null
    warningMessage: null | string
    permaslug: string
    reasoningConfig: ReasoningConfig | null
    endpoint?: Endpoint | null
  }

  export type DataPolicy = {
    termsOfServiceURL?: string
    privacyPolicyURL?: string
    training: boolean
    requiresUserIDS?: boolean
  }

  export type Features = {}

  export type Pricing = {
    prompt: string
    completion: string
    image: string
    request: string
    inputCacheRead: string
    inputCacheWrite: string
    webSearch: string
    internalReasoning: string
  }

  export type ProviderInfo = {
    name: string
    displayName: string
    baseURL: BaseURL
    dataPolicy: DataPolicy
    hasChatCompletions: boolean
    hasCompletions: boolean
    isAbortable: boolean
    moderationRequired: boolean
    group: string
    editors: any[]
    owners: any[]
    isMultipartSupported: boolean
    statusPageURL: null | string
    byokEnabled: boolean
    isPrimaryProvider: boolean
    icon: Icon
  }

  export enum BaseURL {
    URL = 'url',
  }

  export type Icon = {
    url: string
    invertRequired?: boolean
  }

  export enum Quantization {
    Bf16 = 'bf16',
    Fp16 = 'fp16',
    Fp6 = 'fp6',
    Fp8 = 'fp8',
    Int4 = 'int4',
    Unknown = 'unknown',
  }

  export enum SupportedParameter {
    FrequencyPenalty = 'frequency_penalty',
    IncludeReasoning = 'include_reasoning',
    LogitBias = 'logit_bias',
    Logprobs = 'logprobs',
    MaxTokens = 'max_tokens',
    MinP = 'min_p',
    PresencePenalty = 'presence_penalty',
    Reasoning = 'reasoning',
    RepetitionPenalty = 'repetition_penalty',
    ResponseFormat = 'response_format',
    Seed = 'seed',
    Stop = 'stop',
    StructuredOutputs = 'structured_outputs',
    Temperature = 'temperature',
    ToolChoice = 'tool_choice',
    Tools = 'tools',
    TopA = 'top_a',
    TopK = 'top_k',
    TopLogprobs = 'top_logprobs',
    TopP = 'top_p',
  }

  export enum Variant {
    Beta = 'beta',
    Extended = 'extended',
    Free = 'free',
    Standard = 'standard',
    Thinking = 'thinking',
  }

  export enum Group {
    Claude = 'Claude',
    Cohere = 'Cohere',
    DeepSeek = 'DeepSeek',
    GPT = 'GPT',
    Gemini = 'Gemini',
    Grok = 'Grok',
    Llama2 = 'Llama2',
    Llama3 = 'Llama3',
    Media = 'Media',
    Mistral = 'Mistral',
    Nova = 'Nova',
    Other = 'Other',
    PaLM = 'PaLM',
    Qwen = 'Qwen',
    Router = 'Router',
    Rwkv = 'RWKV',
    Yi = 'Yi',
  }

  export enum Modality {
    Text3D = 'text->3d',
    TextImageText = 'text+image->text',
    TextText = 'text->text',
  }

  export type ReasoningConfig = {
    startToken: StartToken
    endToken: EndToken
  }

  export enum EndToken {
    Think = '</think>',
  }

  export enum StartToken {
    Think = '<think>',
  }
}

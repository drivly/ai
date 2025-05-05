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
  providerModelId: string
  providerGroup: string
  isCloaked: boolean
  quantization: null
  variant: string
  isSelfHosted: boolean
  canAbort: boolean
  maxPromptTokens: null
  maxCompletionTokens: number
  maxPromptImages: null
  maxTokensPerImage: null
  supportedParameters: string[]
  isByok: boolean
  moderationRequired: boolean
  dataPolicy: DataPolicy
  pricing: Pricing
  isHidden: boolean
  isDeranked: boolean
  isDisabled: boolean
  supportsToolParameters: boolean
  supportsReasoning: boolean
  supportsMultipart: boolean
  limitRpm: number
  limitRpd: null
  hasCompletions: boolean
  hasChatCompletions: boolean
  features: Features
  providerRegion: null
}

export type Model = {
  slug: string
  hfSlug?: string | null
  updatedAt: string
  createdAt: string
  hfUpdatedAt: null
  name: string
  shortName: string
  author: string
  description: string
  modelVersionGroupId: string
  contextLength: number
  inputModalities: string[]
  outputModalities: string[]
  hasTextOutput: boolean
  group: string
  instructType: null
  defaultSystem: null
  defaultStops: any[]
  hidden: boolean
  router: null
  warningMessage: null
  permaslug: string
  reasoningConfig: null
  endpoint?: Endpoint
  sorting?: Sorting
  providers?: Provider[]
  provider?: Provider
}

export type DataPolicy = {
  termsOfServiceUrl: string
  privacyPolicyUrl: string
  training: boolean
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
  baseUrl: string
  dataPolicy: DataPolicy
  headquarters: string
  hasChatCompletions: boolean
  hasCompletions: boolean
  isAbortable: boolean
  moderationRequired: boolean
  group: string
  editors: any[]
  owners: any[]
  isMultipartSupported: boolean
  statusPageUrl: null
  byokEnabled: boolean
  isPrimaryProvider: boolean
  icon: Icon
}

export type Icon = {
  url: string
}

export type Provider = {
  name: string
  slug: string
  quantization: string | null
  context: number
  maxCompletionTokens: number
  pricing: Pricing
  supportedParameters: string[]
  inputCost: number
  outputCost: number
  throughput: number
  latency: number
}

export type Sorting = {
  topWeekly: number
  newest: number
  throughputHighToLow: number
  latencyLowToHigh: number
  pricingLowToHigh: number
  pricingHighToLow: number
}

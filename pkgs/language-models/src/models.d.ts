// --- Reusable Base Interfaces ---

interface Icon {
  url: string
  invertRequired?: boolean
}

interface DataPolicy {
  termsOfServiceUrl?: string // Optional based on examples
  privacyPolicyUrl?: string // Optional based on examples
  training: boolean
  loggingRetentionDays?: number // Optional based on examples
  requiresUserIds?: boolean // Optional based on examples
}

// Base pricing structure, allowing for optional cache fields
interface Pricing {
  prompt: string
  completion: string
  image: string
  request: string
  webSearch: string
  internalReasoning: string
  discount: number
  inputCacheRead?: string // Optional based on examples
  inputCacheWrite?: string // Optional based on examples
}

interface ReasoningConfig {
  startToken: string
  endToken: string
}

interface Sorting {
  topWeekly: number
  newest: number
  throughputHighToLow: number
  latencyLowToHigh: number
  pricingLowToHigh: number
  pricingHighToLow: number
}

interface ProviderInfo {
  name: string
  displayName: string
  baseUrl: string
  dataPolicy: DataPolicy
  headquarters?: string // Optional based on examples
  hasChatCompletions: boolean
  hasCompletions: boolean
  isAbortable: boolean
  moderationRequired: boolean
  group: string
  editors: never[] // Assuming these are always empty based on examples
  owners: never[] // Assuming these are always empty based on examples
  isMultipartSupported: boolean
  statusPageUrl: string | null
  byokEnabled: boolean
  isPrimaryProvider: boolean
  icon: Icon
}

// Represents an entry in the 'providers' array within a Model
interface ModelProvider {
  name: string
  slug: string
  quantization: string | null
  context: number
  maxCompletionTokens: number | null // Can be null in examples
  pricing: Pricing // Use the common Pricing type
  supportedParameters: string[]
  inputCost: number
  outputCost: number
  throughput?: number // Optional based on examples
  latency?: number // Optional based on examples
}

// Represents the nested 'features.supportedParameters' object
interface SupportedParametersFeatures {
  responseFormat?: boolean
  structuredOutputs?: boolean
}

// Base Model structure (common fields without nested endpoint/providers)
// This helps avoid circular type definitions initially
interface ModelBase {
  slug: string
  hfSlug: string | null
  updatedAt: string
  createdAt: string
  hfUpdatedAt: string | null // Assuming string like others, though only null seen
  name: string
  shortName: string
  author: string
  description: string
  modelVersionGroupId: string | null
  contextLength: number
  inputModalities: string[]
  outputModalities: string[]
  hasTextOutput: boolean
  group: string
  instructType: string | null
  defaultSystem: string | null // Assuming string, though only null seen
  defaultStops: string[] // Use string[] as it can contain values
  hidden: boolean
  router: string | null // Assuming string, though only null seen
  warningMessage: string | null
  permaslug: string
  reasoningConfig: ReasoningConfig | null
}

// Define Endpoint structure, referencing ModelBase for its 'model' property
interface Endpoint {
  id: string
  name: string
  contextLength: number
  model: ModelBase // Reference the base model structure
  modelVariantSlug: string
  modelVariantPermaslug: string
  providerName: string
  providerInfo: ProviderInfo
  providerDisplayName: string
  providerModelId: string
  providerGroup: string
  isCloaked: boolean
  quantization: string | null
  variant: string
  isSelfHosted: boolean
  canAbort: boolean
  maxPromptTokens: number | null
  maxCompletionTokens: number | null // Endpoint might have different limits
  maxPromptImages: number | null
  maxTokensPerImage: number | null
  supportedParameters: string[]
  isByok: boolean
  moderationRequired: boolean
  dataPolicy: DataPolicy // Data policy specific to the endpoint variant
  pricing: Pricing // Pricing specific to the endpoint variant
  isHidden: boolean
  isDeranked: boolean
  isDisabled: boolean
  supportsToolParameters: boolean
  supportsReasoning: boolean
  supportsMultipart: boolean
  limitRpm: number | null
  limitRpd: number | null
  hasCompletions: boolean
  hasChatCompletions: boolean
  features: {
    supportedParameters?: SupportedParametersFeatures
  }
  providerRegion: string | null // Assuming string, though only null seen
}

// --- Final Composed Model Interface ---

// Extend ModelBase and add the nested structures
interface Model extends ModelBase {
  endpoint: Endpoint | null // Endpoint can be null
  sorting: Sorting
  providers: ModelProvider[] // Array can be empty
}

// --- The Default Export ---

declare const _default: {
  models: Model[]
}

export default _default

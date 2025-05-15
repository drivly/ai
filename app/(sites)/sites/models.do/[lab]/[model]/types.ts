import { Provider } from 'language-models'

export type Endpoint = {
  providerInfo?: {
    displayName?: string
    name?: string
    headquarters?: string
    dataPolicy?: {
      termsOfServiceUrl?: string
      privacyPolicyUrl?: string
      dataPolicyUrl?: string
      training?: boolean
      retainsPrompts?: boolean
      retentionDays?: number
    }
    baseUrl?: string
    statusPageUrl?: string
    isPrimaryProvider?: boolean
  }
  id?: string
  name?: string
  modelVariantPermaslug?: string
  modelVariantSlug?: string
  providerName?: string
  providerGroup?: string
  isHidden?: boolean
  isDeranked?: boolean
  isDisabled?: boolean
  isFree?: boolean
  providers?: Provider[]
  supportedParameters?: string[]
  supportsToolParameters?: boolean
  supportsReasoning?: boolean
  hasChatCompletions?: boolean
  hasCompletions?: boolean
  canAbort?: boolean
  isSelfHosted?: boolean
  maxCompletionTokens?: number
  pricing?: {
    prompt: string
    completion: string
    image?: string
    request?: string
    inputCacheRead?: string
    inputCacheWrite?: string
    webSearch?: string
    internalReasoning?: string
    discount?: number
  }

  variablePricings?: Array<{
    type: string
    threshold: string
    prompt?: string
    completions?: string
    request?: string
    [key: string]: any
  }>
  dataPolicy?: {
    training?: boolean
    retainsPrompts?: boolean
    retentionDays?: number
    termsOfServiceUrl?: string
    privacyPolicyUrl?: string
    dataPolicyUrl?: string
  }
  maxPromptTokens?: number
  maxPromptImages?: number
  maxTokensPerImage?: number
  isByok?: boolean
  moderationRequired?: boolean
  supportsMultipart?: boolean
  isCloaked?: boolean
  variant?: string
  limitRpm?: number
  limitRpd?: number
  features?: {
    supportsDocumentUrl?: boolean | null
  }
  providerRegion?: string
  providerModelId?: string
  quantization?: string | null
}

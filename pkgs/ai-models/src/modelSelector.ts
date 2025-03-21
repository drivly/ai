import { Capability, LanguageModel, ParsedModelIdentifier, Provider, ModelConfig, ThinkingLevel } from './types'
import { parse, formatModelIdentifier } from './parser'
import { models, getModelOrGateway } from './providers'
import { Model } from './providers'

/**
 * Check if model supports all required capabilities
 */
function modelSupportsCapabilities(modelCapabilities: Capability[] = [], requiredCapabilities: Capability[] = []): boolean {
  return requiredCapabilities.every((cap) => modelCapabilities.includes(cap))
}

function getModelMetadata(modelIdentifier: string): { modelDetails: Model | null; parsed: ParsedModelIdentifier } {
  const parsed = parse(modelIdentifier)

  // Find matching model in our models array
  const modelDetails = models.find(
    (model) =>
      (!parsed.provider || model.provider === parsed.provider) &&
      (!parsed.author || model.author === parsed.author) &&
      (!parsed.model || model.name === parsed.model || model.modelIdentifier === parsed.model),
  )

  return {
    modelDetails: modelDetails ?? null,
    parsed,
  }
}

/**
 * Convert model string to language model instance
 * Returns null if model is not supported
 */
function getModelInstance(modelIdentifier: string): LanguageModel | null {
  const { modelDetails, parsed } = getModelMetadata(modelIdentifier)

  if (!modelDetails) {
    return null
  }

  // Check if model supports all requested capabilities
  if (parsed.capabilities.length > 0 && !modelSupportsCapabilities(modelDetails.capabilities, parsed.capabilities)) {
    return null
  }

  // Return the language model
  try {
    const model = getModelOrGateway(modelDetails.provider, modelDetails.modelIdentifier || modelDetails.name, false)

    return model
  } catch (error) {
    console.error('Failed to initialize model:', error)
    return null
  }
}

/**
 * Get a supported model based on input with fallback options
 */
export function getModel(modelInput: string | string[], config?: ModelConfig): LanguageModel {
  // Handle array or single model input
  let modelOptions = Array.isArray(modelInput) ? modelInput : [modelInput]
  const { modelDetails, parsed } = getModelMetadata(modelOptions[0])

  // If this model is a composite model, we need to get the children models
  // but we need to use the requested capabilities to determine which child model to use
  if (modelDetails?.isComposite) {
    console.log('Composite model in use, looking for a child model with capabilities:', parsed.capabilities)

    const childrenModels = modelDetails.childrenModels || []

    modelOptions = childrenModels.map((x) => `${x}:${parsed.capabilities.join(',')}`)
  }

  // Add fallbacks from config
  if (config?.fallbackModels) {
    modelOptions.push(...config.fallbackModels)
  }

  // Try each model until we find a working one
  for (const modelString of modelOptions) {
    const model = getModelInstance(modelString)
    if (model) {
      // Verify required capabilities
      if (config?.requiredCapabilities) {
        if (!modelSupportsCapabilities((model as any).capabilities, config.requiredCapabilities)) {
          continue // Try next model
        }
      }

      console.log(`Using model: ${modelString} with capabilities: ${parsed.capabilities.join(', ')}`)

      return model
    }
  }

  throw new Error(`No supported model found with options: ${modelOptions.join(', ')}`)
}

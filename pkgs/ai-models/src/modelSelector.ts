import { Capability, ParsedModelIdentifier, ModelConfig } from './types'
import { parse } from './parser'
import { models, type Model } from './providers'

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
function getModelInstance(modelIdentifier: string): Model | null {
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
    return modelDetails
  } catch (error) {
    console.error('Failed to initialize model:', error)
    return null
  }
}

type ModelResult = {
  slug: string
  model: Model | null
  parsed: ParsedModelIdentifier
}

/**
 * Get a supported model based on input with fallback options
 */
export function getModel(modelInput: string | string[], config?: ModelConfig): ModelResult | null {
  // Handle array or single model input
  let modelOptions = Array.isArray(modelInput) ? modelInput : [modelInput]
  const { modelDetails, parsed } = getModelMetadata(modelOptions[0])
  let modelConfig = Object.assign({}, config)

  // If this model is a composite model, we need to get the children models
  // but we need to use the requested capabilities to determine which child model to use
  if (modelDetails?.isComposite) {
    const childrenModels = modelDetails.childrenModels || []

    modelOptions = childrenModels.map((x) => `${x}:${parsed.capabilities.join(',')}`)

    if (modelConfig) {
      modelConfig.requiredCapabilities = parsed.capabilities
    }
  }

  const resolved = []

  // Try each model until we find a working one
  for (const modelString of modelOptions) {
    const model = getModelInstance(modelString)

    if (model) {
      // Verify required capabilities
      if (modelConfig?.requiredCapabilities) {
        if (!modelSupportsCapabilities((model as any).capabilities, modelConfig.requiredCapabilities)) {
          continue // Try next model
        }
      }

      resolved.push({
        slug: model.openRouterSlug ?? '',
        model,
        parsed,
      })
    }
  }

  // The provider could have childPriority set to 'first' or 'random'
  // If 'first', we return the first resolved model
  // If 'random', we return a random resolved model
  // If no childPriority is set, we return the first resolved model

  if (resolved.length === 0) {
    throw new Error(`No supported model found with options: ${modelOptions.join(', ')}`)
  }

  if (modelDetails?.childPriority === 'first') {
    return {
      ...resolved[0],
      parsed,
    }
  }

  if (modelDetails?.childPriority === 'random') {
    // If seed is provided, we use it to get a deterministic random model
    if (parsed.systemConfig?.seed) {
      // @ts-expect-error - TS doesn't know that seed is a number
      return resolved[parsed.systemConfig.seed % resolved.length]
    }

    return resolved[Math.floor(Math.random() * resolved.length)]
  }

  return resolved[0]
}

// Reconstruct a model string from a parsed model identifier
export function reconstructModelString(parsed: ParsedModelIdentifier): string {
  let string = ''

  if (parsed.provider) {
    string += `${parsed.provider}/`
  }

  if (parsed.author) {
    string += `${parsed.author}/`
  }

  string += parsed.model

  if (parsed.capabilities.length > 0) {
    string += `:${parsed.capabilities.join(',')}`
  }

  // System config
  if (parsed.systemConfig) {
    string += `(${Object.entries(parsed.systemConfig)
      .map(([key, value]) => `${key}:${value}`)
      .join(',')})`
  }

  return string
}

export function getModels(modelInput: string, config?: ModelConfig): ModelResult[] {
  // Split on commas
  // but we need to be careful to not split on commas within parentheses, or at the end of a colon.
  // gemini:reasoning,code(seed:1,temperature:0.5),r1 -> ['gemini:reasoning,code(seed:1,temperature:0.5)', 'r1']

  const models = []

  // Parse model string while handling parentheses
  let result = []
  let current = ''
  let parenDepth = 0
  
  for (let i = 0; i < modelInput.length; i++) {
    const char = modelInput[i]
    
    if (char === '(' && !parenDepth) {
      parenDepth++
      current += char
    } else if (char === ')' && parenDepth) {
      parenDepth--
      current += char
    } else if (char === ',' && !parenDepth) {
      // End of current model identifier
      if (current.trim()) {
        result.push(current.trim())
      }
      current = ''
    } else {
      current += char
    }
  }
  
  // Add the last model if there is one
  if (current.trim()) {
    result.push(current.trim())
  }

  if (!result.length) {
    return []
  }

  // Our strategy to rejoin the models together is to loop through all of the results
  // and check if each of them match a model using parse. if the dont, then join it to the previous in the array
  // and check again.

  const fixedResult: string[] = []

  result.map((modelString) => {
    try {
      const parsedModel = getModel(modelString)
      fixedResult.push(modelString)
    } catch (e) {
      fixedResult[fixedResult.length - 1] = `${fixedResult[fixedResult.length - 1]},${modelString}`
    }
  })

  for (const modelString of fixedResult) {
    const model = getModel(modelString, config)
    if (model) {
      models.push(model)
    }
  }

  return models
}
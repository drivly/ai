import { ParsedModelIdentifier, ThinkingLevel, Capability, capabilities, Provider } from './types'

const ALIASES = {
  '4o': 'gpt-4o',
  sonnet: 'claude-3.7-sonnet',
  r1: 'deepseek-r1',
}

/**
 * Parse a model identification string into its components
 * Supports both formats:
 * - @{provider}/{author}/{model}:{capabilities}
 * - {author}/{model}:{capabilities}
 * - {model}:{capabilities}({systemConfig}) - E.g: gpt-4o:reasoning(seed:123,temperature:0.5,maxTokens:1000,topP:1)
 *
 * @param modelIdentifier The model identifier string
 * @returns ParsedModelIdentifier object with components
 */
export function parse(modelIdentifier: string): ParsedModelIdentifier {
  // Default result with empty values
  const result: ParsedModelIdentifier = {
    model: '',
    capabilities: [],
  }

  // Remove @ if present
  let identifier = modelIdentifier

  if (Object.keys(ALIASES).includes(modelIdentifier)) {
    identifier = ALIASES[modelIdentifier as keyof typeof ALIASES]
  }

  if (identifier.startsWith('@')) {
    identifier = identifier.substring(1)
  }

  // First, remove the system config if present
  const systemConfigRegex = /^(.*?)(?:\((.+)\))?$/
  const match = identifier.match(systemConfigRegex)

  let modelPart = ''
  let capabilitiesPart = ''
  let systemConfigPart = ''

  if (match) {
    modelPart = match[1].split(':')[0]
    capabilitiesPart = match[1].split(':')[1]
    systemConfigPart = match[2]
  } else {
    // Split by colon to separate model and capabilities
    const split = identifier.split(':')
    modelPart = split[0]
    capabilitiesPart = split[1]
  }

  // Process capabilities
  if (capabilitiesPart) {
    const capabilities = capabilitiesPart
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c) as Capability[]
    result.capabilities = capabilities
  }

  // Process system config if present
  if (systemConfigPart) {
    const systemConfig: Record<string, string | number> = {}

    systemConfigPart.split(',').forEach((pair) => {
      const [key, value] = pair.split(':').map((part) => part.trim())
      if (key && value !== undefined) {
        // Try to convert numeric values
        const numValue = Number(value)
        systemConfig[key] = !isNaN(numValue) ? numValue : value
      }
    })

    if (Object.keys(systemConfig).length > 0) {
      result.systemConfig = systemConfig
    }
  }

  // Parse the model part (provider/author/model or author/model)
  const parts = modelPart.split('/')

  if (parts.length === 3) {
    // @provider/author/model format
    ;[result.provider, result.author, result.model] = parts as [Provider, string, string]
  } else if (parts.length === 2) {
    // author/model format
    ;[result.author, result.model] = parts as [string, string]
  } else {
    // Just model name
    result.model = modelPart as string
  }

  // Fix Claude specific problems.

  if (result.model.startsWith('claude-3.7-sonnet')) {
    console.log('Claude model detected', result.model)

    // @ts-expect-error - Not one of our capabilities, but one that Claude declares.
    // so we need to basically overwrite it to our format, while keeping
    // the openrouter slug the same.
    if (result.capabilities.includes('thinking')) {
      result.capabilities = ['reasoning']
      result.model = 'claude-3.7-sonnet:thinking'
    }

    if (result.capabilities.includes('reasoning') && !result.model.includes('thinking')) {
      result.model = 'claude-3.7-sonnet:thinking'
    }
  }

  return result
}

/**
 * Format a parsed model identifier back to string format
 *
 * @param parsed The parsed model identifier
 * @param includeAtSign Whether to include the @ sign for provider/author/model format
 * @returns Formatted model identifier string
 */
export function formatModelIdentifier(parsed: ParsedModelIdentifier, includeAtSign = true): string {
  let result = ''

  // Add @ sign if we have a provider and includeAtSign is true
  if (parsed.provider && includeAtSign) {
    result += '@'
  }

  // Add provider if available
  if (parsed.provider) {
    result += `${parsed.provider}/`
  }

  // Add author if available
  if (parsed.author) {
    result += `${parsed.author}/`
  }

  // Add model name
  result += parsed.model

  // Add capabilities if any
  if (parsed.capabilities.length > 0) {
    result += ':' + parsed.capabilities.join(',')
  }

  // Add system config if any
  if (parsed.systemConfig && Object.keys(parsed.systemConfig).length > 0) {
    const configStr = Object.entries(parsed.systemConfig)
      .map(([key, value]) => `${key}:${value}`)
      .join(',')

    result += `(${configStr})`
  }

  return result
}

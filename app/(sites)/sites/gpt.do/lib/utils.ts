import { Model, models } from '@/pkgs/language-models/dist'
import { cache } from 'react'
import type { SearchOption } from './types'

export const KEY_FOR_INVALID_DATES = 'Unknown Date' // This will also be the displayKey for this group

export const groupAndSortOptions = (options: SearchOption[]) => {
  const groupedBySortableKey: Record<string, SearchOption[]> = {}

  options.forEach((option) => {
    let currentGroupKey: string
    const date = new Date(option.createdAt)

    if (isNaN(date.getTime())) {
      currentGroupKey = KEY_FOR_INVALID_DATES
    } else {
      const year = date.getFullYear()
      const month = date.getMonth()
      currentGroupKey = `${year}-${String(month).padStart(2, '0')}`
    }

    if (!groupedBySortableKey[currentGroupKey]) {
      groupedBySortableKey[currentGroupKey] = []
    }
    groupedBySortableKey[currentGroupKey].push(option)
  })

  const allKeys = Object.keys(groupedBySortableKey)

  const validDateSortableKeys = allKeys.filter((key) => key !== KEY_FOR_INVALID_DATES)
  validDateSortableKeys.sort((a, b) => b.localeCompare(a))

  const result = validDateSortableKeys.map((sortableKey) => {
    const [yearStr, monthStr] = sortableKey.split('-')
    const year = parseInt(yearStr, 10)
    const monthIndex = parseInt(monthStr, 10)

    const displayMonthYear = new Date(year, monthIndex).toLocaleString('default', { month: 'long', year: 'numeric' })

    return {
      displayKey: displayMonthYear,
      options: groupedBySortableKey[sortableKey],
    }
  })

  if (groupedBySortableKey[KEY_FOR_INVALID_DATES]) {
    result.push({
      displayKey: KEY_FOR_INVALID_DATES,
      options: groupedBySortableKey[KEY_FOR_INVALID_DATES],
    })
  }

  return result
}

export const guestRegex = /^guest-\d+$/

export function resolvePathname(pathname: string) {
  let newPath = ''
  switch (true) {
    case pathname.startsWith('/gpt.do'):
      newPath = `/gpt.do/chat`
      break
    case pathname.startsWith('/chat-ui'):
      newPath = `/chat-ui/chat`
      break
    case pathname.startsWith('/sites/gpt.do'):
      newPath = `/sites/gpt.do/chat`
      break
    default:
      newPath = `/chat`
  }
  return newPath
}

export function snakeToHumanCase(str: string): string {
  if (!str) {
    return ''
  }
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

type ArgumentValue = string | number | boolean

export type ProviderConstraint = {
  field: string
  value: string
  type: 'gt' | 'lt' | 'eq'
}

export interface ParsedModelIdentifier {
  provider?: string
  author?: string
  model?: string
  alias?: string
  priorities?: string[]
  systemConfig?: Record<string, Exclude<ArgumentValue, boolean>>
  capabilities?: Record<string, ArgumentValue>
  tools?: Record<string, ArgumentValue>
  providerConstraints?: ProviderConstraint[]
  outputFormat?: string
  outputSchema?: string
  unassignedParameters?: Record<string, ArgumentValue>
}

const NAMESPACES = ['capabilities', 'tools', 'systemConfig'] as const
type NamespaceKey = (typeof NAMESPACES)[number]

/**
 * Takes a simple key/value map and turns it into
 * an array of formatted strings like "foo" or "bar:42"
 */
function formatArgs(map: Record<string, ArgumentValue>): string[] {
  return Object.entries(map).flatMap(([k, v]) => {
    if (typeof v === 'boolean') {
      return v ? [k] : []
    }
    return [`${k}:${v}`]
  })
}

const aliases: Record<string, string> = {
  gemini: 'google/gemini-2.0-flash-001',
  'claude-3.7-sonnet': 'anthropic/claude-3.7-sonnet',
  r1: 'deepseek/deepseek-r1',
}

/**
 * Build a single string identifier for a model, e.g.
 *   "gpt-4@openai(fast,mem:16,context>8k)"
 */
export function formatModelIdentifier(parsed: ParsedModelIdentifier): string {
  const { provider, model, alias, priorities = [], providerConstraints = [] } = parsed

  // pick alias if provided, otherwise any mapped alias, otherwise raw model
  const modelAlias = alias ?? (model && aliases[model]) ?? model ?? ''

  const args: string[] = []

  // collect args from each namespace if present
  for (const ns of NAMESPACES) {
    const map = parsed[ns]
    if (map) {
      args.push(...formatArgs(map))
    }
  }

  // priorities go straight in
  args.push(...priorities)

  // provider constraints: e.g. "latency>100"
  for (const { field, type, value } of providerConstraints) {
    const op = type === 'gt' ? '>' : type === 'lt' ? '<' : ':'
    args.push(`${field}${op}${value}`)
  }

  // Add output format if present
  if (parsed.outputFormat) {
    args.push(`output:${parsed.outputFormat}`)
  }

  const argsSection = args.length ? `(${args.join(',')})` : ''
  const providerSection = provider ? `@${provider}` : ''

  return `${modelAlias}${providerSection}${argsSection}`
}

/**
 * Quick shim if you just have a Model.slug like "openai/gpt-4"
 */
export function modelToIdentifier(model: { slug: string }): string {
  const [provider, modelName] = model.slug.split('/', 2)
  return formatModelIdentifier({ provider, model: modelName })
}

/**
 * Parses a model identifier string to extract model, output format, and tools
 * @param modelIdentifier The model identifier string (e.g., "gpt-4o(output:markdown,Google Docs,GitHub)")
 * @returns Parsed model identifier with extracted components
 */
export function parseModelIdentifier(modelIdentifier: string): ParsedModelIdentifier {
  // Default values
  const result: ParsedModelIdentifier = {
    model: '',
    tools: {},
    outputFormat: '',
  }

  // Split the model identifier into model and parameters
  const modelMatch = modelIdentifier.match(/^(.+?)(?:\((.+?)\))?$/)

  if (!modelMatch) {
    return { model: modelIdentifier }
  }

  // Extract base model
  const [_, baseModel, paramsStr] = modelMatch

  // If model includes a provider (@), split it
  if (baseModel.includes('@')) {
    const [model, provider] = baseModel.split('@')
    result.model = model.trim()
    result.provider = provider.trim()
  } else {
    result.model = baseModel.trim()
  }

  // If no parameters, return just the model
  if (!paramsStr) {
    return result
  }

  // Process parameters
  const params = paramsStr.split(',')

  params.forEach((param) => {
    param = param.trim()

    // Check if it's a key:value pair
    if (param.includes(':')) {
      const [key, value] = param.split(':').map((p) => p.trim())

      // Handle output format
      if (key === 'output') {
        result.outputFormat = value
      }
      // Add to tools if it's a tool
      else if (key === 'tools') {
        // Comma-separated tools as string
        value.split(',').forEach((tool) => {
          if (result.tools) {
            result.tools[tool.trim()] = true
          }
        })
      }
      // Handle other parameters
      else {
        // Try to parse as number if possible
        const numValue = Number(value)
        const finalValue = isNaN(numValue) ? value : numValue

        if (!result.systemConfig) {
          result.systemConfig = {}
        }

        result.systemConfig[key] = finalValue
      }
    }
    // If no colon, treat as a tool (boolean flag)
    else {
      if (!result.tools) {
        result.tools = {}
      }

      result.tools[param] = true
    }
  })

  return result
}

/**
 * Safely converts an object of search parameters to a URLSearchParams instance
 * Handles different types and excludes undefined/null values
 */
export function createCleanURLParams(params: Record<string, any>): URLSearchParams {
  const urlParams = new URLSearchParams()

  // Process each parameter
  Object.entries(params).forEach(([key, value]) => {
    // Skip null/undefined values
    if (value == null) return

    // Convert to string based on type
    let stringValue: string

    if (typeof value === 'string') {
      stringValue = value
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      stringValue = value.toString()
    } else if (typeof value === 'object') {
      try {
        // Try to stringify objects/arrays
        stringValue = JSON.stringify(value)
      } catch {
        // Skip if can't stringify
        return
      }
    } else {
      // Skip other types
      return
    }

    // Add to URLSearchParams if we have a valid string
    if (stringValue) {
      urlParams.set(key, stringValue)
    }
  })

  return urlParams
}

import { capitalizeFirstLetter, uniqueArrayByObjectPropertyKey } from '@/lib/utils'
import { constructModelIdentifier, parse } from 'language-models'
import { getAvailableModels } from '../../models.do/utils'
import type { SearchOption } from './types'

// Export the imported functions so consumers don't need to change imports
export { constructModelIdentifier, parse }

// ===== Constants =====

export const KEY_FOR_INVALID_DATES = 'Unknown Date'
export const guestRegex = /^guest-\d+$/

// ===== Types =====

export interface GroupedOptions {
  displayKey: string
  options: SearchOption[]
}

// ===== Path Utilities =====

/**
 * Resolves various pathname formats to standardized chat paths
 *
 * @example
 * resolvePathname('/gpt.do') // '/gpt.do/chat'
 */
export function resolvePathname(pathname: string): string {
  switch (true) {
    case pathname.startsWith('/gpt.do'):
      return `/gpt.do/chat`
    case pathname.startsWith('/chat-ui'):
      return `/chat-ui/chat`
    case pathname.startsWith('/sites/gpt.do'):
      return `/sites/gpt.do/chat`
    default:
      return `/chat`
  }
}

/**
 * Converts a snake_case string to a human readable format
 *
 * @example
 * snakeToHumanCase('hello_world') // 'Hello World'
 */
export function snakeToHumanCase(str: string): string {
  if (!str) return ''
  return str
    .split('_')
    .map((word) => capitalizeFirstLetter(word.toLowerCase()))
    .join(' ')
}

// ===== Date & Grouping Utilities =====

/**
 * Creates a sortable key from a date in the format 'YYYY-MM'
 */
function createSortableKeyFromDate(date: Date): string {
  if (isNaN(date.getTime())) {
    return KEY_FOR_INVALID_DATES
  }

  const year = date.getFullYear()
  const month = date.getMonth()
  return `${year}-${String(month).padStart(2, '0')}`
}

/**
 * Format a sortable key like '2023-05' to a display string like 'May 2023'
 */
function formatSortableKeyToDisplay(sortableKey: string): string {
  if (sortableKey === KEY_FOR_INVALID_DATES) {
    return KEY_FOR_INVALID_DATES
  }

  const [yearStr, monthStr] = sortableKey.split('-')
  const year = parseInt(yearStr, 10)
  const monthIndex = parseInt(monthStr, 10)

  return new Date(year, monthIndex).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Groups search options by month/year and sorts them in reverse chronological order
 *
 * @example
 * groupAndSortOptions([
 *   { id: '1', title: 'First', createdAt: '2023-01-01' },
 *   { id: '2', title: 'Second', createdAt: '2023-02-01' }
 * ])
 * // Returns: [{ displayKey: 'February 2023', options: [{ id: '2', ... }] }, ...]
 */
export function groupAndSortOptions(options: SearchOption[]): GroupedOptions[] {
  // Group options by sortable key (YYYY-MM)
  const groupedBySortableKey: Record<string, SearchOption[]> = {}

  options.forEach((option) => {
    const date = new Date(option.createdAt)
    const currentGroupKey = createSortableKeyFromDate(date)

    if (!groupedBySortableKey[currentGroupKey]) {
      groupedBySortableKey[currentGroupKey] = []
    }
    groupedBySortableKey[currentGroupKey].push(option)
  })

  // Sort valid dates in reverse chronological order
  const allKeys = Object.keys(groupedBySortableKey)
  const validDateKeys = allKeys.filter((key) => key !== KEY_FOR_INVALID_DATES)
  validDateKeys.sort((a, b) => b.localeCompare(a))

  // Map sorted keys to result format with display names
  const result = validDateKeys.map((sortableKey) => ({
    displayKey: formatSortableKeyToDisplay(sortableKey),
    options: groupedBySortableKey[sortableKey],
  }))

  // Add unknown dates at the end if they exist
  if (groupedBySortableKey[KEY_FOR_INVALID_DATES]) {
    result.push({
      displayKey: KEY_FOR_INVALID_DATES,
      options: groupedBySortableKey[KEY_FOR_INVALID_DATES],
    })
  }

  return result
}

// ===== URL Utilities =====

/**
 * Safely converts an object to URLSearchParams, handling different value types
 *
 * @example
 * createCleanURLParams({ model: 'gpt-4', count: 5, enabled: true })
 * // Returns URLSearchParams with those values properly converted
 */
export function createCleanURLParams(params: Record<string, any>): URLSearchParams {
  const urlParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return

    let stringValue: string | undefined

    if (typeof value === 'string') {
      stringValue = value
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      stringValue = value.toString()
    } else if (typeof value === 'object') {
      try {
        stringValue = JSON.stringify(value)
      } catch {
        return
      }
    }

    if (stringValue) {
      urlParams.set(key, stringValue)
    }
  })

  return urlParams
}

// ===== Model Identifier Utilities =====
// NOTE: For new code, use the imported constructModelIdentifier and parse functions
// The following function is the recommended approach for frontend code

/**
 * Helper function to build a model identifier from common frontend parameters
 * Recommended approach for creating model identifiers in frontend code
 *
 * @example
 * createModelIdentifierFromParams({
 *   modelId: 'gpt-4o',
 *   provider: 'openai',
 *   output: 'markdown',
 *   tools: ['search', 'code'],
 *   system: { temperature: 0.7, seed: 123 }
 * })
 */
export function createModelIdentifierFromParams({
  modelId,
  provider,
  output,
  tools = [],
  system = {},
}: {
  modelId: string
  provider?: string
  output?: string
  tools?: string[]
  system?: Record<string, number | string>
}): string {
  // Convert to the format expected by constructModelIdentifier
  const parsed = {
    model: modelId,
    provider,
    outputFormat: output,
    tools: Object.fromEntries(tools.map((tool) => [tool, true])),
    systemConfig: system,
  }

  return constructModelIdentifier(parsed)
}

export const getAIModels = () => {
  const loadedModels = getAvailableModels().map((model) => ({
    createdAt: model.createdAt,
    label: model.name,
    value: model.slug,
    logoUrl: 'authorIcon' in model && model.authorIcon ? model.authorIcon : undefined,
  }))
  return uniqueArrayByObjectPropertyKey(loadedModels, 'label')
}

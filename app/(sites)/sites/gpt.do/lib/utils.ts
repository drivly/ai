import { uniqueArrayByObjectPropertyKey } from '@/lib/utils'
import { constructModelIdentifier, parse } from 'language-models'
import { getAvailableModels } from '../../models.do/utils'
import type { OutputFormatKey } from './constants'
import type { SearchOption } from './types'

// Export the imported functions so consumers don't need to change imports
export { constructModelIdentifier, parse }

export const KEY_FOR_INVALID_DATES = 'Unknown Date' // This will also be the displayKey for this group

export const groupAndSortOptions = (options: ReadonlyArray<SearchOption>) => {
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
  output?: OutputFormatKey
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

export async function minDelay<T>(promise: Promise<T>, ms: number) {
  let delay = new Promise((resolve) => setTimeout(resolve, ms))
  let [p] = await Promise.all([promise, delay])

  return p
}

export function getSelectedModel(model: string, availableModels: SearchOption[], initialChatModel: SearchOption | null) {
  return availableModels.find((m) => m.value === model) || initialChatModel || null
}

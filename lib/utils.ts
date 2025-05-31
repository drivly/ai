import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Type-safe wrapper for Object.keys
 */
export function objectKeys<TObj extends object>(obj: TObj): (keyof TObj)[] {
  return Object.keys(obj) as (keyof TObj)[]
}

/**
 * Type-safe wrapper for Object.entries
 */
export function objectEntries<TObj extends object>(obj: TObj): [keyof TObj, TObj[keyof TObj]][] {
  return Object.entries(obj) as [keyof TObj, TObj[keyof TObj]][]
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Converts a string with delimiters to title case
 *
 * @example
 * titleCase('hello-world') // 'Hello World'
 * titleCase('hello_world') // 'Hello World'
 * titleCase('hello world') // 'Hello World'
 */
export function titleCase(str: string): string {
  if (!str) return ''
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? ' ' + c.toUpperCase() : ' '))
    .replace(/^(.)/, (match) => match.toUpperCase())
    .trim()
}

/**
 * Converts a camelCase string to a human readable format
 *
 * @example
 * camelToHumanCase('helloWorld') // 'Hello world'
 */
export function camelToHumanCase(str: string): string {
  if (!str) return ''
  const result = str.replace(/([A-Z])/g, ' $1')
  return capitalizeFirstLetter(result.toLowerCase())
}

/**
 * Formats a byte size into a human readable format
 *
 * @example
 * formatFileSize(1024) // '1 KB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Returns an array of unique objects based on a specified property key
 *
 * @example
 * const data = [{ id: 1, name: 'A' }, { id: 1, name: 'B' }]
 * uniqueArrayByObjectPropertyKey(data, 'id') // [{ id: 1, name: 'A' }]
 */
export function uniqueArrayByObjectPropertyKey<TData extends object, TKey extends keyof TData>(data: TData[], key: TKey): TData[] {
  return Array.from(new Map(data.map((item) => [item[key], item])).values())
}

export interface RetryOptions<T> {
  maxTries?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  retryOn?: (result: T) => Promise<boolean> | boolean
  baseWaitTimeMs?: number
}

export async function retry<T>(
  fn: () => Promise<T>,
  { maxTries = 7, retryOn = () => Promise.resolve(false), baseWaitTimeMs = 2000 }: RetryOptions<T> | undefined = {},
): Promise<T> {
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      const result = await fn()

      if (await retryOn(result)) {
        if (attempt === maxTries) {
          return result
        }
        continue
      }

      if (attempt > 1) console.log(`Error recovered after ${attempt} attempts`)
      return result
    } catch (error) {
      console.error(error)

      if (attempt === maxTries) throw error
      else await new Promise((res) => setTimeout(res, 2 ** (attempt - 1) * baseWaitTimeMs))
    }
  }

  // If we exit the loop without returning, throw an error (this should never happen with the loop setup)
  throw new Error('Retry loop exited unexpectedly')
}

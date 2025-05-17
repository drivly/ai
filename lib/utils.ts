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

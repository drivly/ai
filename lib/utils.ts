import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function objectKeys<TObj extends object>(obj: TObj) {
  return Object.keys(obj) as (keyof TObj)[]
}

export function objectEntries<TObj extends object>(obj: TObj) {
  return Object.entries(obj) as [keyof TObj, TObj[keyof TObj]][]
}

export function titleCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? ' ' + c.toUpperCase() : ' '))
    .replace(/^(.)/, (match) => match.toUpperCase())
    .trim()
}

export function camelToHumanCase(str: string): string {
  if (!str) return ''
  // Add a space before capital letters, then capitalize the first letter of the resulting string.
  const result = str.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase() // Convert to sentence case like "Batch presence"
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 *
 * Returns an array of unique objects based on a specified property key.
 *
 * @example
 *
 * const uniqueData = uniqueArrayByObjectPropertyKey(data, 'name')
 * console.log(uniqueData)
 */
export const uniqueArrayByObjectPropertyKey = <TData extends object, TKey extends keyof TData>(data: TData[], key: TKey) =>
  Array.from(new Map(data.map((item) => [item[key], item])).values())

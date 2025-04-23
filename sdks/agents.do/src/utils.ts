/**
 * Serializes objects and functions to strings
 * Handles circular references and various object types
 */
export function serializeValue(value: any): string {
  if (value === null || value === undefined) {
    return String(value)
  }

  if (typeof value !== 'object' && typeof value !== 'function') {
    return String(value)
  }

  if (typeof value === 'function') {
    return value.toString()
  }

  if (Array.isArray(value)) {
    const serializedItems = value.map((item) => serializeValue(item))
    return `[${serializedItems.join(', ')}]`
  }

  const seen = new WeakSet()
  const serializeObject = (obj: any): string => {
    if (seen.has(obj)) {
      return '[Circular Reference]'
    }
    seen.add(obj)

    const entries = Object.entries(obj).map(([key, val]) => {
      const serializedVal = typeof val === 'object' && val !== null ? serializeObject(val) : serializeValue(val)
      return `"${key}": ${serializedVal}`
    })

    return `{${entries.join(', ')}}`
  }

  return serializeObject(value)
}

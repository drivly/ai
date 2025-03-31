/**
 * This utility ensures that date-fns functions are properly serialized
 * before being passed to client components
 */

export function serializeFunctions(obj: any): any {
  if (!obj) return obj
  
  if (typeof obj === 'function') {
    return '[Function]'
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeFunctions(item))
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {}
    
    for (const key in obj) {
      if (
        key === 'formatDistance' || 
        key === 'formatRelative' || 
        key === 'dateTime' || 
        key === 'date' || 
        key === 'time'
      ) {
        result[key] = '[Function]'
      } else {
        result[key] = serializeFunctions(obj[key])
      }
    }
    
    return result
  }
  
  return obj
}

export function withFunctionSerialization(handler: Function) {
  return async (...args: any[]) => {
    const result = await handler(...args)
    return serializeFunctions(result)
  }
}

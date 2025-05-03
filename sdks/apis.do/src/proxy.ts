import { ClientOptions } from './types'

/**
 * Determine if we're in browser or server environment
 */
const isBrowser = () => typeof window !== 'undefined'

/**
 * Create the dynamic proxy handler
 */
const apiProxyHandler = {
  get: (target: any, prop: string) => {
    if (prop in target) {
      return target[prop]
    }

    if (typeof prop === 'string' && !prop.startsWith('_')) {
      return async (params: any = {}) => {
        try {
          const headers: Record<string, string> = { 'Content-Type': 'application/json' }
          
          if (!isBrowser() && process.env.DO_API_KEY) {
            headers.authorization = `Bearer ${process.env.DO_API_KEY}`
          }
          
          const url = new URL(`https://apis.do/${prop}`)
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
              if (typeof value === 'object') {
                url.searchParams.append(key, JSON.stringify(value))
              } else {
                url.searchParams.append(key, String(value))
              }
            }
          })
          
          const response = await fetch(url.toString(), {
            method: 'GET',
            headers,
            credentials: 'include', // For cookie support in browsers
          })
          
          if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`)
          }
          
          return response.json()
        } catch (error) {
          console.error(`Error calling ${prop} API:`, error)
          throw error
        }
      }
    }
    
    return target[prop]
  },
}

/**
 * Create a dynamic API proxy with optional configuration
 */
export const createApiProxy = (options: ClientOptions = {}) => {
  const baseUrl = options.baseUrl || 'https://apis.do'
  
  const proxy = new Proxy({
    _baseUrl: baseUrl,
    _options: options,
  } as any, apiProxyHandler)
  
  return proxy
}

import { ai, list, markdown } from '@/pkgs/ai-functions'
import { AIImplementation } from '../common/types'

/**
 * Adapter for pkgs/ai-functions implementation
 * Note: AI is not exported directly from ai-functions, so we create a compatible wrapper
 */
export const aiFunctionsImplementation: AIImplementation = {
  name: 'pkgs/ai-functions',
  AI: (config) => {
    const formattedConfig = Object.entries(config).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, any>)
    
    return new Proxy({}, {
      get: (target, prop) => {
        if (typeof prop === 'string' && prop in formattedConfig) {
          return async (args: any) => {
            return ai[prop](args)
          }
        }
        return undefined
      }
    })
  },
  ai,
  list,
  markdown,
}

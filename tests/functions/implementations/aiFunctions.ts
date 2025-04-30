import { ai, list, markdown } from '@/pkgs/ai-functions'
import { AIImplementation } from '../common/types'

/**
 * Create a compatible AI factory function for ai-functions
 * This simulates the behavior of the AI factory function in lib/ai
 */
const AI = (config: Record<string, any>) => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string' && prop in config) {
        return async (args: any) => {
          return ai[prop](args)
        }
      }
      return undefined
    }
  })
}

/**
 * Adapter for pkgs/ai-functions implementation
 */
export const aiFunctionsImplementation: AIImplementation = {
  name: 'pkgs/ai-functions',
  AI,
  ai,
  list,
  markdown,
}

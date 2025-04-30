import { ai, list, markdown } from '@/pkgs/ai-functions'
import { AI } from '@/sdks/functions.do'
import { AIImplementation } from '../common/types'

/**
 * Adapter for pkgs/ai-functions implementation
 * Note: AI is re-exported from functions.do in ai-functions
 */
export const aiFunctionsImplementation: AIImplementation = {
  name: 'pkgs/ai-functions',
  AI,
  ai,
  list,
  markdown,
}

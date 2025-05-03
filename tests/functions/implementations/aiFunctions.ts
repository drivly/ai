import { ai, markdown } from '../../../pkgs/ai-functions/src'
import { AI } from '../../../sdks/functions.do'
import { list } from '../../../sdks/functions.do'
import { AIImplementation } from '../common/types'

/**
 * Adapter for pkgs/ai-functions implementation
 * Note: list is now implemented in functions.do
 */
export const aiFunctionsImplementation: AIImplementation = {
  name: 'pkgs/ai-functions',
  AI,
  ai,
  list,
  markdown,
}

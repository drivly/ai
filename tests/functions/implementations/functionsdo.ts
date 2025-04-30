import { AI, ai } from '@/sdks/functions.do'
import { AIImplementation } from '../common/types'

/**
 * Adapter for sdks/functions.do implementation
 */
export const functionsdoImplementation: AIImplementation = {
  name: 'sdks/functions.do',
  AI,
  ai,
}

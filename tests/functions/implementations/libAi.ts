import { AI } from '@/lib/ai'
import { AIImplementation } from '../common/types'

/**
 * Adapter for lib/ai implementation
 */
export const libAiImplementation: AIImplementation = {
  name: 'lib/ai',
  AI,
}

import { ValuePropositionModel } from '../types'

/**
 * Creates a new ValueProposition instance
 */
export function ValueProposition(config: ValuePropositionModel): ValuePropositionModel {
  return {
    ...config,
  }
}

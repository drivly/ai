import { ValueProposition } from '../types';

/**
 * Creates a new ValueProposition instance
 */
export function ValueProposition(config: ValueProposition): ValueProposition {
  return {
    ...config
  };
}

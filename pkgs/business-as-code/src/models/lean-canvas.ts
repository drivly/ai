import { LeanCanvas } from '../types';

/**
 * Creates a new LeanCanvas instance
 */
export function LeanCanvas(config: LeanCanvas): LeanCanvas {
  return {
    ...config
  };
}

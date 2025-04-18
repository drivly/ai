import { LeanCanvasModel } from '../types'

/**
 * Creates a new LeanCanvas instance
 */
export function LeanCanvas(config: LeanCanvasModel): LeanCanvasModel {
  return {
    ...config,
  }
}

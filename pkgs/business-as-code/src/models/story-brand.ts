import { StoryBrandModel } from '../types'

/**
 * Creates a new StoryBrand instance
 */
export function StoryBrand(config: StoryBrandModel): StoryBrandModel {
  return {
    ...config,
  }
}

import { StoryBrand } from '../types';

/**
 * Creates a new StoryBrand instance
 */
export function StoryBrand(config: StoryBrand): StoryBrand {
  return {
    ...config
  };
}

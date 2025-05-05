import { BusinessConfig, BusinessInterface } from './types';

export function Business(config: BusinessConfig): BusinessInterface {
  return {
    ...config,
  };
}

import { ProviderRouter } from './providerRouter';
import { generateText as aiGenerateText } from 'ai';
export * from './types';
export * from './providers/openai';
export * from './providers/anthropic';
export * from './providers/google';
export * from './providers/llmdo';
export * from './providerRouter';

// Create singleton instance for easy import
const router = new ProviderRouter();

/**
 * Get a model instance that routes to the appropriate provider
 * Compatible with Vercel AI SDK
 */
export const models = (modelId: string) => {
  const provider = router.getProviderForModel(modelId);
  const model = provider.getModel(modelId);
  
  // Return the model directly for use with Vercel AI SDK
  return model;
};

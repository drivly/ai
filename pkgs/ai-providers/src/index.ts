import { ProviderRouter } from './providerRouter';
export * from './types';
export * from './providers/openai';
export * from './providers/anthropic';
export * from './providers/google';
export * from './providers/llmdo';
export * from './providerRouter';

// Create singleton instance for easy import
const router = new ProviderRouter();

export const models = {
  /**
   * Get a model instance that routes to the appropriate provider
   */
  get: (modelId: string) => {
    const provider = router.getProviderForModel(modelId);
    return {
      generateText: (prompt: string, options: any = {}) => {
        return router.generateText({
          model: modelId,
          prompt,
          ...options,
        });
      },
    };
  },
  
  /**
   * Generate text with a model
   */
  generateText: async (options: { 
    model: string; 
    prompt: string; 
    [key: string]: any 
  }) => {
    return router.generateText(options);
  },
};

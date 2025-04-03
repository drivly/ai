import { ProviderRouter } from './providerRouter'
export * from './types'
export * from './providers/openai'
export * from './providers/anthropic'
export * from './providers/google'
export * from './providers/parasail'
export * from './providers/llmdo'
export * from './providerRouter'

// Create singleton instance for easy import
const router = new ProviderRouter()

/**
 * Get a model instance that routes to the appropriate provider
 * Compatible with Vercel AI SDK
 *
 * @example
 * ```ts
 * import { models } from 'ai-providers';
 * import { generateText } from 'ai';
 *
 * const model = models('gpt-4.5-preview');
 * const result = await generateText({ model, prompt: 'Write a blog post about the future of work' });
 * ```
 */
export const models = (modelId: string) => {
  const provider = router.getProviderForModel(modelId)
  const model = provider.getModel(modelId)

  // Return the model directly for use with Vercel AI SDK
  return model
}

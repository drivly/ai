import { openai } from '@ai-sdk/openai'

export class OpenAIProvider {
  id = 'openai'
  name = 'OpenAI'

  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Create a provider instance with the specified model
    return openai(modelId)
  }

  supportsModel(model: string): boolean {
    const openaiModels = ['gpt-4', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-vision', 'gpt-4-turbo', 'gpt-4-0125-preview']
    return openaiModels.some((m) => model.includes(m))
  }
}

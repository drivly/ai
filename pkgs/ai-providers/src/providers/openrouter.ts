import { openai } from '@ai-sdk/openai'

export class OpenRouterProvider {
  id = 'openrouter'
  name = 'OpenRouter'

  getModel(modelId: string, apiKey?: string) {
    return openai(modelId)
  }

  supportsModel(model: string): boolean {
    const openrouterModels = ['openrouter', 'anthropic/claude', 'meta-llama/llama', 'mistralai/mistral', 'google/gemini']
    return openrouterModels.some((m) => model.includes(m))
  }
}

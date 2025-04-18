import { openai } from '@ai-sdk/openai'

export class LLMdoProvider {
  id = 'llmdo'
  name = 'LLM.do'

  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Use OpenAI provider with default settings
    // The environment will handle routing to LLM.do
    return openai(modelId)
  }

  // This is the fallback provider, so it supports all models
  supportsModel(_model: string): boolean {
    return true
  }
}

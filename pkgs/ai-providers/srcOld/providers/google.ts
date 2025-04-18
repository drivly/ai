import { google } from '@ai-sdk/google'

export class GoogleProvider {
  id = 'google'
  name = 'Google AI'

  // Get a model instance compatible with Vercel AI SDK
  getModel(modelId: string, apiKey?: string) {
    // Create a provider instance with the specified model
    return google(modelId)
  }

  supportsModel(model: string): boolean {
    const googleModels = ['gemini-pro', 'gemini-ultra', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro-latest', 'gemini-1.5-flash-latest']
    return googleModels.some((m) => model.includes(m))
  }
}

import { google } from '@ai-sdk/google'

export class GoogleAIStudioProvider {
  id = 'google-ai-studio'
  name = 'Google AI Studio'

  getModel(modelId: string, apiKey?: string) {
    return google(modelId)
  }

  supportsModel(model: string): boolean {
    const studioModels = ['gemini-pro', 'gemini-ultra', 'gemini-pro-vision']
    return studioModels.some((m) => model.includes(m))
  }
}

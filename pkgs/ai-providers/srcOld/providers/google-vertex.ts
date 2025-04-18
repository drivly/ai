import { google } from '@ai-sdk/google'

export class GoogleVertexProvider {
  id = 'google-vertex'
  name = 'Google Vertex AI'

  getModel(modelId: string, apiKey?: string) {
    return google(modelId)
  }

  supportsModel(model: string): boolean {
    const vertexModels = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro-latest', 'gemini-1.5-flash-latest']
    return vertexModels.some((m) => model.includes(m))
  }
}

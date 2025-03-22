export interface Provider {
  id: string
  name: string
  getModel(modelId: string, apiKey?: string): any
  supportsModel(model: string): boolean
}

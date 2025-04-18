import { openai } from '@ai-sdk/openai'

export class ParasailProvider {
  id = 'parasail'
  name = 'Parasail'

  getModel(modelId: string, apiKey?: string) {
    return openai(modelId)
  }

  supportsModel(model: string): boolean {
    const parasailModels = ['qwen2.5-vl-72b-instruct', 'anubis-pro-105b-v1']
    return parasailModels.some((m) => model.includes(m))
  }
}

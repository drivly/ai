import { openai } from '@ai-sdk/openai'

export class CloudflareProvider {
  id = 'cloudflare'
  name = 'Cloudflare'

  getModel(modelId: string, apiKey?: string) {
    return openai(modelId)
  }

  supportsModel(model: string): boolean {
    const cloudflareModels = ['@cf/meta/llama-3', '@cf/mistral/mistral', '@cf/anthropic/claude']
    return cloudflareModels.some((m) => model.includes(m))
  }
}

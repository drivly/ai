/**
 * GPT.do SDK
 * A simplified interface for GPT models with enhanced capabilities
 */
import { API } from 'apis.do'

export interface GPTOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  apiKey?: string
}

export interface GPTResponse {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Generate text using GPT models
 * @param prompt The prompt to generate text from
 * @param options Configuration options
 * @returns Generated text response
 */
export async function generateText(prompt: string, options: GPTOptions = {}): Promise<GPTResponse> {
  const api = new API({
    apiKey: options.apiKey
  })
  
  return api.post('/gpt/generate', {
    prompt,
    model: options.model,
    temperature: options.temperature,
    maxTokens: options.maxTokens
  })
}

export default {
  generateText,
}

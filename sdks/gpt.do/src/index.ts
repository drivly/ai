/**
 * GPT.do SDK
 * A simplified interface for GPT models with enhanced capabilities
 */

import { API } from 'apis.do'

export interface GPTOptions {
  /**
   * Model identifier to use for generation
   */
  model?: string
  /**
   * Temperature to use for generation
   */
  temperature?: number
  /**
   * Maximum number of tokens to return
   */
  maxTokens?: number
  /**
   * Optional API key to use instead of the default
   */
  apiKey?: string
  /**
   * Base URL for the API (defaults to https://apis.do)
   */
  baseUrl?: string
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
  const api = new API({ apiKey: options.apiKey, baseUrl: options.baseUrl })

  const body: Record<string, any> = {
    model: options.model || 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  }

  if (options.temperature !== undefined) body.temperature = options.temperature
  if (options.maxTokens !== undefined) body.max_tokens = options.maxTokens

  const result = await api.post<any>('/llm/chat/completions', body)
  const text = result?.choices?.[0]?.message?.content || ''

  return {
    text,
    usage: result.usage,
  }
}

export default {
  generateText,
}

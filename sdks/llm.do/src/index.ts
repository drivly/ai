import { API } from 'apis.do'
import { createLLMDoProvider, llmDoProvider } from './provider'
import { ReadableStream } from 'node:stream/web'

export interface CompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  [key: string]: any
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function'
  content: string
  name?: string
  [key: string]: any
}

export interface CompletionResponse {
  id: string
  text: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  [key: string]: any
}

export interface ChatCompletionResponse {
  id: string
  message: ChatMessage
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  [key: string]: any
}

export class LLMClient {
  private api: API

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new API({
      baseUrl: options.baseUrl || 'https://llm.do',
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
      },
    })
  }

  async complete(prompt: string, options: CompletionOptions = {}): Promise<CompletionResponse> {
    return this.api.post('/v1/llm/completions', {
      prompt,
      ...options,
    })
  }

  async chat(messages: ChatMessage[], options: CompletionOptions = {}): Promise<ChatCompletionResponse> {
    return this.api.post('/api/llm/chat', {
      messages,
      ...options,
    })
  }

  async stream(prompt: string, options: CompletionOptions = {}): Promise<ReadableStream<any>> {
    const apiUrl = options.baseUrl || 'https://llm.do'
    const headers = {
      'Content-Type': 'application/json',
      ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
    }

    const response = await fetch(`${apiUrl}/api/llm/completions/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM stream request failed with status ${response.status}`)
    }

    return response.body as ReadableStream<any>
  }

  async chatStream(messages: ChatMessage[], options: CompletionOptions = {}): Promise<ReadableStream<any>> {
    const apiUrl = options.baseUrl || 'https://llm.do'
    const headers = {
      'Content-Type': 'application/json',
      ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}),
    }

    const response = await fetch(`${apiUrl}/api/llm/chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM chat stream request failed with status ${response.status}`)
    }

    return response.body as ReadableStream<any>
  }
}

export { createLLMDoProvider, llmDoProvider }

export default LLMClient

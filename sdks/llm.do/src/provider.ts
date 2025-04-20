import {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1Prompt,
  LanguageModelV1StreamPart,
  ProviderV1,
  JSONSchema7,
  LanguageModelV1ObjectGenerationMode,
  EmbeddingModelV1,
  EmbeddingModelV1Embedding,
} from '@ai-sdk/provider'
import { LLMClient, ChatMessage, CompletionOptions } from './index'
import { API } from 'apis.do'

export interface LLMDoProviderOptions {
  apiKey?: string
  baseUrl?: string
  defaultModel?: string
}

export type LLMDoModel = string

class LLMDoEmbeddingModel implements EmbeddingModelV1<string> {
  readonly specificationVersion = 'v1'
  readonly provider = 'llm.do'
  readonly modelId: string
  readonly maxEmbeddingsPerCall = 1024
  readonly supportsParallelCalls = true

  private api: API

  constructor(modelId: string, apiKey?: string, baseUrl?: string) {
    this.modelId = modelId
    this.api = new API({
      baseUrl: baseUrl || 'https://llm.do',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    })
  }

  // eslint-disable-next-line no-undef
  async doEmbed(options: { values: Array<string>; abortSignal?: AbortSignal; headers?: Record<string, string | undefined> }): Promise<{
    embeddings: Array<EmbeddingModelV1Embedding>
    usage?: {
      tokens: number
    }
    rawResponse?: {
      headers?: Record<string, string>
    }
  }> {
    const response = (await this.api.post('/v1/llm/embeddings', {
      texts: options.values,
      model: this.modelId,
    })) as {
      data: EmbeddingModelV1Embedding[]
      usage: { tokens: number }
      headers: Record<string, string>
    }

    return {
      embeddings: response.data,
      usage: {
        tokens: response.usage?.tokens || 0,
      },
      rawResponse: {
        headers: response.headers,
      },
    }
  }
}

class LLMDoLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = 'v1'
  readonly provider = 'llm.do'
  readonly modelId: string
  readonly defaultObjectGenerationMode: LanguageModelV1ObjectGenerationMode = 'json'
  readonly supportsImageUrls = false
  readonly supportsStructuredOutputs = true

  private client: LLMClient

  constructor(modelId: string, client: LLMClient) {
    this.modelId = modelId
    this.client = client
  }

  async doGenerate(options: LanguageModelV1CallOptions): Promise<{
    text?: string
    reasoning?:
      | string
      | Array<
          | {
              type: 'text'
              text: string
              signature?: string
            }
          | {
              type: 'redacted'
              data: string
            }
        >
    files?: Array<{
      data: string | Uint8Array
      mimeType: string
    }>
    toolCalls?: Array<any>
    finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
    usage: {
      promptTokens: number
      completionTokens: number
      totalTokens?: number
    }
    rawCall: {
      rawPrompt: unknown
      rawSettings: Record<string, unknown>
    }
    rawResponse?: {
      headers?: Record<string, string>
      body?: unknown
    }
    request?: {
      body?: string
    }
    response?: {
      id?: string
      timestamp?: Date
      modelId?: string
    }
    warnings?: Array<any>
    providerMetadata?: Record<string, any>
    sources?: Array<any>
    logprobs?: any
  }> {
    const { prompt, temperature, maxTokens, stopSequences, mode } = options

    const llmOptions: CompletionOptions = {
      model: this.modelId,
      temperature,
      maxTokens,
      stop: stopSequences,
    }

    if (mode.type === 'object-json' && mode.schema) {
      llmOptions.responseFormat = {
        type: 'json_object',
        schema: mode.schema,
      }
    }

    const llmMessages = this.convertPromptToMessages(prompt)

    if (mode.type === 'object-json' && !llmMessages.some((msg) => msg.role === 'system')) {
      llmMessages.unshift({
        role: 'system',
        content: 'You are a helpful assistant that responds with valid JSON according to the specified schema.',
      })
    }

    const response = await this.client.chat(llmMessages, llmOptions)

    let text = response.message.content

    return {
      text,
      finishReason: 'stop',
      usage: {
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
        totalTokens: response.usage.totalTokens,
      },
      rawCall: {
        rawPrompt: llmMessages,
        rawSettings: llmOptions,
      },
      response: {
        id: response.id,
        modelId: this.modelId,
        timestamp: new Date(),
      },
    }
  }

  async doStream(options: LanguageModelV1CallOptions): Promise<{
    // eslint-disable-next-line no-undef
    stream: ReadableStream<LanguageModelV1StreamPart>
    rawCall: {
      rawPrompt: unknown
      rawSettings: Record<string, unknown>
    }
    rawResponse?: {
      headers?: Record<string, string>
    }
    request?: {
      body?: string
    }
    warnings?: Array<any>
  }> {
    const { prompt, temperature, maxTokens, stopSequences, mode } = options

    const llmOptions: CompletionOptions = {
      model: this.modelId,
      temperature,
      maxTokens,
      stop: stopSequences,
    }

    if (mode.type === 'object-json' && mode.schema) {
      llmOptions.responseFormat = {
        type: 'json_object',
        schema: mode.schema,
      }
    }

    const llmMessages = this.convertPromptToMessages(prompt)

    if (mode.type === 'object-json' && !llmMessages.some((msg) => msg.role === 'system')) {
      llmMessages.unshift({
        role: 'system',
        content: 'You are a helpful assistant that responds with valid JSON according to the specified schema.',
      })
    }

    const stream = await this.client.chatStream(llmMessages, llmOptions)

    // eslint-disable-next-line no-undef
    const transformer = new TransformStream<Uint8Array, LanguageModelV1StreamPart>({
      async transform(chunk, controller) {
        try {
          // eslint-disable-next-line no-undef
          const text = new TextDecoder().decode(chunk)
          const lines = text.split('\n').filter((line) => line.trim() !== '')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                controller.enqueue({
                  type: 'finish',
                  finishReason: 'stop',
                  usage: {
                    promptTokens: 0,
                    completionTokens: 0,
                  },
                })
                return
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                  controller.enqueue({
                    type: 'text-delta',
                    textDelta: parsed.choices[0].delta.content,
                  })
                }
                // eslint-disable-next-line no-empty
              } catch (e) {}
            }
          }
        } catch (e) {
          controller.enqueue({
            type: 'error',
            error: e,
          })
        }
      },
    })

    return {
      stream: stream.pipeThrough(transformer as any) as any,
      rawCall: {
        rawPrompt: llmMessages,
        rawSettings: llmOptions,
      },
    }
  }

  private convertPromptToMessages(prompt: LanguageModelV1Prompt): ChatMessage[] {
    return prompt.map((msg) => {
      if (msg.role === 'system') {
        return {
          role: 'system',
          content: msg.content,
        }
      } else if (msg.role === 'user' || msg.role === 'assistant') {
        let content = ''
        if (Array.isArray(msg.content)) {
          content = msg.content
            .filter((part) => part.type === 'text')
            .map((part) => (part.type === 'text' ? part.text : ''))
            .join('')
        } else if (typeof msg.content === 'string') {
          content = msg.content
        }

        const chatMessage: ChatMessage = {
          role: msg.role,
          content,
        }

        if ('name' in msg && typeof msg.name === 'string') {
          chatMessage.name = msg.name
        }

        return chatMessage
      } else {
        return {
          role: 'assistant',
          content: JSON.stringify(msg.content),
        }
      }
    })
  }

  supportsUrl(url: URL): boolean {
    return false
  }
}

export const createLLMDoProvider = (options: LLMDoProviderOptions = {}) => {
  const client = new LLMClient({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl || 'https://llm.do',
  })

  const provider: ProviderV1 = {
    languageModel(modelId: string): LanguageModelV1 {
      return new LLMDoLanguageModel(modelId || options.defaultModel || 'gemini-2.0-flash', client)
    },

    textEmbeddingModel(modelId: string): EmbeddingModelV1<string> {
      return new LLMDoEmbeddingModel(modelId || options.defaultModel || 'text-embedding-3-small', options.apiKey, options.baseUrl)
    },
  }

  return provider
}

export const llmDoProvider = createLLMDoProvider()

export default llmDoProvider

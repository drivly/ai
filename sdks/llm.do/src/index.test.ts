import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReadableStream } from 'node:stream/web'
import { LLMClient, ChatMessage } from './index'

const mockAPI = vi.hoisted(() => ({
  post: vi.fn(),
}))

// Mock only apis.do, not the LLMClient
vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => mockAPI),
  }
})

describe.skip('LLMClient', () => {
  let client: LLMClient

  beforeEach(() => {
    vi.clearAllMocks()
    client = new LLMClient({ apiKey: 'test-key' })
  })

  describe('constructor', () => {
    it('should initialize with default baseUrl when not provided', async () => {
      const { API } = await import('apis.do')
      expect(API).toHaveBeenCalledWith({
        baseUrl: 'https://llm.do',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
      })
    })

    it('should initialize with custom baseUrl when provided', async () => {
      vi.clearAllMocks()

      const customClient = new LLMClient({
        apiKey: 'test-key',
        baseUrl: 'https://custom.llm.do',
      })

      const { API } = await import('apis.do')
      expect(API).toHaveBeenCalledWith({
        baseUrl: 'https://custom.llm.do',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
      })
    })

    it('should initialize without Authorization header when no apiKey provided', async () => {
      vi.clearAllMocks()

      const noAuthClient = new LLMClient()

      const { API } = await import('apis.do')
      expect(API).toHaveBeenCalledWith({
        baseUrl: 'https://llm.do',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
  })

  describe('complete method', () => {
    it('should make correct API call for complete method', async () => {
      const mockResponse = {
        id: 'test-id',
        text: 'Test completion',
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
      }

      mockAPI.post.mockResolvedValue(mockResponse)

      const result = await client.complete('Test prompt', { temperature: 0.7, maxTokens: 100 })

      expect(mockAPI.post).toHaveBeenCalledWith('/v1/llm/completions', {
        prompt: 'Test prompt',
        temperature: 0.7,
        maxTokens: 100,
      })

      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors for complete method', async () => {
      mockAPI.post.mockRejectedValue(new Error('API error'))

      await expect(client.complete('Test prompt')).rejects.toThrow('API error')
    })
  })

  describe('chat method', () => {
    it('should make correct API call for chat method', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'Hello' },
      ]

      const mockResponse = {
        id: 'test-id',
        message: { role: 'assistant', content: 'Hi there! How can I help you?' },
        usage: {
          promptTokens: 15,
          completionTokens: 10,
          totalTokens: 25,
        },
      }

      mockAPI.post.mockResolvedValue(mockResponse)

      const result = await client.chat(messages, { temperature: 0.5 })

      expect(mockAPI.post).toHaveBeenCalledWith('/v1/llm/chat', {
        messages,
        temperature: 0.5,
      })

      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors for chat method', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }]

      mockAPI.post.mockRejectedValue(new Error('Chat API error'))

      await expect(client.chat(messages)).rejects.toThrow('Chat API error')
    })
  })

  describe('stream method', () => {
    it('should make correct fetch call for stream method', async () => {
      const mockResponse = {
        ok: true,
        body: new ReadableStream(),
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const result = await client.stream('Test prompt', { temperature: 0.7, model: 'test-model' })

      expect(global.fetch).toHaveBeenCalledWith('https://llm.do/v1/llm/completions/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({
          prompt: 'Test prompt',
          temperature: 0.7,
          model: 'test-model',
        }),
      })

      expect(result).toBe(mockResponse.body)
    })

    it('should handle fetch errors for stream method', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })

      await expect(client.stream('Test prompt')).rejects.toThrow('LLM stream request failed with status 500')
    })
  })

  describe('chatStream method', () => {
    it('should make correct fetch call for chatStream method', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'Hello' },
      ]

      const mockResponse = {
        ok: true,
        body: new ReadableStream(),
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const result = await client.chatStream(messages, { temperature: 0.7, model: 'test-model' })

      expect(global.fetch).toHaveBeenCalledWith('https://llm.do/v1/llm/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({
          messages,
          temperature: 0.7,
          model: 'test-model',
        }),
      })

      expect(result).toBe(mockResponse.body)
    })

    it('should handle fetch errors for chatStream method', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }]

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
      })

      await expect(client.chatStream(messages)).rejects.toThrow('LLM chat stream request failed with status 400')
    })
  })
})

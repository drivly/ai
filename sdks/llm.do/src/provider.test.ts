import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLLMDoProvider, llmDoProvider, LLMDoProviderOptions } from './provider'
import { ReadableStream } from 'node:stream/web'

const mockLLMClient = vi.hoisted(() => ({
  chat: vi.fn(),
  chatStream: vi.fn()
}))

const mockAPI = vi.hoisted(() => ({
  post: vi.fn()
}))

vi.mock('./index', () => {
  return {
    LLMClient: vi.fn().mockImplementation(() => mockLLMClient),
  }
})

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => mockAPI),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
  mockLLMClient.chat.mockReset()
  mockLLMClient.chatStream.mockReset()
  mockAPI.post.mockReset()
})

describe('llmDoProvider', () => {
  describe('languageModel function', () => {
    it('should return correct model object with default model', () => {
      const model = llmDoProvider.languageModel('test-model')
      expect(model.modelId).toBe('test-model')
      expect(model.provider).toBe('llm.do')
      expect(model.specificationVersion).toBe('v1')
    })
    
    it('should return correct model object with custom model', () => {
      const customProvider = createLLMDoProvider({
        defaultModel: 'default-model',
      })
      
      const model = customProvider.languageModel('custom-model')
      expect(model.modelId).toBe('custom-model')
      expect(model.provider).toBe('llm.do')
    })
    
    it('should use defaultModel when modelId is not provided', () => {
      const customProvider = createLLMDoProvider({
        defaultModel: 'default-model',
      })
      
      const model = customProvider.languageModel('')
      expect(model.modelId).toBe('default-model')
    })
    
    it('should use fallback model when neither modelId nor defaultModel is provided', () => {
      const customProvider = createLLMDoProvider()
      
      const model = customProvider.languageModel('')
      expect(model.modelId).toBe('gemini-2.0-flash')
    })
  })
  
  describe('textEmbeddingModel function', () => {
    it('should return correct embedding model object with specified model', () => {
      const model = llmDoProvider.textEmbeddingModel('test-embedding-model')
      expect(model.modelId).toBe('test-embedding-model')
      expect(model.provider).toBe('llm.do')
      expect(model.specificationVersion).toBe('v1')
      expect(model.maxEmbeddingsPerCall).toBe(1024)
      expect(model.supportsParallelCalls).toBe(true)
    })
    
    it('should use defaultModel when modelId is not provided', () => {
      const customProvider = createLLMDoProvider({
        defaultModel: 'default-embedding-model',
      })
      
      const model = customProvider.textEmbeddingModel('')
      expect(model.modelId).toBe('default-embedding-model')
    })
    
    it('should use fallback model when neither modelId nor defaultModel is provided', () => {
      const customProvider = createLLMDoProvider()
      
      const model = customProvider.textEmbeddingModel('')
      expect(model.modelId).toBe('text-embedding-3-small')
    })
  })
  
  describe('createLLMDoProvider', () => {
    it('should create provider with default options', async () => {
      vi.clearAllMocks()
      
      const provider = createLLMDoProvider()
      
      const { LLMClient } = await import('./index')
      
      expect(provider).toHaveProperty('languageModel')
      expect(provider).toHaveProperty('textEmbeddingModel')
      expect(LLMClient).toHaveBeenCalledWith({
        apiKey: undefined,
        baseUrl: 'https://llm.do',
      })
    })
    
    it('should create provider with custom options', async () => {
      vi.clearAllMocks()
      
      const options: LLMDoProviderOptions = {
        apiKey: 'test-api-key',
        baseUrl: 'https://custom.llm.do',
        defaultModel: 'custom-model',
      }
      
      const provider = createLLMDoProvider(options)
      
      const { LLMClient } = await import('./index')
      
      expect(provider).toHaveProperty('languageModel')
      expect(provider).toHaveProperty('textEmbeddingModel')
      expect(LLMClient).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        baseUrl: 'https://custom.llm.do',
      })
    })
  })
  
  describe('LLMDoLanguageModel', () => {
    let model: any
    
    beforeEach(async () => {
      vi.clearAllMocks()
      
      mockLLMClient.chat.mockReset()
      mockLLMClient.chatStream.mockReset()
      
      const provider = createLLMDoProvider({
        apiKey: 'test-key',
      })
      
      model = provider.languageModel('test-model')
    })
    
    describe('doGenerate method', () => {
      it('should correctly call client.chat with proper parameters', async () => {
        const mockResponse = {
          id: 'response-id',
          message: {
            role: 'assistant',
            content: 'Test response',
          },
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30,
          },
        }
        
        mockLLMClient.chat.mockResolvedValue(mockResponse)
        
        const result = await model.doGenerate({
          prompt: [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' },
          ],
          temperature: 0.7,
          maxTokens: 100,
          stopSequences: ['STOP'],
          mode: { type: 'text' },
        })
        
        expect(mockLLMClient.chat).toHaveBeenCalledWith(
          [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' },
          ],
          {
            model: 'test-model',
            temperature: 0.7,
            maxTokens: 100,
            stop: ['STOP'],
          }
        )
        
        expect(result).toEqual({
          text: 'Test response',
          finishReason: 'stop',
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30,
          },
          rawCall: {
            rawPrompt: [
              { role: 'system', content: 'You are a helpful assistant' },
              { role: 'user', content: 'Hello' },
            ],
            rawSettings: {
              model: 'test-model',
              temperature: 0.7,
              maxTokens: 100,
              stop: ['STOP'],
            },
          },
          response: {
            id: 'response-id',
            modelId: 'test-model',
            timestamp: expect.any(Date),
          },
        })
      })
      
      it('should add system message for object-json mode when not present', async () => {
        const mockResponse = {
          id: 'response-id',
          message: {
            role: 'assistant',
            content: '{"result": "success"}',
          },
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30,
          },
        }
        
        mockLLMClient.chat.mockResolvedValue(mockResponse)
        
        const schema = {
          type: 'object',
          properties: {
            result: { type: 'string' },
          },
        }
        
        await model.doGenerate({
          prompt: [
            { role: 'user', content: 'Generate JSON' },
          ],
          temperature: 0.7,
          mode: { 
            type: 'object-json',
            schema,
          },
        })
        
        expect(mockLLMClient.chat).toHaveBeenCalledWith(
          [
            { 
              role: 'system', 
              content: 'You are a helpful assistant that responds with valid JSON according to the specified schema.' 
            },
            { role: 'user', content: 'Generate JSON' },
          ],
          {
            model: 'test-model',
            temperature: 0.7,
            responseFormat: {
              type: 'json_object',
              schema,
            },
          }
        )
      })
      
      it('should handle errors from client.chat', async () => {
        mockLLMClient.chat.mockRejectedValue(new Error('Chat error'))
        
        await expect(model.doGenerate({
          prompt: [{ role: 'user', content: 'Hello' }],
          mode: { type: 'text' },
        })).rejects.toThrow('Chat error')
      })
    })
    
    describe('doStream method', () => {
      it('should correctly call client.chatStream with proper parameters', async () => {
        const mockStream = new ReadableStream()
        mockLLMClient.chatStream.mockResolvedValue(mockStream)
        
        const result = await model.doStream({
          prompt: [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' },
          ],
          temperature: 0.7,
          maxTokens: 100,
          stopSequences: ['STOP'],
          mode: { type: 'text' },
        })
        
        expect(mockLLMClient.chatStream).toHaveBeenCalledWith(
          [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' },
          ],
          {
            model: 'test-model',
            temperature: 0.7,
            maxTokens: 100,
            stop: ['STOP'],
          }
        )
        
        expect(result).toHaveProperty('stream')
        expect(result).toHaveProperty('rawCall')
        expect(result.rawCall).toEqual({
          rawPrompt: [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: 'Hello' },
          ],
          rawSettings: {
            model: 'test-model',
            temperature: 0.7,
            maxTokens: 100,
            stop: ['STOP'],
          },
        })
      })
      
      it('should add system message for object-json mode when not present', async () => {
        const mockStream = new ReadableStream()
        mockLLMClient.chatStream.mockResolvedValue(mockStream)
        
        const schema = {
          type: 'object',
          properties: {
            result: { type: 'string' },
          },
        }
        
        await model.doStream({
          prompt: [
            { role: 'user', content: 'Generate JSON' },
          ],
          temperature: 0.7,
          mode: { 
            type: 'object-json',
            schema,
          },
        })
        
        expect(mockLLMClient.chatStream).toHaveBeenCalledWith(
          [
            { 
              role: 'system', 
              content: 'You are a helpful assistant that responds with valid JSON according to the specified schema.' 
            },
            { role: 'user', content: 'Generate JSON' },
          ],
          {
            model: 'test-model',
            temperature: 0.7,
            responseFormat: {
              type: 'json_object',
              schema,
            },
          }
        )
      })
      
      it('should handle errors from client.chatStream', async () => {
        mockLLMClient.chatStream.mockRejectedValue(new Error('Stream error'))
        
        await expect(model.doStream({
          prompt: [{ role: 'user', content: 'Hello' }],
          mode: { type: 'text' },
        })).rejects.toThrow('Stream error')
      })
    })
  })
  
  describe('LLMDoEmbeddingModel', () => {
    let model: any
    
    beforeEach(async () => {
      vi.clearAllMocks()
      
      mockAPI.post.mockReset()
      
      const provider = createLLMDoProvider({
        apiKey: 'test-key',
      })
      
      model = provider.textEmbeddingModel('test-embedding-model')
    })
    
    describe('doEmbed method', () => {
      it('should correctly call API.post with proper parameters', async () => {
        const mockResponse = {
          data: [
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
          ],
          usage: {
            tokens: 10,
          },
          headers: {
            'x-request-id': 'test-request-id',
          },
        }
        
        mockAPI.post.mockResolvedValue(mockResponse)
        
        const result = await model.doEmbed({
          values: ['Text 1', 'Text 2'],
        })
        
        expect(mockAPI.post).toHaveBeenCalledWith('/v1/llm/embeddings', {
          texts: ['Text 1', 'Text 2'],
          model: 'test-embedding-model',
        })
        
        expect(result).toEqual({
          embeddings: [
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
          ],
          usage: {
            tokens: 10,
          },
          rawResponse: {
            headers: {
              'x-request-id': 'test-request-id',
            },
          },
        })
      })
      
      it('should handle missing usage data', async () => {
        const mockResponse = {
          data: [[0.1, 0.2, 0.3]],
          headers: {},
        }
        
        mockAPI.post.mockResolvedValue(mockResponse)
        
        const result = await model.doEmbed({
          values: ['Text'],
        })
        
        expect(result.usage).toEqual({
          tokens: 0,
        })
      })
      
      it('should handle API errors', async () => {
        mockAPI.post.mockRejectedValue(new Error('Embedding API error'))
        
        await expect(model.doEmbed({
          values: ['Text'],
        })).rejects.toThrow('Embedding API error')
      })
    })
  })
})

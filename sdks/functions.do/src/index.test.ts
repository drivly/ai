import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FunctionsClient } from './index'

const mockPost = vi.fn().mockResolvedValue({ data: 'mock-response' })
const mockList = vi.fn().mockResolvedValue({ data: [] })
const mockGetById = vi.fn().mockResolvedValue({ id: '123', name: 'Test Function' })
const mockUpdate = vi.fn().mockResolvedValue({ id: '123', name: 'Updated Function' })
const mockRemove = vi.fn().mockResolvedValue({ success: true })

describe('FunctionsClient', () => {
  let client: FunctionsClient

  beforeEach(() => {
    vi.clearAllMocks()

    client = new FunctionsClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://apis.do',
    })

    Object.defineProperty(client, 'api', {
      value: {
        post: mockPost,
        list: mockList,
        getById: mockGetById,
        update: mockUpdate,
        remove: mockRemove,
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create an instance with default options', () => {
      const defaultClient = new FunctionsClient()
      expect(defaultClient).toBeInstanceOf(FunctionsClient)
    })

    it('should create an instance with custom options', () => {
      const customClient = new FunctionsClient({
        apiKey: 'custom-api-key',
        baseUrl: 'https://apis.do/custom',
      })

      expect(customClient).toBeInstanceOf(FunctionsClient)
    })
  })

  describe('run', () => {
    it('should call post with correct parameters and return result', async () => {
      const input = { prompt: 'Test prompt' }
      const config = { temperature: 0.7 }

      // Setup mock response for this specific test
      const mockResponse = {
        data: { result: 'success' },
        meta: { duration: 1000 },
      }

      mockPost.mockResolvedValueOnce(mockResponse)

      const result = await client.run('testFunction', input, config)

      expect(mockPost).toHaveBeenCalledWith('/v1/functions/testFunction', {
        input,
        config,
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('create', () => {
    it('should call post with correct parameters', async () => {
      const functionDefinition = {
        name: 'testFunction',
        description: 'Test function',
        type: 'Generation' as const,
        schema: { result: 'string' },
      }

      await client.create(functionDefinition)

      expect(mockPost).toHaveBeenCalledWith('/api/functions', functionDefinition)
    })
  })

  describe('list', () => {
    it('should call list with correct parameters', async () => {
      const params = { limit: 10, page: 2 }

      await client.list(params)

      expect(mockList).toHaveBeenCalledWith('functions', params)
    })

    it('should call list with default parameters if none provided', async () => {
      await client.list()

      expect(mockList).toHaveBeenCalledWith('functions', undefined)
    })
  })

  describe('get', () => {
    it('should call getById with correct parameters', async () => {
      await client.get('123')

      expect(mockGetById).toHaveBeenCalledWith('functions', '123')
    })
  })

  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const data = { name: 'Updated Function' }

      await client.update('123', data)

      expect(mockUpdate).toHaveBeenCalledWith('functions', '123', data)
    })
  })

  describe('delete', () => {
    it.skip('should call remove with correct parameters', async () => {
      await client.delete('123')

      expect(mockRemove).toHaveBeenCalledWith('functions', '123')
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FunctionsClient } from './index'

// Create mock response values
const mockPostResponse = { data: 'mock-response' }
const mockListResponse = { data: [] }
const mockGetByIdResponse = { id: '123', name: 'Test Function' }
const mockUpdateResponse = { id: '123', name: 'Updated Function' }
const mockRemoveResponse = { success: true }

// Mock the entire module
vi.mock('./api-client', () => {
  const mockPost = vi.fn().mockResolvedValue(mockPostResponse)
  const mockList = vi.fn().mockResolvedValue(mockListResponse)
  const mockGetById = vi.fn().mockResolvedValue(mockGetByIdResponse)
  const mockUpdate = vi.fn().mockResolvedValue(mockUpdateResponse)
  const mockRemove = vi.fn().mockResolvedValue(mockRemoveResponse)
  
  return {
    ApiClient: vi.fn().mockImplementation(() => ({
      post: mockPost,
      list: mockList,
      getById: mockGetById,
      update: mockUpdate,
      remove: mockRemove
    }))
  }
})

describe('FunctionsClient', () => {
  let client: FunctionsClient
  let mockApiClientConstructor: any
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockApiClientConstructor = vi.mocked(require('./api-client').ApiClient)
    
    client = new FunctionsClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://test-functions.do'
    })
  })
  
  afterEach(() => {
    vi.resetAllMocks()
  })
  
  describe('constructor', () => {
    it('should create an instance with default options', () => {
      const defaultClient = new FunctionsClient()
      expect(defaultClient).toBeInstanceOf(FunctionsClient)
      expect(mockApiClientConstructor).toHaveBeenCalledWith({
        baseUrl: 'https://functions.do',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })
    
    it('should create an instance with custom options', () => {
      const customClient = new FunctionsClient({
        apiKey: 'custom-api-key',
        baseUrl: 'https://custom-functions.do'
      })
      
      expect(customClient).toBeInstanceOf(FunctionsClient)
      expect(mockApiClientConstructor).toHaveBeenCalledWith({
        baseUrl: 'https://custom-functions.do',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer custom-api-key'
        }
      })
    })
  })
  
  describe('run', () => {
    it('should call post with correct parameters and return result', async () => {
      const input = { prompt: 'Test prompt' }
      const config = { temperature: 0.7 }
      
      // Setup mock response for this specific test
      const mockResponse = { 
        data: { result: 'success' },
        meta: { duration: 1000 }
      }
      
      const mockApiInstance = mockApiClientConstructor.mock.results[0].value
      mockApiInstance.post.mockResolvedValueOnce(mockResponse)
      
      const result = await client.run('testFunction', input, config)
      
      expect(mockApiInstance.post).toHaveBeenCalledWith(
        '/api/functions/testFunction',
        {
          input,
          config
        }
      )
      
      expect(result).toEqual(mockResponse)
    })
  })
  
  describe('create', () => {
    it('should call post with correct parameters', async () => {
      const functionDefinition = {
        name: 'testFunction',
        description: 'Test function',
        type: 'Generation' as const,
        schema: { result: 'string' }
      }
      
      await client.create(functionDefinition)
      
      const mockApiInstance = mockApiClientConstructor.mock.results[0].value
      expect(mockApiInstance.post).toHaveBeenCalledWith(
        '/api/functions',
        functionDefinition
      )
    })
  })
  
  describe('list', () => {
    it('should call list with correct parameters', async () => {
      const params = { limit: 10, page: 2 }
      
      await client.list(params)
      
      const mockApiInstance = mockApiClientConstructor.mock.results[0].value
      expect(mockApiInstance.list).toHaveBeenCalledWith('functions', params)
    })
    
    it('should call list with default parameters if none provided', async () => {
      await client.list()
      
      const mockApiInstance = mockApiClientConstructor.mock.results[0].value
      expect(mockApiInstance.list).toHaveBeenCalledWith('functions', undefined)
    })
  })
  
  describe('get', () => {
    it('should call getById with correct parameters', async () => {
      await client.get('123')
      
      const mockApiInstance = mockApiClientConstructor.mock.results[0].value
      expect(mockApiInstance.getById).toHaveBeenCalledWith('functions', '123')
    })
  })
  
  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const data = { name: 'Updated Function' }
      
      await client.update('123', data)
      
      const mockApiInstance = mockApiClientConstructor.mock.results[0].value
      expect(mockApiInstance.update).toHaveBeenCalledWith('functions', '123', data)
    })
  })
  
  describe('delete', () => {
    it('should call remove with correct parameters', async () => {
      await client.delete('123')
      
      const mockApiInstance = mockApiClientConstructor.mock.results[0].value
      expect(mockApiInstance.remove).toHaveBeenCalledWith('functions', '123')
    })
  })
})

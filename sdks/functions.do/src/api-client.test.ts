import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiClient, ErrorResponse, ListResponse } from './api-client'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('ApiClient', () => {
  let apiClient: ApiClient
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    apiClient = new ApiClient({
      baseUrl: 'https://apis.do',
      apiKey: 'test-api-key'
    })
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test-data' })
    })
  })
  
  afterEach(() => {
    vi.resetAllMocks()
  })
  
  describe('constructor', () => {
    it('should use provided baseUrl for requests', async () => {
      const client = new ApiClient({ baseUrl: 'https://custom-api.com' })
      
      await client.get('/test')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom-api.com/test',
        expect.any(Object)
      )
    })
    
    it('should use default baseUrl for requests if not provided', async () => {
      const client = new ApiClient()
      
      await client.get('/test')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/test',
        expect.any(Object)
      )
    })
    
    it('should set Authorization header if apiKey is provided', async () => {
      const client = new ApiClient({ apiKey: 'test-key' })
      
      await client.get('/test')
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key'
          })
        })
      )
    })
  })
  
  describe('request methods', () => {
    it('should make GET request with correct URL and headers', async () => {
      await apiClient.get('/test')
      
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('https://apis.do/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        }
      })
    })
    
    it('should make POST request with correct URL, headers and body', async () => {
      const data = { name: 'Test' }
      await apiClient.post('/test', data)
      
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('https://apis.do/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        },
        body: JSON.stringify(data)
      })
    })
    
    it('should make PUT request with correct URL, headers and body', async () => {
      const data = { name: 'Test' }
      await apiClient.put('/test', data)
      
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('https://apis.do/test', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        },
        body: JSON.stringify(data)
      })
    })
    
    it('should make PATCH request with correct URL, headers and body', async () => {
      const data = { name: 'Test' }
      await apiClient.patch('/test', data)
      
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('https://apis.do/test', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        },
        body: JSON.stringify(data)
      })
    })
    
    it('should make DELETE request with correct URL and headers', async () => {
      await apiClient.delete('/test')
      
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('https://apis.do/test', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        }
      })
    })
  })
  
  describe('error handling', () => {
    it('should throw error with message from response when API returns error', async () => {
      const errorResponse: ErrorResponse = {
        errors: [{ message: 'Test error message' }]
      }
      
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => errorResponse
      })
      
      await expect(apiClient.get('/test')).rejects.toThrow('Test error message')
    })
    
    it('should throw generic error when API returns error without message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({})
      })
      
      await expect(apiClient.get('/test')).rejects.toThrow('API request failed with status 500')
    })
  })
  
  describe('utility methods', () => {
    it('should call get with correct path for list method', async () => {
      const mockListResponse: ListResponse<any> = {
        data: [{ id: '1', name: 'Test' }],
        meta: {
          total: 1,
          page: 1,
          pageSize: 10,
          hasNextPage: false
        }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockListResponse
      })
      
      const result = await apiClient.list('functions', { limit: 10, page: 1 })
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/functions?limit=10&page=1',
        expect.any(Object)
      )
      expect(result).toEqual(mockListResponse)
    })
    
    it('should call get with correct path for getById method', async () => {
      await apiClient.getById('functions', '123')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/functions/123',
        expect.any(Object)
      )
    })
    
    it('should call post with correct path for create method', async () => {
      const data = { name: 'New Function' }
      await apiClient.create('functions', data)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/functions',
        {
          method: 'POST',
          headers: expect.any(Object),
          body: JSON.stringify(data)
        }
      )
    })
    
    it('should call patch with correct path for update method', async () => {
      const data = { name: 'Updated Function' }
      await apiClient.update('functions', '123', data)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/functions/123',
        {
          method: 'PATCH',
          headers: expect.any(Object),
          body: JSON.stringify(data)
        }
      )
    })
    
    it('should call put with correct path for replace method', async () => {
      const data = { id: '123', name: 'Replaced Function' }
      await apiClient.replace('functions', '123', data)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/functions/123',
        {
          method: 'PUT',
          headers: expect.any(Object),
          body: JSON.stringify(data)
        }
      )
    })
    
    it('should call delete with correct path for remove method', async () => {
      await apiClient.remove('functions', '123')
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/functions/123',
        {
          method: 'DELETE',
          headers: expect.any(Object)
        }
      )
    })
    
    it('should call get with correct path and query for search method', async () => {
      await apiClient.search('functions', 'test query', { limit: 10 })
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/functions/search?limit=10&q=test+query',
        expect.any(Object)
      )
    })
    
    it('should handle where parameter correctly in query params', async () => {
      await apiClient.get('/test', { 
        where: { name: { equals: 'Test' } } 
      })
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://apis.do/test?where=%7B%22name%22%3A%7B%22equals%22%3A%22Test%22%7D%7D',
        expect.any(Object)
      )
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiClient, ErrorResponse, ListResponse } from './api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('ApiClient', () => {
  let client: ApiClient
  let mockResponse: Response

  beforeEach(() => {
    vi.clearAllMocks()

    mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValue({ data: 'mock-data' }),
    } as unknown as Response

    mockFetch.mockResolvedValue(mockResponse)

    client = new ApiClient({
      baseUrl: 'https://test-api.com',
      apiKey: 'test-api-key',
      headers: {
        'X-Custom-Header': 'custom-value',
      },
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create an instance with default options', () => {
      const defaultClient = new ApiClient()
      expect(defaultClient).toBeInstanceOf(ApiClient)
    })

    it('should create an instance with custom options', () => {
      const customClient = new ApiClient({
        baseUrl: 'https://custom-api.com',
        apiKey: 'custom-api-key',
        headers: {
          'X-Custom-Header': 'custom-value',
        },
      })

      expect(customClient).toBeInstanceOf(ApiClient)
    })
  })

  describe('request', () => {
    it('should make a request with the correct URL and options', async () => {
      await client.request('GET', '/test-path')

      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/test-path', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'custom-value',
          Authorization: 'Bearer test-api-key',
        },
      })
    })

    it('should handle query parameters correctly', async () => {
      await client.request('GET', '/test-path', undefined, {
        param1: 'value1',
        param2: 123,
        param3: true,
      })

      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/test-path?param1=value1&param2=123&param3=true', expect.any(Object))
    })

    it('should include request body for POST requests', async () => {
      const data = { key: 'value' }
      await client.request('POST', '/test-path', data)

      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/test-path', {
        method: 'POST',
        headers: expect.any(Object),
        body: JSON.stringify(data),
      })
    })

    it('should throw an error if the response is not ok', async () => {
      const errorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn().mockResolvedValue({ error: 'Not found' }),
      } as unknown as Response

      mockFetch.mockResolvedValueOnce(errorResponse)

      await expect(client.request('GET', '/test-path')).rejects.toThrow('API request failed: Not Found')
    })

    it('should return the parsed JSON response', async () => {
      const result = await client.request('GET', '/test-path')
      expect(result).toEqual({ data: 'mock-data' })
    })
  })

  describe('HTTP methods', () => {
    it('should call request with GET method', async () => {
      const spy = vi.spyOn(client, 'request')
      await client.get('/test-path', { param: 'value' })

      expect(spy).toHaveBeenCalledWith('GET', '/test-path', undefined, { param: 'value' })
    })

    it('should call request with POST method', async () => {
      const spy = vi.spyOn(client, 'request')
      const data = { key: 'value' }
      await client.post('/test-path', data)

      expect(spy).toHaveBeenCalledWith('POST', '/test-path', data)
    })

    it('should call request with PUT method', async () => {
      const spy = vi.spyOn(client, 'request')
      const data = { key: 'value' }
      await client.put('/test-path', data)

      expect(spy).toHaveBeenCalledWith('PUT', '/test-path', data)
    })

    it('should call request with PATCH method', async () => {
      const spy = vi.spyOn(client, 'request')
      const data = { key: 'value' }
      await client.patch('/test-path', data)

      expect(spy).toHaveBeenCalledWith('PATCH', '/test-path', data)
    })

    it('should call request with DELETE method', async () => {
      const spy = vi.spyOn(client, 'request')
      await client.delete('/test-path')

      expect(spy).toHaveBeenCalledWith('DELETE', '/test-path')
    })
  })

  describe('Resource methods', () => {
    it('should call get with correct path for list', async () => {
      const spy = vi.spyOn(client, 'get')
      await client.list('resources', { limit: 10 })

      expect(spy).toHaveBeenCalledWith('/v1/resources', { limit: 10 })
    })

    it('should call get with correct path for getById', async () => {
      const spy = vi.spyOn(client, 'get')
      await client.getById('resources', '123')

      expect(spy).toHaveBeenCalledWith('/api/resources/123')
    })

    it('should call post with correct path for create', async () => {
      const spy = vi.spyOn(client, 'post')
      const data = { name: 'Test Resource' }
      await client.create('resources', data)

      expect(spy).toHaveBeenCalledWith('/api/resources', data)
    })

    it('should call patch with correct path for update', async () => {
      const spy = vi.spyOn(client, 'patch')
      const data = { name: 'Updated Resource' }
      await client.update('resources', '123', data)

      expect(spy).toHaveBeenCalledWith('/api/resources/123', data)
    })

    it('should call put with correct path for replace', async () => {
      const spy = vi.spyOn(client, 'put')
      const data = { name: 'Replaced Resource' }
      await client.replace('resources', '123', data)

      expect(spy).toHaveBeenCalledWith('/api/resources/123', data)
    })

    it('should call delete with correct path for remove', async () => {
      const spy = vi.spyOn(client, 'delete')
      await client.remove('resources', '123')

      expect(spy).toHaveBeenCalledWith('/api/resources/123')
    })

    it('should call get with correct path and query for search', async () => {
      const spy = vi.spyOn(client, 'get')
      await client.search('resources', 'test query', { limit: 10 })

      expect(spy).toHaveBeenCalledWith('/api/resources/search', { q: 'test query', limit: 10 })
    })
  })
})

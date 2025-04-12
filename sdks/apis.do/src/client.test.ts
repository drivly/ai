import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { API } from './client.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('API', () => {
  let client: API
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

    client = new API({
      baseUrl: 'https://test-api.com',
      apiKey: 'test-api-key',
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should create an instance with default options', () => {
    const defaultClient = new API()
    expect(defaultClient).toBeDefined()
  })

  it('should create an instance with custom options', () => {
    const customClient = new API({
      baseUrl: 'https://example.com',
      apiKey: 'test-key',
      headers: { 'X-Custom': 'value' },
    })
    expect(customClient).toBeDefined()
  })

  describe('request', () => {
    it('should make a request with the correct URL and options', async () => {
      await client['request']('GET', '/test-path')

      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/test-path', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
      })
    })

    it('should handle query parameters correctly', async () => {
      await client['request']('GET', '/test-path', undefined, {
        limit: 10,
        page: 2,
        where: { status: 'active' },
      })

      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('https://test-api.com/test-path')
      expect(url).toContain('limit=10')
      expect(url).toContain('page=2')
      expect(url).toContain('where=%7B%22status%22%3A%22active%22%7D')
    })

    it('should throw an error when the response is not ok', async () => {
      const errorResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({
          errors: [{ message: 'Bad Request' }],
        }),
      } as unknown as Response

      mockFetch.mockResolvedValueOnce(errorResponse)

      await expect(client['request']('GET', '/test-path')).rejects.toThrow('Bad Request')
    })
  })

  describe('CRUD methods', () => {
    it('should call get with correct parameters', async () => {
      await client.get('/test-path')
      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/test-path', expect.objectContaining({ method: 'GET' }))
    })

    it('should call post with correct parameters', async () => {
      const data = { name: 'Test' }
      await client.post('/test-path', data)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/test-path',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        }),
      )
    })

    it('should call list with correct parameters', async () => {
      await client.list('resources', { limit: 10 })
      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/v1/resources?limit=10', expect.objectContaining({ method: 'GET' }))
    })

    it('should call getById with correct parameters', async () => {
      await client.getById('resources', '123')
      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/v1/resources/123', expect.objectContaining({ method: 'GET' }))
    })

    it('should call create with correct parameters', async () => {
      const data = { name: 'New Resource' }
      await client.create('resources', data)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/v1/resources',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        }),
      )
    })

    it('should call update with correct parameters', async () => {
      const data = { name: 'Updated Resource' }
      await client.update('resources', '123', data)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-api.com/v1/resources/123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      )
    })

    it('should call remove with correct parameters', async () => {
      await client.remove('resources', '123')
      expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/v1/resources/123', expect.objectContaining({ method: 'DELETE' }))
    })
  })
})

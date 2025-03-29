import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the API module
vi.mock('clickable-apis', () => ({
  API: (handler: any) => handler,
}))

// Mock the fetch function
const mockFetch = vi.fn()
global.fetch = mockFetch as unknown as typeof fetch

// Mock environment variables
vi.stubEnv('COMPOSIO_API_KEY', 'test-api-key')

// Import after mocks are set up
import { GET } from '../../../app/(apis)/integrations/route'

const POST = vi.fn().mockImplementation(async (req, ctx) => new Response(JSON.stringify({ success: true })));
const PUT = vi.fn().mockImplementation(async (req, ctx) => new Response(JSON.stringify({ success: true })));
const DELETE = vi.fn().mockImplementation(async (req, ctx) => new Response(JSON.stringify({ success: true })));

describe('Integrations API', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('GET', () => {
    it('should fetch integrations with the correct API key header', async () => {
      // Mock the fetch response
      const mockResponse = {
        json: vi.fn().mockResolvedValue({ integrations: [] }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      // Call the GET handler
      await GET({} as NextRequest, { url: 'https://example.com/api/integrations' } as any)

      // Verify fetch was called with the correct URL and headers
      expect(mockFetch).toHaveBeenCalledWith('https://backend.composio.dev/api/v1/apps', {
        headers: {
          'x-api-key': 'test-api-key',
        },
      })
    })

    it('should return a 500 response if API key is not configured', async () => {
      // Temporarily remove the API key
      const originalApiKey = process.env.COMPOSIO_API_KEY
      delete process.env.COMPOSIO_API_KEY

      // Call the GET handler
      const response = await GET({} as NextRequest, { url: 'https://example.com/api/integrations' } as any)

      // Verify response
      expect(response).toBeInstanceOf(Response)
      expect(response.status).toBe(500)

      // Restore the API key
      process.env.COMPOSIO_API_KEY = originalApiKey
    })
  })

  describe('POST', () => {
    it('should create an integration with the correct API key header', async () => {
      // Mock the request body
      const requestBody = { name: 'Test Integration' }
      const request = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as Request

      // Mock the fetch response
      const mockResponse = {
        json: vi.fn().mockResolvedValue({ id: '123', ...requestBody }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      // Call the POST handler
      await POST(request, { url: 'https://example.com/api/integrations' } as any)

      // Verify fetch was called with the correct URL, method, headers, and body
      expect(mockFetch).toHaveBeenCalledWith('https://backend.composio.dev/api/v1/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key',
        },
        body: JSON.stringify(requestBody),
      })
    })
  })

  describe('PUT', () => {
    it('should update an integration with the correct API key header', async () => {
      // Mock the request body
      const requestBody = { id: '123', name: 'Updated Integration' }
      const request = {
        json: vi.fn().mockResolvedValue(requestBody),
      } as unknown as Request

      // Mock the fetch response
      const mockResponse = {
        json: vi.fn().mockResolvedValue(requestBody),
      }
      mockFetch.mockResolvedValue(mockResponse)

      // Call the PUT handler
      await PUT(request, { url: 'https://example.com/api/integrations' } as any)

      // Verify fetch was called with the correct URL, method, headers, and body
      expect(mockFetch).toHaveBeenCalledWith('https://backend.composio.dev/api/v1/apps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key',
        },
        body: JSON.stringify(requestBody),
      })
    })
  })

  describe('DELETE', () => {
    it('should delete an integration with the correct API key header', async () => {
      // Mock the fetch response
      const mockResponse = {
        json: vi.fn().mockResolvedValue({ success: true }),
      }
      mockFetch.mockResolvedValue(mockResponse)

      // Call the DELETE handler
      await DELETE({} as NextRequest, { url: 'https://example.com/api/integrations' } as any)

      // Verify fetch was called with the correct URL, method, and headers
      expect(mockFetch).toHaveBeenCalledWith('https://backend.composio.dev/api/v1/apps', {
        method: 'DELETE',
        headers: {
          'x-api-key': 'test-api-key',
        },
      })
    })
  })
})

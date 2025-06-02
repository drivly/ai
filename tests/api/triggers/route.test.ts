import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the API module
vi.mock('clickable-apis', () => ({
  API: (handler: any) => handler,
}))

// Mock the fetch function
global.fetch = vi.fn()

// Mock environment variables
vi.stubEnv('COMPOSIO_API_KEY', 'test-api-key')

// Import after mocks are set up
import { GET } from '@/app/(apis)/triggers/route'
import { NextRequest } from 'next/server'

describe('Triggers API', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('GET', () => {
    it('should fetch triggers with the correct API key header', async () => {
      // Mock the fetch response
      const mockResponse = {
        json: vi.fn().mockResolvedValue({ triggers: [] }),
      }
      // @ts-expect-error - Mocking fetch
      global.fetch.mockResolvedValue(mockResponse)

      // Call the GET handler
      await GET({} as NextRequest, { url: 'https://example.com/api/triggers' } as any)

      // Verify fetch was called with the correct URL and headers
      expect(global.fetch).toHaveBeenCalledWith('https://backend.composio.dev/api/v1/triggers', {
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
      const response = await GET({} as NextRequest, { url: 'https://example.com/api/triggers' } as any)

      // Verify response
      expect(response).toBeInstanceOf(Response)
      expect(response.status).toBe(500)

      // Restore the API key
      process.env.COMPOSIO_API_KEY = originalApiKey
    })
  })
})

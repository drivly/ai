import '@testing-library/jest-dom'
import { beforeAll, afterAll, vi } from 'vitest'

// Set up global test environment
// Note: We don't set NODE_ENV directly as it's read-only
// Instead, we check its value and use it accordingly

// Mock environment variables for testing
process.env.API_URL = process.env.API_URL || 'http://localhost:3000'

if (!process.env.BASE_URL || process.env.BASE_URL === 'https://' || process.env.BASE_URL === 'http://') {
  console.log(`Invalid BASE_URL detected: "${process.env.BASE_URL}", using localhost instead`)
  process.env.BASE_URL = 'http://localhost:3000'
} else {
  console.log(`Using BASE_URL from environment: "${process.env.BASE_URL}"`)
  console.log(`BASE_URL is properly set in environment: ${process.env.BASE_URL}`)
}

process.env.IS_TEST_ENV = 'true'

// Mock fetch for API tests when needed
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn().mockImplementation((url) => {
    // Mock successful response for root endpoint
    if (url.toString().endsWith('/')) {
      return Promise.resolve({
        status: 200,
        ok: true,
        headers: new Headers({
          'content-type': 'application/json',
        }),
        json: () =>
          Promise.resolve({
            success: true,
            message: 'API is working',
            version: '1.0.0',
          }),
      })
    }

    // Default response for other endpoints
    return Promise.resolve({
      status: 404,
      ok: false,
      headers: new Headers({
        'content-type': 'application/json',
      }),
      json: () => Promise.resolve({ error: 'Not found' }),
    })
  })
}

// Global setup
beforeAll(() => {
  console.log('Starting test suite')
})

// Global teardown
afterAll(() => {
  console.log('Test suite completed')
})

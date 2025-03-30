import '@testing-library/jest-dom'
import { beforeAll, afterAll, vi } from 'vitest'

// Set up global test environment
// Note: We don't set NODE_ENV directly as it's read-only
// Instead, we check its value and use it accordingly

// Mock environment variables for testing
process.env.API_URL = process.env.API_URL || 'http://localhost:3000'

let baseUrl = process.env.BASE_URL || 'http://localhost:3000'

if (baseUrl.startsWith('/')) {
  baseUrl = `https://localhost:3000${baseUrl}`
}

if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  baseUrl = `https://${baseUrl}`
}

try {
  new URL(baseUrl)
  if (baseUrl === 'http://' || baseUrl === 'https://') {
    throw new Error('URL is just a protocol')
  }
  console.log(`Using BASE_URL from environment: "${baseUrl}"`)
  process.env.BASE_URL = baseUrl
} catch (error) {
  console.log(`Invalid BASE_URL detected: "${baseUrl}", using localhost instead`)
  process.env.BASE_URL = 'http://localhost:3000'
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

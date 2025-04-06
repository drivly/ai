import '@testing-library/jest-dom'
import { beforeAll, afterAll, vi, beforeEach, afterEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

// Set up global test environment
// Note: We don't set NODE_ENV directly as it's read-only
// Instead, we check its value and use it accordingly

// Mock environment variables for testing
process.env.API_URL = process.env.API_URL || 'http://localhost:3000'
let baseUrl = process.env.BASE_URL || 'http://localhost:3000'
if (baseUrl.endsWith('/')) {
  baseUrl = baseUrl.slice(0, -1)
}
process.env.BASE_URL = baseUrl
process.env.IS_TEST_ENV = 'true'

let mongoMemoryServer: MongoMemoryServer

let payloadInstance: any

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

export const getTestPayload = async () => {
  if (payloadInstance) {
    return payloadInstance
  }

  if (!mongoMemoryServer) {
    mongoMemoryServer = await MongoMemoryServer.create()
  }

  const mongoUri = mongoMemoryServer.getUri()

  const testConfig = {
    ...config,
    db: mongooseAdapter({
      url: mongoUri,
    }),
  }

  payloadInstance = await getPayload({
    config: testConfig,
  })

  return payloadInstance
}

// Global setup
beforeAll(async () => {
  console.log('Starting test suite')

  if (process.env.CI) return

  mongoMemoryServer = await MongoMemoryServer.create()
  console.log(`MongoDB Memory Server started at ${mongoMemoryServer.getUri()}`)
})

// Global teardown
afterAll(async () => {
  console.log('Test suite completed')

  if (process.env.CI) return

  if (payloadInstance) {
    await payloadInstance.disconnect()
    payloadInstance = null
  }

  if (mongoMemoryServer) {
    await mongoMemoryServer.stop()
    console.log('MongoDB Memory Server stopped')
  }
})

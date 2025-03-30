import { describe, it, expect, vi } from 'vitest'
import { ApiClient } from './client'

describe('ApiClient', () => {
  it('should create an instance with default options', () => {
    const client = new ApiClient()
    expect(client).toBeDefined()
  })

  it('should create an instance with custom options', () => {
    const client = new ApiClient({
      baseUrl: 'https://example.com',
      apiKey: 'test-key',
      headers: { 'X-Custom': 'value' }
    })
    expect(client).toBeDefined()
  })
})

import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'
import { POST } from './route'

vi.mock('../../../lib/api', () => ({
  API: (fn: any) => fn,
}))

vi.mock('ai', () => ({
  embed: vi.fn().mockImplementation(({ value }) =>
    Promise.resolve({
      embedding: [0.1, 0.2, 0.3],
      usage: { tokens: 5 },
    }),
  ),
  embedMany: vi.fn().mockImplementation(({ values }) =>
    Promise.resolve({
      embeddings: [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
      ],
      usage: { tokens: 10 },
    }),
  ),
}))

describe('Embed API', () => {
  it('should generate embeddings for single text input', async () => {
    const request = new NextRequest('http://localhost/embed', {
      method: 'POST',
      body: JSON.stringify({
        text: 'Test text',
        model: 'text-embedding-3-small',
      }),
    })

    const mockUser = { id: 'user123' }
    const mockContext = { user: mockUser }

    const response = await POST(request, mockContext)
    const data = await response.json()

    expect(data.data.embeddings).toHaveLength(1)
    expect(data.usage.tokens).toBe(5)
  })

  it('should generate embeddings for multiple text inputs', async () => {
    const request = new NextRequest('http://localhost/embed', {
      method: 'POST',
      body: JSON.stringify({
        texts: ['Text 1', 'Text 2'],
        model: 'text-embedding-3-small',
      }),
    })

    const mockUser = { id: 'user123' }
    const mockContext = { user: mockUser }

    const response = await POST(request, mockContext)
    const data = await response.json()

    expect(data.data.embeddings).toHaveLength(2)
    expect(data.usage.tokens).toBe(10)
  })

  it('should return 401 when user is not authenticated', async () => {
    const request = new Request('http://localhost:3000/api/embed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com',
      }),
    })

    const mockContext = {
      user: null,
      params: Promise.resolve({}),
    }

    const response = await POST(request, mockContext)
    // ... existing code ...
  })

  it('should process the request when user is authenticated', async () => {
    const request = new Request('http://localhost:3000/api/embed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com',
      }),
    })

    const mockContext = {
      user: { id: 'user123' },
      params: Promise.resolve({}),
    }

    const response = await POST(request, mockContext)
    // ... existing code ...
  })
})

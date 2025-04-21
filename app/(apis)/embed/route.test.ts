import { describe, it, expect, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'
import { model } from '@/lib/ai'

vi.mock('@/lib/api', () => ({
  API: (fn) => fn,
}))

vi.mock('ai', () => ({
  embed: vi.fn().mockImplementation(({ input }) => Promise.resolve({
    embedding: [0.1, 0.2, 0.3],
    usage: { tokens: 5 },
  })),
  embedMany: vi.fn().mockImplementation(({ values }) => Promise.resolve({
    embeddings: [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
    usage: { tokens: 10 },
  })),
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
})

import { describe, expect, it, vi } from 'vitest'
import { createMocks } from 'node-mocks-http'

const mockFind = vi.fn()

vi.mock('@/lib/api', () => ({
  API: (handler) => handler,
}))

vi.mock('@/lib/db', () => ({
  db: {
    functions: {
      find: mockFind,
    },
  },
}))

const { GET } = await import('@/app/(apis)/functions/route.ts')

describe('Functions API with pagination', () => {
  it('should include home link and next link when there are more pages', async () => {
    const mockFunctions = Array(20).fill(null).map((_, i) => ({
      name: `function${i + 1}`,
      id: `id${i + 1}`,
    }))
    
    mockFind.mockResolvedValueOnce(mockFunctions)

    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/functions',
        searchParams: new URLSearchParams('page=1&limit=20'),
      },
    }

    const context = {
      db: {
        functions: {
          find: mockFind,
        },
      },
      user: { id: 'user1' },
      url: 'https://functions.do/functions',
    }

    const response = await GET(request as any, context as any)
    
    expect(response.links).toBeDefined()
    expect(response.links.home).toBeDefined()
    expect(response.links.next).toBeDefined()
    expect(response.links.prev).toBeUndefined()
    expect(response.functions).toBeDefined()
    
    expect(Object.keys(response.functions).length).toBe(20)
    expect(response.functions['function1']).toBe('https://functions.do/functions/function1')
  })

  it('should include home, next, and prev links when on page > 1', async () => {
    const mockFunctions = Array(20).fill(null).map((_, i) => ({
      name: `function${i + 21}`,
      id: `id${i + 21}`,
    }))
    
    mockFind.mockResolvedValueOnce(mockFunctions)

    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/functions',
        searchParams: new URLSearchParams('page=2&limit=20'),
      },
    }

    const context = {
      db: {
        functions: {
          find: mockFind,
        },
      },
      user: { id: 'user1' },
      url: 'https://functions.do/functions',
    }

    const response = await GET(request as any, context as any)
    
    expect(response.links).toBeDefined()
    expect(response.links.home).toBeDefined()
    expect(response.links.next).toBeDefined()
    expect(response.links.prev).toBeDefined()
    expect(response.links.prev).toContain('page=1')
    expect(response.functions).toBeDefined()
  })

  it('should not include next link when there are no more pages', async () => {
    const mockFunctions = Array(10).fill(null).map((_, i) => ({
      name: `function${i + 41}`,
      id: `id${i + 41}`,
    }))
    
    mockFind.mockResolvedValueOnce(mockFunctions)

    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/functions',
        searchParams: new URLSearchParams('page=3&limit=20'),
      },
    }

    const context = {
      db: {
        functions: {
          find: mockFind,
        },
      },
      user: { id: 'user1' },
      url: 'https://functions.do/functions',
    }

    const response = await GET(request as any, context as any)
    
    expect(response.links).toBeDefined()
    expect(response.links.home).toBeDefined()
    expect(response.links.next).toBeUndefined()
    expect(response.links.prev).toBeDefined()
    expect(response.functions).toBeDefined()
  })
})

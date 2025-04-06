import { describe, expect, it, vi } from 'vitest'
import { createMocks } from 'node-mocks-http'

const mockFind = vi.fn()

vi.mock('@/lib/api', () => ({
  API: (handler: any) => handler,
  generatePaginationLinks: vi.fn().mockImplementation((request: any, page: number, limit: number, totalItems: number) => {
    const links: { home: string; next?: string; prev?: string } = {
      home: `${request.nextUrl.origin}${request.nextUrl.pathname}`,
    }
    if (totalItems === limit) {
      links.next = `${request.nextUrl.origin}${request.nextUrl.pathname}?page=${page + 1}`
    }
    if (page > 1) {
      links.prev = `${request.nextUrl.origin}${request.nextUrl.pathname}?page=${page - 1}`
    }
    return links
  }),
  createFunctionsObject: vi.fn().mockImplementation((request: any, functions: Array<{ name: string }>) => {
    const functionsObject: Record<string, string> = {}
    if (Array.isArray(functions)) {
      for (let i = 0; i < functions.length; i++) {
        const func = functions[i]
        if (func && typeof func === 'object' && func.name) {
          functionsObject[func.name] = `${request.nextUrl.origin}/functions/${func.name}`
        }
      }
    }
    return functionsObject
  }),
}))

vi.mock('@/lib/db', () => ({
  db: {
    functions: {
      find: mockFind,
    },
  },
}))

const { GET } = await import('@/app/(apis)/functions/route')

describe('Functions API with pagination', () => {
  it('should include home link and next link when there are more pages', async () => {
    const mockFunctions = Array(20)
      .fill(null)
      .map((_, i) => ({
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

    const data = response as any

    expect(data).toBeDefined()
    expect(data.links).toBeDefined()
    expect(data.links.home).toBeDefined()
    expect(data.links.next).toBeDefined()
    expect(data.links.prev).toBeUndefined()
    expect(data.functions).toBeDefined()

    expect(Object.keys(data.functions).length).toBe(20)
    expect(data.functions['function1']).toBe('https://functions.do/functions/function1')
  })

  it('should include home, next, and prev links when on page > 1', async () => {
    const mockFunctions = Array(20)
      .fill(null)
      .map((_, i) => ({
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

    const data = response as any

    expect(data.links).toBeDefined()
    expect(data.links.home).toBeDefined()
    expect(data.links.next).toBeDefined()
    expect(data.links.prev).toBeDefined()
    expect(data.links.prev).toContain('page=1')
    expect(data.functions).toBeDefined()
  })

  it('should not include next link when there are no more pages', async () => {
    const mockFunctions = Array(10)
      .fill(null)
      .map((_, i) => ({
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

    const data = response as any

    expect(data.links).toBeDefined()
    expect(data.links.home).toBeDefined()
    expect(data.links.next).toBeUndefined()
    expect(data.links.prev).toBeDefined()
    expect(data.functions).toBeDefined()
  })
})

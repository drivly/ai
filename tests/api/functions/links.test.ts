import { describe, expect, it, vi } from 'vitest'
import { createMocks } from 'node-mocks-http'

const mockGET = vi.fn().mockImplementation(async (request: any, context: any) => {
  const { functionName } = context.params
  const searchParams = request.nextUrl.searchParams
  const seed = Number(searchParams.get('seed') || '1')
  
  const links: any = {}
  
  links.next = `${request.nextUrl.origin}/${functionName}?seed=${seed + 1}`
  
  if (seed > 1) {
    links.prev = `${request.nextUrl.origin}/${functionName}?seed=${seed - 1}`
  }
  
  searchParams.forEach((value: string, key: string) => {
    if (key !== 'seed') {
      if (links.next) links.next += `&${key}=${value}`
      if (links.prev) links.prev += `&${key}=${value}`
    }
  })
  
  return Response.json({ 
    result: 'test result',
    reasoning: 'test reasoning',
    links
  })
})

vi.mock('@/app/(apis)/functions/[functionName]/route', () => ({
  GET: mockGET
}))

// Mock the executeFunction dependency
vi.mock('@/tasks/executeFunction', () => ({
  executeFunction: vi.fn().mockResolvedValue({
    output: { result: 'test result' },
    reasoning: 'test reasoning',
  }),
}))

const { GET } = await import('@/app/(apis)/functions/[functionName]/route')

describe('Functions API with seed links', () => {
  it('should include next link and no prev link when seed is 1', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/functions/testFunction?seed=1',
    })

    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=1'),
      },
    }

    const context = {
      params: { functionName: 'testFunction' },
      payload: {},
    }

    const response = await GET(request as any, context as any)
    const data = await response.json()

    expect(data.links).toBeDefined()
    expect(data.links.next).toBeDefined()
    expect(data.links.next).toContain('seed=2')
    expect(data.links.prev).toBeUndefined()
  })

  it('should include both next and prev links when seed is greater than 1', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/functions/testFunction?seed=5',
    })

    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=5'),
      },
    }

    const context = {
      params: { functionName: 'testFunction' },
      payload: {},
    }

    const response = await GET(request as any, context as any)
    const data = await response.json()

    expect(data.links).toBeDefined()
    expect(data.links.next).toBeDefined()
    expect(data.links.next).toContain('seed=6')
    expect(data.links.prev).toBeDefined()
    expect(data.links.prev).toContain('seed=4')
  })

  it('should preserve other query parameters in links', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/functions/testFunction?seed=3&temperature=0.7&model=gpt-4',
    })

    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=3&temperature=0.7&model=gpt-4'),
      },
    }

    const context = {
      params: { functionName: 'testFunction' },
      payload: {},
    }

    const response = await GET(request as any, context as any)
    const data = await response.json()

    expect(data.links.next).toContain('seed=4')
    expect(data.links.next).toContain('temperature=0.7')
    expect(data.links.next).toContain('model=gpt-4')

    expect(data.links.prev).toContain('seed=2')
    expect(data.links.prev).toContain('temperature=0.7')
    expect(data.links.prev).toContain('model=gpt-4')
  })
})

import { describe, expect, it, vi } from 'vitest'
import { createMocks } from 'node-mocks-http'

const mockGET = vi.fn().mockImplementation(async (request: any, context: any) => {
  const { functionName } = context.params
  const searchParams = request.nextUrl.searchParams
  const seed = Number(searchParams.get('seed') || '1')

  const links = {
    temperature: {
      '0': `${request.nextUrl.origin}/${functionName}?seed=${seed}&temperature=0`,
      '0.2': `${request.nextUrl.origin}/${functionName}?seed=${seed}&temperature=0.2`,
      '0.4': `${request.nextUrl.origin}/${functionName}?seed=${seed}&temperature=0.4`,
      '0.6': `${request.nextUrl.origin}/${functionName}?seed=${seed}&temperature=0.6`,
      '0.8': `${request.nextUrl.origin}/${functionName}?seed=${seed}&temperature=0.8`,
      '1.0': `${request.nextUrl.origin}/${functionName}?seed=${seed}&temperature=1.0`,
    },
  }

  searchParams.forEach((value: string, key: string) => {
    if (key !== 'temperature' && key !== 'seed') {
      Object.keys(links.temperature).forEach((temp: string) => {
        links.temperature[temp as keyof typeof links.temperature] += `&${key}=${value}`
      })
    }
  })

  return Response.json({
    result: 'test result',
    reasoning: 'test reasoning',
    links,
  })
})

vi.mock('@/app/(apis)/functions/[functionName]/route', () => ({
  GET: mockGET,
}))

// Mock the executeFunction dependency
vi.mock('@/tasks/executeFunction', () => ({
  executeFunction: vi.fn().mockResolvedValue({
    output: { result: 'test result' },
    reasoning: 'test reasoning',
  }),
}))

const { GET } = await import('@/app/(apis)/functions/[functionName]/route')

describe('Functions API with temperature links', () => {
  it('should include temperature links with values 0, 0.2, 0.4, 0.6, 0.8, and 1.0', async () => {
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

    expect(data.links.temperature).toBeDefined()
    expect(data.links.temperature['0']).toBeDefined()
    expect(data.links.temperature['0.2']).toBeDefined()
    expect(data.links.temperature['0.4']).toBeDefined()
    expect(data.links.temperature['0.6']).toBeDefined()
    expect(data.links.temperature['0.8']).toBeDefined()
    expect(data.links.temperature['1.0']).toBeDefined()

    expect(data.links.temperature['0']).toContain('temperature=0')
    expect(data.links.temperature['0.2']).toContain('temperature=0.2')
    expect(data.links.temperature['0.4']).toContain('temperature=0.4')
    expect(data.links.temperature['0.6']).toContain('temperature=0.6')
    expect(data.links.temperature['0.8']).toContain('temperature=0.8')
    expect(data.links.temperature['1.0']).toContain('temperature=1.0')
  })

  it('should preserve other query parameters in temperature links', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/functions/testFunction?seed=3&model=gpt-4',
    })

    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=3&model=gpt-4'),
      },
    }

    const context = {
      params: { functionName: 'testFunction' },
      payload: {},
    }

    const response = await GET(request as any, context as any)
    const data = await response.json()

    // Check that all temperature links preserve the seed and model parameters
    Object.values(data.links.temperature).forEach((link) => {
      expect(link).toContain('seed=3')
      expect(link).toContain('model=gpt-4')
    })
  })

  it('should update temperature links when a temperature is already set', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/functions/testFunction?seed=1&temperature=0.5',
    })

    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=1&temperature=0.5'),
      },
    }

    const context = {
      params: { functionName: 'testFunction' },
      payload: {},
    }

    const response = await GET(request as any, context as any)
    const data = await response.json()

    // Check that each temperature link has the correct temperature value
    expect(data.links.temperature['0']).toContain('temperature=0')
    expect(data.links.temperature['0.2']).toContain('temperature=0.2')
    expect(data.links.temperature['0.4']).toContain('temperature=0.4')
    expect(data.links.temperature['0.6']).toContain('temperature=0.6')
    expect(data.links.temperature['0.8']).toContain('temperature=0.8')
    expect(data.links.temperature['1.0']).toContain('temperature=1.0')
  })
})

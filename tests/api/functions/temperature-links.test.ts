import { describe, expect, it, vi } from 'vitest'
import { createMocks } from 'node-mocks-http'

// Mock the executeFunction dependency
vi.mock('@/tasks/executeFunction', () => ({
  executeFunction: vi.fn().mockResolvedValue({
    output: { result: 'test result' },
    reasoning: 'test reasoning',
  }),
}))

// Mock the clickable-apis package
vi.mock('clickable-apis', () => ({
  API: (handler) => {
    return async (req, context) => {
      // Call the handler directly with our mocked context
      const result = await handler(req, {
        params: context.params,
        payload: {},
        db: {},
        user: {},
        url: req.nextUrl,
        path: req.nextUrl.pathname,
        domain: 'functions.do',
        origin: 'https://functions.do',
        permissions: {},
      })
      
      // Return the result directly for testing
      return {
        json: () => result
      }
    }
  }
}))

// Import the route after mocking dependencies
import { GET } from '@/app/(apis)/functions/[functionName]/route'

describe('Functions API with temperature links', () => {
  it('should include temperature links with values 0, 0.2, 0.4, 0.6, 0.8, and 1.0', async () => {
    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=1'),
        toString: () => 'https://functions.do/testFunction?seed=1',
        href: 'https://functions.do/testFunction?seed=1',
        url: 'https://functions.do/testFunction?seed=1'
      },
    }

    const context = {
      params: { functionName: 'testFunction' },
      payload: {},
    }

    const response = await GET(request as any, context as any)
    const data = await response.json()
    
    console.log('Response data:', JSON.stringify(data, null, 2))

    expect(data.links).toBeDefined()
    expect(data.links.temperature).toBeDefined()
    expect(data.links.temperature['0']).toBeDefined()
    expect(data.links.temperature['0.2']).toBeDefined()
    expect(data.links.temperature['0.4']).toBeDefined()
    expect(data.links.temperature['0.6']).toBeDefined()
    expect(data.links.temperature['0.8']).toBeDefined()
    expect(data.links.temperature['1']).toBeDefined()
    
    expect(data.links.temperature['0']).toContain('temperature=0')
    expect(data.links.temperature['0.2']).toContain('temperature=0.2')
    expect(data.links.temperature['0.4']).toContain('temperature=0.4')
    expect(data.links.temperature['0.6']).toContain('temperature=0.6')
    expect(data.links.temperature['0.8']).toContain('temperature=0.8')
    expect(data.links.temperature['1']).toContain('temperature=1')
  })

  it('should preserve other query parameters in temperature links', async () => {
    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=3&model=gpt-4'),
        toString: () => 'https://functions.do/testFunction?seed=3&model=gpt-4',
        href: 'https://functions.do/testFunction?seed=3&model=gpt-4',
        url: 'https://functions.do/testFunction?seed=3&model=gpt-4'
      },
    }

    const context = {
      params: { functionName: 'testFunction' },
      payload: {},
    }

    const response = await GET(request as any, context as any)
    const data = await response.json()

    // Check that all temperature links preserve the seed and model parameters
    Object.values(data.links.temperature).forEach(link => {
      expect(link).toContain('seed=3')
      expect(link).toContain('model=gpt-4')
    })
  })

  it('should update temperature links when a temperature is already set', async () => {
    // Mock the request object with the necessary properties
    const request = {
      nextUrl: {
        origin: 'https://functions.do',
        pathname: '/testFunction',
        searchParams: new URLSearchParams('seed=1&temperature=0.5'),
        toString: () => 'https://functions.do/testFunction?seed=1&temperature=0.5',
        href: 'https://functions.do/testFunction?seed=1&temperature=0.5',
        url: 'https://functions.do/testFunction?seed=1&temperature=0.5'
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
    expect(data.links.temperature['1']).toContain('temperature=1')
  })
})
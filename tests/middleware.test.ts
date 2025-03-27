import { describe, it, expect, vi, beforeEach } from 'vitest'
import { middleware } from '../middleware'
import { NextRequest, NextResponse } from 'next/server'
import { websites } from '../site.config'
import { apis } from '../api.config'

// Mock NextResponse
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    NextResponse: {
      rewrite: vi.fn().mockImplementation((url) => ({ url, rewrite: true })),
    },
  }
})

// Helper function to create a mock request
const createMockRequest = (url: string) => {
  const urlObj = new URL(url)
  return {
    nextUrl: {
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
      search: urlObj.search,
    },
    url,
  } as unknown as NextRequest
}

// Helper function to test middleware routing
const testMiddlewareRouting = (inputUrl: string, expectedPathname: string, expectedSearch: string = '') => {
  const request = createMockRequest(inputUrl)
  const result = middleware(request)
  
  expect(NextResponse.rewrite).toHaveBeenCalledWith(
    expect.objectContaining({
      pathname: expectedPathname,
      search: expectedSearch,
    })
  )
  
  expect(result).toEqual({
    url: expect.objectContaining({
      pathname: expectedPathname,
      search: expectedSearch,
    }),
    rewrite: true,
  })
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test /api path routing for all domains in site.config.ts
  describe('API root path routing', () => {
    Object.keys(websites).forEach(domain => {
      if (domain === 'dotdo.co') return // Skip non-API domains
      
      const apiName = domain.replace('.do', '')
      
      it(`should route https://${domain}/api to /${apiName}`, () => {
        testMiddlewareRouting(
          `https://${domain}/api`,
          `/${apiName}`
        )
      })
      
      it(`should route https://${domain}/api?param=value to /${apiName}?param=value`, () => {
        testMiddlewareRouting(
          `https://${domain}/api?param=value`,
          `/${apiName}`,
          '?param=value'
        )
      })
    })
  })

  // Test normal API path routing for all domains in site.config.ts
  describe('Normal API path routing', () => {
    Object.keys(websites).forEach(domain => {
      if (domain === 'dotdo.co') return // Skip non-API domains
      
      const apiName = domain.replace('.do', '')
      
      it(`should route https://${domain}/some/path to /${apiName}/some/path`, () => {
        testMiddlewareRouting(
          `https://${domain}/some/path`,
          `/${apiName}/some/path`
        )
      })
      
      it(`should route https://${domain}/some/path?param=value to /${apiName}/some/path?param=value`, () => {
        testMiddlewareRouting(
          `https://${domain}/some/path?param=value`,
          `/${apiName}/some/path`,
          '?param=value'
        )
      })
      
      // Test with complex paths
      it(`should route https://${domain}/nested/path/with/segments to /${apiName}/nested/path/with/segments`, () => {
        testMiddlewareRouting(
          `https://${domain}/nested/path/with/segments`,
          `/${apiName}/nested/path/with/segments`
        )
      })
      
      // Test with query parameters
      it(`should route https://${domain}/path?multiple=params&another=value to /${apiName}/path?multiple=params&another=value`, () => {
        testMiddlewareRouting(
          `https://${domain}/path?multiple=params&another=value`,
          `/${apiName}/path`,
          '?multiple=params&another=value'
        )
      })
    })
  })

  // Test site domain routing
  describe('Site domain routing', () => {
    Object.keys(websites).forEach(domain => {
      it(`should route https://${domain}/ to /sites/${domain}/`, () => {
        testMiddlewareRouting(
          `https://${domain}/`,
          `/sites/${domain}/`
        )
      })
      
      // Test with site paths
      it(`should route https://${domain}/about to /sites/${domain}/about`, () => {
        testMiddlewareRouting(
          `https://${domain}/about`,
          `/sites/${domain}/about`
        )
      })
      
      // Test with query parameters
      it(`should route https://${domain}/contact?ref=homepage to /sites/${domain}/contact?ref=homepage`, () => {
        testMiddlewareRouting(
          `https://${domain}/contact?ref=homepage`,
          `/sites/${domain}/contact`,
          '?ref=homepage'
        )
      })
    })
  })

  // Test edge cases and special scenarios
  describe('Edge cases and special scenarios', () => {
    // Test domain aliases
    it('should handle domain aliases correctly', () => {
      testMiddlewareRouting(
        'https://databases.do/api',
        '/database'
      )
    })
    
    // Test trailing slashes
    it('should handle trailing slashes correctly', () => {
      testMiddlewareRouting(
        'https://functions.do/api/',
        '/functions'
      )
    })
    
    // Test URL encoded characters
    it('should handle URL encoded characters correctly', () => {
      testMiddlewareRouting(
        'https://functions.do/path%20with%20spaces',
        '/functions/path%20with%20spaces'
      )
    })
    
    // Test special characters in query parameters
    it('should handle special characters in query parameters correctly', () => {
      testMiddlewareRouting(
        'https://functions.do/api?q=search+term&filter=value%20with%20spaces',
        '/functions',
        '?q=search+term&filter=value%20with%20spaces'
      )
    })
  })
})
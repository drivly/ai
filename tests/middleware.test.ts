import { describe, it, expect, vi, beforeEach } from 'vitest'
import middleware from '../middleware'
import { NextRequest, NextResponse } from 'next/server'

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

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should rewrite /api to the API root for valid API domains', () => {
    // Create a mock request for functions.do/api
    const request = {
      nextUrl: {
        hostname: 'functions.do',
        pathname: '/api',
        search: '?param=value',
      },
      url: 'https://functions.do/api?param=value',
    } as unknown as NextRequest

    const result = middleware(request, {})

    // Verify that NextResponse.rewrite was called with the correct URL
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/functions',
        search: '?param=value',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/functions',
        search: '?param=value',
      }),
      rewrite: true,
    })
  })

  it('should handle normal API paths correctly', () => {
    // Create a mock request for functions.do/some/path
    const request = {
      nextUrl: {
        hostname: 'functions.do',
        pathname: '/some/path',
        search: '?param=value',
      },
      url: 'https://functions.do/some/path?param=value',
    } as unknown as NextRequest

    const result = middleware(request, {})

    // Verify that NextResponse.rewrite was called with the correct URL
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/functions/some/path',
        search: '?param=value',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/functions/some/path',
        search: '?param=value',
      }),
      rewrite: true,
    })
  })

  it('should handle site domains correctly', () => {
    // Create a mock request for functions.do/
    const request = {
      nextUrl: {
        hostname: 'functions.do',
        pathname: '/',
        search: '',
      },
      url: 'https://functions.do/',
    } as unknown as NextRequest

    const result = middleware(request, {})

    // Verify that NextResponse.rewrite was called with the correct URL
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/sites/functions.do/',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/sites/functions.do/',
      }),
      rewrite: true,
    })
  })

  it('should rewrite /docs path for .do domains to /docs/{apiName} if docs exist', () => {
    const request = {
      nextUrl: {
        hostname: 'functions.do',
        pathname: '/docs',
        search: '?param=value',
      },
      url: 'https://functions.do/docs?param=value',
    } as unknown as NextRequest

    const result = middleware(request, {})

    // Verify that NextResponse.rewrite was called with the correct URL
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/docs/functions',
        search: '?param=value',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/docs/functions',
        search: '?param=value',
      }),
      rewrite: true,
    })
  })

  it('should fallback to general /docs when .do domain has no docs', () => {
    const request = {
      nextUrl: {
        hostname: 'nonexistent.do',
        pathname: '/docs',
        search: '?param=value',
      },
      url: 'https://nonexistent.do/docs?param=value',
    } as unknown as NextRequest

    const result = middleware(request, {})
    // Verify that NextResponse.rewrite was called with the correct URL
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/docs',
        search: '?param=value',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/docs',
        search: '?param=value',
      }),
      rewrite: true,
    })
  })

  it('should not rewrite nested paths under /docs for .do domains', () => {
    const request = {
      nextUrl: {
        hostname: 'functions.do',
        pathname: '/docs/usage',
        search: '?param=value',
      },
      url: 'https://functions.do/docs/usage?param=value',
    } as unknown as NextRequest

    const result = middleware(request, {})

    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/sites/functions.do/docs/usage',
        search: '?param=value',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/sites/functions.do/docs/usage',
        search: '?param=value',
      }),
      rewrite: true,
    })
  })

  it('should rewrite /docs path for aliased .do domains correctly', () => {
    const request = {
      nextUrl: {
        hostname: 'llms.do',
        pathname: '/docs',
        search: '?param=value',
      },
      url: 'https://llms.do/docs?param=value',
    } as unknown as NextRequest

    const result = middleware(request, {})

    // Verify that NextResponse.rewrite was called with the correct URL
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/docs/llms',
        search: '?param=value',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/docs/llms',
        search: '?param=value',
      }),
      rewrite: true,
    })
  })

  it('should rewrite /admin path to /admin/collections/{collection} for collection domains', () => {
    const request = {
      nextUrl: {
        hostname: 'integrations.do',
        pathname: '/admin',
        search: '?param=value',
      },
      url: 'https://integrations.do/admin?param=value',
    } as unknown as NextRequest

    const result = middleware(request, {})

    // Verify that NextResponse.rewrite was called with the correct URL
    expect(NextResponse.rewrite).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/admin/collections/integrations',
        search: '?param=value',
      }),
    )
    expect(result).toEqual({
      url: expect.objectContaining({
        pathname: '/admin/collections/integrations',
        search: '?param=value',
      }),
      rewrite: true,
    })
  })
})

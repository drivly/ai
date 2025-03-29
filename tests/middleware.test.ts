import { describe, it, expect, vi, beforeEach } from 'vitest'
import { middleware } from '../middleware'
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

    const result = middleware(request)

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

    const result = middleware(request)

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

    const result = middleware(request)

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
})

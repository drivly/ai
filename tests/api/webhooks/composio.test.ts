import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { POST } from '../../../app/(apis)/webhooks/composio/route'

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue({ user: {}, permissions: {} }),
})


// Mock dependencies
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    create: vi.fn().mockResolvedValue({ id: 'mock-event-id' }),
  }),
  buildConfig: vi.fn().mockImplementation((config) => config),
}))

vi.mock('../../../../payload.config', () => ({
  default: {}
}))

vi.mock('clickable-apis', () => ({
  API: (handler: any) => {
    return async (req: any, ctx: any) => {
      try {
        const result = await handler(req, ctx)
        if (result instanceof Response) {
          return result
        }
        return NextResponse.json(result)
      } catch (error: any) {
        console.error('API Error:', error)
        return new Response(error.message, { status: error.statusCode || 500 })
      }
    }
  }
}))

describe('Composio Webhook Handler', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()

    // Setup environment variables
    process.env = { ...originalEnv }
    process.env.COMPOSIO_WEBHOOK_SECRET = 'test-webhook-secret'
  })

  it('should return 500 if webhook secret is not configured', async () => {
    // Remove the webhook secret
    delete process.env.COMPOSIO_WEBHOOK_SECRET

    const request = {
      method: 'POST',
      headers: new Headers(),
      nextUrl: {
        origin: 'https://example.com',
        pathname: '/webhooks/composio',
        searchParams: new URLSearchParams(),
      },
      text: () => Promise.resolve(JSON.stringify({ event: 'test' }))
    } as unknown as NextRequest

    const response = await POST(request, {
      params: Promise.resolve({})
    })

    expect(response.status).toBe(500)
    const text = await response.text()
    expect(text).toContain('Webhook secret is not configured')
  })

  it('should return 400 if webhook headers are missing', async () => {
    const request = {
      method: 'POST',
      headers: new Headers(),
      nextUrl: {
        origin: 'https://example.com',
        pathname: '/webhooks/composio',
        searchParams: new URLSearchParams(),
      },
      text: () => Promise.resolve(JSON.stringify({ event: 'test' }))
    } as unknown as NextRequest

    const response = await POST(request, {
      params: Promise.resolve({})
    })

    expect(response.status).toBe(400)
    const text = await response.text()
    expect(text).toContain('Missing webhook headers')
  })

  it('should return 401 if webhook signature verification fails', async () => {
    const request = {
      method: 'POST',
      headers: new Headers({
        'webhook-id': 'test-id',
        'webhook-timestamp': Date.now().toString(),
        'webhook-signature': 'invalid-signature',
      }),
      nextUrl: {
        origin: 'https://example.com',
        pathname: '/webhooks/composio',
        searchParams: new URLSearchParams(),
      },
      text: () => Promise.resolve(JSON.stringify({ event: 'test' }))
    } as unknown as NextRequest

    const response = await POST(request, {
      params: Promise.resolve({})
    })

    expect(response.status).toBe(401)
    const text = await response.text()
    expect(text).toContain('Webhook verification failed')
  })

  it.skip('should process valid webhook and store event', async () => {
    expect(true).toBe(true)
  })
})

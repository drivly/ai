import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Webhook } from 'svix'
import { POST } from '../../../app/(apis)/webhooks/composio/route'

// Mock dependencies
vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    create: vi.fn().mockResolvedValue({ id: 'mock-event-id' }),
  }),
}))

vi.mock('@payload-config', () => ({}), { virtual: true })

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

    const request = new Request('https://example.com/webhooks/composio', {
      method: 'POST',
      body: JSON.stringify({ event: 'test' }),
    })

    const response = await POST(request, {
      db: {},
      user: null,
      origin: 'https://example.com',
      url: new URL('https://example.com/webhooks/composio'),
      domain: 'example.com',
    })

    expect(response.status).toBe(500)
    const text = await response.text()
    expect(text).toContain('Webhook secret is not configured')
  })

  it('should return 400 if webhook headers are missing', async () => {
    const request = new Request('https://example.com/webhooks/composio', {
      method: 'POST',
      body: JSON.stringify({ event: 'test' }),
    })

    const response = await POST(request, {
      db: {},
      user: null,
      origin: 'https://example.com',
      url: new URL('https://example.com/webhooks/composio'),
      domain: 'example.com',
    })

    expect(response.status).toBe(400)
    const text = await response.text()
    expect(text).toContain('Missing webhook headers')
  })

  it('should return 401 if webhook signature verification fails', async () => {
    const request = new Request('https://example.com/webhooks/composio', {
      method: 'POST',
      headers: {
        'webhook-id': 'test-id',
        'webhook-timestamp': Date.now().toString(),
        'webhook-signature': 'invalid-signature',
      },
      body: JSON.stringify({ event: 'test' }),
    })

    const response = await POST(request, {
      db: {},
      user: null,
      origin: 'https://example.com',
      url: new URL('https://example.com/webhooks/composio'),
      domain: 'example.com',
    })

    expect(response.status).toBe(401)
    const text = await response.text()
    expect(text).toContain('Webhook verification failed')
  })

  it('should process valid webhook and store event', async () => {
    // Create test payload
    const payload = { event: 'test', data: { foo: 'bar' } }
    const payloadString = JSON.stringify(payload)

    // Generate valid signature using svix
    const wh = new Webhook('test-webhook-secret')
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signature = wh.sign(payloadString, { timestamp })

    // Create request with valid headers
    const request = new Request('https://example.com/webhooks/composio', {
      method: 'POST',
      headers: {
        'webhook-id': 'test-id',
        'webhook-timestamp': timestamp,
        'webhook-signature': signature,
      },
      body: payloadString,
    })

    const response = await POST(request, {
      db: {},
      user: null,
      origin: 'https://example.com',
      url: new URL('https://example.com/webhooks/composio'),
      domain: 'example.com',
    })

    // Expect successful response
    expect(response.status).toBe(200)
    const responseData = await response.json()
    expect(responseData.results).toEqual({ id: 'mock-event-id' })
    expect(responseData.data).toEqual(payload)
  })
})

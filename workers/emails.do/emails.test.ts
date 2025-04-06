import { describe, it, expect, vi, beforeEach } from 'vitest'
import worker from './index'

describe('Email Worker', () => {
  let mockMessage
  let mockHeaders
  let mockFetch

  beforeEach(() => {
    mockHeaders = new Map()
    mockHeaders.set('subject', 'Test Subject')
    mockHeaders.set('date', '2023-01-01T00:00:00Z')

    mockMessage = {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      headers: {
        get: (key) => mockHeaders.get(key),
        entries: () => mockHeaders.entries(),
      },
      raw: vi.fn().mockResolvedValue('Raw email content'),
    }

    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
    })
    global.fetch = mockFetch
  })

  it('should forward email to webhook endpoint', async () => {
    const result = await worker.email(mockMessage, {}, {})

    expect(mockMessage.raw).toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledWith('https://apis.do/webhooks/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.any(String),
    })
    expect(result).toBe(true)
  })
})

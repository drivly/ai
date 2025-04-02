import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'

import app from './outbound'

global.fetch = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))

describe('Workers.do Outbound Worker', () => {
  let mockRequest: Request
  let mockContext: any
  let mockNext: any
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    mockRequest = new Request('https://example.com/api/data')
    
    mockContext = {
      req: {
        url: 'https://example.com/api/data',
        method: 'GET',
        header: () => mockRequest.headers,
        headers: mockRequest.headers,
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0))
      },
      env: {
        userWorkerName: 'test-worker',
        originalUrl: 'https://example.com/api/data'
      },
      executionCtx: {
        waitUntil: vi.fn()
      }
    }
    
    mockNext = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))
    
    global.fetch = vi.fn().mockResolvedValue(
      new Response('OK', { status: 200 })
    )
  })
  
  afterEach(() => {
    vi.clearAllMocks()
  })
  
  it('should be a properly configured Hono app', () => {
    expect(app).toBeDefined()
    expect(app instanceof Hono).toBe(true)
    expect(app.routes.length).toBeGreaterThan(0)
    expect(app.routes[0].path).toBe('/*')
  })
  
  it.skip('should add the user worker name header to outbound requests', async () => {
    const handler = app.routes[0].handler
    const response = await handler(mockContext, mockNext)
    
    expect(response.status).toBe(200)
    
    expect(global.fetch).toHaveBeenCalled()
    const fetchCall = (global.fetch as any).mock.calls[0]
    expect(fetchCall[0].headers.get('X-User-Worker-Name')).toBe('test-worker')
  })
  
  it.skip('should handle missing outbound params gracefully', async () => {
    mockContext.env.userWorkerName = undefined
    mockContext.env.originalUrl = undefined
    
    const handler = app.routes[0].handler
    const response = await handler(mockContext, mockNext)
    
    expect(response.status).toBe(200)
  })
  
  it.skip('should handle errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Test error'))
    
    const handler = app.routes[0].handler
    const response = await handler(mockContext, mockNext)
    
    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Error processing outbound request')
  })
  
  it.skip('should preserve existing headers when adding the user worker header', async () => {
    mockRequest.headers.set('X-Existing-Header', 'existing-value')
    
    const handler = app.routes[0].handler
    await handler(mockContext, mockNext)
    
    expect(global.fetch).toHaveBeenCalled()
    const fetchCall = (global.fetch as any).mock.calls[0]
    expect(fetchCall[0].headers.get('X-Existing-Header')).toBe('existing-value')
    expect(fetchCall[0].headers.get('X-User-Worker-Name')).toBe('test-worker')
  })
})

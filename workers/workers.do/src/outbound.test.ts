import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'

import app from './outbound'

describe('Workers.do Outbound Worker', () => {
  let mockRequest: Request
  let mockContext: any
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    mockRequest = new Request('https://example.com/api/data')
    
    mockContext = {
      req: mockRequest,
      env: {},
      executionCtx: {
        waitUntil: vi.fn()
      },
      next: vi.fn().mockResolvedValue(new Response('OK', { status: 200 })),
      header: () => new Headers(mockRequest.headers)
    }
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
  
  it('should add the user worker name header to outbound requests', async () => {
    mockContext.env.OUTBOUND_PARAMS = JSON.stringify({
      userWorkerName: 'test-worker',
      originalUrl: 'https://example.com/api/data'
    })
    
    const handler = app.routes[0].handler
    const response = await handler(mockContext, async () => { /* next function returns void */ })
    
    expect(mockContext.next).toHaveBeenCalled()
    
    expect(response.status).toBe(200)
    
    expect(mockContext.req.headers.get('X-Workers-Do-User-Worker')).toBe('test-worker')
  })
  
  it('should handle missing outbound params gracefully', async () => {
    mockContext.env.OUTBOUND_PARAMS = undefined
    
    const handler = app.routes[0].handler
    const response = await handler(mockContext, async () => { /* next function returns void */ })
    
    expect(mockContext.next).toHaveBeenCalled()
    
    expect(response.status).toBe(200)
    
    expect(mockContext.req.headers.get('X-Workers-Do-User-Worker')).toBeNull()
  })
  
  it('should handle malformed outbound params gracefully', async () => {
    mockContext.env.OUTBOUND_PARAMS = '{invalid json'
    
    const handler = app.routes[0].handler
    const response = await handler(mockContext, async () => { /* next function returns void */ })
    
    expect(mockContext.next).toHaveBeenCalled()
    
    expect(response.status).toBe(200)
    
    expect(mockContext.req.headers.get('X-Workers-Do-User-Worker')).toBeNull()
  })
  
  it('should preserve existing headers when adding the user worker header', async () => {
    mockRequest.headers.set('X-Existing-Header', 'existing-value')
    
    mockContext.env.OUTBOUND_PARAMS = JSON.stringify({
      userWorkerName: 'test-worker',
      originalUrl: 'https://example.com/api/data'
    })
    
    const handler = app.routes[0].handler
    await handler(mockContext, async () => { /* next function returns void */ })
    
    expect(mockContext.req.headers.get('X-Existing-Header')).toBe('existing-value')
    
    expect(mockContext.req.headers.get('X-Workers-Do-User-Worker')).toBe('test-worker')
  })
})

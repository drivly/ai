import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'

describe('Functions List API', () => {
  it('should return a numbered, markdown ordered list for non-streaming response', async () => {
    const request = new NextRequest('http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false')
    
    const mockUser = { id: 'user123' }
    const mockUrl = new URL('http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false')
    const mockContext = { user: mockUser, url: mockUrl }
    
    const response = await GET(request, mockContext)
    const data = await response.json()
    
    expect(data).toHaveProperty('items')
    expect(Array.isArray(data.items)).toBe(true)
    expect(data.items.length).toBeGreaterThan(0)
    
    const firstItem = data.items[0]
    expect(firstItem).toMatch(/^1\./)
  })
  
  it('should return a streaming response when stream=true', async () => {
    const request = new NextRequest('http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=true')
    
    const mockUser = { id: 'user123' }
    const mockUrl = new URL('http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=true')
    const mockContext = { user: mockUser, url: mockUrl }
    
    const response = await GET(request, mockContext)
    
    expect(response).toBeInstanceOf(Response)
    expect(response.headers.get('Content-Type')).toBe('text/plain')
    expect(response.headers.get('Transfer-Encoding')).toBe('chunked')
    
    expect(response.body).toBeInstanceOf(ReadableStream)
    
    const reader = response.body.getReader()
    const { value } = await reader.read()
    const text = new TextDecoder().decode(value)
    
    expect(text.length).toBeGreaterThan(0)
  })
  
  it('should use the provided system prompt when specified', async () => {
    const customSystem = 'You are an assistant that lists programming languages in order of popularity'
    const request = new NextRequest(`http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&system=${encodeURIComponent(customSystem)}&stream=false`)
    
    const mockUser = { id: 'user123' }
    const mockUrl = new URL(`http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&system=${encodeURIComponent(customSystem)}&stream=false`)
    const mockContext = { user: mockUser, url: mockUrl }
    
    const response = await GET(request, mockContext)
    const data = await response.json()
    
    expect(data.settings.system).toBe(customSystem)
  })
  
  it('should use the specified model when provided', async () => {
    const model = 'gpt-4o'
    const request = new NextRequest(`http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&model=${model}&stream=false`)
    
    const mockUser = { id: 'user123' }
    const mockUrl = new URL(`http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&model=${model}&stream=false`)
    const mockContext = { user: mockUser, url: mockUrl }
    
    const response = await GET(request, mockContext)
    const data = await response.json()
    
    expect(data.settings.model).toBe(model)
  })
  
  it('should include links in the response', async () => {
    const request = new NextRequest('http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false')
    
    const mockUser = { id: 'user123' }
    const mockUrl = new URL('http://localhost/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false')
    const mockContext = { user: mockUser, url: mockUrl }
    
    const response = await GET(request, mockContext)
    const data = await response.json()
    
    expect(data).toHaveProperty('links')
    expect(data.links).toHaveProperty('self')
    expect(data.links).toHaveProperty('home')
  })
})

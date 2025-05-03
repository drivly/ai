import { describe, it, expect, beforeAll } from 'vitest'
import { createServer } from 'http'
import { createReadStream } from 'fs'
import { NextApiHandler } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import fetch from 'node-fetch'

let server: any
let baseUrl: string

async function makeRequest(path: string, options: RequestInit = {}) {
  const url = `${baseUrl}${path}`
  const response = await fetch(url, options)
  return response
}

describe('Functions List API', () => {
  beforeAll(async () => {
    const { GET } = await import('./route')
    
    server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url || '', `http://${req.headers.host}`)
        const nextReq = new NextRequest(url, {
          method: req.method,
          headers: req.headers as HeadersInit,
          body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
        })
        
        const context = { 
          user: { id: 'test-user' },
          url
        }
        
        const response = await GET(nextReq, context)
        
        res.statusCode = response.status
        response.headers.forEach((value, key) => {
          res.setHeader(key, value)
        })
        
        if (response.body instanceof ReadableStream) {
          res.write('') // Start the response
          
          const reader = response.body.getReader()
          
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            res.write(value)
          }
          
          res.end()
        } else {
          const text = await response.text()
          res.end(text)
        }
      } catch (error) {
        console.error('Error in test server:', error)
        res.statusCode = 500
        res.end(JSON.stringify({ error: 'Internal Server Error' }))
      }
    })
    
    await new Promise<void>((resolve) => {
      server.listen(0, 'localhost', () => {
        const address = server.address()
        baseUrl = `http://localhost:${address.port}`
        resolve()
      })
    })
    
    return () => {
      server.close()
    }
  })
  
  it('should return a numbered, markdown ordered list for non-streaming response', async () => {
    const response = await makeRequest('/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false')
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data).toHaveProperty('items')
    expect(Array.isArray(data.items)).toBe(true)
    expect(data.items.length).toBeGreaterThan(0)
    
    const firstItem = data.items[0]
    expect(firstItem).toMatch(/^1\./)
  })
  
  it('should return a streaming response when stream=true', async () => {
    const response = await makeRequest('/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=true')
    
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain')
    expect(response.headers.get('Transfer-Encoding')).toBe('chunked')
    
    const text = await response.text()
    expect(text.length).toBeGreaterThan(0)
    
    const lines = text.split('\n').filter(line => line.trim())
    expect(lines.some(line => /^\d+\./.test(line))).toBe(true)
  })
  
  it('should use the provided system prompt when specified', async () => {
    const customSystem = 'You are an assistant that lists programming languages in order of popularity'
    const response = await makeRequest(`/functions/list?prompt=List%20the%20top%205%20programming%20languages&system=${encodeURIComponent(customSystem)}&stream=false`)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data.settings.system).toBe(customSystem)
  })
  
  it('should use the specified model when provided', async () => {
    const model = 'gpt-4o'
    const response = await makeRequest(`/functions/list?prompt=List%20the%20top%205%20programming%20languages&model=${model}&stream=false`)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data.settings.model).toBe(model)
  })
  
  it('should include links in the response', async () => {
    const response = await makeRequest('/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false')
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data).toHaveProperty('links')
    expect(data.links).toHaveProperty('self')
    expect(data.links).toHaveProperty('home')
  })
})

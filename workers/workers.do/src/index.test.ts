import { describe, it, expect, vi } from 'vitest'
import app from './index'

describe('Workers.do Dispatch Worker', () => {
  it('should return a welcome message for the root path', async () => {
    const req = new Request('https://workers.do/')
    const res = await app.fetch(req, {
      CF_ACCOUNT_ID: 'test-account-id',
      CF_API_TOKEN: 'test-api-token',
      CF_NAMESPACE_ID: 'test-namespace-id',
    })
    
    expect(res.status).toBe(200)
    const body = await res.json() as { name: string; description: string }
    expect(body.name).toBe('Workers.do')
    expect(body.description).toBe('Cloudflare Workers for Platforms Dispatch Worker')
  })
  
  it('should return an error for invalid subdomains', async () => {
    const req = new Request('https://workers.do/test')
    const res = await app.fetch(req, {
      CF_ACCOUNT_ID: 'test-account-id',
      CF_API_TOKEN: 'test-api-token',
      CF_NAMESPACE_ID: 'test-namespace-id',
    })
    
    expect(res.status).toBe(400)
    expect(await res.text()).toContain('Invalid subdomain')
  })
})

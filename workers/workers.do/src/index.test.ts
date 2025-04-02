import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('agents', () => ({
  Agent: vi.fn().mockImplementation((config, state = {}) => ({
    name: config.name,
    instructions: config.instructions,
    model: config.model,
    apiKey: config.apiKey,
    chat: vi.fn().mockResolvedValue('Mocked response')
  }))
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

import app from './index'

describe('Workers.do Dispatch Worker', () => {
  const mockEnv = {
    CF_ACCOUNT_ID: 'test-account-id',
    CF_API_TOKEN: 'test-api-token',
    CF_NAMESPACE_ID: 'test-namespace-id',
    OPENAI_API_KEY: 'test-openai-key',
    ANTHROPIC_API_KEY: 'test-anthropic-key'
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Root path handling', () => {
    it('should return a welcome message for the root path', async () => {
      const req = new Request('https://workers.do/')
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(200)
      const body = await res.json() as { name: string; description: string }
      expect(body.name).toBe('Workers.do')
      expect(body.description).toBe('Cloudflare Workers for Platforms Dispatch Worker')
    })
    
    it('should include documentation and version in the response', async () => {
      const req = new Request('https://workers.do/')
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(200)
      const body = await res.json() as { documentation: string; version: string }
      expect(body.documentation).toBe('https://workers.do/docs')
      expect(body.version).toBe('1.0.0')
    })
  })
  
  describe('Subdomain handling', () => {
    it('should return an error for invalid subdomains', async () => {
      const req = new Request('https://workers.do/test')
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(400)
      expect(await res.text()).toContain('Invalid subdomain')
    })
    
    it('should handle worker not found errors', async () => {
      const req = new Request('https://test.workers.do/')
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, errors: [{ message: 'Worker not found' }] })
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(404)
      const body = await res.json() as { error: string }
      expect(body.error).toContain('Worker not found')
    })
    
    it('should handle introspection failures', async () => {
      const req = new Request('https://test.workers.do/')
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Introspection failed' })
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(500)
      const body = await res.json() as { error: string }
      expect(body.error).toContain('Failed to introspect worker')
    })
    
    it('should return worker exports when introspection succeeds', async () => {
      const req = new Request('https://test.workers.do/')
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          add: { 
            type: 'function',
            examples: [
              { id: 0, description: 'Add two numbers', input: '{ a: 1, b: 2 }', expectedOutput: '3' }
            ]
          },
          PI: { type: 'constant', value: 3.14159 }
        })
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(200)
      const body = await res.json() as { 
        name: string; 
        exports: Array<{
          name: string;
          type: string;
          examples?: Array<any>;
        }>;
      }
      expect(body.name).toBe('test')
      expect(body.exports).toHaveLength(2)
      expect(body.exports[0].name).toBe('add')
      expect(body.exports[0].type).toBe('function')
      expect(body.exports[0].examples).toHaveLength(1)
      expect(body.exports[1].name).toBe('PI')
      expect(body.exports[1].type).toBe('constant')
    })
  })
  
  describe('Agent deployment', () => {
    it('should return an error when agent ID is missing', async () => {
      const req = new Request('https://workers.do/deploy/agent/', {
        method: 'POST'
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(400)
      const text = await res.text()
      expect(text).toContain('Agent ID is required')
    })
    
    it('should handle agent fetch failures', async () => {
      const req = new Request('https://workers.do/deploy/agent/test-agent', {
        method: 'POST'
      })
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Agent not found' })
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(404)
      const body = await res.json() as { error: string }
      expect(body.error).toContain('Failed to fetch agent')
    })
    
    it('should handle successful agent deployment', async () => {
      const req = new Request('https://workers.do/deploy/agent/test-agent', {
        method: 'POST'
      })
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          name: 'Test Agent',
          systemPrompt: 'You are a test agent',
          baseModel: 'openai/gpt-4'
        })
      })
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          result: { id: 'test-agent-worker' }
        })
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(200)
      const body = await res.json() as { 
        success: boolean; 
        agent: { 
          name: string; 
          url: string 
        } 
      }
      expect(body.success).toBe(true)
      expect(body.agent.name).toBe('Test Agent')
      expect(body.agent.url).toContain('test-agent')
    })
    
    it('should handle deployment failures', async () => {
      const req = new Request('https://workers.do/deploy/agent/test-agent', {
        method: 'POST'
      })
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          name: 'Test Agent',
          systemPrompt: 'You are a test agent',
          baseModel: 'openai/gpt-4'
        })
      })
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          errors: [{ message: 'Deployment failed' }]
        })
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(500)
      const body = await res.json() as { error: string }
      expect(body.error).toContain('Failed to deploy agent')
    })
  })
  
  describe('Request forwarding', () => {
    it('should forward requests to the worker with outbound context', async () => {
      const req = new Request('https://test.workers.do/api/data')
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })
      
      mockFetch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ data: 'test' }),
        json: async () => ({ data: 'test' })
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(2)
      
      const secondFetchCall = mockFetch.mock.calls[1]
      expect(secondFetchCall[0]).toBe('https://test.workers.do/api/data')
      expect(secondFetchCall[1].cf.outbound.service).toBe('workers-do-outbound')
      expect(secondFetchCall[1].cf.outbound.params_object.userWorkerName).toBe('test')
    })
  })
})

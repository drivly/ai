import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import app from '../index'
import outboundApp from '../outbound'

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

describe('Workers.do Integration Tests', () => {
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

  describe('End-to-end request flow', () => {
    it('should handle a complete request flow through dispatch and outbound workers', async () => {
      const req = new Request('https://test-worker.workers.do/api/data')
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })
      
      const mockWorkerResponse = new Response(JSON.stringify({ data: 'test-data' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
      
      mockFetch.mockImplementationOnce(async (url, options) => {
        expect(options.cf.outbound.service).toBe('workers-do-outbound')
        expect(options.cf.outbound.params_object.userWorkerName).toBe('test-worker')
        
        const headers = new Headers(options.headers)
        headers.set('X-Workers-Do-User-Worker', 'test-worker')
        
        return mockWorkerResponse
      })
      
      const res = await app.fetch(req, mockEnv)
      
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data).toBe('test-data')
      
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Worker deployment and execution', () => {
    it('should deploy an agent as a worker and handle requests to it', async () => {
      const deployReq = new Request('https://workers.do/deploy/agent/test-agent', {
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
      
      const deployRes = await app.fetch(deployReq, mockEnv)
      expect(deployRes.status).toBe(200)
      const deployBody = await deployRes.json()
      expect(deployBody.success).toBe(true)
      
      const agentReq = new Request('https://test-agent.workers.do/?message=Hello')
      
      mockFetch.mockReset()
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      })
      
      mockFetch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ response: 'Hello, I am Test Agent', agent: 'Test Agent' }),
        json: async () => ({ response: 'Hello, I am Test Agent', agent: 'Test Agent' })
      })
      
      const agentRes = await app.fetch(agentReq, mockEnv)
      
      expect(agentRes.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { AgentsClient } from './index'
import type { AgentConfig, AgentResponse } from '../types'

describe('AgentsClient', () => {
  it('should create an instance with default options', () => {
    const client = new AgentsClient()
    expect(client).toBeDefined()
  })

  it('should create an instance with custom options', () => {
    const client = new AgentsClient({
      apiKey: 'test-key',
      baseUrl: 'https://custom-agents.do',
      defaultConfig: {
        baseModel: 'gpt-4',
      },
    })
    expect(client).toBeDefined()
  })

  it('should properly format API requests', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test-response' }),
    })

    const client = new AgentsClient({
      apiKey: 'test-key',
    })

    const response = await client.ask('test-agent', 'What is the weather?')
    expect(response).toEqual({ data: 'test-response' })
    expect(fetch).toHaveBeenCalledWith(
      'https://agents.do/v1/agents/test-agent/ask',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        }),
        body: expect.any(String),
      }),
    )
  })
})

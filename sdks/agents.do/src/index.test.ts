import { describe, it, expect, vi } from 'vitest'
import { AgentsClient, Agent, doFunction as agentDo } from './index'
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

describe('Agent do function', () => {
  it.skip('should support chained function call syntax', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test-result' }),
    })

    // const result = await agentDo('test-agent')('How can I help?')
    // expect(result).toEqual({ data: 'test-result' })
    // expect(fetch).toHaveBeenCalledWith(
    //   'https://agents.do/v1/agents/test-agent/execute',
    //   expect.objectContaining({
    //     method: 'POST',
    //     body: expect.any(String),
    //   }),
    // )

    // const parsedBody = JSON.parse((fetch as any).mock.calls[0][1].body)
    // expect(parsedBody).toHaveProperty('prompt', 'How can I help?')
  })

  it.skip('should support chained template literal syntax', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: 'test-result' }),
    })

    // const name = 'John'
    // const result = await agentDo('test-agent')`Hello ${name}, how can I help?`
    // expect(result).toEqual({ data: 'test-result' })

    // const parsedBody = JSON.parse((fetch as any).mock.calls[0][1].body)
    // expect(parsedBody).toHaveProperty('prompt', 'Hello John, how can I help?')
  })
})

describe('Agent class do method', () => {
  it.skip('should support function call syntax', async () => {
    const mockExecute = vi.fn().mockResolvedValue({ data: 'executed' })
    const agent = new Agent({ name: 'test-agent' })
    agent.execute = mockExecute

    // await agent.do('How can I help?')
    // expect(mockExecute).toHaveBeenCalledWith({ prompt: 'How can I help?' }, undefined)
  })

  it('should support template literal syntax', async () => {
    const mockExecute = vi.fn().mockResolvedValue({ data: 'executed' })
    const agent = new Agent({ name: 'test-agent' })
    agent.execute = mockExecute

    const name = 'John'
    await agent.do`Hello ${name}, how can I help?`
    expect(mockExecute).toHaveBeenCalledWith({ prompt: 'Hello John, how can I help?' })
  })
})

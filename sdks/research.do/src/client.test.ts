import { describe, it, expect, vi } from 'vitest'
import { ResearchClient } from './client'
import { ResearchOptions } from '../types'
import * as functionsdo from 'functions.do'

describe('ResearchClient', () => {
  it('creates a client with default options', () => {
    const client = new ResearchClient()
    expect(client).toBeDefined()
  })

  it('creates a client with custom options', () => {
    const client = new ResearchClient({
      apiKey: 'test-key',
      baseUrl: 'https://example.com',
    })
    expect(client).toBeDefined()
  })

  it('throws an error when topic is missing', async () => {
    const client = new ResearchClient()
    await expect(client.research({} as any)).rejects.toThrow('Missing required parameter: topic')
  })

  it('calls functions.do with correct parameters', async () => {
    const mockResearch = vi.fn().mockResolvedValue({
      taskId: 'test-task-id',
      jobId: 'test-job-id',
    })

    vi.spyOn(functionsdo, 'ai', 'get').mockReturnValue({
      research: mockResearch,
    } as any)

    const client = new ResearchClient()
    const params: ResearchOptions = {
      topic: 'Test topic',
      depth: 'medium',
      sources: ['news', 'academic'],
      format: 'markdown',
    }

    await client.research(params)

    expect(mockResearch).toHaveBeenCalledWith(params, {
      model: 'perplexity/sonar-deep-research',
    })
  })
})

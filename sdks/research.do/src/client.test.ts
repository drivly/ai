import { describe, it, expect, vi } from 'vitest'
import { ResearchClient } from './client'
import { ResearchOptions } from '../types'

describe('ResearchClient', () => {
  it('creates a client with default options', () => {
    const client = new ResearchClient()
    expect(client).toBeDefined()
  })

  it('creates a client with custom options', () => {
    const client = new ResearchClient({
      apiKey: 'test-key',
      baseUrl: 'https://example.com'
    })
    expect(client).toBeDefined()
  })

  it('throws an error when topic is missing', async () => {
    const client = new ResearchClient()
    await expect(client.research({} as any)).rejects.toThrow('Missing required parameter: topic')
  })

  it('calls API with correct parameters', async () => {
    const client = new ResearchClient()
    const mockPost = vi.spyOn(client['api'], 'post').mockResolvedValue({
      success: true,
      taskId: 'test-task-id',
      jobId: 'test-job-id'
    })

    const params: ResearchOptions = {
      topic: 'Test topic',
      depth: 'medium',
      sources: ['news', 'academic'],
      format: 'markdown'
    }

    await client.research(params)
    
    expect(mockPost).toHaveBeenCalledWith('/research', params)
  })
})

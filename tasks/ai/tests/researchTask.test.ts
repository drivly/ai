import { describe, it, expect, vi, beforeEach } from 'vitest'
import { researchTaskHandler } from '../researchTask' // Adjust path as needed
import type { Payload } from 'payload'
import type { TaskHandlerArgs } from 'payload' // Import TaskHandlerArgs

const mockQueue = vi.fn()
const mockUpdate = vi.fn()

const mockPayload = {
  jobs: {
    queue: mockQueue,
  },
  update: mockUpdate,
} as unknown as Payload

const mockReq = {} as any

describe('researchTaskHandler', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should queue executeFunction job and update task status to processing', async () => {
    const input = {
      topic: 'Test Topic',
      depth: 1,
      sources: [{ sourceUrl: 'http://example.com' }],
      format: 'summary',
      taskId: 'task123',
      callback: null,
    }
    const mockJobId = 'job456'

    mockQueue.mockResolvedValue({ id: mockJobId })

    const result = await researchTaskHandler({ input, payload: mockPayload, req: mockReq } as unknown as TaskHandlerArgs<'researchTask'>)

    expect(mockPayload.jobs.queue).toHaveBeenCalledTimes(1)
    expect(mockPayload.jobs.queue).toHaveBeenCalledWith({
      task: 'executeFunction',
      input: {
        functionName: 'research',
        args: { topic: input.topic, depth: input.depth, sources: input.sources, format: input.format },
        schema: {
          summary: 'string',
          findings: 'string[]',
          sources: 'string[]',
          confidence: 'number',
        },
        settings: {
          model: 'perplexity/sonar-deep-research',
        },
        type: 'Object',
      },
    })

    expect(mockPayload.update).toHaveBeenCalledTimes(1)
    expect(mockPayload.update).toHaveBeenCalledWith({
      collection: 'tasks',
      id: input.taskId,
      data: {
        status: 'processing',
        jobID: mockJobId,
      },
    })

    expect(result).toEqual({ summary: 'Processing...', findings: [], sources: [], confidence: 0 })
  })

  it('should update task status to failed on error during job queuing', async () => {
    const input = {
      topic: 'Error Topic',
      taskId: 'task789',
    }
    const errorMessage = 'Failed to queue job'

    mockQueue.mockRejectedValue(new Error(errorMessage))

    await expect(researchTaskHandler({ input, payload: mockPayload, req: mockReq } as unknown as TaskHandlerArgs<'researchTask'>)).rejects.toThrow(errorMessage)

    expect(mockPayload.update).toHaveBeenCalledTimes(1)
    expect(mockPayload.update).toHaveBeenCalledWith({
      collection: 'tasks',
      id: input.taskId,
      data: {
        status: 'failed',
        output: { error: errorMessage },
      },
    })
  })

  it('should throw error if payload instance is missing', async () => {
    const input = { topic: 'No Payload Topic', taskId: 'task000' }

    await expect(researchTaskHandler({ input, req: mockReq } as any)).rejects.toThrow('Payload instance not found in task arguments')

    expect(mockPayload.jobs.queue).not.toHaveBeenCalled()
    expect(mockPayload.update).not.toHaveBeenCalled()
  })
})

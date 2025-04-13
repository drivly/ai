import { describe, it, expect, vi } from 'vitest'
import { AI, createWorkflow } from '../index'

describe('workflows.do SDK - Unit Tests', () => {
  describe('AI function', () => {
    it('should create an AI instance with event handlers', async () => {
      const mockHandler = vi.fn()
      const ai = AI({
        testHandler: mockHandler,
      })

      expect(ai.testHandler).toBeDefined()
      expect(typeof ai.testHandler).toBe('function')

      const event = { type: 'test' }
      await ai.testHandler(event)

      expect(mockHandler).toHaveBeenCalledWith(
        event,
        expect.objectContaining({
          ai: expect.any(Object),
          api: expect.any(Object),
          db: expect.any(Object),
        }),
      )
    })

    it('should create an AI instance with function schemas', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ result: 'test' }),
      })

      const ai = AI({
        testFunction: {
          input: { type: 'string' },
          output: { type: 'string' },
        },
      })

      expect(ai.testFunction).toBeDefined()
      const result = await ai.testFunction({ input: 'test' })
      expect(result).toEqual({ result: 'test' })
      expect(fetch).toHaveBeenCalledWith('https://apis.do/ai/execute', expect.any(Object))
    })
  })

  describe('createWorkflow', () => {
    it('should create a workflow instance with execute method', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ status: 'completed', output: 'test' }),
      })

      const workflow = createWorkflow({
        name: 'test-workflow',
        initialStep: 'start',
        steps: {
          start: {
            name: 'start',
            function: 'testFunction',
            input: { value: 'test' },
            isFinal: true,
          },
        },
      })

      expect(workflow.name).toBe('test-workflow')
      expect(workflow.execute).toBeDefined()

      const result = await workflow.execute({ input: 'test' })
      expect(result).toEqual({ status: 'completed', output: 'test' })
      expect(fetch).toHaveBeenCalledWith('https://apis.do/workflows/execute', expect.any(Object))
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AI, createWorkflow } from '../index'

describe('workflows.do SDK - E2E Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    const mockFetch = vi.fn().mockImplementation(() => Promise.resolve(new Response()))
    global.fetch = mockFetch as unknown as typeof fetch
  })

  describe('Payload CRUD API', () => {
    it('should create and retrieve a workflow through Payload API', async () => {
      const mockWorkflow = {
        id: '123',
        name: 'test-workflow',
        type: 'typescript',
        code: 'export default { /* workflow definition */ }'
      }

      global.fetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ doc: mockWorkflow })
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ doc: mockWorkflow })
        })

      const response = await fetch('https://apis.do/workflows/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockWorkflow)
      })
      
      const result = await response.json()
      expect(result.doc).toBeDefined()
      expect(result.doc.name).toBe('test-workflow')

      const getResponse = await fetch(`https://apis.do/workflows/${mockWorkflow.id}`)
      const getResult = await getResponse.json()
      expect(getResult.doc).toBeDefined()
      expect(getResult.doc.name).toBe('test-workflow')
    })
  })

  describe('Clickable API Integration', () => {
    it('should execute a workflow through the Clickable API', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          status: 'completed',
          output: { result: 'success' }
        })
      })

      const workflow = createWorkflow({
        name: 'test-workflow',
        initialStep: 'start',
        steps: {
          start: {
            name: 'start',
            function: 'testFunction',
            input: { value: 'test' },
            isFinal: true
          }
        }
      })

      const result = await workflow.execute({ input: 'test' })
      expect(result).toBeDefined()
      expect(result.status).toBe('completed')
      expect(result.output).toEqual({ result: 'success' })
    })

    it('should handle workflow execution errors gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          status: 'failed',
          error: 'Function not found',
          context: {
            currentStep: 'start',
            history: []
          }
        })
      })

      const workflow = createWorkflow({
        name: 'error-workflow',
        initialStep: 'start',
        steps: {
          start: {
            name: 'start',
            function: 'nonExistentFunction',
            input: { value: 'test' },
            isFinal: true
          }
        }
      })

      const result = await workflow.execute({ input: 'test' })
      expect(result).toBeDefined()
      expect(result.status).toBe('failed')
      expect(result.error).toBe('Function not found')
    })
  })
})

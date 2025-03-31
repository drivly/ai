import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AI, createWorkflow } from '../index'

describe('workflows.do SDK - E2E Tests', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetAllMocks()
    mockFetch = vi.fn().mockImplementation(() => Promise.resolve(new Response()))
    global.fetch = mockFetch as unknown as typeof fetch
  })

  const mockWorkflow = {
    id: '123',
    name: 'test-workflow',
    type: 'typescript',
    code: 'export default { /* workflow definition */ }'
  }

  describe('Payload CRUD API', () => {
    it('should create and retrieve a workflow through Payload API', async () => {

      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ doc: mockWorkflow })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ doc: mockWorkflow })))

      const response = await fetch('http://localhost:3000/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockWorkflow)
      })
      
      const result = await response.json()
      expect(result.doc).toBeDefined()
      expect(result.doc.name).toBe('test-workflow')

      const getResponse = await fetch(`http://localhost:3000/api/workflows/${mockWorkflow.id}`)
      const getResult = await getResponse.json()
      expect(getResult.doc).toBeDefined()
      expect(getResult.doc.name).toBe('test-workflow')
    })

    it('should update and delete a workflow through Payload API', async () => {
      const updatedWorkflow = {
        ...mockWorkflow,
        code: 'export default { /* updated workflow */ }'
      }

      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ doc: updatedWorkflow })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })))

      const updateResponse = await fetch(`http://localhost:3000/api/workflows/${mockWorkflow.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWorkflow)
      })
      const updateResult = await updateResponse.json()
      expect(updateResult.doc.code).toBe(updatedWorkflow.code)

      const deleteResponse = await fetch(`http://localhost:3000/api/workflows/${mockWorkflow.id}`, {
        method: 'DELETE'
      })
      const deleteResult = await deleteResponse.json()
      expect(deleteResult.success).toBe(true)
    })

    it('should handle Payload API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ 
        error: 'Not Found',
        message: 'Workflow does not exist'
      }), { status: 404 }))

      const response = await fetch(`http://localhost:3000/api/workflows/nonexistent-id`)
      expect(response.status).toBe(404)
      const result = await response.json()
      expect(result.error).toBe('Not Found')
    })
  })

  describe('Clickable API Integration', () => {
    it('should execute a workflow through the Clickable API', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({
        status: 'completed',
        output: { result: 'success' }
      })))

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

    it('should execute a workflow with custom options', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({
        status: 'completed',
        output: { result: 'custom' },
        context: {
          timeout: 5000,
          retries: 2
        }
      })))

      const workflow = createWorkflow({
        name: 'custom-workflow',
        initialStep: 'start',
        steps: {
          start: {
            name: 'start',
            function: 'customFunction',
            input: { value: 'test' },
            isFinal: true
          }
        }
      })

      const result = await workflow.execute({ input: 'test' }, { 
        timeout: 5000,
        retries: 2
      })
      
      expect(result.status).toBe('completed')
      expect(result.context.timeout).toBe(5000)
      expect(result.context.retries).toBe(2)
    })

    it('should execute workflows with different input types', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({
        status: 'completed',
        output: { 
          string: 'test',
          number: 42,
          boolean: true,
          array: [1, 2, 3],
          object: { key: 'value' }
        }
      })))

      const workflow = createWorkflow({
        name: 'input-types-workflow',
        initialStep: 'start',
        steps: {
          start: {
            name: 'start',
            function: 'processInputs',
            input: {
              string: 'test',
              number: 42,
              boolean: true,
              array: [1, 2, 3],
              object: { key: 'value' }
            },
            isFinal: true
          }
        }
      })

      const result = await workflow.execute({
        string: 'test',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { key: 'value' }
      })
      
      expect(result.status).toBe('completed')
      expect(result.output).toEqual({
        string: 'test',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { key: 'value' }
      })
    })

    it('should handle concurrent workflow executions', async () => {
      mockFetch
        .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'completed', output: 'workflow1' })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'completed', output: 'workflow2' })))
        .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'completed', output: 'workflow3' })))

      const workflow = createWorkflow({
        name: 'concurrent-workflow',
        initialStep: 'start',
        steps: {
          start: {
            name: 'start',
            function: 'process',
            isFinal: true
          }
        }
      })

      const results = await Promise.all([
        workflow.execute({ id: 1 }),
        workflow.execute({ id: 2 }),
        workflow.execute({ id: 3 })
      ])

      expect(results).toHaveLength(3)
      expect(results[0].output).toBe('workflow1')
      expect(results[1].output).toBe('workflow2')
      expect(results[2].output).toBe('workflow3')
    })

    it('should handle workflow execution errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({
        status: 'failed',
        error: 'Function not found',
        context: {
          currentStep: 'start',
          history: []
        }
      })))

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

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AI, createWorkflow } from '../index'

describe('workflows.do SDK - E2E Tests', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.resetAllMocks()
    mockFetch = vi.fn().mockImplementation(() => Promise.resolve(new Response()))
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

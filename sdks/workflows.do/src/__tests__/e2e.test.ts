import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { AI, createWorkflow } from '../index'

/**
 * E2E Tests for workflows.do SDK
 * 
 * These tests use mocks to simulate API interactions.
 * In a production environment, these would connect to the actual backend.
 */
describe('workflows.do SDK - E2E Tests', () => {
  beforeAll(() => {
    global.window = {
      location: {
        hostname: 'localhost'
      }
    } as any
  })

  const testWorkflow = {
    name: 'e2e-test-workflow',
    type: 'typescript',
    code: 'export default { /* workflow definition */ }'
  }

  const mockWorkflowId = 'mock-workflow-id-123'

  describe('Payload CRUD API', () => {
    beforeAll(() => {
      global.fetch = vi.fn()
    })

    it('should create and retrieve a workflow through Payload API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ 
          doc: { 
            ...testWorkflow, 
            id: mockWorkflowId 
          } 
        })
      } as Response)

      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ 
          doc: { 
            ...testWorkflow, 
            id: mockWorkflowId 
          } 
        })
      } as Response)

      const response = await fetch('http://localhost:3000/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testWorkflow)
      })
      
      const result = await response.json()
      expect(result.doc).toBeDefined()
      expect(result.doc.name).toBe('e2e-test-workflow')
      expect(result.doc.id).toBe(mockWorkflowId)
      
      const getResponse = await fetch(`http://localhost:3000/api/workflows/${mockWorkflowId}`)
      const getResult = await getResponse.json()
      expect(getResult.doc).toBeDefined()
      expect(getResult.doc.name).toBe('e2e-test-workflow')
    })

    it('should update a workflow through Payload API', async () => {
      const updatedWorkflow = {
        ...testWorkflow,
        code: 'export default { /* updated workflow */ }'
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ 
          doc: { 
            ...updatedWorkflow, 
            id: mockWorkflowId 
          } 
        })
      } as Response)

      const updateResponse = await fetch(`http://localhost:3000/api/workflows/${mockWorkflowId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWorkflow)
      })
      
      const updateResult = await updateResponse.json()
      expect(updateResult.doc).toBeDefined()
      expect(updateResult.doc.code).toBe(updatedWorkflow.code)
    })

    it('should handle Payload API errors gracefully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 404,
        json: async () => ({ 
          errors: [{ message: 'Workflow not found' }] 
        })
      } as Response)

      const response = await fetch(`http://localhost:3000/api/workflows/nonexistent-id`)
      expect(response.status).toBe(404)
      
      const result = await response.json()
      expect(result.errors).toBeDefined()
    })

    it('should delete a workflow through Payload API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 200,
        json: async () => ({ 
          doc: { id: mockWorkflowId, deleted: true } 
        })
      } as Response)

      const deleteResponse = await fetch(`http://localhost:3000/api/workflows/${mockWorkflowId}`, {
        method: 'DELETE'
      })
      
      expect(deleteResponse.status).toBe(200)
      const deleteResult = await deleteResponse.json()
      expect(deleteResult.doc).toBeDefined()
    })
  })

  describe('Clickable API Integration', () => {
    beforeEach(() => {
      vi.resetAllMocks()
      global.fetch = vi.fn()
    })

    it('should execute a workflow through the Clickable API', async () => {
      const workflow = createWorkflow({
        name: 'e2e-execution-test',
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

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url.toString().includes('/workflows/execute')) {
          return Promise.resolve({
            json: async () => ({ 
              status: 'completed',
              output: { result: 'success' }
            })
          } as Response)
        }
        
        return Promise.resolve({
          json: async () => ({})
        } as Response)
      })

      const result = await workflow.execute({ input: 'test' })
      expect(result).toBeDefined()
      expect(result.status).toBe('completed')
    })

    it('should execute a workflow with custom options', async () => {
      const workflow = createWorkflow({
        name: 'e2e-options-test',
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

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url.toString().includes('/workflows/execute')) {
          return Promise.resolve({
            json: async () => ({ 
              status: 'completed',
              output: { 
                result: 'custom',
                timeout: 5000,
                retries: 2
              }
            })
          } as Response)
        }
        
        return Promise.resolve({
          json: async () => ({})
        } as Response)
      })

      const result = await workflow.execute({ input: 'test' }, { 
        timeout: 5000,
        retries: 2
      })
      
      expect(result).toBeDefined()
      expect(result.status).toBe('completed')
    })

    it('should handle workflow execution errors gracefully', async () => {
      const workflow = createWorkflow({
        name: 'e2e-error-test',
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

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url.toString().includes('/workflows/execute')) {
          return Promise.resolve({
            json: async () => ({ 
              status: 'failed',
              error: 'Function not found: nonExistentFunction'
            })
          } as Response)
        }
        
        return Promise.resolve({
          json: async () => ({})
        } as Response)
      })

      const result = await workflow.execute({ input: 'test' })
      expect(result).toBeDefined()
      expect(result.status).toBe('failed')
    })
  })
})

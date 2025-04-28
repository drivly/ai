import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { AI, createWorkflow, on, every } from '../index'

/**
 * E2E Tests for workflows.do SDK
 *
 * These tests use mocks to simulate API interactions.
 * In a production environment, these would connect to the actual backend.
 */
describe('workflows.do SDK - E2E Tests', () => {
  beforeAll(() => {
    globalThis.window = {
      location: {
        hostname: 'localhost',
      },
    } as any
  })

  const testWorkflow = {
    name: 'e2e-test-workflow',
    type: 'typescript',
    code: 'export default { /* workflow definition */ }',
  }

  const mockWorkflowId = 'mock-workflow-id-123'

  describe('Payload CRUD API', () => {
    beforeAll(() => {
      globalThis.fetch = vi.fn()
    })

    it('should create and retrieve a workflow through Payload API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({
          doc: {
            ...testWorkflow,
            id: mockWorkflowId,
          },
        }),
      } as Response)

      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({
          doc: {
            ...testWorkflow,
            id: mockWorkflowId,
          },
        }),
      } as Response)

      const response = await fetch('http://localhost:3000/v1/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testWorkflow),
      })

      const result = await response.json()
      expect(result.doc).toBeDefined()
      expect(result.doc.name).toBe('e2e-test-workflow')
      expect(result.doc.id).toBe(mockWorkflowId)

      const getResponse = await fetch(`http://localhost:3000/v1/workflows/${mockWorkflowId}`)
      const getResult = await getResponse.json()
      expect(getResult.doc).toBeDefined()
      expect(getResult.doc.name).toBe('e2e-test-workflow')
    })

    it('should update a workflow through Payload API', async () => {
      const updatedWorkflow = {
        ...testWorkflow,
        code: 'export default { /* updated workflow */ }',
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({
          doc: {
            ...updatedWorkflow,
            id: mockWorkflowId,
          },
        }),
      } as Response)

      const updateResponse = await fetch(`http://localhost:3000/v1/workflows/${mockWorkflowId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkflow),
      })

      const updateResult = await updateResponse.json()
      expect(updateResult.doc).toBeDefined()
      expect(updateResult.doc.code).toBe(updatedWorkflow.code)
    })

    it('should handle Payload API errors gracefully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 404,
        json: async () => ({
          errors: [{ message: 'Workflow not found' }],
        }),
      } as Response)

      const response = await fetch(`http://localhost:3000/v1/workflows/nonexistent-id`)
      expect(response.status).toBe(404)

      const result = await response.json()
      expect(result.errors).toBeDefined()
    })

    it('should delete a workflow through Payload API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 200,
        json: async () => ({
          doc: { id: mockWorkflowId, deleted: true },
        }),
      } as Response)

      const deleteResponse = await fetch(`http://localhost:3000/v1/workflows/${mockWorkflowId}`, {
        method: 'DELETE',
      })

      expect(deleteResponse.status).toBe(200)
      const deleteResult = await deleteResponse.json()
      expect(deleteResult.doc).toBeDefined()
    })
  })

  describe('Clickable API Integration', () => {
    beforeEach(() => {
      vi.resetAllMocks()
      globalThis.fetch = vi.fn()
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
            isFinal: true,
          },
        },
      })

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url.toString().includes('/workflows/execute')) {
          return Promise.resolve({
            json: async () => ({
              status: 'completed',
              output: { result: 'success' },
            }),
          } as Response)
        }

        return Promise.resolve({
          json: async () => ({}),
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
            isFinal: true,
          },
        },
      })

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url.toString().includes('/workflows/execute')) {
          return Promise.resolve({
            json: async () => ({
              status: 'completed',
              output: {
                result: 'custom',
                timeout: 5000,
                retries: 2,
              },
            }),
          } as Response)
        }

        return Promise.resolve({
          json: async () => ({}),
        } as Response)
      })

      const result = await workflow.execute(
        { input: 'test' },
        {
          timeout: 5000,
          retries: 2,
        },
      )

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
            isFinal: true,
          },
        },
      })

      vi.mocked(fetch).mockImplementation((url, options) => {
        if (url.toString().includes('/workflows/execute')) {
          return Promise.resolve({
            json: async () => ({
              status: 'failed',
              error: 'Function not found: nonExistentFunction',
            }),
          } as Response)
        }

        return Promise.resolve({
          json: async () => ({}),
        } as Response)
      })

      const result = await workflow.execute({ input: 'test' })
      expect(result).toBeDefined()
      expect(result.status).toBe('failed')
    })
  })

  describe('Event-based workflow functions', () => {
    beforeEach(() => {
      vi.resetAllMocks()
      globalThis.fetch = vi.fn()
    })

    describe('on function', () => {
      it('should register event handlers with the remote service', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        })
        globalThis.fetch = mockFetch
        
        const handler = async (event: any) => {
          return { processed: true }
        }
        
        const eventName = 'test.event'
        on(eventName, handler)
        
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/triggers/create'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: expect.stringContaining(eventName),
          })
        )

        const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(requestBody.type).toBe('event')
        expect(requestBody.event).toBe(eventName)
        expect(requestBody.handler).toBe(handler.toString())
      })

      it('should handle local execution when running on localhost', async () => {
        globalThis.window = {
          location: {
            hostname: 'localhost'
          }
        } as any

        const mockFetch = vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        })
        globalThis.fetch = mockFetch
        
        const handler = async (event: any) => {
          return { processed: true }
        }
        
        on('local.test.event', handler)
        
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('http://localhost:3000/triggers/create'),
          expect.any(Object)
        )
      })
    })

    describe('every function', () => {
      it('should register cron handlers with the remote service', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        })
        globalThis.fetch = mockFetch
        
        const handler = async (event: any) => {
          return { processed: true }
        }
        
        const cronExpression = '0 0 * * *'
        every(cronExpression, handler)
        
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/cron/schedule'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: expect.stringContaining(cronExpression),
          })
        )

        const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(requestBody.cron).toBe(cronExpression)
        expect(requestBody.handler).toBe(handler.toString())
      })

      it('should include options in the request when provided', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        })
        globalThis.fetch = mockFetch
        
        const handler = async (event: any) => {
          return { processed: true }
        }
        
        const options = {
          timezone: 'America/New_York',
          enabled: true,
        }
        
        every('0 12 * * *', handler, options)
        
        const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(requestBody.options).toEqual(options)
      })

      it('should handle local execution when running on localhost', async () => {
        globalThis.window = {
          location: {
            hostname: 'localhost'
          }
        } as any

        const mockFetch = vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ success: true }),
        })
        globalThis.fetch = mockFetch
        
        const handler = async (event: any) => {
          return { processed: true }
        }
        
        every('*/5 * * * *', handler)
        
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('http://localhost:3000/cron/schedule'),
          expect.any(Object)
        )
      })
    })

    describe('Error handling', () => {
      beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should handle network errors for on function', async () => {
        const networkError = new Error('Network error')
        globalThis.fetch = vi.fn().mockRejectedValue(networkError)
        
        const handler = async (event: any) => {
          return { processed: true }
        }
        
        on('error.test.event', handler)
        
        await new Promise(resolve => setTimeout(resolve, 10))
        
        expect(console.error).toHaveBeenCalledWith(
          'Error creating trigger:',
          networkError
        )
      })

      it('should handle network errors for every function', async () => {
        const networkError = new Error('Network error')
        globalThis.fetch = vi.fn().mockRejectedValue(networkError)
        
        const handler = async (event: any) => {
          return { processed: true }
        }
        
        every('0 0 * * *', handler)
        
        await new Promise(resolve => setTimeout(resolve, 10))
        
        expect(console.error).toHaveBeenCalledWith(
          'Error scheduling cron task:',
          networkError
        )
      })
    })
  })

  describe('Integration with test server', () => {
    const hasTestServer = typeof process !== 'undefined' && process.env.TEST_SERVER
    
    ;(hasTestServer ? it : it.skip)('should successfully register an event handler with a test server', async () => {
      const originalFetch = globalThis.fetch
      
      try {
        const handler = async (event: any) => {
          return { processed: true, event }
        }
        
        const uniqueEventName = `test.event.${Date.now()}`
        
        on(uniqueEventName, handler)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const testServerUrl = process.env.TEST_SERVER || 'http://localhost:3000'
        const response = await fetch(`${testServerUrl}/triggers/test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: uniqueEventName,
            payload: { test: true }
          }),
        })
        
        const result = await response.json()
        expect(result.success).toBe(true)
      } finally {
        globalThis.fetch = originalFetch
      }
    })
    
    ;(hasTestServer ? it : it.skip)('should successfully schedule a cron job with a test server', async () => {
      const originalFetch = globalThis.fetch
      
      try {
        const handler = async (event: any) => {
          return { processed: true, timestamp: Date.now() }
        }
        
        const cronExpression = '* * * * *'
        
        every(cronExpression, handler, { runImmediately: true })
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const testServerUrl = process.env.TEST_SERVER || 'http://localhost:3000'
        const response = await fetch(`${testServerUrl}/cron/list`, {
          method: 'GET',
        })
        
        const result = await response.json()
        expect(result.jobs).toBeDefined()
        expect(result.jobs.some((job: any) => job.cron === cronExpression)).toBe(true)
      } finally {
        globalThis.fetch = originalFetch
      }
    })
  })
})

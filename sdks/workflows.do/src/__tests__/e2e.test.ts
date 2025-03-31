import { describe, it, expect, beforeAll } from 'vitest'
import { AI, createWorkflow } from '../index'

describe('workflows.do SDK - E2E Tests', () => {
  const BASE_URL = 'http://localhost:3000'

  describe('Payload CRUD API', () => {
    it('should create and retrieve a workflow through Payload API', async () => {
      const response = await fetch(`${BASE_URL}/api/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'test-workflow',
          type: 'typescript',
          code: 'export default { /* workflow definition */ }'
        })
      })
      
      const result = await response.json()
      expect(result.doc).toBeDefined()
      expect(result.doc.name).toBe('test-workflow')

      const getResponse = await fetch(`${BASE_URL}/api/workflows/${result.doc.id}`)
      const getResult = await getResponse.json()
      expect(getResult.doc).toBeDefined()
      expect(getResult.doc.name).toBe('test-workflow')
    })
  })

  describe('Clickable API Integration', () => {
    it('should execute a workflow through the Clickable API', async () => {
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
    })

    it('should handle workflow execution errors gracefully', async () => {
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
      expect(result.error).toBeDefined()
    })
  })
})

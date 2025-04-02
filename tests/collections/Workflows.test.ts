import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { Workflows } from '../../collections/ai/Workflows'
import { getPayload } from 'payload'
import config from '../../payload.config'
import type { Workflow as WorkflowType } from '../../payload.types'

describe('Workflows Collection', () => {
  let payload: any

  beforeAll(async () => {
    if (process.env.CI) return

    try {
      payload = await getPayload({
        config,
      })
    } catch (error) {
      console.error('Error initializing Payload:', error)
    }
  })

  afterAll(async () => {
    if (process.env.CI || !payload) return

    try {
      await payload.disconnect()
    } catch (error) {
      console.error('Error disconnecting Payload:', error)
    }
  })

  it('should have the correct slug', () => {
    expect(Workflows.slug).toBe('workflows')
  })

  it('should be in the AI admin group', () => {
    expect(Workflows.admin?.group).toBe('AI')
  })

  it('should use name as title', () => {
    expect(Workflows.admin?.useAsTitle).toBe('name')
  })

  it('should have versions enabled', () => {
    expect(Workflows.versions).toBe(true)
  })

  describe('Fields', () => {
    it('should have a name field', () => {
      const nameField = Workflows.fields.find((field: any) => field.name === 'name')
      expect(nameField).toBeDefined()
      expect(nameField?.type).toBe('text')
    })

    it('should have type and code fields', () => {
      const typeField = Workflows.fields.find((field: any) => field.name === 'type')
      const codeField = Workflows.fields.find((field: any) => field.name === 'code')

      expect(typeField).toBeDefined()
      expect(typeField?.type).toBe('code')

      expect(codeField).toBeDefined()
      expect(codeField?.type).toBe('code')
    })

    it('should have relationship fields', () => {
      const functionsField = Workflows.fields.find((field: any) => field.name === 'functions')
      const moduleField = Workflows.fields.find((field: any) => field.name === 'module')
      const packageField = Workflows.fields.find((field: any) => field.name === 'package')
      const deploymentField = Workflows.fields.find((field: any) => field.name === 'deployment')

      expect(functionsField).toBeDefined()
      expect(functionsField?.type).toBe('relationship')
      expect((functionsField as any)?.relationTo).toBe('functions')

      expect(moduleField).toBeDefined()
      expect(moduleField?.type).toBe('relationship')
      expect((moduleField as any)?.relationTo).toBe('modules')

      expect(packageField).toBeDefined()
      expect(packageField?.type).toBe('relationship')
      expect((packageField as any)?.relationTo).toBe('packages')

      expect(deploymentField).toBeDefined()
      expect(deploymentField?.type).toBe('relationship')
      expect((deploymentField as any)?.relationTo).toBe('deployments')
    })
  })(payload ? describe : describe.skip)('Payload Integration', () => {
    it('should be able to find workflows collection', async () => {
      const result = await payload.find({
        collection: 'workflows',
        limit: 1,
      })

      expect(result).toBeDefined()
      expect(result.docs).toBeDefined()
      expect(Array.isArray(result.docs)).toBe(true)
    })

    it('should be able to create and delete a workflow', async () => {
      const testWorkflow = {
        name: 'Test Workflow',
        type: 'Test Type',
      }

      const created = await payload.create({
        collection: 'workflows',
        data: testWorkflow,
      })

      expect(created).toBeDefined()
      expect(created.id).toBeDefined()
      expect(created.name).toBe(testWorkflow.name)
      expect(created.type).toBe(testWorkflow.type)

      const deleted = await payload.delete({
        collection: 'workflows',
        id: created.id,
      })

      expect(deleted).toBeDefined()
      expect(deleted.id).toBe(created.id)
    })
  })
})

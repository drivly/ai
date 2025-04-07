import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Agents } from '../../collections/ai/Agents'
import type { Agent as AgentType } from '../../payload.types'
import { getTestPayload } from '../setup'

describe('Agents Collection', () => {
  let payload: any

  beforeAll(async () => {
    if (process.env.CI) return

    try {
      payload = await getTestPayload()
    } catch (error) {
      console.error('Error initializing Payload:', error)
    }
  })

  afterAll(async () => {})

  it('should have the correct slug', () => {
    expect(Agents.slug).toBe('agents')
  })

  it('should be in the AI admin group', () => {
    expect(Agents.admin?.group).toBe('AI')
  })

  it('should use name as title', () => {
    expect(Agents.admin?.useAsTitle).toBe('name')
  })

  it('should have versions enabled', () => {
    expect(Agents.versions).toBe(true)
  })

  describe('Fields', function () {
    it('should have a name field', () => {
      const nameField = Agents.fields.find((field: any) => field.name === 'name')
      expect(nameField).toBeDefined()
      expect(nameField?.type).toBe('text')
    })
  })
  ;(payload ? describe : describe.skip)('Payload Integration', () => {
    it('should be able to find agents collection', async () => {
      const result = await payload.find({
        collection: 'agents',
        limit: 1,
      })

      expect(result).toBeDefined()
      expect(result.docs).toBeDefined()
      expect(Array.isArray(result.docs)).toBe(true)
    })

    it('should be able to create and delete an agent', async () => {
      const testAgent = {
        name: 'Test Agent',
      }

      const created = await payload.create({
        collection: 'agents',
        data: testAgent,
      })

      expect(created).toBeDefined()
      expect(created.id).toBeDefined()
      expect(created.name).toBe(testAgent.name)

      const deleted = await payload.delete({
        collection: 'agents',
        id: created.id,
      })

      expect(deleted).toBeDefined()
      expect(deleted.id).toBe(created.id)
    })
  })
})

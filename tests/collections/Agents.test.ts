import { describe, it, expect, vi } from 'vitest'
import { Agents } from '../../collections/ai/Agents'
import { getPayload } from 'payload'

vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    create: vi.fn().mockResolvedValue({ id: 'mock-id' }),
    find: vi.fn().mockResolvedValue({ docs: [] }),
    update: vi.fn().mockResolvedValue({ id: 'mock-id' }),
    delete: vi.fn().mockResolvedValue({ id: 'mock-id' }),
  }),
}))

describe('Agents Collection', () => {
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

  describe('Fields', () => {
    it('should have a name field', () => {
      const nameField = Agents.fields.find((field: any) => field.name === 'name')
      expect(nameField).toBeDefined()
      expect(nameField?.type).toBe('text')
    })
  })
})

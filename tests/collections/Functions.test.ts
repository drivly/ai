import { describe, it, expect, vi } from 'vitest'
import { Functions } from '../../collections/ai/Functions'
import { getPayload } from 'payload'

vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    create: vi.fn().mockResolvedValue({ id: 'mock-id' }),
    find: vi.fn().mockResolvedValue({ docs: [] }),
    update: vi.fn().mockResolvedValue({ id: 'mock-id' }),
    delete: vi.fn().mockResolvedValue({ id: 'mock-id' }),
  }),
}))

describe('Functions Collection', () => {
  it('should have the correct slug', () => {
    expect(Functions.slug).toBe('functions')
  })

  it('should be in the AI admin group', () => {
    expect(Functions.admin?.group).toBe('AI')
  })

  it('should use name as title', () => {
    expect(Functions.admin?.useAsTitle).toBe('name')
  })

  it('should have versions enabled', () => {
    expect(Functions.versions).toBe(true)
  })

  describe('Fields', () => {
    it('should have a name field', () => {
      const nameField = Functions.fields.find(field => field.name === 'name')
      expect(nameField).toBeDefined()
      expect(nameField?.type).toBe('text')
      expect(nameField?.required).toBe(true)
    })

    it('should have a type field with correct options', () => {
      const typeField = Functions.fields.find(field => field.name === 'type')
      expect(typeField).toBeDefined()
      expect(typeField?.type).toBe('select')
      expect(typeField?.options).toContain('Generation')
      expect(typeField?.options).toContain('Code')
      expect(typeField?.options).toContain('Human')
      expect(typeField?.options).toContain('Agent')
    })

    it('should have a format field with correct options', () => {
      const formatField = Functions.fields.find(field => field.name === 'format')
      expect(formatField).toBeDefined()
      expect(formatField?.type).toBe('select')
      expect(formatField?.options).toContain('Object')
      expect(formatField?.options).toContain('ObjectArray')
      expect(formatField?.options).toContain('Text')
      expect(formatField?.options).toContain('TextArray')
      expect(formatField?.options).toContain('Markdown')
      expect(formatField?.options).toContain('Code')
    })

    it('should have a schemaYaml field', () => {
      const schemaField = Functions.fields.find(field => field.name === 'schemaYaml')
      expect(schemaField).toBeDefined()
      expect(schemaField?.type).toBe('textarea')
    })

    it('should have a code field', () => {
      const codeField = Functions.fields.find(field => field.name === 'code')
      expect(codeField).toBeDefined()
      expect(codeField?.type).toBe('code')
    })
  })

  describe('Hooks', () => {
    it('should have a beforeChange hook', () => {
      expect(Functions.hooks?.beforeChange).toBeDefined()
    })

    it('should have an afterChange hook', () => {
      expect(Functions.hooks?.afterChange).toBeDefined()
    })
  })
})

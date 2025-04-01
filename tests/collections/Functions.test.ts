import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Functions } from '../../collections/ai/Functions'
import { getPayload } from 'payload'
import config from '../../payload.config'
import type { Function as FunctionType } from '../../payload.types'

describe('Functions Collection', () => {
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
      const nameField = Functions.fields.find((field: any) => field.name === 'name')
      expect(nameField).toBeDefined()
      expect(nameField?.type).toBe('text')
      expect(nameField?.required).toBe(true)
    })

    it('should have a type field with correct options', () => {
      const typeField = Functions.fields.find((field: any) => field.name === 'type')
      expect(typeField).toBeDefined()
      expect(typeField?.type).toBe('select')
      expect(typeField?.options).toContain('Generation')
      expect(typeField?.options).toContain('Code')
      expect(typeField?.options).toContain('Human')
      expect(typeField?.options).toContain('Agent')
    })

    it('should have a format field with correct options', () => {
      const formatField = Functions.fields.find((field: any) => field.name === 'format')
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
      const schemaField = Functions.fields.find((field: any) => field.name === 'schemaYaml')
      expect(schemaField).toBeDefined()
      expect(schemaField?.type).toBe('textarea')
    })

    it('should have a code field', () => {
      const codeField = Functions.fields.find((field: any) => field.name === 'code')
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

  (payload ? describe : describe.skip)('Payload Integration', () => {
    it('should be able to find functions collection', async () => {
      const result = await payload.find({
        collection: 'functions',
        limit: 1,
      })
      
      expect(result).toBeDefined()
      expect(result.docs).toBeDefined()
      expect(Array.isArray(result.docs)).toBe(true)
    })

    it('should be able to create and delete a function', async () => {
      const testFunction = {
        name: 'Test Function',
        type: 'Generation',
        format: 'Text',
      }
      
      const created = await payload.create({
        collection: 'functions',
        data: testFunction,
      })
      
      expect(created).toBeDefined()
      expect(created.id).toBeDefined()
      expect(created.name).toBe(testFunction.name)
      expect(created.type).toBe(testFunction.type)
      expect(created.format).toBe(testFunction.format)
      
      const deleted = await payload.delete({
        collection: 'functions',
        id: created.id,
      })
      
      expect(deleted).toBeDefined()
      expect(deleted.id).toBe(created.id)
    })
  })
})

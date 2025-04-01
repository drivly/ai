import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { executeFunction } from '../../tasks/executeFunction'
import { generateObjectArray } from '../../tasks/generateObjectArray'

const originalGenerateObjectArray = generateObjectArray

vi.mock('../../tasks/schemaUtils', () => ({
  validateWithSchema: vi.fn().mockImplementation((schema, obj) => obj),
  schemaToJsonSchema: vi.fn()
}))

vi.mock('@vercel/functions', () => ({
  waitUntil: vi.fn()
}))

const mockPayload = {
  find: vi.fn().mockResolvedValue({ docs: [] }),
  create: vi.fn().mockResolvedValue({}),
  db: {
    upsert: vi.fn().mockResolvedValue({})
  }
}

describe('executeFunction with ObjectArray format', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (!process.env.AI_GATEWAY_URL) {
      process.env.AI_GATEWAY_URL = 'https://ai-gateway.drivly.dev'
    }
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle ObjectArray format correctly', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of planets with diameters' },
      settings: { model: 'gpt-4o-mini' },
      schema: { name: 'string', diameter: 'number' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload
    })

    expect(result.output).toHaveProperty('items')
    expect(Array.isArray(result.output.items)).toBe(true)
    expect(result.output.items.length).toBeGreaterThan(0)
    
    const firstItem = result.output.items[0]
    expect(typeof firstItem.name).toBe('string')
    expect(typeof firstItem.diameter).toBe('number')
  })

  it('should validate each item in the array against the schema', async () => {
    const validateWithSchemaSpy = vi.spyOn(require('../../tasks/schemaUtils'), 'validateWithSchema')

    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of countries with populations' },
      settings: { model: 'gpt-4o-mini' },
      schema: { name: 'string', population: 'number' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload
    })

    expect(validateWithSchemaSpy).toHaveBeenCalled()
    
    expect(result.output).toHaveProperty('items')
    expect(Array.isArray(result.output.items)).toBe(true)
    expect(result.output.items.length).toBeGreaterThan(0)
    
    result.output.items.forEach((item: any) => {
      expect(typeof item.name).toBe('string')
      expect(typeof item.population).toBe('number')
    })
  })

  it('should handle optional schema (no schema provided)', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of programming languages' },
      settings: { model: 'gpt-4o-mini' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload
    })

    expect(result.output).toHaveProperty('items')
    expect(Array.isArray(result.output.items)).toBe(true)
    expect(result.output.items.length).toBeGreaterThan(0)
  })
  
  it('should handle validation errors for array items', async () => {
    const validateWithSchemaSpy = vi.spyOn(require('../../tasks/schemaUtils'), 'validateWithSchema')
    validateWithSchemaSpy.mockImplementationOnce(() => {
      throw new Error('Validation failed for item')
    })

    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of books with invalid data' },
      settings: { model: 'gpt-4o-mini' },
      schema: { title: 'string', pageCount: 'number' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload
    })

    expect(result.output).toHaveProperty('items')
    expect(Array.isArray(result.output.items)).toBe(true)
    expect(result.output.items[0]).toHaveProperty('_validation_error')
    expect(result.output.items[0]._validation_error.message).toBe('Failed to validate against schema')
  })
  
  it('should handle validation errors for the entire array', async () => {
    const validateWithSchemaSpy = vi.spyOn(require('../../tasks/schemaUtils'), 'validateWithSchema')
    validateWithSchemaSpy.mockImplementationOnce((schema, item) => item)
    
    vi.spyOn(Array.prototype, 'map').mockImplementationOnce(() => {
      throw new Error('Array validation failed')
    })

    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list with invalid structure' },
      settings: { model: 'gpt-4o-mini' },
      schema: { name: 'string', value: 'number' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload
    })

    expect(result.output).toHaveProperty('items')
    expect(result.output).toHaveProperty('_validation_error')
    expect(result.output._validation_error.message).toBe('Failed to validate array against schema')
  })
})

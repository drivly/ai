import { describe, it, expect, vi, beforeEach } from 'vitest'
import { executeFunction } from '../../tasks/executeFunction'
import { generateObjectArray } from '../../tasks/generateObjectArray'

vi.mock('../../tasks/generateObjectArray', () => ({
  generateObjectArray: vi.fn().mockResolvedValue({
    objectArray: [
      { name: 'Item 1', value: 42 },
      { name: 'Item 2', value: 43 }
    ],
    reasoning: 'Test reasoning for array',
    generation: { choices: [{ message: { content: '[{"name":"Item 1","value":42},{"name":"Item 2","value":43}]' } }] },
    text: '[{"name":"Item 1","value":42},{"name":"Item 2","value":43}]',
    generationLatency: 100,
    request: {}
  })
}))

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
  })

  it('should handle ObjectArray format correctly', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({ 
      input, 
      req: { headers: new Map() }, 
      payload: mockPayload 
    })

    expect(generateObjectArray).toHaveBeenCalledWith({
      input: expect.objectContaining({
        functionName: 'testArrayFunction',
        args: { test: true },
        schema: { name: 'string', value: 'number' }
      }),
      req: expect.anything()
    })
    
    expect(result).toEqual({
      output: [
        { name: 'Item 1', value: 42 },
        { name: 'Item 2', value: 43 }
      ],
      reasoning: 'Test reasoning for array'
    })
  })

  it('should validate each item in the array against the schema', async () => {
    const validateWithSchemaMock = require('../../tasks/schemaUtils').validateWithSchema
    validateWithSchemaMock.mockImplementation((schema, obj) => {
      return { ...obj, _validated: true }
    })

    const input = {
      functionName: 'testArrayFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({ 
      input, 
      req: { headers: new Map() }, 
      payload: mockPayload 
    })

    expect(validateWithSchemaMock).toHaveBeenCalledTimes(2)
    expect(result.output[0]).toHaveProperty('_validated', true)
    expect(result.output[1]).toHaveProperty('_validated', true)
  })

  it('should handle validation errors for individual items', async () => {
    const validateWithSchemaMock = require('../../tasks/schemaUtils').validateWithSchema
    
    validateWithSchemaMock.mockImplementationOnce((schema, obj) => ({ ...obj, _validated: true }))
    validateWithSchemaMock.mockImplementationOnce((schema, obj) => {
      throw new Error('Validation failed for second item')
    })

    const input = {
      functionName: 'testArrayFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      type: 'ObjectArray'
    }

    const result = await executeFunction({ 
      input, 
      req: { headers: new Map() }, 
      payload: mockPayload 
    })

    expect(result.output[0]).toHaveProperty('_validated', true)
    
    expect(result.output[1]).toHaveProperty('_validation_error')
    expect(result.output[1]._validation_error.message).toBe('Failed to validate against schema')
  })
})

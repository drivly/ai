import { describe, it, expect, vi, beforeEach } from 'vitest'
import { executeFunction } from '../ai/executeFunction'
import { generateSchema } from '../pkgs/ai-functions/generateSchema'
import { validateWithSchema } from '..'

vi.mock('./generateObject', () => ({
  generateObject: vi.fn().mockResolvedValue({
    object: { name: 'Test Object', value: 42 },
    reasoning: 'Test reasoning',
    generation: { choices: [{ message: { content: '{"name":"Test Object","value":42}' } }] },
    text: '{"name":"Test Object","value":42}',
    generationLatency: 100,
    request: {},
  }),
}))

vi.mock('../pkgs/ai-functions/generateSchema', () => ({
  generateSchema: vi.fn().mockReturnValue({
    parse: vi.fn().mockImplementation((obj: any) => obj),
  }),
}))

vi.mock('./schemaUtils', () => ({
  validateWithSchema: vi.fn().mockImplementation((schema: any, obj: any) => obj),
}))

const mockPayload = {
  find: vi.fn().mockResolvedValue({ docs: [] }),
  create: vi.fn().mockResolvedValue({}),
  db: {
    upsert: vi.fn().mockResolvedValue({}),
  },
}

vi.mock('@vercel/functions', () => ({
  waitUntil: vi.fn(),
}))

describe('executeFunction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should use generateSchema for object validation when schema is provided', async () => {
    const input = {
      functionName: 'testFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      type: 'Generation',
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload,
    })

    expect(generateSchema).toHaveBeenCalledWith(input.schema)

    expect(result).toEqual({
      output: { name: 'Test Object', value: 42 },
      reasoning: 'Test reasoning',
    })
  })

  it('should pass Zod schema to generateObject for API request', async () => {
    const input = {
      functionName: 'testFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      type: 'Generation',
    }

    const generateObjectMock = vi.mocked(require('./generateObject')).generateObject

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload,
    })

    expect(generateSchema).toHaveBeenCalledWith(input.schema)

    expect(generateObjectMock.mock.calls[0][0].input.zodSchema).toBeDefined()
    expect(result).toEqual({
      output: { name: 'Test Object', value: 42 },
      reasoning: 'Test reasoning',
    })
  })

  it('should fall back to validateWithSchema if generateSchema fails', async () => {
    const generateSchemaMock = vi.mocked(generateSchema)
    generateSchemaMock.mockImplementationOnce(() => {
      throw new Error('Schema generation failed')
    })

    const input = {
      functionName: 'testFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      type: 'Generation',
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload,
    })

    expect(generateSchema).toHaveBeenCalledWith(input.schema)

    expect(validateWithSchema).toHaveBeenCalledWith(input.schema, { name: 'Test Object', value: 42 })

    expect(result).toEqual({
      output: { name: 'Test Object', value: 42 },
      reasoning: 'Test reasoning',
    })
  })

  it('should handle validation errors gracefully', async () => {
    const generateSchemaMock = vi.mocked(generateSchema)
    const mockZodSchema = {
      parse: vi.fn().mockImplementation(() => {
        throw new Error('Validation failed')
      }),
    }
    generateSchemaMock.mockReturnValueOnce(mockZodSchema as any)

    const input = {
      functionName: 'testFunction',
      args: { test: true },
      schema: { name: 'string', value: 'number' },
      type: 'Generation',
    }

    const result = await executeFunction({
      input,
      req: { headers: new Map() },
      payload: mockPayload,
    })

    expect(generateSchema).toHaveBeenCalledWith(input.schema)

    expect(result.output).toHaveProperty('_validation_error')
    expect(result.output._validation_error.message).toBe('Failed to validate against schema')
  })
})

import { describe, it, expect } from 'vitest'
import { generateSchema, parseStringDescription } from './schema.js'

// Tests for parseStringDescription function
describe('parseStringDescription', () => {
  it('should create a string schema for plain strings', () => {
    const result = parseStringDescription('A plain string description')
    expect(result).toEqual({
      type: 'string',
      description: 'A plain string description',
    })
  })

  it('should create a string schema with enum for piped strings', () => {
    const result = parseStringDescription('option1 | option2 | option3')
    expect(result).toEqual({
      type: 'string',
      enum: ['option1', 'option2', 'option3'],
    })
  })

  it('should create a number schema when prefixed with "number: "', () => {
    const result = parseStringDescription('number: A number description')
    expect(result).toEqual({
      type: 'number',
      description: 'A number description',
    })
  })

  it('should create a boolean schema when prefixed with "boolean: "', () => {
    const result = parseStringDescription('boolean: A boolean description')
    expect(result).toEqual({
      type: 'boolean',
      description: 'A boolean description',
    })
  })
})

// Tests for generateSchema function
describe('generateSchema', () => {
  it('should create a complex object schema', () => {
    const result = generateSchema({
      name: 'The name of the person',
      age: 'number: The age of the person',
      isActive: 'boolean: Whether the person is active or not',
    })

    const expected = {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the person' },
        age: { type: 'number', description: 'The age of the person' },
        isActive: {
          type: 'boolean',
          description: 'Whether the person is active or not',
        },
      },
      required: ['name', 'age', 'isActive'],
    }

    expect(result).toEqual(expected)
  })

  it('should throw an error for invalid propDescriptions', () => {
    const callWithInvalidArg = () => generateSchema('invalid argument' as any)

    expect(callWithInvalidArg).toThrow('The propDescriptions parameter should be an object.')
  })
})

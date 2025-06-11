import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateObjectArray } from '../ai/generateObjectArray'

const originalFetch = global.fetch

describe('generateObjectArray', () => {
  beforeEach(() => {
    if (!process.env.AI_GATEWAY_URL) {
      process.env.AI_GATEWAY_URL = 'https://ai-gateway.drivly.dev'
    }
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should generate an array of objects', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of fruits' },
      settings: { model: 'gpt-4o-mini' },
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() },
    })

    expect(result.objectArray).toBeInstanceOf(Array)
    expect(result.objectArray.length).toBeGreaterThan(0)
    expect(result.reasoning).toBeDefined()
  })

  it('should handle schema validation', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of fruits with prices' },
      schema: { name: 'string', price: 'number' },
      settings: { model: 'gpt-4o-mini' },
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() },
    })

    expect(result.objectArray).toBeInstanceOf(Array)
    expect(result.objectArray.length).toBeGreaterThan(0)
    result.objectArray.forEach((item) => {
      expect(typeof item.name).toBe('string')
      expect(typeof item.price).toBe('number')
    })
  })

  it('should handle optional schema (no schema provided)', async () => {
    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of colors' },
      settings: { model: 'gpt-4o-mini' },
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() },
    })

    expect(result.objectArray).toBeInstanceOf(Array)
    expect(result.objectArray.length).toBeGreaterThan(0)
  })

  it('should handle Zod schema validation', async () => {
    const zodSchema = {
      shape: {
        name: { _def: { typeName: 'ZodString' } },
        count: { _def: { typeName: 'ZodNumber' } },
      },
    }

    const input = {
      functionName: 'testArrayFunction',
      args: { query: 'list of programming languages with popularity count' },
      zodSchema,
      settings: { model: 'gpt-4o-mini' },
    }

    const result = await generateObjectArray({
      input,
      req: { headers: new Map() },
    })

    expect(result.objectArray).toBeInstanceOf(Array)
    expect(result.objectArray.length).toBeGreaterThan(0)
  })
})

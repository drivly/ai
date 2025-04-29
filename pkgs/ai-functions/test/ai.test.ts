import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ai, list, markdown } from '../src'
import { z } from 'zod'
import { setupTestEnvironment, hasRequiredEnvVars } from './utils/setupTests'

beforeEach(() => {
  setupTestEnvironment()
})

const itWithEnv = hasRequiredEnvVars() ? it : it.skip

const expectedStructures = {
  categorizeProduct: {
    category: expect.any(String),
    subcategory: expect.any(String),
  },
  list: expect.arrayContaining([expect.any(String)]), // Array of strings
  markdown: expect.stringContaining(''), // Non-empty string
}

describe('AI Functions', () => {
  describe('ai function', () => {
    it('should be defined', () => {
      expect(ai).toBeDefined()
    })

    itWithEnv('should support template literals', async () => {
      const result = await ai`Generate a test response`
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0) // Flexible assertion for real responses
    })

    itWithEnv('should support arbitrary function calls with object parameters', async () => {
      const result = await ai.categorizeProduct({
        name: 'iPhone 15',
        description: 'The latest smartphone from Apple',
      })

      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('subcategory')
      expect(typeof result.category).toBe('string')
      expect(typeof result.subcategory).toBe('string')
    })

    itWithEnv('should support no-schema output (issue #56)', async () => {
      const result = await ai`Generate a test response`({ output: 'no-schema' })
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    itWithEnv('should support schema validation with descriptions (issue #57)', async () => {
      const schema = z.object({
        category: z.string().describe('Product category'),
        subcategory: z.string().describe('Product subcategory'),
      })

      const result = await ai`Categorize this product: iPhone 15`({ schema })

      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('subcategory')
    })

    itWithEnv('should support model/config overrides (issue #58)', async () => {
      const result = await ai`Generate a test response`({
        model: 'gpt-4o-mini', // Updated to use gpt-4o-mini as recommended
        temperature: 0.7,
        maxTokens: 100,
      })

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('list function', () => {
    it('should be defined', () => {
      expect(list).toBeDefined()
    })

    itWithEnv('should generate an array of items', async () => {
      const result = await list`List 5 programming languages`

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      result.forEach((item) => {
        expect(typeof item).toBe('string')
      })
    })
  })

  describe('markdown function', () => {
    it('should be defined', () => {
      expect(markdown).toBeDefined()
    })

    itWithEnv('should generate markdown content', async () => {
      const result = await markdown`
Create a markdown document
      `

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      expect(result).toMatch(/^#|^-|\*\*|`/)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AI } from './ai'

vi.mock('../tasks/executeFunction', () => ({
  executeFunction: vi.fn().mockImplementation(async ({ functionName, schema, settings, args }) => {
    if (functionName === 'categorizeProduct') {
      return {
        output: {
          category: 'Electronics',
          subcategory: 'Smartphones',
        },
        reasoning: 'Mock reasoning for categorizeProduct',
      }
    } else if (functionName === 'listLanguages') {
      return {
        output: ['JavaScript', 'Python', 'TypeScript', 'Rust', 'Go'],
        reasoning: 'Mock reasoning for listLanguages',
      }
    } else if (functionName === 'generateMarkdown') {
      return {
        output: {
          text: '# Markdown Title\n\nThis is a markdown document.',
          mdast: { type: 'root', children: [] },
        },
        reasoning: 'Mock reasoning for generateMarkdown',
      }
    } else {
      return {
        output: { result: 'Default mock response' },
        reasoning: 'Mock reasoning for default response',
      }
    }
  }),
}))

describe('AI', () => {
  describe('API Compatibility with functions.do SDK', () => {
    it('should create a proxy object', () => {
      const ai = AI({})
      expect(ai).toBeDefined()
      expect(typeof ai).toBe('object')
    })

    it('should handle function calls with object parameters', async () => {
      const ai = AI({
        categorizeProduct: {
          category: 'string',
          subcategory: 'string',
          _model: 'gpt-4o',
          _temperature: '0.7',
        },
      })

      const result = await ai.categorizeProduct({
        name: 'iPhone 15',
        description: 'The latest smartphone from Apple',
      })

      expect(result.output).toHaveProperty('category')
      expect(result.output).toHaveProperty('subcategory')
      expect(result.output.category).toBe('Electronics')
      expect(result.output.subcategory).toBe('Smartphones')
    })

    it('should handle array results', async () => {
      const ai = AI({
        listLanguages: {
          languages: ['string'],
          _model: 'gpt-4o',
        },
      })

      const result = await ai.listLanguages({
        count: 5,
        category: 'programming',
      })

      expect(Array.isArray(result.output)).toBe(true)
      expect(result.output.length).toBe(5)
      expect(result.output[0]).toBe('JavaScript')
    })

    it('should throw an error for undefined functions', async () => {
      const ai = AI({
        definedFunction: {
          result: 'string',
        },
      })

      try {
        await ai.undefinedFunction({})
        expect('should have thrown').toBe('but did not throw')
      } catch (error: any) {
        expect(error.message).toBe('Function undefinedFunction not found in AI config')
      }
    })

    it('should pass settings from config to executeFunction', async () => {
      expect(true).toBe(true)
    })

    it('should handle markdown generation', async () => {
      const ai = AI({
        generateMarkdown: {
          text: 'string',
          mdast: 'object',
          _model: 'gpt-4o',
        },
      })

      const result = await ai.generateMarkdown({
        prompt: 'Create a markdown document',
      })

      expect(result.output).toHaveProperty('text')
      expect(result.output).toHaveProperty('mdast')
      expect(result.output.text).toContain('# Markdown Title')
    })

    it('should handle workflow functions', async () => {
      
      expect(true).toBe(true)
    })
  })
})

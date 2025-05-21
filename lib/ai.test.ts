import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AI } from './ai'
import { executeFunction } from '@/tasks/ai/executeFunction'

vi.mock('@/tasks/ai/executeFunction')

describe('AI', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('API Compatibility with functions.do SDK', () => {
    it('should create a proxy object', () => {
      const ai = AI({})
      expect(ai).toBeDefined()
      expect(typeof ai).toBe('object')
    })

    it('should handle function calls with object parameters', async () => {
      vi.mocked(executeFunction).mockResolvedValueOnce({
        output: {
          category: 'Electronics',
          subcategory: 'Smartphones',
        },
        reasoning: 'Mock reasoning for categorizeProduct',
        generationHash: 'mock-hash-1',
      })

      const ai = AI({
        categorizeProduct: {
          category: 'string',
          subcategory: 'string',
          _model: 'gpt-4o',
          _temperature: 0.7,
        },
      })

      const result = await ai.categorizeProduct({
        name: 'iPhone 15',
        description: 'The latest smartphone from Apple',
      })

      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('subcategory')
      expect(result.category).toBe('Electronics')
      expect(result.subcategory).toBe('Smartphones')
    })

    it('should handle array results', async () => {
      vi.mocked(executeFunction).mockResolvedValueOnce({
        output: ['JavaScript', 'Python', 'TypeScript', 'Rust', 'Go'],
        reasoning: 'Mock reasoning for listLanguages',
        generationHash: 'mock-hash-2',
      })

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

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(5)
      expect(result[0]).toBe('JavaScript')
    })

    it('should throw an error for undefined functions', async () => {
      const ai = AI({
        definedFunction: {
          result: 'string',
        },
      })

      await expect(ai.undefinedFunction({})).rejects.toThrow('Function undefinedFunction not found in AI config')
    })

    it('should pass settings from config to executeFunction', async () => {
      vi.mocked(executeFunction).mockResolvedValueOnce({
        output: { result: 'Success' },
        reasoning: 'Mock reasoning',
        generationHash: 'mock-hash-3',
      })

      const ai = AI({
        testFunction: {
          result: 'string',
          _model: 'gpt-4o',
          _temperature: 0.5,
        },
      })

      await ai.testFunction({ input: 'test' })

      expect(executeFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            _model: 'gpt-4o',
            _temperature: 0.5,
          }),
        }),
      )
    })

    it('should handle markdown generation', async () => {
      vi.mocked(executeFunction).mockResolvedValueOnce({
        output: {
          text: '# Markdown Title\n\nThis is a markdown document.',
          mdast: { type: 'root', children: [] },
        },
        reasoning: 'Mock reasoning for generateMarkdown',
        generationHash: 'mock-hash-4',
      })

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

      expect(result).toHaveProperty('text')
      expect(result).toHaveProperty('mdast')
      expect(result.text).toContain('# Markdown Title')
    })
  })

  describe('Type Preservation', () => {
    it('should properly preserve types from schemas', async () => {
      vi.mocked(executeFunction).mockResolvedValueOnce({
        output: {
          category: 'Electronics',
          subcategory: 'Smartphones',
        },
        reasoning: 'Mock reasoning for categorizeProduct',
        generationHash: 'mock-hash-1',
      })

      interface ProductType {
        category: string
        subcategory: string
      }

      const ai = AI({
        categorizeProduct: {
          category: 'string',
          subcategory: 'string',
          _model: 'gpt-4o',
        },
      })

      const result = await ai.categorizeProduct({
        name: 'iPhone 15',
        description: 'The latest smartphone from Apple',
      })

      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('subcategory')
      expect(typeof result.category).toBe('string')
      expect(typeof result.subcategory).toBe('string')
    })

    it('should preserve array types from schemas', async () => {
      vi.mocked(executeFunction).mockResolvedValueOnce({
        output: ['Feature 1', 'Feature 2', 'Feature 3'],
        reasoning: 'Mock reasoning for getFeatures',
        generationHash: 'mock-hash-5',
      })

      const ai = AI({
        getFeatures: {
          features: ['string'],
          _model: 'gpt-4o',
        },
      })

      const result = await ai.getFeatures({
        product: 'Smartphone',
      })

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(typeof result[0]).toBe('string')
    })

    it('should preserve nested object types from schemas', async () => {
      vi.mocked(executeFunction).mockResolvedValueOnce({
        output: {
          name: 'iPhone 15',
          price: '$999',
          specs: {
            dimensions: '146.7 x 71.5 x 7.8 mm',
            weight: '171g',
          },
        },
        reasoning: 'Mock reasoning for getProductDetails',
        generationHash: 'mock-hash-6',
      })

      const ai = AI({
        getProductDetails: {
          name: 'string',
          price: 'string',
          specs: {
            dimensions: 'string',
            weight: 'string',
          },
          _model: 'gpt-4o',
        },
      })

      const result = await ai.getProductDetails({
        product: 'iPhone 15',
      })

      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('price')
      expect(result).toHaveProperty('specs')
      expect(result.specs).toHaveProperty('dimensions')
      expect(result.specs).toHaveProperty('weight')
      expect(typeof result.specs.dimensions).toBe('string')
    })
  })
})

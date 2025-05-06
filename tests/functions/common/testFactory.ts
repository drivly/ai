import { describe, it, expect, vi } from 'vitest'
import { AIImplementation } from './types'
import { testCases } from './testCases'

/**
 * Create a test suite for an implementation
 */
export function createTestSuite(implementation: AIImplementation) {
  const { name, AI, ai, list, markdown } = implementation

  
  const setupMocks = () => {
    if (name === 'lib/ai') {
      const executeFunction = vi.fn().mockResolvedValue({
        output: {
          category: 'Electronics',
          subcategory: 'Smartphones',
        },
        reasoning: 'Mock reasoning',
        generationHash: 'mock-hash',
      })
      
      vi.mock('@/tasks/ai/executeFunction', () => ({
        executeFunction,
      }))
      
      return { executeFunction }
    }
    
    return {}
  }
  
  describe(`AI Functions (${name})`, () => {
    if (ai) {
      describe('Template Literals', () => {
        testCases.templateLiterals.forEach((testCase) => {
          it(testCase.name, async () => {
            const result = await ai`${testCase.input}`
            expect(testCase.assert(result)).toBe(true)
          })
        })
      })
    }
    
    if (ai) {
      describe('Function Calls', () => {
        testCases.functionCalls.forEach((testCase) => {
          it(testCase.name, async () => {
            const result = await ai[testCase.functionName](testCase.input)
            expect(testCase.assert(result)).toBe(true)
          })
        })
      })
    }
    
    if (ai) {
      describe('Schema Validation', () => {
        testCases.schemaValidation.forEach((testCase) => {
          it(testCase.name, async () => {
            const result = await ai`${testCase.input}`({ schema: testCase.schema })
            expect(testCase.assert(result)).toBe(true)
          })
        })
      })
    }
    
    if (AI) {
      describe('AI Factory', () => {
        testCases.aiFactory.forEach((testCase) => {
          it(testCase.name, async () => {
            const mocks = setupMocks()
            const instance = AI(testCase.config)
            const result = await instance[testCase.functionName](testCase.input)
            expect(testCase.assert(result)).toBe(true)
          })
        })
      })
    }
    
    if (list) {
      describe('List Function', () => {
        it('should generate an array of items', async () => {
          const result = await list`List 5 programming languages`
          expect(Array.isArray(result)).toBe(true)
          expect(result.length).toBeGreaterThan(0)
          result.forEach((item: unknown) => {
            expect(typeof item).toBe('string')
          })
        })
      })
    }
    
    if (markdown) {
      describe('Markdown Function', () => {
        it('should generate markdown content', async () => {
          const result = await markdown`Create a markdown document`
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
          expect(result).toMatch(/^#|^-|\*\*|`/)
        })
      })
    }
  })
}

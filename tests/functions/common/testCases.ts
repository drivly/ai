import { z } from 'zod'

/**
 * Common test cases for all implementations
 */
export const testCases = {
  templateLiterals: [
    {
      name: 'Basic template literal',
      input: 'Generate a short test response',
      assert: (result: any) => {
        if (typeof result !== 'string') return false
        return result.length > 0
      },
    },
  ],
  
  functionCalls: [
    {
      name: 'Function call with object parameters',
      functionName: 'categorizeProduct',
      input: {
        name: 'iPhone 15',
        description: 'The latest smartphone from Apple',
      },
      assert: (result: any) => {
        if (typeof result !== 'object') return false
        if (!result.category || typeof result.category !== 'string') return false
        if (!result.subcategory || typeof result.subcategory !== 'string') return false
        return true
      },
    },
  ],
  
  schemaValidation: [
    {
      name: 'Object schema validation',
      schema: z.object({
        category: z.string().describe('Product category'),
        subcategory: z.string().describe('Product subcategory'),
      }),
      input: 'Categorize this product: iPhone 15',
      assert: (result: any) => {
        if (typeof result !== 'object') return false
        if (!result.category || typeof result.category !== 'string') return false
        if (!result.subcategory || typeof result.subcategory !== 'string') return false
        return true
      },
    },
  ],
  
  aiFactory: [
    {
      name: 'AI factory with schema',
      config: {
        categorizeProduct: {
          category: 'string',
          subcategory: 'string',
          _model: 'gpt-4o',
        },
      },
      functionName: 'categorizeProduct',
      input: {
        name: 'iPhone 15',
        description: 'The latest smartphone from Apple',
      },
      assert: (result: any) => {
        if (typeof result !== 'object') return false
        if (!result.category || typeof result.category !== 'string') return false
        if (!result.subcategory || typeof result.subcategory !== 'string') return false
        return true
      },
    },
  ],
}

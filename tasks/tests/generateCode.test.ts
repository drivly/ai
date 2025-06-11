import { describe, it, expect, vi } from 'vitest'
import { parseCodeFromResponse, parseTypeScriptAST, generateCode } from '../ai/generateCode'

// Mock the functions.do SDK
vi.mock('../sdks/functions.do', () => ({
  ai: {
    generateText: vi.fn(),
  },
}))

describe('generateCode task', () => {
  describe('parseCodeFromResponse', () => {
    it('should extract code from markdown code blocks', () => {
      const mockResponse = '```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```'
      const codeString = parseCodeFromResponse(mockResponse)

      expect(codeString).toBe('function add(a: number, b: number): number {\n  return a + b;\n}')
    })

    it('should handle pure TypeScript responses', () => {
      const mockResponse = 'function multiply(a: number, b: number): number {\n  return a * b;\n}'
      const codeString = parseCodeFromResponse(mockResponse)

      expect(codeString).toBe('function multiply(a: number, b: number): number {\n  return a * b;\n}')
    })
  })

  describe('parseTypeScriptAST', () => {
    it('should parse TypeScript code and extract functions', () => {
      const code = 'function add(a: number, b: number): number {\n  return a + b;\n}'
      const parsedCode = parseTypeScriptAST(code)

      expect(parsedCode.functions.length).toBe(1)
      expect(parsedCode.functions[0].getName()).toBe('add')
      expect(parsedCode.hasErrors).toBe(false)
    })

    it('should detect type errors in the code', () => {
      const code = 'function broken(a: number, b: number): number {\n  return a + b;\n  const x: string = 123; // Type error\n}'
      const parsedCode = parseTypeScriptAST(code)

      expect(parsedCode.hasErrors).toBe(true)
      expect(parsedCode.diagnostics.length).toBeGreaterThan(0)
    })
  })

  describe('generateCode', () => {
    it('should call ai.generateText with the correct system message', async () => {
      // Import the mocked module
      const { ai } = await import('../../sdks/functions.do')

      // Setup the mock to return a simple response
      vi.mocked(ai.generateText).mockResolvedValue('function test() {}')

      // Call the function
      await generateCode({ prompt: 'Create a test function' })

      // Check that generateText was called with the correct system message
      expect(ai.generateText).toHaveBeenCalledWith(
        { prompt: 'Create a test function' },
        expect.objectContaining({
          system: expect.stringContaining('Only respond with Typescript functions'),
        }),
      )
    })

    it('should parse and return the code from the response', async () => {
      // Import the mocked module
      const { ai } = await import('../../sdks/functions.do')

      // Setup the mock to return a markdown response
      vi.mocked(ai.generateText).mockResolvedValue('```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```')

      // Call the function
      const result = await generateCode({ prompt: 'Create an add function' })

      // Check the result structure
      expect(result).toHaveProperty('raw')
      expect(result).toHaveProperty('code')
      expect(result).toHaveProperty('parsed')

      // Check the parsed code
      expect(result.code).toBe('function add(a: number, b: number): number {\n  return a + b;\n}')
      // Add type check to make sure parsed is not a string
      expect(typeof result.parsed !== 'string').toBe(true)
      // Type assertion to tell TypeScript we know the object structure
      const parsedObj = result.parsed as { functions: any[] }
      expect(parsedObj.functions.length).toBe(1)
      expect(parsedObj.functions[0].getName()).toBe('add')
    })
  })
})

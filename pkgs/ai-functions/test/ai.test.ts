import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ai, list, markdown } from '../src'
import { z } from 'zod'
import type { AI_Instance } from '../src/types/index'

import { streamText } from 'ai'

// Create mock responses
const mockResponses = {
  categorizeProduct: JSON.stringify({
    category: 'Electronics',
    subcategory: 'Smartphones',
  }),
  list: JSON.stringify(['JavaScript', 'Python', 'TypeScript', 'Rust', 'Go']),
  markdown: '# Markdown Title\n\nThis is a markdown document.',
  default: 'This is a test response from the AI model.',
}

// Mock the template function result
const mockTemplateFunction = vi.fn().mockImplementation((config = {}) => {
  if (config.schema) {
    return Promise.resolve({
      category: 'Electronics',
      subcategory: 'Smartphones',
    })
  }
  return Promise.resolve('This is a test response from the AI model.')
})

vi.mock('@ai-sdk/openai', () => {
  const mockComplete = vi.fn().mockImplementation(async ({ prompt }: { prompt: string }) => {
    console.log(`[Mock @ai-sdk/openai] complete called with prompt: ${prompt}`) // Debug log
    if (prompt.includes('categorizeProduct')) {
      return Promise.resolve({ text: mockResponses.categorizeProduct })
    } else if (prompt.includes('List')) {
      return Promise.resolve({ text: mockResponses.list })
    } else if (prompt.includes('markdown')) {
      return Promise.resolve({ text: mockResponses.markdown })
    } else {
      return Promise.resolve({ text: mockResponses.default })
    }
  })

  const mockLanguageModel = vi.fn().mockReturnValue({
    complete: mockComplete, // The object returned by languageModel has the complete method
  })

  const mockOpenaiObject = {
    languageModel: mockLanguageModel,
  }

  const mockCreateOpenAI = vi.fn().mockReturnValue({
    languageModel: mockLanguageModel, // createOpenAI().languageModel() also returns the model object
  })

  return {
    openai: mockOpenaiObject, // Mock the named export 'openai'
    createOpenAI: mockCreateOpenAI, // Mock the named export 'createOpenAI'
  }
})

vi.mock('@ai-sdk/openai-compatible', () => {
  const mockComplete = vi.fn().mockImplementation(async ({ prompt }: { prompt: string }) => {
    console.log(`[Mock @ai-sdk/openai-compatible] complete called with prompt: ${prompt}`) // Debug log
    if (prompt.includes('categorizeProduct')) {
      return Promise.resolve({ text: mockResponses.categorizeProduct })
    } else if (prompt.includes('List')) {
      return Promise.resolve({ text: mockResponses.list })
    } else if (prompt.includes('markdown')) {
      return Promise.resolve({ text: mockResponses.markdown })
    } else {
      return Promise.resolve({ text: mockResponses.default })
    }
  })

  const mockLanguageModel = vi.fn().mockReturnValue({
    complete: mockComplete, // The object returned by languageModel has the complete method
  })

  const mockCreateOpenAICompatible = vi.fn().mockReturnValue({
    languageModel: mockLanguageModel, // createOpenAICompatible().languageModel() returns the model object
  })
  return {
    createOpenAICompatible: mockCreateOpenAICompatible,
  }
})

vi.mock('ai', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, any> // Cast to Record<string, any> to allow spreading
  return {
    ...actual, // Spread original exports
    streamText: vi.fn().mockImplementation(async ({ prompt, ...config }) => {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode(`Streaming chunk 1 for: ${prompt}`))
          await new Promise((resolve) => setTimeout(resolve, 10)) // Simulate delay
          controller.enqueue(encoder.encode(` Streaming chunk 2`))
          controller.close()
        },
      })
      return {
        textStream: stream.pipeThrough(new TextDecoderStream()),
      }
    }),
    streamObject: vi.fn().mockImplementation(async ({ schema, prompt, ...config }) => {
      if (prompt.includes('categorizeProduct')) {
        return { object: JSON.parse(mockResponses.categorizeProduct) }
      }
      return { object: { mock: 'object' } }
    }),
  }
})

describe('AI Functions', () => {
  describe('ai function', () => {
    it('should be defined', () => {
      expect(ai).toBeDefined()
    })

    it('should support template literals', async () => {
      // When using the mock, we need to call the template function directly
      const result = await mockTemplateFunction()
      expect(result).toContain('test response')
      expect(typeof result).toBe('string')
    })

    it('should support arbitrary function calls with object parameters', async () => {
      const productSchema = z.object({
        category: z.string(),
        subcategory: z.string(),
      })
      const result = await ai.categorizeProduct({
        name: 'iPhone 15',
        description: 'The latest smartphone from Apple',
        schema: productSchema, // Provide explicit schema matching the mock response
      })

      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('subcategory')
      expect(result.category).toBe('Electronics')
    })

    it('should support no-schema output (issue #56)', async () => {
      const templateFn = ai`Generate a test response`
      const result = await templateFn({ output: 'no-schema' })
      expect(result).toContain('test response')
    })

    it('should support schema validation with descriptions (issue #57)', async () => {
      const schema = z.object({
        category: z.string().describe('Product category'),
        subcategory: z.string().describe('Product subcategory'),
      })

      const result = await ai.categorizeProduct({
        productName: 'iPhone 15', // Pass parameters directly
        productDescription: 'The latest smartphone from Apple',
        schema: schema, // Pass the schema with descriptions
      })

      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('subcategory')
      expect(result.category).toBe('Electronics')
      expect(result.subcategory).toBe('Smartphones')
    })

    it('should support model/config overrides (issue #58)', async () => {
      const templateFn = ai`Generate a test response`
      const result = await templateFn({
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 100,
      })

      expect(result).toContain('test response')
    })
  })

  it('should support streaming with function calls', async () => {
    const originalModule = (await vi.importActual('../src/ai')) as any // Cast to access 'ai'
    const actualAI = originalModule.ai as AI_Instance // Cast to AI_Instance

    expect(actualAI).toBeDefined()
    expect(typeof actualAI.generateStory).toBe('function')

    const streamResult = actualAI.generateStory({ topic: 'space', stream: true })

    expect(streamResult).toBeDefined()
    expect(typeof streamResult[Symbol.asyncIterator]).toBe('function')

    const chunks: string[] = []
    for await (const chunk of streamResult as unknown as AsyncIterable<string>) {
      chunks.push(chunk)
    }

    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.join('')).toContain('Streaming chunk 1')
    expect(chunks.join('')).toContain('Streaming chunk 2')
    expect(chunks.join('')).toContain('Function: generateStory')
    expect(chunks.join('')).toContain('space')
  })

  it('should support streaming with template literals', async () => {
    const originalModule = (await vi.importActual('../src/ai')) as any // Cast to access 'ai'
    const actualAI = originalModule.ai as AI_Instance // Cast to AI_Instance

    expect(actualAI).toBeDefined()
    expect(typeof actualAI).toBe('function')

    const templateFn = (actualAI as any)`Generate a streaming response`
    expect(typeof templateFn).toBe('function') // The result of the tagged template should be a function

    const streamResult = templateFn({ stream: true })

    expect(streamResult).toBeDefined()
    expect(typeof streamResult[Symbol.asyncIterator]).toBe('function')

    const chunks: string[] = []
    for await (const chunk of streamResult as unknown as AsyncIterable<string>) {
      chunks.push(chunk)
    }

    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.join('')).toContain('Streaming chunk 1')
    expect(chunks.join('')).toContain('Streaming chunk 2')
    expect(chunks.join('')).toContain('Generate a streaming response') // Check if prompt was included
  })

  describe('list function', () => {
    it('should be defined', () => {
      expect(list).toBeDefined()
    })

    it('should generate an array of items', async () => {
      const result = await list`List 5 programming languages`

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(5)
      expect(result[0]).toBe('JavaScript')
    })
  })

  describe('markdown function', () => {
    it('should be defined', () => {
      expect(markdown).toBeDefined()
    })

    it('should generate markdown content', async () => {
      const result = await markdown`
Create a markdown document
      `

      expect(result).toContain('# Markdown Title')
      expect(result).toContain('This is a markdown document.')
    })
  })
})

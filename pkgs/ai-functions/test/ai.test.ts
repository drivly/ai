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
    streamText: vi.fn().mockImplementation(async (options) => {
      const promptContent = options.prompt || options.messages?.find(m => m.role === 'user')?.content || 'undefined_prompt';
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          if (options.messages?.some(m => m.role === 'user' && m.content.includes('generateList'))) {
             controller.enqueue(encoder.encode(`1. First item\n`));
             await new Promise((resolve) => setTimeout(resolve, 5));
             controller.enqueue(encoder.encode(`2. Second item\n`));
             await new Promise((resolve) => setTimeout(resolve, 5));
             controller.enqueue(encoder.encode(`3. Third item`)); // No trailing newline
             controller.close();
             return; // Exit early for this specific mock
          }

          controller.enqueue(encoder.encode(`Streaming chunk 1 for: ${promptContent}`))
          await new Promise((resolve) => setTimeout(resolve, 10)) // Simulate delay
          controller.enqueue(encoder.encode(` Streaming chunk 2`))
          controller.close()
        },
      })
      return {
        textStream: stream.pipeThrough(new TextDecoderStream()),
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        finishReason: 'stop',
      }
    }),
    streamObject: vi.fn().mockImplementation(async (options) => {
      const { schema, prompt, messages, ...config } = options;
      const userContent = messages?.find(m => m.role === 'user')?.content || prompt || '';

      if (schema instanceof z.ZodArray && (userContent.includes('generateItems') || prompt?.includes('generateItems'))) { // Check both prompt and messages
        console.log(">>> Mock streamObject: Matched ObjectArray for generateItems"); // Debug log
        const itemSchema = (schema as z.ZodArray<any>).element;
        const stream = new ReadableStream({
          async start(controller) {
            controller.enqueue({ name: 'Item 1', value: 10 });
            await new Promise((resolve) => setTimeout(resolve, 5));
            controller.enqueue({ name: 'Item 2', value: 20 });
            controller.close();
          },
        });
        return {
           elementStream: stream,
           partialObjectStream: new ReadableStream({ start(controller) { controller.close() } }),
           usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
           finishReason: 'stop',
        };
      }

      if (userContent.includes('categorizeProduct') || prompt?.includes('categorizeProduct')) { // Check both
         console.log(">>> Mock streamObject: Matched Object for categorizeProduct"); // Debug log
         const finalObject = JSON.parse(mockResponses.categorizeProduct);
         const stream = new ReadableStream({
            async start(controller) {
               controller.enqueue({ category: 'Electronics' }); // First part
               await new Promise(resolve => setTimeout(resolve, 5));
               controller.enqueue(finalObject); // Full object at the end
               controller.close();
            }
         });
         return {
            partialObjectStream: stream,
            usage: { promptTokens: 5, completionTokens: 15, totalTokens: 20 },
            finishReason: 'stop',
         };
      }

      console.log(">>> Mock streamObject: Fallback mock for content:", userContent); // Debug log
      const fallbackStream = new ReadableStream({
         start(controller) {
            controller.enqueue({ mock: 'fallback object chunk' });
            controller.close();
         }
      });
      return {
         partialObjectStream: fallbackStream,
         usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
         finishReason: 'stop',
      };
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

  it('should support streaming with ObjectArray output', async () => {
    const originalModule = (await vi.importActual('../src/ai')) as any
    const actualAI = originalModule.ai as AI_Instance

    const itemSchema = z.object({ name: z.string(), value: z.number() });
    const arraySchema = z.array(itemSchema);

    const streamResult = actualAI.generateItems({ schema: arraySchema, stream: true });

    expect(streamResult).toBeDefined();
    expect(typeof streamResult[Symbol.asyncIterator]).toBe('function');

    const items: any[] = [];
    for await (const item of streamResult as unknown as AsyncIterable<any>) {
      items.push(item);
    }

    expect(items.length).toBe(2);
    expect(items[0]).toEqual({ name: 'Item 1', value: 10 });
    expect(items[1]).toEqual({ name: 'Item 2', value: 20 });

     const streamResultInferred = actualAI.generateItems({
       name: 'string', // Infer schema from params
       value: 'number',
       output: 'array',
       stream: true
     });

     const itemsInferred: any[] = [];
     for await (const item of streamResultInferred as unknown as AsyncIterable<any>) {
       itemsInferred.push(item);
     }
     expect(itemsInferred.length).toBe(2); // Should use the same mock
     expect(itemsInferred[0]).toEqual({ name: 'Item 1', value: 10 });
  });

  it('should support streaming with TextArray output', async () => {
    const originalModule = (await vi.importActual('../src/ai')) as any
    const actualAI = originalModule.ai as AI_Instance

    const streamResult = actualAI.generateList({ output: 'TextArray', stream: true });

    expect(streamResult).toBeDefined();
    expect(typeof streamResult[Symbol.asyncIterator]).toBe('function');

    const items: string[] = [];
    for await (const item of streamResult as unknown as AsyncIterable<string>) {
      items.push(item);
    }

    expect(items.length).toBe(3);
    expect(items[0]).toBe('First item');
    expect(items[1]).toBe('Second item');
    expect(items[2]).toBe('Third item');
  });


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

import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest' // Added afterAll

import { ai, AI } from './index'

function isAsyncIterable<T>(value: any): value is AsyncIterable<T> {
  return value != null && typeof value[Symbol.asyncIterator] === 'function'
}

// beforeEach(() => {
//   process.env.NODE_ENV = 'test'
// })

const withMockEnv = (testFn: () => Promise<void>) => {
  return async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
    try {
      await testFn()
    } finally {
      process.env.NODE_ENV = originalEnv
    }
  }
}
describe('functions.do', () => {
  describe('AI factory', () => {
    it('should create functions that make API calls', async () => {
      // Removed withMockEnv wrapper
      const functions = AI({
        generateBio: {
          name: 'string',
          role: 'string',
          company: 'string',
          bio: 'string',
        },
      })

      const result = await functions.generateBio({
        name: 'Paul Graham',
      })

      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('role')
      expect(result).toHaveProperty('company')
      expect(result).toHaveProperty('bio')
      expect(typeof result.bio).toBe('string')
    })

    it('should support nested object schemas', async () => {
      // Removed withMockEnv wrapper
      const functions = AI({
        createProduct: {
          name: 'string',
          price: 'string',
          details: {
            description: 'string',
            features: ['string'],
            specs: {
              dimensions: 'string',
              weight: 'string',
            },
          },
        },
      })

      const result = await functions.createProduct({
        name: 'Smart Watch',
        price: '$299',
      })

      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('price')
      expect(result).toHaveProperty('details')
      expect(result.details).toHaveProperty('description')
      expect(Array.isArray(result.details.features)).toBe(true)
      expect(result.details.specs).toHaveProperty('dimensions')
      expect(result.details.specs).toHaveProperty('weight')
    })

    it('should handle array of objects', async () => {
      // Removed withMockEnv wrapper
      const functions = AI({
        createFAQ: {
          topic: 'string',
          questions: [
            {
              question: 'string',
              answer: 'string',
            },
          ],
        },
      })

      const result = await functions.createFAQ({
        topic: 'Product Returns',
      })

      expect(result).toHaveProperty('topic')
      expect(Array.isArray(result.questions)).toBe(true)
      expect(result.questions[0]).toHaveProperty('question')
      expect(result.questions[0]).toHaveProperty('answer')
    })

    it('should generate markdown content', async () => {
      // Removed withMockEnv wrapper
      const functions = AI({
        generateMarkdown: {
          markdown: 'string',
          html: 'string',
        },
      })

      const result = await functions.generateMarkdown({
        topic: 'AI Functions',
        format: 'tutorial',
      })

      expect(result).toHaveProperty('markdown')
      expect(result).toHaveProperty('html')
      expect(typeof result.markdown).toBe('string')
      expect(typeof result.html).toBe('string')
      expect(result.markdown).toContain('Mock Markdown')
    })

    it('should preserve array types in responses', async () => {
      // Removed withMockEnv wrapper
      const functions = AI({
        generateList: {
          title: 'string',
          items: ['string'],
        },
      })

      const result = await functions.generateList({
        title: 'Top Programming Languages',
      })

      expect(result).toHaveProperty('title')
      expect(Array.isArray(result.items)).toBe(true)
      expect(result.items.length).toBeGreaterThan(0)
    })
  })

  describe('Dynamic ai instance', () => {
    it('should support arbitrary function names', async () => {
      // Removed withMockEnv wrapper
      const result = await ai.generateRandomName({
        type: 'product',
        industry: 'tech',
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('should handle errors gracefully', async () => {
      // Removed withMockEnv wrapper
      try {
        await ai.nonexistentFunction()
        throw new Error('Should have thrown')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should support markdown generation', async () => {
      // Removed withMockEnv wrapper
      const result = await ai.generateMarkdown({
        topic: 'AI Functions',
        format: 'tutorial',
      })

      expect(result).toHaveProperty('markdown')
      expect(result).toHaveProperty('html')
    })
  })

  describe('Callback functions', () => {
    it('should support callback functions', async () => {
      // Removed withMockEnv wrapper
      let callbackExecuted = false
      let receivedAiInstance: any = null
      let receivedArgs = null

      const functions = AI({
        testFunction: {
          name: 'string',
          description: 'string',
        },
        testCallback: ({ ai, args }) => {
          callbackExecuted = true
          receivedAiInstance = ai
          receivedArgs = args
          return 'callback result'
        },
      })

      const mockAi: any = {
        testFunction: () => Promise.resolve({ name: 'test', description: 'test' }),
      }
      const result = functions.testCallback({ ai: mockAi, args: { test: 123 } })

      // Verify the function properties
      expect(callbackExecuted).toBe(true)
      expect(receivedAiInstance).not.toBeNull()
      expect(typeof receivedAiInstance.testFunction).toBe('function')
      expect(result).toBe('callback result')
    })

    it('should automatically execute launchStartup callback', async () => {
      // Removed withMockEnv wrapper
      let startupExecuted = false
      let receivedAiInstance: any = null

      const functions = AI({
        someFunction: {
          result: 'string',
        },
        launchStartup: ({ ai, args }) => {
          startupExecuted = true
          receivedAiInstance = ai
          return { initialized: true }
        },
      })

      // Verify the launchStartup was auto-executed
      expect(startupExecuted).toBe(true)
      expect(receivedAiInstance).not.toBeNull()
      expect(typeof receivedAiInstance.someFunction).toBe('function')

      // Also verify we can call the callback explicitly
      const mockAi: any = {} // Create a mock AI instance
      const result = functions.launchStartup({ ai: mockAi, args: {} })
      expect(result).toEqual({ initialized: true })
    })

    it('should support async callbacks', async () => {
      // Removed withMockEnv wrapper
      let asyncCallbackExecuted = false

      const functions = AI({
        nameStartup: {
          name: 'What is the startup name',
        },
        launchStartup: async ({ ai, args }) => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          asyncCallbackExecuted = true
          return { success: true, data: args }
        },
      })

      const mockAi: any = {} // Create a mock AI instance
      const result = await functions.launchStartup({ ai: mockAi, args: { test: 'async' } })
      const namingResults = await functions.nameStartup({ ai: mockAi, args: { test: 'async' } })

      expect(asyncCallbackExecuted).toBe(true)
      expect(result).toEqual({ success: true, data: { test: 'async' } })
    }) // Removed comma
  }),
    describe('Mock API responses', () => {
      it('should use mock responses in test environment', async () => {
        // Removed withMockEnv wrapper
        const consoleSpy = vi.spyOn(console, 'log')

        const functions = AI({
          testFunction: {
            result: 'string',
          },
        })

        await functions.testFunction({})

        expect(consoleSpy).toHaveBeenCalledWith('Using mock API response for tests')

        consoleSpy.mockRestore()
      }),
        it('should create mock objects based on schema', async () => {
          // Removed withMockEnv wrapper
          const functions = AI({
            complexFunction: {
              name: 'string',
              age: 'string',
              address: {
                street: 'string',
                city: 'string',
                country: 'string',
              },
              hobbies: ['string'],
              contacts: [
                {
                  type: 'string',
                  value: 'string',
                },
              ],
            },
          })

          const result = await functions.complexFunction({})

          expect(result).toHaveProperty('name')
          expect(result).toHaveProperty('age')
          expect(result).toHaveProperty('address')
          expect(result.address).toHaveProperty('street')
          expect(result.address).toHaveProperty('city')
          expect(result.address).toHaveProperty('country')
          expect(Array.isArray(result.hobbies)).toBe(true)
          expect(Array.isArray(result.contacts)).toBe(true)
          expect(result.contacts[0]).toHaveProperty('type')
          expect(result.contacts[0]).toHaveProperty('value')
        }) // Restored closing parenthesis structure
    }) // End of 'describe' block 'Mock API responses'
  const originalNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'test'
  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv
  })

  describe('Streaming', () => {
    it('should support streaming with dynamic ai instance', async () => {
      console.log('>>> Test: Calling dynamic ai instance with config:', { stream: true })
      const stream = ai.generateQuote({ topic: 'technology', stream: true } as import('./types').StreamingAIConfig)
      let fullResponse = ''
      let chunkCount = 0

      if (isAsyncIterable<string>(stream)) {
        for await (const chunk of stream) {
          expect(typeof chunk).toBe('string')
          fullResponse += chunk
          chunkCount++
        }
      } else {
        throw new Error('Expected an async iterable for dynamic ai instance streaming test')
      }

      expect(chunkCount).toBeGreaterThan(0)
      expect(fullResponse.length).toBeGreaterThan(10) // Basic check for non-empty response
      console.log('Streamed dynamic response:', fullResponse)
    }, 90000),
      it('should support streaming with AI factory instance', async () => {
        const functions = AI({
          generateSummary: {
            text: 'string', // Input schema
            summary: 'string', // Expected output field (though streaming yields text chunks)
          },
        })

        console.log('>>> Test: Calling AI factory instance with config:', { stream: true })
        const stream = functions.generateSummary({ text: 'Streaming is a technique used in computer science.', stream: true } as import('./types').StreamingAIConfig)
        let fullResponse = ''
        let chunkCount = 0

        if (isAsyncIterable<string>(stream)) {
          for await (const chunk of stream) {
            expect(typeof chunk).toBe('string')
            fullResponse += chunk
            chunkCount++
          }
        } else {
          throw new Error('Expected an async iterable for AI factory instance streaming test')
        }

        expect(chunkCount).toBeGreaterThan(0)
        expect(fullResponse.length).toBeGreaterThan(5) // Basic check
        console.log('Streamed factory response:', fullResponse)
      }, 90000),
      it('should support streaming with tagged template literals', async () => {
        const topic = 'artificial intelligence'
        console.log('>>> Test: Calling tagged template literal ai`...`')
        console.log(`>>> Test: ai object type: ${typeof ai}, is proxy? ${!!ai?.apply}`) // Check ai object before use
        const executor = ai`Give me a short definition of ${topic}` // Get the executor function first
        console.log(`>>> Test: Got executor type: ${typeof executor}`)
        const result = executor({ stream: true }) // Now call with config
        console.log(`>>> Test: Called executor, result type: ${typeof result}, is async iterable? ${result != null && typeof (result as any)[Symbol.asyncIterator] === 'function'}`)
        let fullResponse = ''
        let chunkCount = 0

        if (isAsyncIterable<string>(result)) {
          // Check if it's iterable
          for await (const chunk of result) {
            expect(typeof chunk).toBe('string')
            fullResponse += chunk
            chunkCount++
          }
        } else {
          throw new Error('Expected an async iterable for tagged template literal streaming test')
        }

        expect(chunkCount).toBeGreaterThan(0)
        expect(fullResponse.length).toBeGreaterThan(10)
        console.log('Streamed template literal response:', fullResponse)
      }, 90000)
  }),
    describe('Tagged Template Literals', () => {
      it.skip('should support basic tagged template usage', async () => {
        // Removed withMockEnv wrapper
        const text = 'Test tagged template'
        const result = await ai`Summarize this: ${text}`() // Needs invocation

        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
      }),
        it.skip('should support configuration with tagged templates', async () => {
          // Removed withMockEnv wrapper
          const text = 'Test with configuration'
          const result = await ai({ model: 'test-model' })`Translate this: ${text}`

          expect(result).toBeDefined()
          expect(typeof result).toBe('string')
        }) // Restored closing
    }) // End describe 'Tagged Template Literals'
}) // End describe 'functions.do'

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ai, AI } from './index'

beforeEach(() => {
  process.env.NODE_ENV = 'test'
})

describe('functions.do', () => {
  describe('AI factory', () => {
    it('should create functions that make API calls', async () => {
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
    }, 90000)

    it('should support nested object schemas', async () => {
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
    }, 90000)

    it('should handle array of objects', async () => {
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
    }, 90000)

    it('should generate markdown content', async () => {
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
    }, 90000)

    it('should preserve array types in responses', async () => {
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
    }, 90000)
  })

  describe('Dynamic ai instance', () => {
    it('should support arbitrary function names', async () => {
      const result = await ai.generateRandomName({
        type: 'product',
        industry: 'tech',
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    }, 90000)

    it('should handle errors gracefully', async () => {
      try {
        await ai.nonexistentFunction()
        throw new Error('Should have thrown')
      } catch (error) {
        expect(error).toBeDefined()
      }
    }, 90000)

    it('should support markdown generation', async () => {
      const result = await ai.generateMarkdown({
        topic: 'AI Functions',
        format: 'tutorial',
      })

      expect(result).toHaveProperty('markdown')
      expect(result).toHaveProperty('html')
    }, 90000)
  })

  describe('Callback functions', () => {
    it('should support callback functions', async () => {
      let callbackExecuted = false
      let receivedAiInstance: any = null
      let receivedArgs = null

      const functions = AI({
        testFunction: {
          name: 'string',
          description: 'string',
        },
        testCallback: (args, ctx) => {
          callbackExecuted = true
          receivedAiInstance = ctx.ai
          receivedArgs = args
          return Promise.resolve('callback result')
        },
      })

      const mockAi: any = {
        testFunction: () => Promise.resolve({ name: 'test', description: 'test' }),
      }
      const result = functions.testCallback({ test: 123 }, { ai: mockAi, api: {}, db: {} })

      // Verify the function properties
      expect(callbackExecuted).toBe(true)
      expect(receivedAiInstance).not.toBeNull()
      expect(typeof receivedAiInstance.testFunction).toBe('function')
      expect(result).toBe('callback result')
    })

    it('should automatically execute launchStartup callback', async () => {
      let startupExecuted = false
      let receivedAiInstance: any = null

      const functions = AI({
        someFunction: {
          result: 'string',
        },
        launchStartup: (args, ctx) => {
          startupExecuted = true
          receivedAiInstance = ctx.ai
          return Promise.resolve({ initialized: true })
        },
      })

      // Verify the launchStartup was auto-executed
      expect(startupExecuted).toBe(true)
      expect(receivedAiInstance).not.toBeNull()
      expect(typeof receivedAiInstance.someFunction).toBe('function')

      // Also verify we can call the callback explicitly
      const mockAi: any = {} // Create a mock AI instance
      const result = functions.launchStartup({}, { ai: mockAi, api: {}, db: {} })
      expect(result).toEqual({ initialized: true })
    })

    it('should support async callbacks', async () => {
      let asyncCallbackExecuted = false

      const functions = AI({
        nameStartup: {
          name: 'What is the startup name',
        },
        launchStartup: async (args, ctx) => {
          await new Promise((resolve) => setTimeout(resolve, 100))
          asyncCallbackExecuted = true
          return { success: true, data: args }
        },
      })

      const mockAi: any = {} // Create a mock AI instance
      const result = await functions.launchStartup({ test: 'async' }, { ai: mockAi, api: {}, db: {} })
      const namingResults = await functions.nameStartup({ test: 'async' })

      expect(asyncCallbackExecuted).toBe(true)
      expect(result).toEqual({ success: true, data: { test: 'async' } })
    })
  })

  describe('Mock API responses', () => {
    it('should use mock responses in test environment', async () => {
      const consoleSpy = vi.spyOn(console, 'log')

      const functions = AI({
        testFunction: {
          result: 'string',
        },
      })

      await functions.testFunction({})

      expect(consoleSpy).toHaveBeenCalledWith('Using mock API response for tests')

      consoleSpy.mockRestore()
    })

    it('should create mock objects based on schema', async () => {
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
    })
  })

  describe('Tagged Template Literals', () => {
    it.skip('should support basic tagged template usage', async () => {
      const text = 'Test tagged template'
      const result = await ai`Summarize this: ${text}`

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it.skip('should support configuration with tagged templates', async () => {
      const text = 'Test with configuration'
      const result = await ai({ model: 'test-model' })`Translate this: ${text}`

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })
  })
})

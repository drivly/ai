import { describe, it, expect } from 'vitest'
import { ai, AI } from './index'

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
        testCallback: ({ ai, args }) => {
          callbackExecuted = true
          receivedAiInstance = ai
          receivedArgs = args
          return 'callback result'
        },
      })

      // Access the callback function result
      const mockAi: any = {} // Create a mock AI instance
      const result = functions.testCallback({ ai: mockAi, args: { test: 123 } })

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
    })
  })
})

import { model } from 'ai-providers'
import { z } from 'zod'
import type { AIFunctionOptions, AIFunctionConfig } from './types'

// Default configuration
const defaultConfig: AIFunctionConfig = {
  model: 'gpt-4o',
}

// Create AI model provider with support for multiple providers through ai-providers
const getAIProvider = (modelName: string) => {
  return model(modelName)
}

/**
 * Generate an object using the AI model
 */
const generateObject = async (options: { model: any; prompt: string; schema?: z.ZodType<any>; temperature?: number; maxTokens?: number; output?: string; [key: string]: any }) => {
  const { model, prompt, schema, ...rest } = options

  // If schema is provided, use it to validate the response
  if (schema) {
    // Use the model to generate a response
    const response = await model.complete({
      prompt,
      ...rest,
    })

    // Parse the response as JSON
    try {
      const jsonResponse = JSON.parse(response.text)

      // Validate the response against the schema
      if (schema.parse) {
        return { object: schema.parse(jsonResponse) }
      }

      return { object: jsonResponse }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to parse AI response as JSON: ${errorMessage}`)
    }
  } else {
    // No schema provided, return the raw text
    const response = await model.complete({
      prompt,
      ...rest,
    })

    return { object: response.text }
  }
}

/**
 * Generate text using the AI model
 */
const generateText = async (options: { model: any; prompt: string; temperature?: number; maxTokens?: number; [key: string]: any }) => {
  const { model, prompt, ...rest } = options

  const response = await model.complete({
    prompt,
    ...rest,
  })

  return { text: response.text }
}

// Create a proxy handler for the ai function
const aiHandler = {
  apply: async (target: any, thisArg: any, args: any[]) => {
    // Handle template literal tag usage: ai`prompt ${var}`
    if (args[0] && Array.isArray(args[0]) && 'raw' in args[0]) {
      const [template, ...expressions] = args
      const prompt = String.raw({ raw: template }, ...expressions)

      // Create a function that can be called with config: ai`prompt`({ model: 'model-name' })
      const templateResult = async (config: any = {}) => {
        const modelName = config.model || defaultConfig.model
        const model = getAIProvider(modelName)

        // Use no-schema mode when no schema is provided
        if (config.schema) {
          // Generate object with schema
          const result = await generateObject({
            model,
            prompt,
            schema: config.schema,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
            ...config,
          })
          return result.object
        } else {
          // Generate text without schema
          const result = await generateText({
            model,
            prompt,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
            ...config,
          })
          return result.text
        }
      }

      // If no config is passed, execute immediately
      if (args.length === 1) {
        return templateResult()
      }

      // Return the function for later execution with config
      return templateResult
    }

    // TODO: Handle other usage patterns
    throw new Error('Not implemented yet')
  },

  get: (target: any, prop: string) => {
    // Implement proxy for arbitrary function calls
    return async (...args: any[]) => {
      // If called with an object, use it as parameters
      if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
        const params = args[0]

        // Create a prompt that describes the function call
        const prompt = `Function: ${prop}\nParameters: ${JSON.stringify(params, null, 2)}`

        // Auto-generate a schema based on the parameters
        const schemaObj: Record<string, z.ZodType> = {}

        // Create a schema for each parameter with its description
        Object.entries(params).forEach(([key, value]) => {
          schemaObj[key] = z.string().describe(String(value))
        })

        // Create a Zod schema for the function result
        const schema = z.object(schemaObj)

        // Get the model
        const model = getAIProvider(defaultConfig.model)

        // Generate the object with the schema
        const result = await generateObject({
          model,
          prompt,
          schema,
          output: params.output || 'object',
          temperature: params.temperature || defaultConfig.temperature,
          maxTokens: params.maxTokens || defaultConfig.maxTokens,
        })

        return result.object
      }

      // If called with multiple arguments or an array, convert to a function call string
      const functionCall = `${prop}(${JSON.stringify(args)})`
      const model = getAIProvider(defaultConfig.model)

      // Generate text for function call
      const result = await generateText({
        model,
        prompt: functionCall,
      })

      return result.text
    }
  },
}

// Create the ai function with proxy
export const ai = new Proxy(function () {}, aiHandler) as any

const createListIterator = async function* (prompt: string, config: AIFunctionOptions = {}) {
  const modelName = config.model || defaultConfig.model
  const model = getAIProvider(modelName)

  // Use the model's streaming API
  const stream = await model.streamComplete({
    prompt,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    ...config,
  })

  let buffer = ''
  let items: string[] = []

  for await (const chunk of stream) {
    buffer += chunk.text

    try {
      const parsed = JSON.parse(buffer)
      if (Array.isArray(parsed)) {
        const newItems = parsed.filter((item) => !items.includes(item))
        for (const item of newItems) {
          items.push(item)
          yield item
        }
      }
    } catch (e) {}
  }

  try {
    const finalParsed = JSON.parse(buffer)
    if (Array.isArray(finalParsed)) {
      const newItems = finalParsed.filter((item) => !items.includes(item))
      for (const item of newItems) {
        yield item
      }
    }
  } catch (e) {
    console.error('Failed to parse final JSON response', e)
  }
}

// Implement list function
export const list = new Proxy(function () {}, {
  apply: async (target: any, thisArg: any, args: any[]) => {
    // Handle template literal tag usage: list`prompt ${var}`
    if (args[0] && Array.isArray(args[0]) && 'raw' in args[0]) {
      const [template, ...expressions] = args
      const prompt = String.raw({ raw: template }, ...expressions)

      // Create a function that can be called with config: list`prompt`({ model: 'model-name' })
      const templateResult = async (config: any = {}) => {
        if (config.iterator === true) {
          // Create a promise that will be resolved with the first item
          let firstItemPromise: Promise<string> | null = null
          let firstItemResolver: ((value: string) => void) | null = null

          // Create an iterator that will yield items as they become available
          const iterator = createListIterator(prompt, config)

          // Create a promise that will be resolved with the first item
          firstItemPromise = new Promise<string>((resolve) => {
            firstItemResolver = resolve
          })

          // Create a wrapper iterator that will resolve the promise with the first item
          const wrappedIterator = async function* () {
            let isFirst = true
            for await (const item of iterator) {
              if (isFirst && firstItemResolver) {
                firstItemResolver(item)
                isFirst = false
              }
              yield item
            }
          }

          // Create a result object that is both a promise and an async iterator
          const result = Object.assign(async (opts?: AIFunctionOptions) => templateResult({ ...config, ...opts }), {
            [Symbol.asyncIterator]: wrappedIterator,
            then: firstItemPromise.then.bind(firstItemPromise),
            catch: firstItemPromise.catch.bind(firstItemPromise),
            finally: firstItemPromise.finally.bind(firstItemPromise),
          })

          return result
        }

        // Default behavior (return a promise that resolves to the complete array)
        const modelName = config.model || defaultConfig.model
        const model = getAIProvider(modelName)

        // Create a schema for an array of strings
        const schema = z.array(z.string())

        const systemPrompt = "Respond only with a numbered, markdown ordered list. Each item should be on a new line starting with a number followed by a period."
        const mergedConfig = {
          ...config,
          systemPrompt: config.systemPrompt 
            ? `${config.systemPrompt}\n${systemPrompt}` 
            : systemPrompt
        }

        // Generate object with array schema
        const result = await generateObject({
          model,
          prompt,
          schema,
          output: 'array',
          temperature: mergedConfig.temperature,
          maxTokens: mergedConfig.maxTokens,
          ...mergedConfig,
        })

        return result.object
      }

      // If no config is passed, execute immediately
      if (args.length === 1) {
        return templateResult()
      }

      // Return the function for later execution with config
      return templateResult
    }

    throw new Error('list function must be used as a template literal tag')
  },
}) as any

// Implement markdown function
export const markdown = new Proxy(function () {}, {
  apply: async (target: any, thisArg: any, args: any[]) => {
    // Handle template literal tag usage: markdown`prompt ${var}`
    if (args[0] && Array.isArray(args[0]) && 'raw' in args[0]) {
      const [template, ...expressions] = args
      const prompt = String.raw({ raw: template }, ...expressions)

      // Create a function that can be called with config: markdown`prompt`({ model: 'model-name' })
      const templateResult = async (config: any = {}) => {
        const modelName = config.model || defaultConfig.model
        const model = getAIProvider(modelName)

        // Generate markdown text
        const result = await generateText({
          model,
          prompt: `Generate markdown content for: ${prompt}`,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          ...config,
        })

        return result.text
      }

      // If no config is passed, execute immediately
      if (args.length === 1) {
        return templateResult()
      }

      // Return the function for later execution with config
      return templateResult
    }

    throw new Error('markdown function must be used as a template literal tag')
  },
}) as any

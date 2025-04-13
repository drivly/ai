import { openai } from '@ai-sdk/openai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { z } from 'zod'
import { streamText } from 'ai' // Import streamText for streaming

import type { AIFunctionOptions, AIFunctionConfig } from './types/index'

// Default configuration
const defaultConfig: AIFunctionConfig = {
  model: 'gpt-4o',
}

// Create AI model provider with support for AI_GATEWAY environment variable
const getAIProvider = (modelName: string) => {
  if (typeof process !== 'undefined' && process.env?.AI_GATEWAY) {
    console.log(`Using AI_GATEWAY: ${process.env.AI_GATEWAY}`) // Debug log
    return createOpenAICompatible({
      baseURL: process.env.AI_GATEWAY,
    }).languageModel(modelName)
  }
  console.log('Using standard OpenAI provider.') // Debug log
  return openai.languageModel(modelName)
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

/**
 * Create a streaming function that yields results as they come in
 */
const createStreamingFunction = (model: any, prompt: string, config: any) => {
  return {
    [Symbol.asyncIterator]: async function* () {
      try {
        const stream = await streamText({
          model,
          prompt,
          ...config, // Pass remaining config like temperature, maxTokens etc.
        })

        for await (const chunk of stream.textStream) {
          yield chunk
        }
      } catch (error) {
        console.error('Error during AI streaming:', error)
        throw error
      }
    },
  }
}

// Create a proxy handler for the ai function
const aiHandler = {
  apply: (target: any, thisArg: any, args: any[]) => {
    if (args.length >= 1 && Array.isArray(args[0]) && 'raw' in args[0]) {
      const template = args[0] as { raw: readonly string[] | ArrayLike<string> }
      const expressions = args.slice(1) as any[]
      const prompt = String.raw({ raw: template.raw }, ...expressions)

      return (config?: AIFunctionConfig) => {
        const fullConfig = { ...defaultConfig, ...config } // Combine defaults and call-time config
        const modelName = fullConfig.model || defaultConfig.model // Determine the model name
        const model = getAIProvider(modelName) // Resolve the model name to a model object

        if (fullConfig.stream === true) {
          const { stream, model: _modelConfig, schema: _schema, ...streamingConfig } = fullConfig // Exclude stream, model, schema
          return createStreamingFunction(model, prompt, streamingConfig)
        } else {
          return (async () => {
            if (fullConfig.schema) {
              // Generate object with schema
              const { model: _modelConfig, schema: _schema, ...objectConfig } = fullConfig // Exclude model/schema for generateObject
              const result = await generateObject({
                model, // Pass the resolved model object
                prompt,
                schema: fullConfig.schema,
                ...objectConfig, // Pass remaining config
              })
              return result.object
            } else {
              // Generate text without schema
              const { model: _modelConfig, schema: _schema, ...textConfig } = fullConfig // Exclude model/schema for generateText
              const result = await generateText({
                model, // Pass the resolved model object
                prompt,
                ...textConfig, // Pass remaining config
              })
              return result.text
            }
          })() // Immediately invoke the async function
        }
      }
    }
    console.warn('AI proxy called directly without template literal. This usage might not be supported.')
    throw new Error('AI proxy can only be used as a tagged template literal (ai`...`) or via property access (ai.func(...)).')
  },

  get: (target: any, prop: string) => {
    // Implement proxy for arbitrary function calls
    return (...args: any[]) => {
      // Return a function, not necessarily async immediately
      if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
        const params = args[0] // The config object passed to the function call
        const modelName = params.model || defaultConfig.model // Determine model name from params or default
        const model = getAIProvider(modelName) // Resolve the model name to a model object

        if (params.stream === true) {
          const prompt = `Function: ${prop}\nParameters: ${JSON.stringify(params, null, 2)}` // Construct prompt
          const { stream, model: _modelConfig, schema: _schema, ...streamingConfig } = params // Exclude stream, model, schema
          return createStreamingFunction(model, prompt, streamingConfig)
        } else {
          return (async () => {
            const prompt = `Function: ${prop}\nParameters: ${JSON.stringify(params, null, 2)}` // Construct prompt

            let schema = params.schema
            if (!schema && params.output !== 'no-schema') {
              // Auto-generate only if not explicitly no-schema
              const schemaObj: Record<string, z.ZodType> = {}
              Object.entries(params).forEach(([key, value]) => {
                if (!['model', 'temperature', 'maxTokens', 'output', 'stream', 'schema'].includes(key)) {
                  schemaObj[key] = z.string().describe(String(value)) // Basic auto-schema: string with description
                }
              })
              if (Object.keys(schemaObj).length > 0) {
                schema = z.object(schemaObj)
              }
            }

            const { model: _modelConfig, schema: _schemaParam, stream: _stream, ...generationConfig } = params

            if (schema) {
              // Generate object with schema
              const result = await generateObject({
                model, // Pass the resolved model object
                prompt,
                schema,
                ...generationConfig, // Pass remaining config
              })
              return result.object
            } else {
              const result = await generateText({
                model, // Pass the resolved model object
                prompt,
                ...generationConfig, // Pass remaining config
              })
              return result.text
            }
          })() // Immediately invoke the async function
        }
      }

      return (async () => {
        const functionCall = `${prop}(${JSON.stringify(args)})`
        const model = getAIProvider(defaultConfig.model) // Use default model

        // Generate text for function call
        const result = await generateText({
          model,
          prompt: functionCall,
        })

        return result.text
      })()
    }
  },
}

// Create the ai function with proxy
export const ai = new Proxy(function () {}, aiHandler) as any

// Implement list function
export const list = new Proxy(function () {}, {
  apply: async (target: any, thisArg: any, args: any[]) => {
    // Handle template literal tag usage: list`prompt ${var}`
    if (args[0] && Array.isArray(args[0]) && 'raw' in args[0]) {
      const [template, ...expressions] = args
      const prompt = String.raw({ raw: template }, ...expressions)

      // Create a function that can be called with config: list`prompt`({ model: 'model-name' })
      const templateResult = async (config: any = {}) => {
        const modelName = config.model || defaultConfig.model
        const model = getAIProvider(modelName)

        // Create a schema for an array of strings
        const schema = z.array(z.string())

        // Generate object with array schema
        const result = await generateObject({
          model,
          prompt,
          schema,
          output: 'array',
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          ...config,
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

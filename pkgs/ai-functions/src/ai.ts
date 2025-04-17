import { openai } from '@ai-sdk/openai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { z } from 'zod'
import { CoreMessage } from 'ai';
import { streamText, streamObject } from 'ai' // Import streamText and streamObject for streaming

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
const createStreamingFunction = (model: any, prompt: string, config: any, schema?: z.ZodType<any>, format?: string) => {
  return {
    [Symbol.asyncIterator]: async function* () {
      try {
        let effectiveFormat = format; // `format` comes from params.output or defaults ('Object'/'Text')

        if (!effectiveFormat || effectiveFormat === 'Object' || effectiveFormat === 'array') {
            if (schema instanceof z.ZodArray) {
                effectiveFormat = 'ObjectArray';
            } else if (schema instanceof z.ZodObject) {
                effectiveFormat = 'Object';
            } else {
                effectiveFormat = 'Text';
            }
        }

        console.log(`>>> ai-functions: Streaming with effective format: ${effectiveFormat}`); // Log the final determined format

        if (effectiveFormat === 'TextArray') {
           const listPrompt = `${prompt}\n\nRespond ONLY with a numbered markdown list. Each item must be on a new line.`
           const { system, ...restTextArrayConfig } = config;
           const textArrayMessages: CoreMessage[] = [ // Assuming CoreMessage is available or imported
              { role: 'system', content: `${system || ''}\nRespond ONLY with a numbered markdown list.` },
              { role: 'user', content: prompt }
           ];
           const result = await streamText({ model, messages: textArrayMessages, ...restTextArrayConfig });
           let buffer = '';
           const lineRegex = /^\s*\d+\.\s+(.*)/;
           for await (const textChunk of result.textStream) {
             buffer += textChunk;
             let newlineIndex;
             while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
               const line = buffer.substring(0, newlineIndex);
               buffer = buffer.substring(newlineIndex + 1);
               const match = line.match(lineRegex);
               if (match && match[1]) {
                 yield match[1].trim();
               }
             }
           }
           if (buffer.length > 0) {
              const match = buffer.match(lineRegex);
              if (match && match[1]) {
                yield match[1].trim();
              }
           }
        }
        else if (effectiveFormat === 'ObjectArray' && schema instanceof z.ZodArray) {
          const { system: objArraySystem, ...restObjectArrayConfig } = config;
          const objectArrayMessages: CoreMessage[] = [
             { role: 'system', content: `${objArraySystem || ''}\nRespond ONLY with a JSON array conforming to the provided item schema.` },
             { role: 'user', content: prompt }
          ];
          const result = await streamObject({ model, messages: objectArrayMessages, schema, ...restObjectArrayConfig });
          if (result.elementStream && typeof (result.elementStream as any)[Symbol.asyncIterator] === 'function') {
             console.log(">>> ai-functions: Iterating over elementStream for ObjectArray")
             for await (const element of result.elementStream as AsyncIterable<any>) {
               yield element
             }
          } else {
             console.warn(">>> ai-functions: elementStream not available/iterable for ObjectArray, falling back to partialObjectStream")
             for await (const partial of result.partialObjectStream) {
                yield partial // Yield partial arrays
             }
          }
        }
        else if (effectiveFormat === 'Object' && schema instanceof z.ZodObject) {
           const { system: objSystem, ...restObjectConfig } = config;
           const objectMessages: CoreMessage[] = [
              { role: 'system', content: `${objSystem || ''}\nRespond ONLY with a JSON object conforming to the provided schema.` },
              { role: 'user', content: prompt }
           ];
           const result = await streamObject({ model, messages: objectMessages, schema, ...restObjectConfig });
           for await (const partial of result.partialObjectStream) {
             yield partial
           }
        }
        else {
          const { system, ...restTextConfig } = config;
          const textMessages: CoreMessage[] = [
             { role: 'system', content: system || 'You are a helpful assistant.' },
             { role: 'user', content: prompt }
          ];
          const result = await streamText({ model, messages: textMessages, ...restTextConfig });
          for await (const chunk of result.textStream) {
            yield chunk
          }
        }
      } catch (error) {
        console.error('Error during AI streaming:', error)
        yield { error: `Streaming failed: ${error instanceof Error ? error.message : String(error)}` }
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
          const { stream, model: _modelConfig, schema: schemaFromConfig, ...streamingConfig } = fullConfig // Exclude stream, model, schema
          return createStreamingFunction(model, prompt, streamingConfig, schemaFromConfig)
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
          let schemaForStreaming: z.ZodTypeAny | undefined = params.schema
          const outputFormat = params.output || (params.schema ? 'Object' : 'Text'); // Determine format: 'array', 'TextArray', 'Object', 'Text', 'no-schema'

          if (!schemaForStreaming && outputFormat !== 'no-schema' && outputFormat !== 'TextArray' && outputFormat !== 'Text') {
             const schemaObj: Record<string, z.ZodType> = {}
             Object.entries(params).forEach(([key, value]) => {
               if (!['model', 'temperature', 'maxTokens', 'output', 'stream', 'schema', 'system'].includes(key)) {
                  if (typeof value === 'string') schemaObj[key] = z.string().describe(value);
                  else if (typeof value === 'number') schemaObj[key] = z.number().describe(String(value));
                  else if (typeof value === 'boolean') schemaObj[key] = z.boolean().describe(String(value));
                  else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') schemaObj[key] = z.array(z.string()).describe(value[0]);
                  else schemaObj[key] = z.any().describe(JSON.stringify(value)); // Fallback
               }
             })
             if (Object.keys(schemaObj).length > 0) {
                const itemSchema = z.object(schemaObj);
                if (outputFormat === 'array') { // Explicitly 'array' means ObjectArray
                    schemaForStreaming = z.array(itemSchema).describe('Array of objects based on input parameters');
                } else { // Default to single object if not 'array'
                    schemaForStreaming = itemSchema;
                }
             }
          } else if (outputFormat === 'array' && schemaForStreaming && !(schemaForStreaming instanceof z.ZodArray)) {
             console.warn(">>> ai-functions: Wrapping provided schema in z.array() due to output: 'array'");
             schemaForStreaming = z.array(schemaForStreaming);
          } else if (outputFormat === 'array' && !schemaForStreaming) {
             console.warn(">>> ai-functions: output: 'array' specified but no schema provided or inferrable. Defaulting to z.array(z.string()).");
             schemaForStreaming = z.array(z.string()).describe('Array of strings (fallback)');
          }

          const { stream, model: _modelConfig, schema: _schemaParam, output: _output, ...streamingConfig } = params // Exclude control params
          return createStreamingFunction(model, prompt, streamingConfig, schemaForStreaming, outputFormat)
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

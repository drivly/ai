import { AIConfig, AIFunction, FunctionDefinition, FunctionCallback, SchemaValue, AI_Instance, SchemaToOutput, MarkdownOutput } from './types'
export type { FunctionResponse, FunctionDefinition as ClientFunctionDefinition, AIConfig as ClientAIConfig } from './src/index'
export { default as FunctionsClient } from './src/index'

// Helper to preserve array types for TypeScript
const preserveArrayTypes = <T extends Array<any>>(arr: T): T => {
  return arr
}

// Helper to generate the API request payload
const generateRequest = (functionName: string, schema: FunctionDefinition, input: any, config: AIConfig) => {
  return {
    functionName,
    schema,
    input,
    config,
  }
}

// Helper to call the functions.do API
const callAPI = async (request: any) => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Using mock API response for tests')
    const functionName = request.functionName
    const schema = request.schema
    const input = request.input

    const mockResponse: any = {}

    for (const key in schema) {
      if (typeof schema[key] === 'string') {
        mockResponse[key] = input[key] || `Mock ${key}`
      } else if (Array.isArray(schema[key])) {
        mockResponse[key] = [typeof schema[key][0] === 'object' ? createMockObjectFromSchema(schema[key][0]) : `Mock ${key} item`]
      } else if (typeof schema[key] === 'object') {
        mockResponse[key] = createMockObjectFromSchema(schema[key])
      }
    }

    return { data: mockResponse }
  }

  const baseUrl = process.env.FUNCTIONS_API_URL || 'https://apis.do'
  const url = `${baseUrl}/functions/${request.functionName}`
  console.log({ url })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FUNCTIONS_DO_API_KEY}`,
    },
    body: JSON.stringify({
      input: {
        functionName: request.functionName,
        args: request.input || {},
        schema: request.schema,
        settings: request.config,
      },
    }),
  })

  if (!response.ok) {
    console.log(response.status, response.statusText)
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = (await response.json()) as any
  console.log(data)
  return data
}

const createMockObjectFromSchema = (schema: any): any => {
  const mockObj: any = {}

  for (const key in schema) {
    if (typeof schema[key] === 'string') {
      mockObj[key] = `Mock ${key}`
    } else if (Array.isArray(schema[key])) {
      mockObj[key] = [typeof schema[key][0] === 'object' ? createMockObjectFromSchema(schema[key][0]) : `Mock ${key} item`]
    } else if (typeof schema[key] === 'object') {
      mockObj[key] = createMockObjectFromSchema(schema[key])
    }
  }

  return mockObj
}

// Helper to call the functions.do API with markdown output
const callMarkdownAPI = async (request: any): Promise<MarkdownOutput> => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Using mock markdown API response for tests')
    const functionName = request.functionName
    const schema = request.schema
    const input = request.input

    const mockResponse: any = {
      markdown: '# Mock Markdown\n\nThis is a mock markdown response for testing.',
      html: '<h1>Mock Markdown</h1><p>This is a mock markdown response for testing.</p>',
    }

    for (const key in schema) {
      if (typeof schema[key] === 'string') {
        mockResponse[key] = input[key] || `Mock ${key}`
      } else if (Array.isArray(schema[key])) {
        mockResponse[key] = [typeof schema[key][0] === 'object' ? createMockObjectFromSchema(schema[key][0]) : `Mock ${key} item`]
      } else if (typeof schema[key] === 'object') {
        mockResponse[key] = createMockObjectFromSchema(schema[key])
      }
    }

    return mockResponse as MarkdownOutput
  }

  const baseUrl = process.env.FUNCTIONS_API_URL || 'https://apis.do'
  const url = `${baseUrl}/functions/${request.functionName}`
  console.log({ url })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FUNCTIONS_DO_API_KEY}`,
    },
    body: JSON.stringify({
      input: {
        functionName: request.functionName,
        args: request.input || {},
        schema: request.schema,
        settings: { ...request.config, format: 'markdown' }, // Specify markdown format
      },
    }),
  })

  if (!response.ok) {
    console.log(response.status, response.statusText)
    throw new Error(`API call failed: ${response.statusText}`)
  }

  const data = (await response.json()) as any
  console.log(data)
  return data
}

// Helper to generate a function from schema and config
const createFunction = <T extends FunctionDefinition>(name: string, schema: T, config?: AIConfig) => {
  // Extract the output type from the schema, ensuring arrays are handled properly
  type OutputType = SchemaToOutput<T>

  // Return a typed function to ensure TypeScript properly infers types from schema
  return async (input: any, functionConfig?: AIConfig): Promise<OutputType> => {
    const mergedConfig = { ...config, ...functionConfig }
    const request = generateRequest(name, schema, input, mergedConfig)

    try {
      const response = (await callAPI(request)) as any
      const result = response.data ?? response

      // Ensure schema shapes are preserved for TypeScript
      for (const key in schema) {
        // If schema defines an array property and result has that property
        if (Array.isArray(schema[key]) && result[key]) {
          // Use our helper to ensure the array type is preserved for TypeScript inference
          result[key] = preserveArrayTypes(Array.isArray(result[key]) ? result[key] : [result[key]])
        }
      }

      return result as OutputType
    } catch (error) {
      console.error('Error calling AI function:', error)
      throw error
    }
  }
}

// Helper to generate a markdown function from schema and config
const createMarkdownFunction = <T extends FunctionDefinition>(name: string, schema: T, config?: AIConfig) => {
  // Extract the output type from the schema, ensuring arrays are handled properly
  type OutputType = SchemaToOutput<T>

  // Return a typed function to ensure TypeScript properly infers types from schema
  return async (input: any, functionConfig?: AIConfig): Promise<MarkdownOutput & OutputType> => {
    const mergedConfig = { ...config, ...functionConfig }
    const request = generateRequest(name, schema, input, mergedConfig)

    try {
      const response = (await callMarkdownAPI(request)) as any
      const result = response.data ?? response

      // Ensure schema shapes are preserved for TypeScript
      for (const key in schema) {
        // If schema defines an array property and result has that property
        if (Array.isArray(schema[key]) && result[key]) {
          // Use our helper to ensure the array type is preserved for TypeScript inference
          result[key] = preserveArrayTypes(Array.isArray(result[key]) ? result[key] : [result[key]])
        }
      }

      return result as MarkdownOutput & OutputType
    } catch (error) {
      console.error('Error calling AI markdown function:', error)
      throw error
    }
  }
}

// AI factory function for creating strongly-typed functions
export const AI = <T extends Record<string, FunctionDefinition | FunctionCallback>>(functions: T, config?: AIConfig) => {
  // Use a more specific type definition to ensure array element types are preserved
  type Result = {
    [K in keyof T]: T[K] extends FunctionDefinition
      ? AIFunction<any, SchemaToOutput<T[K]>> & ((input: any, config?: AIConfig) => Promise<SchemaToOutput<T[K]>>)
      : T[K] extends FunctionCallback<infer TArgs>
        ? FunctionCallback<TArgs>
        : never
  }

  // Create a type-safe result object
  const result = {} as Result

  // Create the ai instance first so it can be passed to callbacks
  const aiInstance = new Proxy(
    {},
    {
      get: (target: any, prop: string) => {
        if (typeof prop === 'string' && prop in functions) {
          if (typeof functions[prop] === 'object') {
            return createFunction(prop, functions[prop] as any, config)
          }
        }

        if (typeof prop === 'string' && !prop.startsWith('_')) {
          return createFunction(prop, {}, {})
        }
        return target[prop]
      },
    },
  ) as AI_Instance

  for (const [name, value] of Object.entries(functions)) {
    if (typeof value === 'function') {
      result[name as keyof T] = value as any

      if (name === 'launchStartup' && typeof value === 'function') {
        try {
          ;(value as FunctionCallback<any>)({ ai: aiInstance, args: {} })
        } catch (error) {
          console.error('Error auto-executing launchStartup:', error)
        }
      }
    } else if (typeof value === 'object') {
      // Handle schema-based function by preserving the exact schema type
      result[name as keyof T] = createFunction(
        name,
        value as any, // Cast to any first to avoid TypeScript narrowing issues
        config,
      ) as any
    }
  }

  // Add the generateMarkdown function
  result['generateMarkdown' as keyof T] = createMarkdownFunction(
    'generateMarkdown',
    {} as any, // Empty schema as the server will handle the schema
    config,
  ) as any

  return result
}

// Dynamic ai instance that accepts any function name
// Make a specialized version of createFunction that better handles type inference for dynamic calls
const createDynamicFunction = <T extends SchemaValue>(name: string, config?: AIConfig) => {
  // Create an empty schema that will be filled dynamically by the server
  const emptySchema = {} as Record<string, T>

  return createFunction(name, emptySchema, config)
}

// Make a specialized version of createMarkdownFunction for dynamic calls
const createDynamicMarkdownFunction = <T extends SchemaValue>(name: string, config?: AIConfig) => {
  // Create an empty schema that will be filled dynamically by the server
  const emptySchema = {} as Record<string, T>

  return createMarkdownFunction(name, emptySchema, config)
}

// Create a special proxy with improved type inference
export const ai = new Proxy(
  {
    // Add the generateMarkdown function explicitly
    generateMarkdown: createDynamicMarkdownFunction('generateMarkdown', {}),
  },
  {
    get: (target: any, prop: string) => {
      // First check if the property exists on the target
      if (prop in target) {
        return target[prop]
      }

      // Otherwise create a dynamic function
      if (typeof prop === 'string' && !prop.startsWith('_')) {
        return createDynamicFunction(prop, {})
      }
      return target[prop]
    },
  },
) as AI_Instance

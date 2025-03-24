import { AIConfig, AIFunction, FunctionDefinition, FunctionCallback, SchemaValue, AI_Instance, SchemaToOutput } from './types'

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
  const url = process.env.FUNCTIONS_API_URL || 'https://functions.do/api/generate'
  console.log({ url })
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${process.env.FUNCTIONS_DO_API_KEY}`,
    },
    body: JSON.stringify(request),
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
        if (typeof prop === 'string' && !prop.startsWith('_')) {
          // For dynamic access, we have to use empty schema
          return createFunction(prop, {}, {})
        }
        return target[prop]
      },
    },
  ) as AI_Instance

  for (const [name, value] of Object.entries(functions)) {
    if (typeof value === 'function') {
      // Handle schema-based function by preserving the exact schema type
      result[name as keyof T] = createFunction(
        name,
        value as any, // Cast to any first to avoid TypeScript narrowing issues
        config,
      ) as any
    }
  }

  return result
}

// Dynamic ai instance that accepts any function name
// Make a specialized version of createFunction that better handles type inference for dynamic calls
const createDynamicFunction = <T extends SchemaValue>(name: string, config?: AIConfig) => {
  // Create an empty schema that will be filled dynamically by the server
  const emptySchema = {} as Record<string, T>

  return createFunction(name, emptySchema, config)
}

// Create a special proxy with improved type inference
export const ai = new Proxy(
  {},
  {
    get: (target: any, prop: string) => {
      if (typeof prop === 'string' && !prop.startsWith('_')) {
        return createDynamicFunction(prop, {})
      }
      return target[prop]
    },
  },
) as AI_Instance

// Helper to generate code using the generateText function with a specific system message
export const generateCode = async (input: any, config?: AIConfig) => {
  const systemMessage = 'Only respond with Typescript functions, starting with a defined type decorated with JSDoc, followed by a Vitest unit test (assuming `describe`, `expect`, and `it` are already imported into scope), and finally providing a well-documented implementation of the function.'
  
  // Use the dynamic ai instance to call generateText with our custom system message
  return ai.generateText(input, { 
    ...config,
    system: systemMessage 
  })
}

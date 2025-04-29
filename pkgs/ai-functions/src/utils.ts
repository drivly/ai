import { z } from 'zod'
import type { AIConfig, FunctionDefinition, SchemaToOutput } from './types'

/**
 * Helper to preserve array types for TypeScript
 */
export const preserveArrayTypes = <T extends Array<any>>(arr: T): T => {
  return arr
}

/**
 * Helper to generate the API request payload
 */
export const generateRequest = (functionName: string, schema: FunctionDefinition, input: any, config: AIConfig) => {
  return {
    functionName,
    schema,
    input,
    config,
  }
}

/**
 * Helper to determine if an object is a schema
 */
export const determineIfSchema = (obj: any): boolean => {
  if (obj == null) return false

  if (typeof obj !== 'object' || Array.isArray(obj)) return false

  if (obj.shape || typeof obj.parse === 'function') {
    return true
  }

  if (obj._def && typeof obj._def === 'object') {
    return true
  }

  if (Object.keys(obj).length > 0) {
    return Object.values(obj).every((value) => {
      if (value === null || value === undefined) return false

      if (typeof value === 'string') return true

      if (Array.isArray(value)) return true

      if (typeof value === 'object') return true

      return false
    })
  }

  return false
}

/**
 * Create a template literal function for string generation
 */
export const createTemplateFunction = (templateFn: (template: string, config?: AIConfig) => Promise<string>) => {
  return (strings: TemplateStringsArray, ...values: any[]) => {
    const combined = strings.reduce((result, str, i) => {
      return result + str + (values[i] !== undefined ? values[i] : '')
    }, '')

    return templateFn(combined, {})
  }
}

/**
 * Convert a Zod schema to a function definition
 */
export const zodSchemaToFunctionDefinition = (schema: z.ZodObject<any>): FunctionDefinition => {
  const definition: FunctionDefinition = {}

  if (!schema.shape) {
    return definition
  }

  for (const [key, value] of Object.entries(schema.shape)) {
    if (value instanceof z.ZodString) {
      definition[key] = value.description || key
    } else if (value instanceof z.ZodArray) {
      if (value.element instanceof z.ZodString) {
        definition[key] = [value.element.description || 'string item']
      } else if (value.element instanceof z.ZodObject) {
        definition[key] = [zodSchemaToFunctionDefinition(value.element)]
      } else {
        definition[key] = ['item']
      }
    } else if (value instanceof z.ZodObject) {
      definition[key] = zodSchemaToFunctionDefinition(value)
    } else {
      definition[key] = key
    }
  }

  return definition
}

/**
 * Create a mock object from a schema for testing
 */
export const createMockObjectFromSchema = (schema: FunctionDefinition | Record<string, any>): any => {
  const mockObj: any = {}

  for (const key in schema) {
    if (typeof schema[key] === 'string') {
      mockObj[key] = `Mock ${key}`
    } else if (Array.isArray(schema[key])) {
      mockObj[key] = [typeof schema[key][0] === 'object' ? createMockObjectFromSchema(schema[key][0] as Record<string, any>) : `Mock ${key} item`]
    } else if (typeof schema[key] === 'object') {
      mockObj[key] = createMockObjectFromSchema(schema[key] as Record<string, any>)
    }
  }

  return mockObj
}

/**
 * Factory function to create an API caller for a specific API endpoint
 */
export const createAPICaller = <T extends FunctionDefinition>(apiCall: (request: any) => Promise<any>, name: string, schema: T, config?: AIConfig) => {
  type OutputType = SchemaToOutput<T>

  return async (input: any, functionConfig?: AIConfig): Promise<OutputType> => {
    const mergedConfig = { ...config, ...functionConfig }
    const request = generateRequest(name, schema, input, mergedConfig)

    try {
      const response = await apiCall(request)
      const result = response.data ?? response

      for (const key in schema) {
        if (Array.isArray(schema[key]) && result[key]) {
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

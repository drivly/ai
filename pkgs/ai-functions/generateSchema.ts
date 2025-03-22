import { FunctionDefinition, SchemaValue } from './types'
import { z } from 'zod'

/**
 * Recursively generates a Zod schema from a FunctionDefinition
 *
 * @param schema The function definition schema to convert to a Zod schema
 * @returns A Zod schema object that validates against the function definition
 */
export const generateSchema = (schema: FunctionDefinition) => {
  // Create an object schema with all the properties from the FunctionDefinition
  return z.object(
    Object.entries(schema).reduce(
      (acc, [key, value]) => {
        acc[key] = schemaValueToZod(value)
        return acc
      },
      {} as Record<string, z.ZodTypeAny>,
    ),
  )
}

/**
 * Converts a SchemaValue to the appropriate Zod schema type
 *
 * @param value The schema value to convert
 * @returns The corresponding Zod schema
 */
const schemaValueToZod = (value: SchemaValue): z.ZodTypeAny => {
  // Handle string values (likely containing description)
  if (typeof value === 'string') {
    // Check if the string contains pipe character for enum options
    if (value.includes('|')) {
      // Split by pipe, trim whitespace, and filter out empty strings
      const enumOptions = value
        .split('|')
        .map((option) => option.trim())
        .filter((option) => option.length > 0)

      // Ensure we have at least one option
      if (enumOptions.length > 0) {
        return z.enum(enumOptions as [string, ...string[]])
      }
    }

    // For simple string values, create a string schema with description
    return z.string().describe(value)
  }

  // Handle array of strings
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    // For empty arrays, return a string array
    if (value.length === 0) {
      return z.string().array()
    }

    // Check if the first string contains pipe character for enum options
    const firstValue = value[0] as string
    if (firstValue.includes('|')) {
      // Split by pipe, trim whitespace, and filter out empty strings
      const enumOptions = firstValue
        .split('|')
        .map((option) => option.trim())
        .filter((option) => option.length > 0)

      // Ensure we have at least one option
      if (enumOptions.length > 0) {
        return z.enum(enumOptions as [string, ...string[]])
      }
    }

    // If we have multiple strings but no pipe characters,
    // treat them as an array of string options
    return z.string().array()
  }

  // Handle nested objects
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    // Recursively build the nested object schema
    const entries = Object.entries(value)
    const objectSchema = z.object(
      entries.reduce(
        (acc, [subKey, subValue]) => {
          acc[subKey] = schemaValueToZod(subValue as SchemaValue)
          return acc
        },
        {} as Record<string, z.ZodTypeAny>,
      ),
    )

    return objectSchema
  }

  // Handle arrays of objects
  if (Array.isArray(value) && value.some((item) => typeof item === 'object' && item !== null)) {
    // Extract object items
    const objectItems = value.filter((item) => typeof item === 'object' && item !== null) as Record<string, SchemaValue>[]

    // If there are no object items, return a string array
    if (objectItems.length === 0) {
      return z.string().array()
    }

    // Create a union type for the array items if needed
    if (objectItems.length === 1) {
      return z.array(schemaValueToZod(objectItems[0]))
    } else {
      // Handle array of different object shapes
      // Make sure we have at least two items for the union
      const schemaItems = objectItems.map((item) => schemaValueToZod(item))
      if (schemaItems.length >= 2) {
        return z.array(z.union([schemaItems[0], schemaItems[1], ...schemaItems.slice(2)]))
      } else {
        // Fallback to any if we don't have enough items for a proper union
        return z.array(z.any())
      }
    }
  }

  // Default to any for unhandled cases
  return z.any()
}

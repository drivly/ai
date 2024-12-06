import { JSONSchema } from 'json-schema-to-ts'

// This is a helper function to generate a JSON schema for string properties.
// It checks if a string includes '|' which would indicate an enum,
// or if it starts with 'number: ' or 'boolean: ' which would indicate
// a number or boolean type respectively, otherwise it defaults to string.
export const parseStringDescription = (description: string): JSONSchema => {
  // Check if the description indicates an enum for string type
  if (description.includes('|')) {
    return { type: 'string', enum: description.split('|').map((v) => v.trim()) }
  } else {
    // Check for 'number: ' prefix
    if (description.startsWith('number: ')) {
      return {
        type: 'number',
        description: description.replace('number: ', ''),
      }
    }
    // Check for 'boolean: ' prefix
    else if (description.startsWith('boolean: ')) {
      return {
        type: 'boolean',
        description: description.replace('boolean: ', ''),
      }
    }
    // Default to string type
    else {
      return { type: 'string', description }
    }
  }
}

/**
 * Given a property description object, generate a JSON schema.
 *
 * @param propDescriptions - A record object with keys as property names
 * and values as descriptions or nested property description objects.
 * @returns A JSON schema object based on the provided descriptions.
 */
export const generateSchema = (propDescriptions: Record<string, string | Record<string, any>>): JSONSchema => {
  // If the propDescriptions is for an object structure
  if (typeof propDescriptions !== 'object' || propDescriptions === null || Array.isArray(propDescriptions)) {
    throw new Error('The propDescriptions parameter should be an object.')
  }

  const properties: Record<string, JSONSchema> = {}
  const required: string[] = Object.keys(propDescriptions)

  for (let [key, description] of Object.entries(propDescriptions)) {
    // TODO: if key ends with '?' then it is nullable
    // const nullable = key.endsWith('?')
    // if (nullable) key = key.slice(0, -1)
    if (typeof description === 'string') {
      // Handle the string description
      properties[key] = parseStringDescription(description)
    } else if (typeof description === 'object' && !Array.isArray(description)) {
      // Recursive call for nested objects
      properties[key] = generateSchema(description)
    } else if (Array.isArray(description)) {
      // Recursive call for nested objects
      const [itemValue] = description
      const itemType = typeof itemValue
      if (itemType == 'string') {
        // If the item is a string, then it is an array of strings
        properties[key] = { type: 'array', description: itemValue, items: { type: 'string' } }
      } else if (itemType == 'object') {
        // If the item is an object, then it is an array of objects, and get the schema for the object
        properties[key] = { type: 'array', items: generateSchema(itemValue) }
      }
    } else {
      throw new Error(`Invalid description for key "${key}".`)
    }
  }

  return { type: 'object', properties, required }
}

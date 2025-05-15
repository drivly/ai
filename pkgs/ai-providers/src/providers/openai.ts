// THIS CODE IS DIRECTLY CLONED FROM @ai-sdk/google PACKAGE
// Modified to edit the schemas for OpenAI models.

import { JSONSchema7Definition } from '@ai-sdk/provider';

/**
 * Converts JSON Schema 7 to OpenAPI Schema 3.0
 */
export function alterSchemaForOpenAI(
  jsonSchema: JSONSchema7Definition,
): unknown {
  // parameters need to be undefined if they are empty objects:
  if (isEmptyObjectSchema(jsonSchema)) {
    return undefined;
  }

  if (typeof jsonSchema === 'boolean') {
    return { type: 'boolean', properties: {} };
  }

  const {
    type,
    description,
    required,
    properties,
    items,
    allOf,
    anyOf,
    oneOf,
    format,
    const: constValue,
    minLength,
    enum: enumValues,
  } = jsonSchema;

  const result: Record<string, unknown> = {};

  if (description) result.description = description;
  if (required) result.required = required;
  // OpenAI doesn't allow format in schema properties

  if (constValue !== undefined) {
    result.enum = [constValue];
  }

  // Process properties first so we can check if it exists for type inference
  if (properties != null) {
    result.properties = Object.entries(properties).reduce(
      (acc, [key, value]) => {
        acc[key] = alterSchemaForOpenAI(value);
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  // Handle type - ensure a type is always present
  // If it has properties, it MUST be an object regardless of the specified type
  if (properties && Object.keys(properties).length > 0) {
    result.type = 'object'
  } else if (type) {
    if (Array.isArray(type)) {
      if (type.includes('null')) {
        result.type = type.filter(t => t !== 'null')[0];
        result.nullable = true;
      } else {
        result.type = type;
      }
    } else if (type === 'null') {
      result.type = 'null';
    } else {
      result.type = type;
    }
  } else {
    // Default to string if no type is specified and no properties exist
    result.type = 'string';
  }

  // Handle enum
  if (enumValues !== undefined) {
    result.enum = enumValues;
  }

  if (items) {
    result.items = Array.isArray(items)
      ? alterSchemaForOpenAI(items[0]) // Just use the first item schema
      : alterSchemaForOpenAI(items);
  }

  // Handle combinators by taking only the first schema
  if (allOf && allOf.length > 0) {
    const firstSchema = alterSchemaForOpenAI(allOf[0]);
    if (typeof firstSchema === 'object') {
      Object.assign(result, firstSchema);
      // Re-check if we need to force type to object after merging
      if (result.properties && Object.keys(result.properties as object).length > 0) {
        result.type = 'object';
      }
    }
  }

  if (anyOf && anyOf.length > 0) {
    const firstSchema = alterSchemaForOpenAI(anyOf[0]);
    if (typeof firstSchema === 'object') {
      Object.assign(result, firstSchema);
      // Re-check if we need to force type to object after merging
      if (result.properties && Object.keys(result.properties as object).length > 0) {
        result.type = 'object';
      }
    }
  }

  if (oneOf && oneOf.length > 0) {
    const firstSchema = alterSchemaForOpenAI(oneOf[0]);
    if (typeof firstSchema === 'object') {
      Object.assign(result, firstSchema);
      // Re-check if we need to force type to object after merging
      if (result.properties && Object.keys(result.properties as object).length > 0) {
        result.type = 'object';
      }
    }
  }

  const illegalKeys = [
    'example',
    'default',
    'minimum',
    'maximum',
    'minLength',
    'maxLength',
    'format'  // Added format to the list of illegal keys
  ]

  for (const key of illegalKeys) {
    if (result[key]) {
      delete result[key]
    }
  }

  result.additionalProperties = false
  result.strict = true

  result.required = Object.keys(result.properties || {})

  // Final check to ensure type is correct based on properties
  if (result.properties && Object.keys(result.properties as object).length > 0) {
    result.type = 'object'
  }

  return result;
}

function isEmptyObjectSchema(jsonSchema: JSONSchema7Definition): boolean {
  return (
    jsonSchema != null &&
    typeof jsonSchema === 'object' &&
    jsonSchema.type === 'object' &&
    (jsonSchema.properties == null ||
      Object.keys(jsonSchema.properties).length === 0)
  );
}
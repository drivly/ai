import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Parses a schema object from functions.do format to a Zod schema
 * 
 * The functions.do schema format uses:
 * - String values as descriptions
 * - Pipe-separated values (a | b | c) as enums
 * - Arrays for array types
 * 
 * @param schema The schema object in functions.do format
 * @returns A Zod schema object
 */
export const parseSchemaToZod = (schema: Record<string, any>): z.ZodObject<any> => {
  const schemaEntries = Object.entries(schema);
  const zodSchemaObj: Record<string, z.ZodTypeAny> = {};

  for (const [key, value] of schemaEntries) {
    if (Array.isArray(value)) {
      // Handle array type - the first item is used as a template
      if (value.length > 0) {
        if (typeof value[0] === 'string') {
          // Array of strings with description
          zodSchemaObj[key] = z.array(z.string().describe(value[0]));
        } else if (typeof value[0] === 'object') {
          // Array of objects - recursively parse the first item as a template
          const nestedZodSchema = parseSchemaToZod(value[0]);
          zodSchemaObj[key] = z.array(nestedZodSchema);
        } else {
          // Default to array of strings
          zodSchemaObj[key] = z.array(z.string());
        }
      } else {
        // Empty array, default to array of strings
        zodSchemaObj[key] = z.array(z.string());
      }
    } else if (typeof value === 'string') {
      // Check if the string contains enum options (pipe-separated values)
      if (value.includes(' | ')) {
        const enumOptions = value.split(' | ').map(option => option.trim());
        zodSchemaObj[key] = z.enum(enumOptions as [string, ...string[]]).describe(value);
      } else {
        // Regular string with description
        zodSchemaObj[key] = z.string().describe(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested object - recursively parse
      zodSchemaObj[key] = parseSchemaToZod(value);
    } else {
      // Default to string for unknown types
      zodSchemaObj[key] = z.string();
    }
  }

  return z.object(zodSchemaObj);
};

/**
 * Converts a functions.do schema to a JSON Schema
 * 
 * @param schema The schema object in functions.do format
 * @returns A JSON Schema object
 */
export const schemaToJsonSchema = (schema: Record<string, any>): Record<string, any> => {
  const zodSchema = parseSchemaToZod(schema);
  return zodToJsonSchema(zodSchema, {
    $refStrategy: 'none',
    target: 'openApi3',
  });
};

/**
 * Validates data against a functions.do schema
 * 
 * @param schema The schema object in functions.do format
 * @param data The data to validate
 * @returns The validated data or throws an error
 */
export const validateWithSchema = <T extends Record<string, any>>(
  schema: Record<string, any>,
  data: any
): T => {
  const zodSchema = parseSchemaToZod(schema);
  return zodSchema.parse(data) as T;
};

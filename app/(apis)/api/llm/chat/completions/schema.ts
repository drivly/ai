import { jsonSchema } from 'ai'

export function convertIncomingSchema(schema: any) {
  // A function to convert any schema to a json schema
  // Supports OpenAI, llm.do, and normal JSON Schema.

  if (schema.type === 'json_schema' && schema.json_schema) {
    // OpenAI compatible schema.
    return schema.json_schema.schema
  }
}

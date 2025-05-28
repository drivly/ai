import { schemaToJsonSchema } from '../language/schemaUtils'

// Define the input and output types for the generateObject utility function
type GenerateObjectInput = {
  functionName: string
  args: any
  schema?: Record<string, any>
  zodSchema?: any
  settings?: {
    referer?: string
    title?: string
    [key: string]: any
  }
}

type GenerateObjectOutput = {
  object: any
  reasoning?: string
  generation: any
  text: string
  generationLatency: number
  request: any
}

/**
 * Utility function to generate an object using AI
 * This is not a Payload task, but a utility function used by executeFunction
 */
export const generateObject = async ({ input, req }: { input: GenerateObjectInput; req: any }): Promise<GenerateObjectOutput> => {
  const { functionName, args, schema, settings } = input
  const start = Date.now()

  // Generate the object
  const prompt = `${functionName}(${JSON.stringify(args)})`

  // Process schema if provided
  let jsonSchema
  let systemMessage = 'Respond ONLY with JSON.'

  if (input.zodSchema) {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    jsonSchema = zodToJsonSchema(input.zodSchema, {
      $refStrategy: 'none',
      target: 'openApi3',
    })
    // Enhance system message with schema information
    systemMessage = `Respond ONLY with JSON that conforms to the following schema: ${JSON.stringify(jsonSchema)}`
  } else if (schema) {
    jsonSchema = schemaToJsonSchema(schema)
    // Enhance system message with schema information
    systemMessage = `Respond ONLY with JSON that conforms to the following schema: ${JSON.stringify(jsonSchema)}`
  }

  const request = {
    model: settings?.model || 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    ...(jsonSchema && { json_schema: jsonSchema }),
    ...settings,
  }

  const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions'
  const referer = settings?.referer || process.env.AI_REFERER
  const title = settings?.title || process.env.AI_TITLE
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY}`,
      ...(referer ? { 'HTTP-Referer': referer } : {}),
      ...(title ? { 'X-Title': title } : {}),
    },
    body: JSON.stringify(request),
  })

  const generation = await response.json()
  const generationLatency = Date.now() - start

  const text = generation?.choices?.[0]?.message?.content || ''
  const reasoning = generation?.choices?.[0]?.message?.reasoning || undefined
  let object: any

  try {
    object = JSON.parse(text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, ''))
  } catch (error) {
    console.error('Error parsing JSON response:', error)
    object = { error: 'Failed to parse JSON response' }
  }

  // Return the output directly
  return {
    object,
    reasoning,
    generation,
    text,
    generationLatency,
    request,
  }
}

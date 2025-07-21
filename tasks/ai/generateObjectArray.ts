import { schemaToJsonSchema } from '../language/schemaUtils'

type GenerateObjectArrayInput = {
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

type GenerateObjectArrayOutput = {
  objectArray: any[]
  reasoning?: string
  generation: any
  text: string
  generationLatency: number
  request: any
}

/**
 * Utility function to generate an array of objects using AI
 * This is not a Payload task, but a utility function used by executeFunction
 */
export const generateObjectArray = async ({ input, req }: { input: GenerateObjectArrayInput; req: any }): Promise<GenerateObjectArrayOutput> => {
  const { functionName, args, schema, settings } = input
  const start = Date.now()

  const prompt = `${functionName}(${JSON.stringify(args)})`

  let jsonSchema
  let systemMessage = 'Respond ONLY with a JSON object that has an "items" property containing an array of objects.'

  if (input.zodSchema) {
    const { zodToJsonSchema } = await import('zod-to-json-schema')
    jsonSchema = zodToJsonSchema(input.zodSchema, {
      $refStrategy: 'none',
      target: 'openApi3',
    })
    systemMessage = `Respond ONLY with a JSON object that has an "items" property containing an array of objects that conform to the following schema: ${JSON.stringify(jsonSchema)}`
  } else if (schema) {
    jsonSchema = schemaToJsonSchema(schema)
    systemMessage = `Respond ONLY with a JSON object that has an "items" property containing an array of objects that conform to the following schema: ${JSON.stringify(jsonSchema)}`
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
  let objectArray: any[] = []

  try {
    const parsed = JSON.parse(text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, ''))

    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
      objectArray = parsed.items
    } else if (Array.isArray(parsed)) {
      objectArray = parsed
    } else {
      objectArray = [parsed]
    }
  } catch (error) {
    console.error('Error parsing JSON array response:', error)
    objectArray = [{ error: 'Failed to parse JSON array response' }]
  }

  return {
    objectArray,
    reasoning,
    generation,
    text,
    generationLatency,
    request,
  }
}

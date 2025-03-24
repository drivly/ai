import { TaskConfig, TaskHandler } from 'payload'

// Define the input and output types for the generateObject task
type GenerateObjectInput = {
  functionName: string
  args: any
  settings?: any
}

type GenerateObjectOutput = {
  object: any
  reasoning?: string
  generation: any
  text: string
  generationLatency: number
  request: any
}

// Implement the task handler with proper return type
export const generateObject: TaskHandler<{ input: GenerateObjectInput; output: GenerateObjectOutput }> = async ({ input, req }) => {
  const { functionName, args, settings } = input
  const start = Date.now()

  // Generate the object
  const prompt = `${functionName}(${JSON.stringify(args)})`
  const request = {
    model: settings?.model || 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: 'Respond ONLY with JSON.' }, // TODO: Figure out how to integrate/configure
      { role: 'user', content: prompt }, // TODO: Merge with prompt settings/config
    ],
    response_format: { type: 'json_object' },
    ...settings,
  }

  const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY}`,
      'HTTP-Referer': 'https://functions.do', // TODO: Figure out the proper logic to set/override the app
      'X-Title': 'Functions.do - Reliable Structured Outputs Without Complexity', // TODO: Figure out a dynamic place for the app title
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

  // Return with the expected TaskHandlerResult structure
  return {
    output: {
      object,
      reasoning,
      generation,
      text,
      generationLatency,
      request
    },
    state: 'succeeded'
  }
}

// Define the task configuration
export const generateObjectTask = {
  retries: 3,
  slug: 'generateObject',
  label: 'Generate Object',
  inputSchema: [
    { name: 'functionName', type: 'text', required: true },
    { name: 'args', type: 'json', required: true },
    { name: 'settings', type: 'json' },
  ],
  outputSchema: [
    { name: 'object', type: 'json' },
    { name: 'reasoning', type: 'text' },
    { name: 'generation', type: 'json' },
    { name: 'text', type: 'text' },
    { name: 'generationLatency', type: 'number' },
    { name: 'request', type: 'json' },
  ],
  handler: generateObject,
} as TaskConfig<{ input: GenerateObjectInput; output: GenerateObjectOutput }>
// Define the input and output types for the generateText utility function
type GenerateTextInput = {
  functionName: string
  args: any
  settings?: any
}

type GenerateTextOutput = {
  text: string
  reasoning?: string
  generation: any
  generationLatency: number
  request: any
}

/**
 * Utility function to generate text using AI
 * This is not a Payload task, but a utility function used by executeFunction
 */
export const generateText = async ({ input, req }: { input: GenerateTextInput; req: any }): Promise<GenerateTextOutput> => {
  const { functionName, args, settings } = input
  const start = Date.now()

  // Generate the text
  const prompt = `${functionName}(${JSON.stringify(args)})`
  const request = {
    model: settings?.model || 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: 'Respond in markdown format.' }, // Default system prompt for markdown
      { role: 'user', content: prompt }, // TODO: Merge with prompt settings/config
    ],
    ...settings,
  }

  const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions'
  
  console.log(`Using AI gateway URL: ${url}`)
  console.log(`Environment: ${process.env.VERCEL_ENV || 'local'}`)
  
  try {
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

    // Return the output directly
    return {
      text,
      reasoning,
      generation,
      generationLatency,
      request,
    }
  } catch (error) {
    console.error('Error generating text:', error)
    const generationLatency = Date.now() - start
    
    return {
      text: 'Error generating content. Please try again later.',
      reasoning: `Error: ${error instanceof Error ? error.message : String(error)}`,
      generation: { error: String(error) },
      generationLatency,
      request,
    }
  }
}

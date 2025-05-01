import { auth } from '@/auth'
import { streamText, generateObject, streamObject, generateText, resolveConfig, createLLMProvider } from '@/pkgs/ai-providers/src'
import { CoreMessage, jsonSchema, createDataStreamResponse, tool } from 'ai'

export const maxDuration = 600
export const dynamic = 'force-dynamic'

type OpenAICompatibleRequest = {
  model: string;
  messages?: CoreMessage[];
  prompt?: string;
  system?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  response_format?: any;
  tools?: any;
}

export async function POST(req: Request) {
  const qs = new URL(req.url).searchParams

  // Support both normal auth, and API key authentication
  let session = await auth()
  let apiKey = req.headers.get('Authorization') || ''

  if (!session && !apiKey) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (apiKey) {
    // Remove the Bearer prefix
    apiKey = apiKey.split(' ')[1]
      .replace('sk-do-', 'sk-or-')

    // Make sure the API key is valid
    const identifyUser = async (offset: number = 0) => {
      const res = await fetch(`https://openrouter.ai/api/v1/keys?offset=${ offset }`, {
        headers: {
          'Authorization': `Bearer ${ process.env.OPENROUTER_PROVISIONING_KEY }`
        }
      })
        .then(x => x.json())
        .then(x => x.data)

      if (res.length === 0) {
        return null
      }

      // We can only match on the first 3 characters, and the last 3 of the API key.
      const keyAfterIntro = apiKey.split('-v1-')[1]
      const fixedApiKey = keyAfterIntro.slice(0, 3) + '...' + keyAfterIntro.slice(-3)

      const keyMatch = res.find((key: { label: string }) => key.label.split('-v1-')[1] === fixedApiKey)

      if (!keyMatch) {
        // Loop again until we find a match or we've ran out
        return await identifyUser(
          offset + res.length
        )
      }

      return {
        authenticationType: 'apiKey',
        email: keyMatch.name
      }
    }

    const user = await identifyUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    session = {
      user: {
        id: user.email,
        email: user.email
      },
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
    }
  }

  // Support both GET and POST requests
  let postData = {}

  try {
    postData = await req.json()
  } catch (error) {
    // Convert the query string into an object
    postData = Object.fromEntries(qs.entries())
  }

  const {
    model = 'openai/gpt-4.1',
    messages,
    prompt,
    system,
    temperature,
    max_tokens,
    top_p,
    stream,
    response_format,
    tools: userTools
  } = postData as OpenAICompatibleRequest

  if (!prompt && !messages) {
    return new Response('No prompt or messages provided', { status: 400 })
  }

  const llm = createLLMProvider({
    baseURL: 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter',
    apiKey: apiKey,
    headers: {
      'HTTP-Referer': 'http://workflows.do',
      'X-Title': 'Workflows.do'
    }
  })

  const llmModel = llm(model)

  // Fix user tools to be able to be used by our system
  const tools: Record<string, any> = {}

  for (const [name, toolData] of Object.entries((userTools ?? {}) as Record<string, any>)) {
    tools[toolData.function.name] = tool({
      type: 'function',
      description: toolData.function.description,
      parameters: jsonSchema(toolData.function.parameters)
    })
  }

  const openAiResponse = (result: any) => {
    return Response.json({
      id: result.id,
      object: 'llm.completion',
      created: Date.now(),
      model,
      choices: [
        {
          message: {
            content: result.text,
            role: 'assistant',
            tool_calls: result.toolCalls.map((toolCall: any) => ({
              index: 0,
              id: toolCall.id,
              type: 'function',
              function: {
                name: toolCall.toolName,
                arguments: JSON.stringify(toolCall.args)
              }
            }))
          },
          index: 0,
          finish_reason: 'stop'
        }
      ],  
      usage: {
        prompt_tokens: result.usage.prompt_tokens,
        completion_tokens: result.usage.completion_tokens,
        total_tokens: result.usage.total_tokens
      }
    })
  }

  if (stream) {
    if (response_format) {
      const result = await streamObject({
        model: llmModel,
        system,
        messages,
        prompt,
        user: session?.user.email || '',
        schema: jsonSchema(response_format),
        onError({ error }) {
          console.error(error); // your error logging logic here
        }
      })

      return result.toTextStreamResponse()
    } else {
      
      const result = await streamText({
        model: llmModel,
        system,
        messages,
        prompt,
        user: session?.user.email || '',
        maxSteps: 50
      })
    
      return result.toDataStreamResponse()
    }
  } else {
    if (response_format) {
      const result = await generateObject({
        model: llmModel,
        system,
        messages,
        prompt, 
        user: session?.user.email || '',
        mode: 'json',
        schema: jsonSchema(response_format)
      })

      return Response.json({
        data: result.object
      })
    } else {
      const result = await generateText({
        model: llmModel,
        system,
        messages,
        prompt,
        user: session?.user.email || '',
        maxSteps: 10,
        tools
      })

      return openAiResponse(result)
    }
  }
}

export const GET = POST

import { auth } from '@/auth'
import { streamText, generateObject, streamObject, generateText, resolveConfig } from '@/pkgs/ai-providers/src'
import { CoreMessage, jsonSchema, createDataStreamResponse } from 'ai'


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
}

export async function POST(req: Request) {
  const qs = new URL(req.url).searchParams

  const session = await auth()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
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
    response_format
  } = postData as OpenAICompatibleRequest

  if (!prompt && !messages) {
    return new Response('No prompt or messages provided', { status: 400 })
  }

  const openAiResponse = (body: any, usage: any) => {
    return Response.json({
      id: body.id,
      object: 'llm.completion',
      created: Date.now(),
      model,
      choices: [
        {
          message: {
            content: body,
            role: 'assistant'
          },
          index: 0,
          finish_reason: 'stop'
        }
      ],  
      usage: {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens
      }
    })
  }

  if (stream) {
    if (response_format) {
      const result = await streamObject({
        model,
        system,
        messages,
        prompt,
        user: session.user.email || '',
        schema: jsonSchema(response_format),
        onError({ error }) {
          console.error(error); // your error logging logic here
        },
      })

      return result.toTextStreamResponse()
    } else {
      
      const result = await streamText({
        model,
        system,
        messages,
        prompt,
        user: session.user.email || '',
        maxSteps: 50
      })
    
      return result.toDataStreamResponse()
    }
  } else {
    if (response_format) {
      const result = await generateObject({
        model,
        system,
        messages,
        prompt,
        user: session.user.email || '',
        mode: 'json',
        schema: jsonSchema(response_format)
      })

      return Response.json({
        data: result.object
      })
    } else {
      const result = await generateText({
        model,
        system,
        messages,
        prompt,
        user: session.user.email || '',
        maxSteps: 25
      })

      return openAiResponse(result.text, result.usage)
    }
  }
}

export const GET = POST

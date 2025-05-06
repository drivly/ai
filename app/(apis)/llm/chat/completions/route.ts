import { auth } from '@/auth'
import { streamText, generateObject, streamObject, generateText, resolveConfig, createLLMProvider } from '@/pkgs/ai-providers/src'
import { CoreMessage, jsonSchema, createDataStreamResponse, tool } from 'ai'
import { parse, getModel } from '@/pkgs/language-models'

import {
  alterSchemaForOpenAI
} from '@/pkgs/ai-providers/src/providers/openai'

import {
  convertJSONSchemaToOpenAPISchema
} from '@/pkgs/ai-providers/src/providers/google'

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
  /*
  * If true, the response will be streamed as a data stream response
  * This is used by the useChat hook in the client
  */
  useChat?: boolean;
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
  let postData: OpenAICompatibleRequest = {
    model: 'openai/gpt-4.1',
  }

  try {
    postData = await req.json()

    // Mixin query string into the post data
    postData = {
      ...postData,
      ...Object.fromEntries(qs.entries())
    }

  } catch (error) {
    // Convert the query string into an object
    postData = {
      model: 'openai/gpt-4.1',
      ...Object.fromEntries(qs.entries())
    }
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
    tools: userTools
  } = postData as OpenAICompatibleRequest

  // Overwritable variables
  let {
    response_format
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

  const { parsed: parsedModel, ...modelData } = getModel(model)

  console.log(
    parsedModel
  )

  if (parsedModel.outputSchema) {
    const schema = await fetch(
      `https://cdn.jsdelivr.net/gh/charlestati/schema-org-json-schemas/schemas/${ parsedModel.outputSchema }.schema.json`
    ).then(x => x.json())

    switch (modelData.author) {
      case 'openai':
        response_format = alterSchemaForOpenAI(schema)
        break
      case 'google':
        response_format = convertJSONSchemaToOpenAPISchema(schema)
        break
      default:
        response_format = schema
    }
  }

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
      id: result.id || `msg-${ Math.random().toString(36).substring(2, 15) }`,
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

  console.log(
    'Using', stream ? 'streaming' : 'non-streaming',
    'with', response_format ? 'response_format' : 'no response_format'
  )

  if (stream) {
    if (response_format) {

      let generateObjectError: (error: string) => void = () => {}
      const generateObjectErrorPromise = new Promise<string | null>((resolve) => {
        generateObjectError = resolve
      })

      const result = await streamObject({
        model: llmModel,
        system,
        messages,
        prompt,
        user: session?.user.email || '',
        // @ts-expect-error - Type error to be fixed.
        //schema: jsonSchema(response_format),
        output: 'no-schema',
        onError({ error }) {
          console.error(error); // your error logging logic here
          generateObjectError(JSON.stringify(error))
        }
      })

      if (postData.useChat) {
        return createDataStreamResponse({
          execute: async(dataStream) => {
            const textStream = result.textStream

            // When this promise resolves, it will have an error.
            // We need to pass this error to the client so it can be displayed.
            generateObjectErrorPromise.then(error => {
              dataStream.write(`0:"${ error?.replaceAll('"', '\\"') }"\n`)
            })

            // Simulate a message id
            dataStream.write(`f:{"messageId":"hi"}\n`)

            const formatChunk = (chunk: string) => {
              // Make sure that the chunk can be parsed as JSON
              return chunk.replaceAll('"', '\\"').replaceAll('\n', '\\n')
            }

            dataStream.write(`0:"\`\`\`json\\n"\n`)
            
            for await (const chunk of textStream) {
              dataStream.write(`0:"${ formatChunk(chunk) }"\n`)
            }

            dataStream.write(`0:"\\n\`\`\`"\n`)

            // Fixes usagePromise not being exposed via the types
            const usage = (result as any).usagePromise.status.value as {
              promptTokens: number
              completionTokens: number
              totalTokens: number
            }

            //dataStream.write(`e:{"finishReason":"stop","usage":{"promptTokens":2217,"completionTokens":70},"isContinued":false}\n`)
            //dataStream.write(`d:{"finishReason":"stop","usage":{"promptTokens":2367,"completionTokens":89}}\n`)
          }
        })
      } else {
        return result.toTextStreamResponse()
      }
    } else {
      
      const result = await streamText({
        model: llmModel,
        system,
        messages,
        prompt,
        user: session?.user.email || '',
        maxSteps: 50
      })
    
      // We need to support both streaming and useChat use cases.
      if (postData.useChat) {
        return result.toDataStreamResponse()
      } else {
        return result.toTextStreamResponse()
      }
    }
  } else {
    if (response_format) {
      const schema = jsonSchema(response_format)


      const result = await generateObject({
        model: llmModel,
        system,
        messages,
        prompt, 
        user: session?.user.email || '',
        mode: 'json',
        // @ts-expect-error - Type error to be fixed.
        schema
      })

      return Response.json(result.object)
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
import { auth } from '@/auth'
import { findKey } from '@/lib/openrouter'
import { createLLMProvider, generateObject, generateText, streamObject, streamText } from '@/pkgs/ai-providers/src'
import { convertJSONSchemaToOpenAPISchema } from '@/pkgs/ai-providers/src/providers/google'
import { alterSchemaForOpenAI } from '@/pkgs/ai-providers/src/providers/openai'
import { filterModels, getModel } from '@/pkgs/language-models'
import { LLMCompatibleRequest, OpenAICompatibleRequest } from '@/sdks/llm.do/src'
import { CoreMessage, createDataStreamResponse, jsonSchema, tool } from 'ai'
import { createDataPoint } from './analytics'
import { injectFormatIntoSystem } from './responseFormats'
import { convertIncomingSchema } from './schema'
import { schemas } from './schemas'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const ErrorResponse = (message: string, code: number = 400) => {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status: code },
  )
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
    apiKey = apiKey.split(' ')[1].replace('sk-do-', 'sk-or-')

    // Make sure the API key is valid
    const keyMatch = await findKey(apiKey)
    const user = keyMatch
      ? {
          authenticationType: 'apiKey',
          email: keyMatch.name,
        }
      : null

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    session = {
      user: {
        id: user.email,
        email: user.email,
      },
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    }
  }

  // Support both GET and POST requests
  let postData: Partial<OpenAICompatibleRequest> = {}

  try {
    postData = await req.json()

    // Mixin query string into the post data
    postData = {
      ...postData,
      ...Object.fromEntries(qs.entries()),
    }
  } catch (error) {
    // Convert the query string into an object
    postData = {
      ...Object.fromEntries(qs.entries()),
    }
  }

  const { model, prompt, stream, tools: userTools, ...rest } = postData as OpenAICompatibleRequest

  // Overwritable variables
  let { response_format, system, messages } = postData as OpenAICompatibleRequest

  // llm.do superset OpenAI standard
  const { modelOptions, useChat } = postData as LLMCompatibleRequest

  if (!prompt && !messages) {
    return ErrorResponse('No prompt or messages provided')
  }

  system = injectFormatIntoSystem(system || '', (modelOptions?.outputFormat || '').replace('Code:', ''), useChat || false)

  // Fix messages to be in the VerceL AI SDK format.
  // Most notibly, we need to fix files coming in as OpenAI compatible
  // and translate it for the user.

  if (messages) {
    // Swap tool role for assistant role.
    // Tool responses from user tools comes in as tool role, which is not compatible with
    // the AI SDK.
    messages = messages.map((message): CoreMessage =>
      message.role === 'tool' ? { ...message, role: 'assistant' } : message,
    )

    if (!messages) {
      return ErrorResponse('No messages provided')
    }

    // Check to see if this message is a file, and in the open ai format.
    // First get the indexes of file messages
    const fileMessageIndexes: number[] = []

    for (const [index, message] of messages.entries()) {
      const content = (message as any).content
      if (Array.isArray(content) && content[0]?.type === 'file' && content[0]?.file?.file_data) {
        fileMessageIndexes.push(index)
      }
    }

    let tempMessages: CoreMessage[] = []

    for (const index of Array.from({ length: messages.length }, (_, i) => i)) {
      const message = messages[index]
      // const file = message.content[0] as unknown as {
      //   type: 'file'
      //   file: {
      //     filename: string
      //     file_data: string
      //   }
      // }

      // Translate the file to the VerceL AI SDK format
      if (fileMessageIndexes.includes(index)) {
        const fileData = (message as any).content[0].file.file_data as string
        tempMessages.push({
          role: message.role as 'user',
          content: [
            {
              type: 'file',
              data: fileData,
              mimeType: 'application/pdf',
            },
          ],
        })
      } else {
        tempMessages.push(message)
      }
    }

    messages = tempMessages
  }

  console.log(postData)

  const llm = createLLMProvider({
    baseURL: 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-testing/openrouter',
    apiKey: apiKey,
    headers: {
      'HTTP-Referer': 'http://workflows.do',
      'X-Title': 'Workflows.do',
    },
  })

  const llmModel = llm(model, modelOptions as any)

  const { parsed: parsedModel, ...modelData } = getModel(model, modelOptions ?? {})

  if (!modelData.slug) {
    const modelExists = filterModels(model.split('(')[0])

    if (modelExists.models.length > 0) {
      const requestedCapabilities = Object.keys(modelOptions ?? {})

      return Response.json(
        {
          success: false,
          type: 'MODEL_INCOMPATIBLE',
          error: `Model ${model} has no providers with given options and constraints. ${requestedCapabilities.length > 0 ? `The following capabilities are not supported by this model: ${requestedCapabilities.join(', ')}` : ''}`,
          requestedCapabilities,
        },
        { status: 404 },
      )
    } else {
      return Response.json(
        {
          success: false,
          type: 'MODEL_NOT_FOUND',
          error: `Model ${model} does not exist. Please check the model name and try again.`,
        },
        { status: 404 },
      )
    }
  }

  const fixSchema = (schema: any) => {
    switch (modelData.author) {
      case 'openai':
        return alterSchemaForOpenAI(schema)
      case 'google':
        return convertJSONSchemaToOpenAPISchema(schema)
      default:
        return schema
    }
  }

  if (response_format) {
    response_format = fixSchema(convertIncomingSchema(response_format))
  }

  // Only run this if we dont already have a response_format
  if (!response_format && parsedModel.outputSchema) {
    if (parsedModel.outputSchema !== 'JSON') {
      // If its an internal schema, like W2, then use that instead of Schema.org.
      if (schemas[parsedModel.outputSchema]) {
        response_format = schemas[parsedModel.outputSchema]
      } else {
        const schema = await fetch(`https://cdn.jsdelivr.net/gh/charlestati/schema-org-json-schemas/schemas/${parsedModel.outputSchema}.schema.json`).then((x) => x.json())

        response_format = jsonSchema(fixSchema(schema))
      }
    }
  }

  // Fix user tools to be able to be used by our system
  const tools: Record<string, any> = {}

  for (const [_name, toolData] of Object.entries((userTools ?? {}) as Record<string, any>)) {
    tools[toolData.function.name] = tool({
      type: 'function',
      description: toolData.function.description,
      parameters: jsonSchema(fixSchema(toolData.function.parameters)),
    })
  }

  const openAiResponse = (result: any) => {
    const body = {
      id: result.id || `msg-${Math.random().toString(36).substring(2, 15)}`,
      object: 'llm.completion',
      created: Date.now(),
      model,
      provider: modelData.provider,
      parsed: parsedModel,
      choices: [
        {
          message: {
            content: result.text,
            role: 'assistant',
            tool_calls: (result.toolCalls || []).map((toolCall: any) => ({
              index: 0,
              id: toolCall.id,
              type: 'function',
              function: {
                name: toolCall.toolName,
                arguments: JSON.stringify(toolCall.args),
              },
            })),
          },
          index: 0,
          finish_reason: 'stop',
        },
      ],
      usage: result.usage
        ? {
            prompt_tokens: result.usage.prompt_tokens,
            completion_tokens: result.usage.completion_tokens,
            total_tokens: result.usage.total_tokens,
          }
        : undefined,
    }

    return Response.json(body, {
      // Send partial data via headers as AI SDK does not support viewing the raw body.
      headers: {
        'llm-provider': modelData.provider.name,
        'llm-model': model,
        'llm-model-options': JSON.stringify(modelOptions),
        'llm-parsed-model': JSON.stringify(parsedModel),
        'llm-response-format': JSON.stringify(response_format),
        'keep-alive': 'timeout=600',
        'x-powered-by': 'llm.do',
      },
    })
  }

  const openAIStreamableResponse = (textStream: any) => {
    // We need to replicate this response format:
    // data: {"id": "chatcmpl-81ac59df-6615-4967-9462-a0d4bcb002dd", "model": "llama3.2-3b-it-q6", "created": 1733773199, "object": "chat.completion.chunk", "choices": [{"index": 0, "delta": {"content": " any"}, "logprobs": null, "finish_reason": null}]}
    // data: {"id":"gen-1746649993-JcAnN9JWfGSdco3C13ad","provider":"Google AI Studio","model":"google/gemini-2.0-flash-lite-001","object":"chat.completion.chunk","created":1746649993,"choices":[{"index":0,"delta":{"role":"assistant","content":"Okay"},"finish_reason":null,"native_finish_reason":null,"logprobs":null}]}

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const id = `chatcmpl-${Math.random().toString(36).substring(2, 15)}`

        for await (const chunk of textStream) {
          const openAICompatibleChunk = {
            id,
            model,
            created: Date.now(),
            object: 'chat.completion.chunk',
            choices: [
              {
                index: 0,
                delta: {
                  content: chunk,
                },
                logprobs: null,
                finish_reason: null,
              },
            ],
          }

          ;(dataStream as any).write(`data: ${JSON.stringify(openAICompatibleChunk)}\n\n`)
        }

        // Send the stop reason chunk
        ;(dataStream as any).write(
          `data: ${JSON.stringify({
            id: `chatcmpl-${Math.random().toString(36).substring(2, 15)}`,
            model,
            created: Date.now(),
            object: 'chat.completion.chunk',
            choices: [],
            finish_reason: 'stop',
          })}\n`,
        )
      },
    })
  }

  console.log('Using', stream ? 'streaming' : 'non-streaming', 'with', response_format ? 'response_format' : 'no response_format')

  console.log('Using tools', tools)

  const onTool = async (tool: string, args: any, result: object) => {
    createDataPoint(
      'llm.tool-use',
      {
        user: session?.user.email || '',
        tool,
        args,
      },
      result,
    )
  }

  try {
    const headers = {
      'HTTP-Referer': 'http://workflows.do',
      'X-Title': 'Workflows.do',
      Authorization: `Bearer ${apiKey}`,
    }
    if (stream) {
      if (response_format || parsedModel.outputSchema === 'JSON') {
        let generateObjectError: (error: string) => void = () => {}
        const generateObjectErrorPromise = new Promise<string | null>((resolve) => {
          generateObjectError = resolve
        })

        const result = await streamObject({
          ...rest,
          headers,
          model: llmModel,
          modelOptions,
          system,
          messages,
          prompt,
          user: session?.user.email || '',
          schema: parsedModel.outputSchema === 'JSON' ? undefined : jsonSchema(response_format),
          output: parsedModel.outputSchema === 'JSON' ? ('no-schema' as const) : undefined,
          onError({ error }) {
            console.error(error) // your error logging logic here
            generateObjectError(JSON.stringify(error))
          },
          onTool,
        })

        if (useChat) {
          return createDataStreamResponse({
            execute: async (dataStream) => {
              const textStream = result.textStream

              // When this promise resolves, it will have an error.
              // We need to pass this error to the client so it can be displayed.
              generateObjectErrorPromise.then((error) => {
                dataStream.write(`0:"${error?.replaceAll('"', '\\"')}"\n`)
              })

              // Simulate a message id
              dataStream.write(`f:{"messageId":"msg-${Math.random().toString(36).substring(2, 15)}"}\n`)

              const formatChunk = (chunk: string) => {
                // Make sure that the chunk can be parsed as JSON
                return chunk.replaceAll('"', '\\"').replaceAll('\n', '\\n')
              }

              dataStream.write(`0:"\`\`\`json\\n"\n`)

              for await (const chunk of textStream) {
                dataStream.write(`0:"${formatChunk(chunk)}"\n`)
              }

              dataStream.write(`0:"\\n\`\`\`"\n`)

              // // Fixes usagePromise not being exposed via the types
              // const usage = (result as any).usagePromise.status.value as {
              //   promptTokens: number
              //   completionTokens: number
              //   totalTokens: number
              // }

              //dataStream.write(`e:{"finishReason":"stop","usage":{"promptTokens":2217,"completionTokens":70},"isContinued":false}\n`)
              //dataStream.write(`d:{"finishReason":"stop","usage":{"promptTokens":2367,"completionTokens":89}}\n`)
            },
          })
        } else {
          const response = result.toTextStreamResponse()

          response.headers.set('Content-Type', 'application/json; charset=utf-8')

          return response
        }
      } else {
        const result = await streamText({
          ...rest,
          headers,
          model: llmModel,
          modelOptions,
          system,
          messages,
          prompt,
          user: session?.user.email || '',
          maxSteps: 50,
          tools,
          onTool,
          onChunk: (chunk: any) => {
            console.log('Chunk', chunk)
          },
        })

        // We need to support both streaming and useChat use cases.
        if (useChat) {
          return result.toDataStreamResponse()
        } else {
          return openAIStreamableResponse(result.textStream)
        }
      }
    } else {
      if (response_format) {
        const schema = jsonSchema(response_format)

        const result = await generateObject({
          ...rest,
          headers,
          model: llmModel,
          modelOptions,
          system,
          messages,
          prompt,
          user: session?.user.email || '',
          schema,
          onTool,
          maxSteps: 10,
        })

        ;(result as any).text = JSON.stringify(result.object)

        return openAiResponse(result)
      } else {
        let result = await generateText({
          ...rest,
          headers,
          model: llmModel,
          modelOptions,
          system,
          messages,
          prompt,
          user: session?.user.email || '',
          maxSteps: 10,
          tools,
          onTool,
        })

        const hasJsonTool = !!tools.json

        if (hasJsonTool && !result.toolCalls.length) {
        }

        return openAiResponse(result)
      }
    }
  } catch (e) {
    console.error(e)

    switch ((e as { type: string }).type) {
      case 'AI_PROVIDERS_TOOLS_AUTHORIZATION':
        const error = e as any

        return Response.json(
          {
            success: false,
            type: 'TOOL_AUTHORIZATION',
            error: `To continue with this request, please authorize the following apps: ${error.apps.join(', ')}`,
            connectionRequests: error.connectionRequests,
            apps: error.apps,
          },
          { status: 400 },
        )
      default:
        return Response.json(
          {
            success: false,
            type: 'INTERNAL_SERVER_ERROR',
            error: 'An error occurred while processing your request. This has been logged and will be investigated. Please try again later.',
          },
          { status: 500 },
        )
    }
  }
}

export const GET = POST

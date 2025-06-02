import { auth } from '@/auth'
import { findKey } from '@/lib/openrouter'
import config from '@/payload.config'
import { createLLMProvider, generateObject, generateText, streamObject, streamText } from '@/pkgs/ai-providers/src'
import { convertJSONSchemaToOpenAPISchema } from '@/pkgs/ai-providers/src/providers/google'
import { alterSchemaForOpenAI } from '@/pkgs/ai-providers/src/providers/openai'
import { waitUntil } from '@vercel/functions'
import { filterModels, getModel } from '@/pkgs/language-models/src'
import { LLMCompatibleRequest, OpenAICompatibleRequest } from '@/sdks/llm.do/src'
import { jsonSchema, ToolSet, GenerateTextResult, GenerateObjectResult, JSONValue, StepResult, StreamObjectOnFinishCallback, Output, tool, hasToolCall, StreamTextResult, stepCountIs, createUIMessageStreamResponse, streamText as aiStreamText, ModelMessage, convertToModelMessages, createUIMessageStream } from 'ai'
import { getPayload } from 'payload'
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
    if (apiKey.includes(' ')) {
      apiKey = apiKey.split(' ')[1].replace('sk-do-', 'sk-or-')
    }

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

  const { model = process.env.DEFAULT_MODEL || '', prompt, stream, tools: userTools, ...rest } = postData as OpenAICompatibleRequest

  // Overwritable variables + llm.do superset OpenAI standard
  let { response_format, system, messages, modelOptions = {}, useChat, chatId } = postData as OpenAICompatibleRequest & LLMCompatibleRequest

  // TODO: Figure out the message format

  if (chatId) {
    // This is a useChat request so we need to convert it to model messages first
    messages = convertToModelMessages(messages as any)
  }

  if (!prompt && !messages) {
    return ErrorResponse('No prompt or messages provided')
  }

  if (useChat && !stream) {
    // Return error
    return ErrorResponse('useChat is only supported when streaming is true')
  }

  // TODO: Pull from a database for these formats.
  // This isnt dynamic and will lead to problems down the line as we need to update the code to update the formats.
  system = injectFormatIntoSystem(system || '', (modelOptions?.outputFormat || '').replace('Code:', ''), useChat || false)

  // Fix messages to be in the VerceL AI SDK format.
  // Most notibly, we need to fix files coming in as OpenAI compatible
  // and translate it for the user.

  const modelMessages: ModelMessage[] = []

  if (messages) {
    // Swap tool role for assistant role.
    // Tool responses from user tools comes in as tool role, which is not compatible with
    // the AI SDK.
    // @ts-expect-error - Read above
    messages = messages.map((message) => {
      if (message.role === 'tool') {
        return {
          ...message,
          role: 'assistant',
        }
      }

      return message
    })

    if (!messages) {
      return ErrorResponse('No messages provided')
    }

    // OpenAI files come in as the wrong format.
    for (const message of (messages as any)) {
      const fixedMessageContent = []

      if (typeof message.content === 'string') {
        modelMessages.push({
          role: message.role,
          content: message.content
        })
        continue
      }

      for (const messageChunks of message.content) {
        if (messageChunks?.type === 'file' && messageChunks?.file?.file_data) {
          fixedMessageContent.push({
            type: 'file',
            data: messageChunks.file.file_data,
            mediaType: messageChunks.file.mime_type || messageChunks.file.file_data.split(';')[0].replace('data:', ''),
            filename: messageChunks.file.filename,
          })
        } else {
          fixedMessageContent.push(messageChunks)
        }
      }

      modelMessages.push({
        role: message.role,
        content: fixedMessageContent
      })
    }

    messages = modelMessages
  }

  console.log(
    `Incoming request:`
  )

  console.dir(
    postData,
    { depth: null }
  )

  // If the user requests tools, force modelOptions.capabilities to include tools
  const hasTools = [
    userTools && Object.keys(userTools).length > 0,
    modelOptions?.tools && modelOptions.tools.length > 0,
    response_format
  ]

  if (hasTools.some(x => x)) {
    modelOptions.capabilities = [
      ...(modelOptions.capabilities || []),
      'tools'
    ]
  }

  const llm = createLLMProvider({
    baseURL: 'https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-testing/openrouter',
    apiKey: apiKey,
    headers: {
      'HTTP-Referer': 'http://workflows.do',
      'X-Title': 'Workflows.do',
    },
  })

  // @ts-expect-error - Object is coming from the client
  const llmModel = llm(model, modelOptions)

  const { parsed: parsedModel, ...modelData } = getModel(model, modelOptions ?? {})

  console.log(modelData, parsedModel)

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
        return alterSchemaForOpenAI(schema)
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

        response_format = jsonSchema(fixSchema(schema) as any)
      }
    }
  }

  // Fix user tools to be able to be used by our system
  const tools: Record<string, any> = {}

  for (const [_name, toolData] of Object.entries((userTools ?? {}) as Record<string, any>)) {
    tools[toolData.function.name] = tool({
      type: 'function',
      description: toolData.function.description,
      parameters: jsonSchema(fixSchema(toolData.function.parameters) as any),
    })
  }

  const openAiResponse = (result: any) => {
    // Log to database.
    recordEvent(result, apiKey, session?.user.email || '')

    const body = {
      id: result.id || result.response.id || `msg-${Math.random().toString(36).substring(2, 15)}`,
      object: 'llm.completion',
      created: Date.now(),
      model,
      provider: modelData.provider,
      parsed: parsedModel,
      choices: [
        {
          message: {
            content: 'text' in result ? result.text : JSON.stringify(result.object),
            role: 'assistant',
            tool_calls: (('toolCalls' in result && result.toolCalls) || []).map((toolCall: any) => ({
              index: 0,
              id: ('id' in toolCall && toolCall.id) || toolCall.toolCallId,
              type: 'function',
              function: {
                name: toolCall.toolName,
                arguments: JSON.stringify(toolCall.args),
              },
            })),
            reasoning: result.reasoning,
          },
          index: 0,
          finish_reason: 'stop',
        },
      ],
      usage: result.usage
        ? {
            prompt_tokens: ('prompt_tokens' in result.usage && result.usage.prompt_tokens) || result.usage.promptTokens,
            completion_tokens: ('completion_tokens' in result.usage && result.usage.completion_tokens) || result.usage.completionTokens,
            total_tokens: ('total_tokens' in result.usage && result.usage.total_tokens) || result.usage.totalTokens,
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

  console.log('Using', stream ? 'streaming' : 'non-streaming', 'with', response_format ? 'response_format' : 'no response_format')

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

  const constructError = (type: string, message: string) => {
    const error = new Error(message) as Error & { type: string }
    error.type = type
    return error
  }

  const errors = {
    NO_OBJECT_GENERATED: constructError('NO_OBJECT_GENERATED', 'No object was generated.'),
    UNKNOWN_ERROR: constructError('UNKNOWN_ERROR', 'An unknown error occurred while processing your request. This has been logged and will be investigated. Please try again later.'),
  }

  try {
    if (modelOptions?.capabilities?.includes('tools')) {
      tools['fetch'] = tool({
        type: 'function',
        description: 'Fetch a URL and return the result.',
        parameters: jsonSchema({
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to fetch.',
            },
          },
          additionalProperties: false,
          required: [ 'url' ]
        }),
        execute: async (args: any) => {
          const url = args.url as string
          const response = await fetch(url)
          const text = await response.text()
          return text
        }
      })
    }

    if (response_format) {
      // Add this to the system prompt to tell the model to use the tool when done.
      system = system + `\n\nWhen you are done, you MUST use the jsonOutput tool to indicate to the user that you are done.`

      tools['jsonOutput'] = tool({
        type: 'function',
        description: 'Output the result in a JSON format.',
        parameters: jsonSchema(fixSchema(response_format) as any),
      })
    }

    // Force using messages over prompt

    if (prompt && !messages) {
      messages = [
        {
          role: 'user',
          content: prompt
        }
      ]
    }

    let errorPromiseResolve: (value: unknown) => void

    const errorPromise = new Promise(res => {
      errorPromiseResolve = res
    })

    const generateSettings = {
      model: llmModel,
      system,
      messages: messages as any, 
      tools,
      maxTokens: modelOptions?.maxTokens || undefined,
      user: session?.user.email || '',
      stopWhen: [
        response_format ? hasToolCall('jsonOutput') : undefined,
        stepCountIs(10)
      ].filter(x => !!x),
      onTool,
      onError: (error: any) => {
        errorPromiseResolve(error)

        return error.message
      }
    }

    if (stream) {
      // @ts-expect-error - TS doesnt know this is a valid property.
      generateSettings.onFinish = (result: any) => {
        recordEvent(result, apiKey, session?.user.email || '')
      }

      // @ts-expect-error - TS doesnt know this is a valid property.
      generateSettings.onStepFinish = (result: any) => {
        recordEvent(result, apiKey, session?.user.email || '')
      }
    }

    let result = await (stream ? streamText : generateText)(generateSettings)

    if (response_format && !stream) {

      let hasObjectBeenGenerated = false
      let object = {}

      if (result.finishReason === 'tool-calls' && result.toolCalls.length > 0) {
        // Check if the jsonOutput tool is in the final response
        for (const toolCall of result.toolCalls) {
          if (toolCall.toolName === 'jsonOutput') {
            hasObjectBeenGenerated = true

            object = toolCall.args
          }
        }
      } else {
        // Recall but force the model to use the tool.
        const messagesToRetransmit = (JSON.parse((result.request as any).body as string)).messages.map((x: any) => {
          x.role = 'assistant' // AI SDK is weird?
          return x
        })

        // Add the newest message to the history and then resend the request but forcing the jsonOutput tool.

        messagesToRetransmit.push({
          role: 'assistant',
          content: result.text
        })

        messagesToRetransmit.push({
          role: 'user',
          content: 'Condense your response into the jsonOutput tool.'
        })

        result = await generateText({
          ...generateSettings,
          messages: messagesToRetransmit as any,
          toolChoice: {
            toolName: 'jsonOutput',
            type: 'tool'
          }
        })

        // Check the tool result, if its still empty, something has seriously gone wrong.
        if (result.toolCalls.length > 0) {
          for (const toolCall of result.toolCalls) {
            if (toolCall.toolName === 'jsonOutput') {
              object = toolCall.args
            }
          }
        }
      }

      if (!object) {
        throw errors.NO_OBJECT_GENERATED
      }

      // @ts-expect-error - We need to overwrite this readonly property.
      result.text = JSON.stringify(object)
      // @ts-expect-error - We need to overwrite this readonly property.
      result.toolCalls = [] // Make sure to clean up the response.
    }

    let startStream = Date.now()
    let endReasoning = null // Used to track if/when reasoning has ended

    if (useChat || stream) {
      // List all properties of result
      const r = result as unknown as ReturnType<typeof aiStreamText>

      let writer: any = null

      const onError = (e: any): string => {
        if (e.message.includes('This request requires more credits')) {
          return 'This request requires more credits. Please add more credits to your account, or try a different model.'
        }

        return 'An unknown error has occurred while processing your request. If this persists, please contact support.'
      }

      const stream = createUIMessageStream({
        onError,
        execute: async (options) => {
          writer = options.writer

          // Send inital headers
          options.writer.write({
            type: 'data-metadata',
            data: {
              type: 'llm-provider',
              provider: modelData.provider.name,
              model: model,
              modelOptions,
              parsedModel,
              responseFormat: response_format,
              created: Date.now()
            }
          })

          const rawStream = r.toUIMessageStream({
            sendReasoning: true,
            onError
          })

          options.writer.merge(rawStream)

          await r.text

          const usage = await r.usage

          // Only send a usage frame when we have a usage object.
          if (usage) {
            options.writer.write({
              type: 'data-usage',
              data: {
                ...usage,
                timeToComplete: Date.now() - startStream,
                tokensPerSecond: usage?.outputTokens ? usage.outputTokens / ((Date.now() - startStream) / 1000) : undefined
              }
            })
          }
        }
      })

      // We need to do this song and dance because the stream we're given from the AI SDK is not cancellable.
      // And if an error occurs, the stream isnt stopped, causing the runtime to hang as it thinks the stream is still running.
      let cancelStream: () => void

      const cancellableStream = new ReadableStream({
        start: async (controller) => {
          cancelStream = () => {
            // Flush first
            controller.close()
          }

          const reader = stream.getReader()

          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              break
            }

            controller.enqueue(value)
          }
        },
        cancel: () => {
          cancelStream()
        }
      })

      errorPromise.then(async err => {
        console.error(
          '[ERROR WHILE STREAMING]',
          err
        )

        // Wait at least a single tick to make sure the error is
        // transmitted before we cancel the stream.
        await new Promise(res => setTimeout(res, 1))

        cancelStream()
      })

      return createUIMessageStreamResponse({
        stream: cancellableStream
      })
    }

    return openAiResponse(result)

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

function recordEvent(result: unknown, apiKey: string, user: string) {
  waitUntil(
    getPayload({ config }).then((payload) =>
      payload.jobs
        .queue({
          workflow: 'recordEvent',
          input: {
            result: result as {
              [k: string]: unknown
            },
            apiKey,
            user,
          },
        })
        .then((job) => payload.jobs.runByID(job)),
    ),
  )
}
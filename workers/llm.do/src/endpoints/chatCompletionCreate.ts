import { Capability, getModel } from 'ai-models'
import { OpenAPIRoute } from 'chanfana'
import { env } from 'cloudflare:workers'
import { OpenAIToolSet } from 'composio-core'
import { Context } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, type ChatCompletionRequest, ChatCompletionRequestSchema, ChatCompletionResponse, ChatCompletionResponseSchema } from '../types/chat'

export class ChatCompletionCreate extends OpenAPIRoute {
  schema = {
    tags: ['Completions'],
    summary: 'Create a chat completion',
    request: {
      headers: AuthHeader,
      body: {
        content: {
          'application/json': {
            schema: ChatCompletionRequestSchema,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Returns the chat completion',
        content: {
          'application/json': {
            schema: ChatCompletionResponseSchema,
          },
        },
      },
    },
  }

  async handle(c: Context<{ Bindings: Cloudflare.Env }>) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()
    const fallbackModel = 'drivly/frontier'

    // Model router
    try {
      request.body.model =
        getModel(request.body.model || '', {
          requiredCapabilities: getRequiredCapabilities(request.body),
          seed: request.body.seed,
        })?.slug || fallbackModel
    } catch (error) {
      console.error(error)
      request.body.model = fallbackModel
    }

    const actions = request.body.tools?.filter((t) => typeof t === 'string')
    if (actions?.length) {
      request.body.stream = false

      const composioToolset = new OpenAIToolSet({
        apiKey: env.COMPOSIO_API_KEY,
      })

      const tools = await composioToolset.getTools({ actions: actions.length === 1 && actions[0] === 'all' ? undefined : actions })
      request.body.tools = (request.body.tools?.filter((t) => typeof t !== 'string') || []).concat(tools)
      const response = await fetchFromProvider(request, 'POST', '/chat/completions')
      const json: ChatCompletionResponse = await response.json()
      if (json.choices?.find((c) => c.message.tool_calls?.find((c) => tools.find((t) => t.function.name === c.function.name)))) {
        const composioResponse = await composioToolset.handleToolCall(json)
        return c.json(composioResponse)
      }
      return c.json(json)
    }

    // Pass request to OpenRouter
    return fetchFromProvider(request, 'POST', '/chat/completions')
  }
}

function getRequiredCapabilities(body: ChatCompletionRequest) {
  const requiredCapabilities: Capability[] = []
  // TODO: Add code capability
  // if (body.???) {
  //   requiredCapabilities.push('code')
  // }
  if (body.tools?.find((t) => typeof t !== 'string' && typeof t.type === 'string' && t.type.startsWith('web_search'))) {
    requiredCapabilities.push('online')
  }
  if (body.reasoning_effort) {
    requiredCapabilities.push('reasoning', `reasoning-${body.reasoning_effort}`)
  }
  if (body.tools?.find((t) => typeof t === 'string' || t.type === 'function')) {
    requiredCapabilities.push('tools')
  }
  if (body.response_format?.type === 'json_schema') {
    requiredCapabilities.push('structuredOutput')
  } else if (body.response_format?.type === 'json_object') {
    requiredCapabilities.push('responseFormat')
  }
  return requiredCapabilities
}

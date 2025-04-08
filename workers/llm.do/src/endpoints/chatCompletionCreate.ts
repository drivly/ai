import { OpenAPIRoute } from 'chanfana'
import { env } from 'cloudflare:workers'
import { OpenAIToolSet } from 'composio-core'
import { Context } from 'hono'
import { providers } from 'providers/provider'
import { AuthHeader } from 'types/shared'
import { ChatCompletionRequestSchema, ChatCompletionResponse, ChatCompletionResponseSchema } from '../types/chat'

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

    const actions = request.body.tools?.filter((t) => typeof t === 'string')
    if (actions?.length) {
      request.body.stream = false

      const composioToolset = new OpenAIToolSet({
        apiKey: env.COMPOSIO_API_KEY,
      })

      const tools = await composioToolset.getTools({ actions: actions.length === 1 && actions[0] === 'all' ? undefined : actions })
      request.body.tools = (request.body.tools?.filter((t) => typeof t !== 'string') || []).concat(tools)
      const response = await providers.default.fetchFromProvider(request, 'POST', '/chat/completions')
      const json: ChatCompletionResponse = await response.json()
      if (json.choices?.find((c) => c.message.tool_calls?.find((c) => tools.find((t) => t.function.name === c.function.name)))) {
        const composioResponse = await composioToolset.handleToolCall(json)
        return c.json(composioResponse)
      }
      return c.json(json)
    }

    // Pass request to provider
    return providers.default.fetchFromProvider(request, 'POST', '/chat/completions')
  }
}

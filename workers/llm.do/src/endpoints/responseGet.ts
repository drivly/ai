import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { ResponseSchema } from 'types/responses'
import { AuthHeader } from 'types/shared'
import { toResponse } from 'types/translate'
import type { ChatCompletionResponse } from '../types/chat'

export class ResponseGet extends OpenAPIRoute {
  schema = {
    tags: ['Responses'],
    summary: 'Get response',
    request: {
      headers: AuthHeader,
    },
    responses: {
      '200': {
        description: 'Return a response',
        content: {
          'application/json': {
            schema: ResponseSchema,
          },
        },
      },
    },
  }

  async handle(c: Context<{ Bindings: Cloudflare.Env }>) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Pass request to OpenRouter
    const response = await fetchFromProvider(request, 'GET', '/chat/completions/' + c.req.param('id'))
    const json: ChatCompletionResponse = await response.json()

    return c.json(toResponse(json))
  }
}

import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, ResponseSchema } from '../types/chat'

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

  async handle(_c: Context<{ Bindings: Cloudflare.Env }>) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Pass request to OpenRouter
    return await fetchFromProvider(request, 'GET', '/responses')
  }
}

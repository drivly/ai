import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, ResponseRequestSchema, ResponseSchema } from '../types/chat'

export class ResponseCreate extends OpenAPIRoute {
  schema = {
    tags: ['Responses'],
    summary: 'Create a response',
    request: {
      headers: AuthHeader,
      body: {
        content: {
          'application/json': {
            schema: ResponseRequestSchema,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Returns the response',
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
    return fetchFromProvider(request, 'POST', '/responses')
  }
}

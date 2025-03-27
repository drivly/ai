import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, ModelListResponseSchema } from '../types/chat'

export class ModelList extends OpenAPIRoute {
  schema = {
    tags: ['Model'],
    summary: 'List models',
    request: {
      headers: AuthHeader,
    },
    responses: {
      '200': {
        description: 'Returns a list of models',
        content: {
          'application/json': {
            schema: ModelListResponseSchema,
          },
        },
      },
    },
  }

  async handle(_c: Context<{ Bindings: Cloudflare.Env }>) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Pass request to OpenRouter
    return await fetchFromProvider(request, 'GET', '/models')
  }
}

import { OpenAPIRoute } from 'chanfana'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, ModelListResponseSchema } from '../types/chat'
import { Context } from 'hono'

export class ModelList extends OpenAPIRoute {
  schema = {
    tags: ['Models'],
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

  async handle(_c: Context) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Pass request to OpenRouter
    return await fetchFromProvider(request, 'GET', '/models')
  }
}

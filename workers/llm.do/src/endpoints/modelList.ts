import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { ModelListResponseSchema } from 'types/models'
import { AuthHeader } from 'types/shared'

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

  async handle(_c: Context<{ Bindings: Cloudflare.Env }>) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Pass request to OpenRouter
    return fetchFromProvider(request, 'GET', '/models')
  }
}

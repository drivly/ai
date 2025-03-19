import { OpenAPIRoute } from 'chanfana'
import { AuthHeader, ModelListResponse } from '../types'
import { fetchFromProvider } from 'providers/openRouter'

export class ModelList extends OpenAPIRoute {
  schema = {
    tags: ['models'],
    summary: 'List Models',
    request: {
      headers: AuthHeader,
    },
    responses: {
      '200': {
        description: 'Returns a list of models',
        content: {
          'application/json': {
            schema: ModelListResponse,
          },
        },
      },
    },
  }

  async handle(_args: any[]) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Pass request to OpenRouter
    return await fetchFromProvider(request, 'GET', '/models')
  }
}

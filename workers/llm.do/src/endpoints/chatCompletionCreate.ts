import { OpenAPIRoute } from 'chanfana'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, ChatCompletionRequest, ChatCompletionResponse } from '../types'
import { models } from '@drivly/ai-providers'
import { parse } from '@drivly/ai-models'

export class ChatCompletionCreate extends OpenAPIRoute {
  schema = {
    tags: ['Chat'],
    summary: 'Create a chat completion',
    request: {
      headers: AuthHeader,
      body: {
        content: {
          'application/json': {
            schema: ChatCompletionRequest,
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Returns the chat completion',
        content: {
          'application/json': {
            schema: ChatCompletionResponse,
          },
        },
      },
    },
  }

  async handle(_args: any[]) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Get the appropriate model using the ai-providers package
    const modelId = request.body.model || 'gpt-3.5-turbo'
    const model = models(modelId)
    
    // Parse model information for routing
    const { author, provider, capabilities } = parse(modelId)
    request.body.model = (provider && author ? `${provider}/${author}/${model}` : `${author ? author + '/' : ''}${model}`) + (capabilities ? `:${capabilities.join(',')}` : '')

    // Pass request to OpenRouter
    return await fetchFromProvider(request, 'POST', '/chat/completions')
  }
}

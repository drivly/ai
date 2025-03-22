import { OpenAPIRoute } from 'chanfana'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, ChatCompletionRequest, ChatCompletionResponse } from '../types'
import { parse } from '@ai-primitives/ai-models'

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

    // Model router
    const { model, author, provider, capabilities } = parse(request.body.model || '')
    request.body.model = (provider && author ? `${provider}/${author}/${model}` : `${author ? author + '/' : ''}${model}`) + (capabilities ? `:${capabilities.join(',')}` : '')

    // Pass request to OpenRouter
    return await fetchFromProvider(request, 'POST', '/chat/completions')
  }
}

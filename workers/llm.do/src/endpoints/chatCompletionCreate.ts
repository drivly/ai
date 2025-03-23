import { Capability, getModel } from 'ai-models'
import { OpenAPIRoute } from 'chanfana'
import { fetchFromProvider } from 'providers/openRouter'
import { z } from 'zod'
import { AuthHeader, ChatCompletionRequest, ChatCompletionResponse } from '../types'

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
    try {
      request.body.model = getModel(request.body.model || '', {
        requiredCapabilities: getRequiredCapabilities(request.body),
        seed: request.body.seed,
      })?.slug
    } catch (error) {
      console.error(error)
    }

    // Pass request to OpenRouter
    return fetchFromProvider(request, 'POST', '/chat/completions')
  }
}

function getRequiredCapabilities(body: z.infer<typeof ChatCompletionRequest>) {
  const requiredCapabilities: Capability[] = [] //['code']

  if (body.web_search_options) {
    requiredCapabilities.push('online')
  }
  if (body.reasoning_effort) {
    requiredCapabilities.push('reasoning', `reasoning-${body.reasoning_effort}`)
  }
  if (body.tools?.length) {
    requiredCapabilities.push('tools')
  }
  if (body.response_format?.type === 'json_schema') {
    requiredCapabilities.push('structuredOutput')
  } else if (body.response_format?.type === 'json_object') {
    requiredCapabilities.push('responseFormat')
  }
  return requiredCapabilities
}

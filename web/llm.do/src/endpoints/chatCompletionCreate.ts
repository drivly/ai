import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { ChatCompletionRequest, ChatCompletionResponse } from '../types'

export class ChatCompletionCreate extends OpenAPIRoute {
  schema = {
    tags: ['chat'],
    summary: 'Create a chat completion',
    request: {
      headers: z.object({
        Authorization: z.string(),
      }),
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
    const {
      body: chatCompletionRequestBody,
      headers: { Authorization: apiKey },
    } = await this.getValidatedData<typeof this.schema>()

    // TODO: Integrate model router

    // Pass request to OpenRouter
    const response = await fetch(
      // TODO: Get account and gateway ids from env
      `https://gateway.ai.cloudflare.com/v1/b6641681fe423910342b9ffa1364c76d/ai-functions/openrouter/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey,
        },
        body: JSON.stringify(chatCompletionRequestBody),
      },
    )

    // return the completion
    return response.json()
  }
}

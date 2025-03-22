import { OpenAPIRoute } from 'chanfana'
import { fetchFromProvider } from 'providers/openRouter'
import { AuthHeader, ChatCompletionRequest, ChatCompletionResponse } from '../types'
import { models } from 'ai-providers'
import { generateText } from 'ai'

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

    try {
      // Get the appropriate model using the ai-providers package
      const modelId = request.body.model || 'gpt-3.5-turbo'
      const model = models(modelId)
      
      // Use Vercel AI SDK to generate text
      const result = await generateText({
        model,
        prompt: request.body.messages?.[0]?.content || '',
      })
      
      // Return the result in OpenAI-compatible format
      return {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: modelId,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: result.text,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: result.usage?.promptTokens || 0,
          completion_tokens: result.usage?.completionTokens || 0,
          total_tokens: result.usage?.totalTokens || 0,
        },
      }
    } catch (error) {
      console.error('Error generating text:', error)
      
      // Fallback to OpenRouter if Vercel AI SDK fails
      return await fetchFromProvider(request, 'POST', '/chat/completions')
    }
  }
}

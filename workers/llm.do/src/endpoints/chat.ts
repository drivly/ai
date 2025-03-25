import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import app from '../index'
import { APIDefinitionSchema, APIUserSchema } from '../types/api'
import { ChatCompletionResponseSchema } from '../types/chat'
import { Context } from 'hono'

export class Chat extends OpenAPIRoute {
  schema = {
    tags: ['Chat'],
    summary: 'Get chat information',
    request: {
      query: z.object({
        prompt: z.string().describe('The user prompt').optional(),
        system: z.string().optional().describe('Optional system message'),
        temperature: z.number().min(0).max(2).optional().describe('Controls randomness: 0 = deterministic, 2 = maximum creativity'),
        model: z.string().optional().describe('Model to use for the chat'),
        Authorization: z.string().describe('Bearer token alias').optional(),
        authorization: z.string().describe('Bearer token alias').optional(),
        apikey: z.string().describe('Bearer token alias').optional(),
        apiKey: z.string().describe('Bearer token alias').optional(),
        key: z.string().describe('Bearer token alias').optional(),
        token: z.string().describe('Bearer token alias').optional(),
        'api-key': z.string().describe('Bearer token alias').optional(),
        'x-api-key': z.string().describe('Bearer token alias').optional(),
        'x-apikey': z.string().describe('Bearer token alias').optional(),
      }),
    },
    responses: {
      '200': {
        description: 'Returns chat information',
        content: {
          'application/json': {
            schema: z.object({
              api: APIDefinitionSchema,
              links: z.record(z.string()),
              data: ChatCompletionResponseSchema,
              user: APIUserSchema,
            }),
          },
        },
      },
    },
  }

  async handle({ req: { path } }: Context) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()

    // Translate the query to the completion endpoint
    const { prompt = ' ', system, temperature, model } = request.query

    const messages = []
    if (system) {
      messages.push({ role: 'system', content: system })
    }
    messages.push({ role: 'user', content: prompt })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const Authorization =
      (request.headers as any)?.Authorization ||
      request.query.Authorization ||
      request.query.authorization ||
      request.query.apikey ||
      request.query.apiKey ||
      request.query.key ||
      request.query.token ||
      request.query['api-key'] ||
      request.query['x-api-key'] ||
      request.query['x-apikey']

    if (Authorization) {
      headers.Authorization = Authorization.startsWith('Bearer ') ? Authorization : 'Bearer ' + Authorization
    }

    const response = await app.request('/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: messages.length ? messages : undefined,
        temperature,
      }),
    })

    const data = await response.json()

    // Return response
    return {
      api: {
        name: 'llm.do',
        url: 'https://llm.do',
        endpoints: {
          chat: '/chat',
          models: '/models',
        },
      },
      links: {
        home: 'https://llm.do',
        self: 'https://llm.do' + path,
      },
      data,
      user: { authenticated: false },
    }
  }
}

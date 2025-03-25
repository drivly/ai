import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import app from '../index'
import { APIDefinitionSchema, APIUserSchema, FlexibleAPILinksSchema } from '../types/api'
import { ChatCompletionResponseSchema } from '../types/chat'
import { Context } from 'hono'

export class Chat extends OpenAPIRoute {
  schema = {
    tags: ['Chat'],
    summary: 'Send a message to the chatbot',
    request: {
      query: z.object({
        prompt: z.string().describe('The user prompt').optional(),
        system: z.string().optional().describe('Optional system message'),
        model: z.string().optional().describe('Model to use for the chat'),
        seed: z.number().optional().describe('Seed for the chat'),
        temperature: z.number().min(0).max(2).optional().describe('Controls randomness: 0 = deterministic, 2 = maximum creativity'),
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
              links: FlexibleAPILinksSchema,
              data: ChatCompletionResponseSchema,
              user: APIUserSchema,
            }),
          },
        },
      },
    },
  }

  async handle(c: Context) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()
    const { model: providerModel, provider } = c.req.param()

    // Translate the query to the completion endpoint
    const { prompt = ' ', system, model = (provider ? provider + '/' + providerModel : providerModel) || 'drivly/frontier', seed, temperature } = request.query

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

    let data

    if (Authorization) {
      headers.Authorization = Authorization.startsWith('Bearer ') ? Authorization : 'Bearer ' + Authorization

      const response = await app.request('/api/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages: messages.length ? messages : undefined,
          seed,
          temperature,
        }),
      })

      data = await response.json()
    } else {
      data = {
        error: 'Please provide an API key.',
      }
    }

    return {
      api: {
        name: 'llm.do',
        url: 'https://llm.do',
        endpoints: {
          chat: '/chat',
          models: '/api/v1/models',
        },
        examples: {
          'Hello World': getLink({ prompt: 'Hello, World!', system, model, seed, temperature, Authorization }),
          'What is the meaning of life?': getLink({ prompt: 'What is the meaning of life?', system, model, seed, temperature, Authorization }),
          'Talk like a pirate': getLink({ prompt, system: 'Talk like a pirate', model, seed, temperature, Authorization }),
        },
      },
      links: generateLinks({ prompt, system, model, seed, temperature, Authorization }),
      data,
      user: { authenticated: false },
    }
  }
}

function generateLinks({
  prompt,
  system,
  model,
  seed,
  temperature,
  Authorization,
}: {
  prompt: string
  system: string | undefined
  model: string | undefined
  seed: number | undefined
  temperature: number | undefined
  Authorization: string | undefined
}) {
  const links: Record<string, string> = {
    home: 'https://llm.do',
    self: getLink({ prompt, system, model, seed, temperature, Authorization }),
  }
  if (seed !== undefined) {
    links.next = getLink({ prompt, system, model, seed: seed + 1, temperature, Authorization })
    links.prev = getLink({ prompt, system, model, seed: seed - 1, temperature, Authorization })
  }

  if (prompt.trim() && (system || model || seed !== undefined || temperature !== undefined)) {
    links['Remove prompt'] = getLink({ prompt: '', system, model, seed, temperature, Authorization })
  }
  if (system && (prompt.trim() || model || seed !== undefined || temperature !== undefined)) {
    links['Remove system'] = getLink({ prompt, system: '', model, seed, temperature, Authorization })
  }
  if (model && (prompt.trim() || system || seed !== undefined || temperature !== undefined)) {
    links['Remove model'] = getLink({ prompt, system, model: '', seed, temperature, Authorization })
  }
  if (seed !== undefined) {
    links['Remove seed'] = getLink({ prompt, system, model, seed: undefined, temperature, Authorization })
  } else {
    links['Add seed'] = getLink({ prompt, system, model, seed: 0, temperature, Authorization })
  }
  if (temperature !== undefined && (prompt.trim() || system || model || seed !== undefined)) {
    links['Remove temperature'] = getLink({ prompt, system, model, seed, temperature: undefined, Authorization })
  }
  return links
}

function getLink({
  prompt,
  system,
  model,
  seed,
  temperature,
  Authorization,
}: {
  prompt: string
  system: string | undefined
  model: string | undefined
  seed: number | undefined
  temperature: number | undefined
  Authorization: string | undefined
}) {
  let path
  const params = new URLSearchParams()
  if (prompt.trim()) {
    params.set('prompt', prompt.trim())
  }
  if (system) {
    params.set('system', system)
  }
  if (model) {
    path = '/chat/' + model
  } else {
    path = '/chat'
  }
  if (seed !== undefined) {
    params.set('seed', seed.toString())
  }
  if (temperature !== undefined) {
    params.set('temperature', temperature.toString())
  }
  if (Authorization) {
    params.set('Authorization', Authorization)
  }
  return `https://llm.do${path}${params.size ? '?' + params.toString() : ''}`
}

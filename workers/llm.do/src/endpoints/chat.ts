import { getUser } from 'api/user'
import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { type AnyZodObject, z } from 'zod'
import app from '../index'
import { APIDefinitionSchema, APIUserSchema, FlexibleAPILinksSchema } from '../types/api'
import { ChatCompletionResponseSchema } from '../types/chat'

const ChatResponseSchema = z.object({
  api: APIDefinitionSchema,
  links: FlexibleAPILinksSchema,
  data: ChatCompletionResponseSchema,
  user: APIUserSchema,
})

export class Chat extends OpenAPIRoute {
  schema = this.createSchema()

  public createSchema(params?: AnyZodObject) {
    return {
      tags: ['Chat'],
      summary: 'Send a message to the chatbot',
      request: {
        params,
        query: z.object({
          prompt: z.string().describe('The user prompt').optional(),
          system: z.string().optional().describe('Optional system message'),
          model: z.string().optional().describe('Model to use for the chat'),
          models: z.string().optional().describe('Comma-separated list of models to use for the chat'),
          seed: z.number().optional().describe('Seed for the chat'),
          temperature: z.number().min(0).max(2).optional().describe('Controls randomness: 0 = deterministic, 2 = maximum creativity'),
          tools: z.string().optional().describe('Comma-separated list of tools to use for the chat (or "all" for all tools)'),
          Authorization: z.string().describe('Bearer token').optional(),
        }),
      },
      responses: {
        '200': {
          description: 'Returns chat information',
          content: {
            'application/json': {
              schema: ChatResponseSchema,
            },
          },
        },
      },
    }
  }

  async handle(c: Context<{ Bindings: Cloudflare.Env }>) {
    // Retrieve the validated request
    const request = await this.getValidatedData<typeof this.schema>()
    const { model: providerModel, provider } = c.req.param()

    // Translate the query to the completion endpoint
    const { prompt = ' ', system, model = provider ? provider + '/' + providerModel : providerModel, models, seed, temperature, tools } = request.query

    const messages = []
    if (system) {
      messages.push({ role: 'system', content: system })
    }
    messages.push({ role: 'user', content: prompt })

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const Authorization = (request.headers as any)?.Authorization || request.query.Authorization

    let data

    if (Authorization) {
      if (!Authorization.startsWith('Bearer ')) {
        headers.Authorization = 'Bearer ' + Authorization
      }

      const response = await app.request('/api/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          models: models?.length ? models.split(',') : undefined,
          messages: messages.length ? messages : undefined,
          seed,
          temperature,
          tools: tools?.length ? tools.split(',') : undefined,
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
      user: getUser(c.req.raw),
    } as z.infer<typeof ChatResponseSchema>
  }
}

export class ChatModel extends Chat {
  schema = this.createSchema(z.object({ model: z.string() }))
}

export class ChatProviderModel extends Chat {
  schema = this.createSchema(z.object({ provider: z.string(), model: z.string() }))
}

export function generateLinks({
  prompt,
  system,
  model,
  seed,
  temperature,
  tools,
  Authorization,
}: {
  prompt: string
  system?: string
  model?: string
  seed?: number
  temperature?: number
  tools?: string[]
  Authorization?: string
}) {
  const links: Record<string, string> = {
    home: 'https://llm.do',
    self: getLink({ prompt, system, model, seed, temperature, tools, Authorization }),
  }
  if (seed !== undefined) {
    links.next = getLink({ prompt, system, model, seed: seed + 1, temperature, tools, Authorization })
    links.prev = getLink({ prompt, system, model, seed: seed - 1, temperature, tools, Authorization })
  }

  if (prompt.trim() && (system || model || seed !== undefined || temperature !== undefined)) {
    links['Remove prompt'] = getLink({ prompt: '', system, model, seed, temperature, tools, Authorization })
  }
  if (system && (prompt.trim() || model || seed !== undefined || temperature !== undefined)) {
    links['Remove system'] = getLink({ prompt, system: '', model, seed, temperature, tools, Authorization })
  }
  if (model && (prompt.trim() || system || seed !== undefined || temperature !== undefined)) {
    links['Remove model'] = getLink({ prompt, system, model: '', seed, temperature, tools, Authorization })
  }
  if (seed !== undefined) {
    links['Remove seed'] = getLink({ prompt, system, model, seed: undefined, temperature, tools, Authorization })
  } else {
    links['Add seed'] = getLink({ prompt, system, model, seed: 0, temperature, tools, Authorization })
  }
  if (temperature !== undefined && (prompt.trim() || system || model || seed !== undefined)) {
    links['Remove temperature'] = getLink({ prompt, system, model, seed, temperature: undefined, tools, Authorization })
  }
  return links
}

export function getLink({
  prompt,
  system,
  model,
  seed,
  temperature,
  tools,
  Authorization,
}: {
  prompt: string
  system?: string
  model?: string
  seed?: number
  temperature?: number
  tools?: string[]
  Authorization?: string
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
  if (tools?.length) {
    params.set('tools', tools.join(','))
  }
  if (Authorization) {
    params.set('Authorization', Authorization)
  }
  return `https://llm.do${path}${params.size ? '?' + params.toString() : ''}`
}

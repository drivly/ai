import { getModels, modelPattern } from 'ai-models'
import { getUser } from 'api/user'
import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { providers } from 'providers/provider'
import { APIDefinitionSchema, APIUserSchema, FlexibleAPILinksSchema } from 'types/api'
import type { ChatCompletionRequest, ChatCompletionResponse } from 'types/chat'
import { z } from 'zod'
import { parseCookies } from './cookies'

const PROMPTS = ["How many R's are in Strawberry?", 'Generate a business plan for selling water to a fish']

const ArenaCompletionResponseSchema = z.object({
  api: APIDefinitionSchema,
  links: FlexibleAPILinksSchema,
  prompt: z.string(),
  arena: z.record(z.string(), z.array(z.string())),
  user: APIUserSchema,
})

export class ArenaCompletion extends OpenAPIRoute {
  schema = {
    tags: ['Chat'],
    summary: 'Compare multiple models at once',
    request: {
      query: z.object({
        prompt: z.string().describe('The user prompt').optional(),
        system: z.string().optional().describe('Optional system message'),
        model: z.string().optional().describe('Model to use for the chat'),
        models: z.string().regex(modelPattern).optional().describe('Comma-separated list of models to use for the chat'),
        tools: z.string().optional().describe('Comma-separated list of tools to use for the chat (or "all" for all tools)'),
        Authorization: z.string().describe('Bearer token').optional(),
      }),
    },
    responses: {
      '200': {
        description: 'Returns arena completions',
        content: {
          'application/json': {
            schema: ArenaCompletionResponseSchema,
          },
        },
      },
      '400': {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  }

  async handle(c: Context<{ Bindings: Cloudflare.Env }>) {
    const url = new URL(c.req.url)
    let origin = url.origin
    if (c.env.ENV === 'development') {
      origin = 'http://localhost:8787'
    }

    const originOrApiRoute = `${origin}${url.pathname}`

    const modifyQueryString = (param: string, value: string | number, type: 'string' | 'boolean' | 'array' = 'string') => {
      const qs = new URLSearchParams(c.req.url.split('?')[1])
      // If the value is a boolean, and it exists, remove it
      // otherwise add it

      switch (type) {
        case 'boolean':
          if (qs.has(param)) {
            qs.delete(param)
          } else {
            qs.set(param, value.toString())
          }
          break
        case 'array':
          // arrays are serialized as a comma separated list
          // when the value exists, remove it, otherwise add it,
          // then re-serialize into a comma separated list
          let existingArray = qs.get(param)?.split(',') ?? []

          if (existingArray.includes(value.toString())) {
            existingArray = existingArray.filter((item) => item !== value.toString())
          } else {
            existingArray.push(value.toString())
          }

          qs.set(param, existingArray.join(','))

          break
        case 'string':
          qs.set(param, value.toString())
          break
      }

      // Remove any empty values but ignore models because it can be an empty string.
      qs.forEach((value, key) => {
        if (value === '' && key !== 'models') {
          qs.delete(key)
        }
      })

      return `${originOrApiRoute}?${qs.toString()}`.replaceAll('%3A', ':').replaceAll('%2C', ',')
    }

    try {
      // Retrieve the validated request
      const request = await this.getValidatedData<typeof this.schema>()

      // If prompt is not provided, use a random prompt from the PROMPTS array
      const { prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)], system, model, models } = request.query
      const Authorization = c.req.header('Authorization') || request.query.Authorization || parseCookies(c.req.header('Cookie') || '').Authorization
      if (!Authorization) {
        return c.json({ error: 'Authorization is required' }, 401)
      }

      // Create messages array for the chat request
      const messages: ChatCompletionRequest['messages'] = []
      if (system) {
        messages.push({ role: 'system', content: system })
      }
      messages.push({ role: 'user', content: prompt + '\n\nOnly respond with at most 4 paragraphs.' })

      // Determine which models to use
      const combinedModels = model || models || ''

      if (!combinedModels) {
        return c.json({ error: 'No models specified' }, 400)
      }

      // Resolve the models
      const resolvedModels = getModels(combinedModels)

      if (!resolvedModels.length) {
        return c.json({ error: 'No valid models found' }, 400)
      }

      // Request completions from all specified models
      const completions = await Promise.all(
        resolvedModels.map(async ({ slug: model, parsed: { systemConfig: { seed, temperature } = {} } }) => {
          const body: ChatCompletionRequest = {
            model,
            messages,
            max_tokens: 250,
            seed: seed !== undefined ? Number(seed) : undefined,
            temperature: temperature !== undefined ? Number(temperature) : undefined,
          }

          try {
            const response = await providers.default.fetchFromProvider({ headers: { Authorization }, body }, 'POST', '/chat/completions')
            const data: ChatCompletionResponse = await response.json()
            return {
              model,
              text: data.choices[0].message.content?.split('\n').map((line: string) => line.trim()),
            }
          } catch (error) {
            console.error(`Error fetching from model ${model}:`, error)
            return {
              model,
              text: 'Failed to get completion',
            }
          }
        }),
      )

      return c.json({
        api: {
          name: 'llm.do',
          version: '1.0.0',
        },
        links: {
          prompts: PROMPTS.map((p) => [modifyQueryString('prompt', p), p]).reduce((acc, [url, prompt]) => {
            return {
              ...acc,
              [prompt]: url,
            }
          }, {}),
          system: {
            'Talk like a pirate': modifyQueryString('system', 'For all responses, talk like a pirate'),
            'Be an unhelpful assistant': modifyQueryString('system', 'Be an unhelpful assistant'),
          },
        },
        prompt,
        arena: completions.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.model]: curr.text,
          }
        }, {}),
        user: getUser(c.req.raw),
      } as z.infer<typeof ArenaCompletionResponseSchema>)
    } catch (error) {
      console.error('Error in ArenaCompletion:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
}

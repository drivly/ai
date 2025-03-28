import { getModels } from 'ai-models'
import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { fetchFromProvider } from 'providers/openRouter'
import { APIDefinitionSchema, FlexibleAPILinksSchema, APIUserSchema } from 'types/api'
import { ChatCompletionResponseSchema } from '../types/chat'
import { AnyZodObject, z } from 'zod'

export class Cookies extends OpenAPIRoute {
  schema = this.createSchema()

  public createSchema(params?: AnyZodObject) {
    return {
      tags: [],
      summary: 'Retrieve, and set cookies for llm.do',
      request: {
        params,
        query: z.object({
          Authorization: z.string().describe('Bearer token alias').optional(),
        }),
      },
      responses: {
        '200': {
          description: 'Authorization header set successfully',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
        },
      },
    }
  }

  async handle(c: Context<{ Bindings: Cloudflare.Env }>) {
    const url = new URL(c.req.url)
    let origin = url.origin
    if (c.env.ENV === 'development') {
      origin = 'http://localhost:8787'
    }

    const originOrApiRoute = `${origin}${url.pathname}`

    const { Authorization } = c.req.query()

    const cookies = c.req.header('Cookie')

    if (!Authorization) {
      return c.json({ error: 'No Authorization query parameter provided' }, 400)
    }

    const response = c.json({
      message: 'Cookies have been set, you can now close this tab'
    })

    response.headers.set('Set-Cookie', `Authorization=Bearer ${Authorization}`)

    return response
  }
}

export function parseCookies(cookies: string) {
  const cookieArray = cookies.split(';')
  const cookieObject: Record<string, string> = {}
  cookieArray.forEach(cookie => {
    const [key, value] = cookie.split('=')
    cookieObject[key.trim()] = value.trim()
  })
  return cookieObject
}
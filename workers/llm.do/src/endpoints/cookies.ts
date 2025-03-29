import { OpenAPIRoute } from 'chanfana'
import { Context } from 'hono'
import { z } from 'zod'

export class Cookies extends OpenAPIRoute {
  schema = {
    tags: ['Authentication'],
    summary: 'Retrieve and set cookies for llm.do',
    request: {
      query: z.object({
        Authorization: z.string().describe('Bearer token').optional(),
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

  async handle(c: Context<{ Bindings: Cloudflare.Env }>) {
    const { Authorization } = c.req.query()

    if (!Authorization) {
      return c.json({ error: 'No Authorization query parameter provided' }, 400)
    }

    const response = c.json({
      message: 'Cookies have been set, you can now close this tab',
    })

    response.headers.set('Set-Cookie', `Authorization=Bearer ${Authorization}`)

    return response
  }
}

export function parseCookies(cookies: string) {
  const cookieArray = cookies.split(';')
  const cookieObject: Record<string, string> = {}
  cookieArray.forEach((cookie) => {
    const [key, value] = cookie.split('=')
    cookieObject[key.trim()] = value.trim()
  })
  return cookieObject
}

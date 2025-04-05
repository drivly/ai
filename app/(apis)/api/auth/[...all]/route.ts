import { toNextJsHandler } from 'better-auth/next-js'
import { getPayload } from '@/lib/auth/payload-auth'

const payload = await getPayload()

const authHandler = {
  handler: async (request: Request) => {
    const result = await payload.auth(request)
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const { POST, GET } = toNextJsHandler(authHandler)

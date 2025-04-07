import { toNextJsHandler } from 'better-auth/next-js'
import { getPayloadAuth } from '@/lib/auth/payload-auth'

const payload = await getPayloadAuth()

const authHandler = {
  handler: async (request: Request) => {
    const result = await payload.auth(request)
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}

export const { POST, GET } = toNextJsHandler(authHandler)

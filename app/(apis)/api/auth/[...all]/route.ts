import { toNextJsHandler } from 'better-auth/next-js'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'

const payload = await getPayloadWithAuth()

export const { POST, GET } = toNextJsHandler(payload.betterAuth.handler)

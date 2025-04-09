import { toNextJsHandler } from 'better-auth/next-js'
import { getPayloadAuth } from '@/lib/auth/payload-auth'

const payload = await getPayloadAuth()

export const { POST, GET } = toNextJsHandler(payload.betterAuth)

import { toNextJsHandler } from 'better-auth/next-js'
import { getPayload } from '@/lib/auth/payload-auth'

const payload = await getPayload()

export const { POST, GET } = toNextJsHandler(payload.betterAuth)

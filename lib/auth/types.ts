import { getPayload } from '@/lib/auth/payload-auth'
import { betterAuthPlugins } from './options'

const payload = await getPayload()

export type Session = typeof payload.betterAuth.$Infer.Session
export type SocialProvider = Parameters<Awaited<ReturnType<typeof getPayload>>['betterAuth']['api']['signInSocial']>[0]['body']['provider']
export type BetterAuthPlugins = typeof betterAuthPlugins
export type Account = Awaited<ReturnType<typeof payload.betterAuth.api.listUserAccounts>>[number]
export type DeviceSession = Awaited<ReturnType<typeof payload.betterAuth.api.listDeviceSessions>>[number]

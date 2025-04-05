import { BasePayload } from 'payload'
import { betterAuthPlugins } from './options'
type BetterAuthReturn<T> = {
  api: any
  $Infer: any
}

export type PayloadWithBetterAuth = BasePayload & {
  betterAuth: BetterAuthReturn<typeof betterAuthPlugins>
}

export type BetterAuthPlugins = typeof betterAuthPlugins

export type Session = any // Will be properly typed when betterAuth is fixed
export type SocialProvider = string
export type Account = any
export type DeviceSession = any

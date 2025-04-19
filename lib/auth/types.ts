import { Session as NextAuthSession, User as NextAuthUser } from 'next-auth'
import { authProviders } from './options'

export type SocialProvider = 'github' | 'google' | 'workos' | 'linear'

export interface User extends NextAuthUser {
  id: string
  role?: string
}

export interface Session {
  user: User
  expires: string
}

export type Account = any // Placeholder for next-auth Account type
export type DeviceSession = any // Placeholder for session type

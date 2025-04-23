import 'server-only'

import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { DefaultSession, NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import authConfig from './auth.config'
import { User } from './payload.types'

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  role?: User['role']
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: User['role']
  }
}

const authOptions: NextAuthConfig = {
  ...authConfig,
  session: { strategy: 'jwt' },
  adapter: MongoDBAdapter(clientPromise),
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)

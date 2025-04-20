import 'server-only'

import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { authConfig } from './auth.config'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '@/lib/mongodb'


const authOptions: NextAuthConfig = {
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)

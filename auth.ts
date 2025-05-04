import 'server-only'

import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { DefaultSession, NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'
import authConfig from './auth.config'
import { User as PayloadUser } from './payload.types'

export type UserType = 'guest' | 'regular'
// Extended GitHub profile data for job applications
interface GitHubProfile {
  login: string
  html_url: string
  avatar_url: string
  name: string
  notification_email: string
  bio?: string
  location?: string
  blog?: string
  public_repos?: number
  followers?: number
  following?: number
  created_at?: string
}

// Define a custom user role type to avoid circular references
type UserRole = PayloadUser['role']

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  role?: UserRole
  type?: UserType
  github?: {
    username: string
    email: string
    profileUrl: string
    bio?: string
    location?: string
    website?: string
    repos?: number
    followers?: number
    following?: number
    createdAt?: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }

  // Add custom properties to the User type
  interface User {
    role?: UserRole
    type?: UserType
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
    type?: UserType
    github?: {
      username: string
      email: string
      profileUrl: string
      bio?: string
      location?: string
      website?: string
      repos?: number
      followers?: number
      following?: number
      createdAt?: string
    }
  }
}

const authOptions: NextAuthConfig = {
  ...authConfig,
  events: {
    createUser: async ({ user }) => {
      console.log('createUser', { user })
    },
    signIn: async ({ account, user, profile }) => {
      console.log(`🚀 ~ signIn: ~ { account, user, profile }:`, { account, user, profile })
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub
      }

      if (token.role) {
        session.user.role = token.role
      }

      if (token.github) {
        session.user.github = token.github
      }

      return session
    },
    jwt: async ({ token, user, account, profile }) => {
      // Keep existing role if present
      if (user) {
        // Safe type assertion since we know our user has a role property
        const userWithRole = user as AdapterUser & { role?: UserRole }
        if (userWithRole.role) {
          token.role = userWithRole.role
        }
      }

      // Store GitHub profile data in token when signing in
      if (account?.provider === 'github' && profile) {
        const githubProfile = profile as unknown as GitHubProfile

        token.github = {
          username: githubProfile.login,
          email: githubProfile.notification_email,
          profileUrl: githubProfile.html_url,
          bio: githubProfile.bio,
          location: githubProfile.location,
          website: githubProfile.blog,
          repos: githubProfile.public_repos,
          followers: githubProfile.followers,
          following: githubProfile.following,
          createdAt: githubProfile.created_at,
        }
      }

      return token
    },
  },
  session: { strategy: 'jwt' },
  adapter: MongoDBAdapter(clientPromise),
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)

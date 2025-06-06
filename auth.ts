import 'server-only'

import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { DefaultSession } from 'next-auth'
import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import authConfig from './auth.config'
import { getOrCreateUserApikey, getUserById, updateUserById } from './lib/actions/user.action'
import type { User as PayloadUser } from './payload.types'

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
  apiKey?: string
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
    apiKey?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
    type?: UserType
    apiKey?: string
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

// Define more descriptive types for the API key system
type UserId = ExtendedUser['id']
type ApiKey = string | null

const userRegistry = new Map<UserId, Promise<ApiKey>>()

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  events: {
    linkAccount: async ({ user }) => {
      const userId = user.id
      if (!userId) return
      await updateUserById(userId, { emailVerified: !!user.email })
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

      if (token.apiKey) {
        session.user.apiKey = token.apiKey
      }

      return session
    },
    jwt: async ({ token, account, profile }) => {
      if (!token.sub) return token

      const userId = token.sub
      const existingUser = await getUserById(userId)

      if (!existingUser) return token

      token.role = existingUser.role

      if (!token.apiKey) {
        if (!userRegistry.has(userId)) {
          const apiKeyPromise = getOrCreateUserApikey({ ...existingUser, type: 'api' })
          userRegistry.set(userId, apiKeyPromise)

          // Clean up after completion (success or failure)
          apiKeyPromise
            .catch((error: unknown) => {
              console.error(`Error creating API key for user ${userId}:`, error)
              return null
            })
            .finally(() => {
              // Schedule cleanup after a delay
              setTimeout(() => {
                if (userRegistry.get(userId) === apiKeyPromise) {
                  userRegistry.delete(userId)
                }
              }, 5000)
            })
        }

        // Use the existing or newly created promise
        try {
          const apiKeyPromise = userRegistry.get(userId)
          if (apiKeyPromise) {
            const userApiKey = await apiKeyPromise
            if (userApiKey) {
              token.apiKey = userApiKey
            }
          }
        } catch (error: unknown) {
          console.error(`Failed to set API key for user ${userId}:`, error)
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
})

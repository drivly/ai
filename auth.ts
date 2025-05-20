import 'server-only'

import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { DefaultSession } from 'next-auth'
import NextAuth from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import type { JWT } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import authConfig from './auth.config'
import { createUserApiKey, getUserApikeyAction, getUserById, updateUserById } from './lib/actions/user.action'
import { getCurrentURL } from './lib/utils/url'
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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth((request: NextRequest | undefined) => {
  const currentUrl = getCurrentURL(request?.headers)
  const isGptDo = currentUrl?.includes('gpt.do') || process.env.HOSTNAME_OVERRIDE === 'gpt.do'

  return {
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
      jwt: async ({ token, user, account, profile }) => {
        if (!token.sub) return token

        if (isGptDo) {
          const existingUser = await getUserById(token.sub)
          if (!existingUser) return token

          // Prefer the user's apiKey if it exists
          if (existingUser.apiKey) {
            token.apiKey = existingUser.apiKey
          } else {
            // Try to fetch an apiKey (if you have a separate action for this)
            const userApiKey = await getUserApikeyAction({ email: existingUser.email, sub: existingUser.id })
            if (userApiKey) {
              token.apiKey = userApiKey
            } else {
              // Create a new apiKey if none exists
              const newApiKey = await createUserApiKey(existingUser)
              if (newApiKey) {
                token.apiKey = newApiKey
              }
            }
          }
        }

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
})

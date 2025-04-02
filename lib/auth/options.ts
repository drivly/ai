import { PayloadBetterAuthPluginOptions } from '@payload-auth/better-auth-plugin'
import { BetterAuthOptions } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { admin, apiKey, multiSession, openAPI, oAuthProxy } from 'better-auth/plugins'
import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../hooks/isSuperAdmin'

export const betterAuthPlugins = [admin(), apiKey(), multiSession(), openAPI(), nextCookies(), oAuthProxy({ 
  productionURL: 'https://apis.do',
  currentURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
              process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 
              process.env.VERCEL_BRANCH_URL ? process.env.VERCEL_BRANCH_URL : 
              process.env.VERCEL_PREVIEW_URL ? process.env.VERCEL_PREVIEW_URL : undefined
})]

export type BetterAuthPlugins = typeof betterAuthPlugins

export const betterAuthOptions: BetterAuthOptions = {
  secret: process.env.BETTER_AUTH_SECRET as string,
  appName: 'AGI Platform',
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: 'https://apis.do/api/auth/callback/google',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: 'https://apis.do/api/auth/callback/github',
    },
    // microsoft: {
    //   clientId: process.env.MICROSOFT_CLIENT_ID as string,
    //   clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
    // },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (isSuperAdmin(user)) {
            console.log('create:before isSuperAdmin', user)
            return { data: { ...user, role: 'admin' } }
          }
        },
        after: async (user) => {
          console.log('create:after', user)
        },
      },
    },
  },
  plugins: betterAuthPlugins,
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
        console.log('Send change email verification for user: ', user, newEmail, url, token)
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url, token }) => {
        // Send delete account verification
      },
      beforeDelete: async (user) => {
        // Perform actions before user deletion
      },
      afterDelete: async (user) => {
        // Perform cleanup after user deletion
      },
    },
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'email-password'],
    },
  },
}

export const payloadBetterAuthOptions: PayloadBetterAuthPluginOptions = {
  disabled: false,
  logTables: false,
  enableDebugLogs: false,
  hidePluginCollections: true,
  users: {
    slug: 'users',
    hidden: true, // Hide the users collection from navigation
    adminRoles: ['admin'],
    allowedFields: ['name'],
    blockFirstBetterAuthVerificationEmail: true,
    collectionOverrides: ({ collection }) => {
      return {
        ...collection,
        admin: {
          ...(collection.admin || {}),
          group: 'AuthInternal', // Use a different group name
        },
        auth: {
          ...(typeof collection?.auth === 'object' ? collection.auth : {}),
        },
      } satisfies CollectionConfig
    },
  },
  accounts: {
    slug: 'accounts',
    hidden: true,
  },
  sessions: {
    slug: 'sessions',
    hidden: true,
  },
  verifications: {
    slug: 'verifications',
    hidden: true,
  },
  betterAuthOptions: betterAuthOptions,
}

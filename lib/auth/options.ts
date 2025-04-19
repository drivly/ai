import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../hooks/isSuperAdmin'
import stripeClient from '../stripe'
import { getOAuthCallbackURL } from '../utils/url'

const trustedOrigins = [
  // Only use the NEXT_PUBLIC_ versions as they're available on both server and client
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`,
  `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
  ...(process.env.NODE_ENV === 'production'
    ? ['https://apis.do', 'https://workflows.do', 'https://functions.do', 'https://agents.do', 'https://llm.do']
    : ['http://localhost:3000', 'https://localhost:3000']),
]

export const betterAuthPlugins = []
export type BetterAuthPlugins = typeof betterAuthPlugins

export const betterAuthOptions = {
  secret: process.env.BETTER_AUTH_SECRET as string,
  appName: '.do',
  trustedOrigins,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: getOAuthCallbackURL('google'),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: getOAuthCallbackURL('github'),
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user: any) => {
          if (isSuperAdmin(user)) {
            console.log('create:before isSuperAdmin', user)
            return { data: { ...user, role: 'superAdmin' } }
          } else {
            return { data: { ...user, role: 'user' } }
          }
        },
        after: async (user: any) => {
          console.log('create:after', user)
        },
      },
    },
  },
  plugins: [],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
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
      trustedProviders: ['google', 'email-password', 'workos'],
    },
  },
}

export const payloadBetterAuthOptions = {
  disabled: true, // Disable better-auth plugin
  logTables: false,
  enableDebugLogs: false,
  hidePluginCollections: true,
  users: {
    slug: 'users',
    hidden: true, // Hide the users collection from navigation
    adminRoles: ['admin', 'superAdmin'],
    roles: ['user', 'admin', 'superAdmin'],
    allowedFields: ['name'],
    blockFirstBetterAuthVerificationEmail: true,
    collectionOverrides: ({ collection }: { collection: CollectionConfig }) => {
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

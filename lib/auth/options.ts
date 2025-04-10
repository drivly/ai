import type { PayloadBetterAuthPluginOptions } from '@payload-auth/better-auth-plugin'
import { BetterAuthOptions } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { admin, apiKey, multiSession, openAPI, oAuthProxy, genericOAuth, oidcProvider } from 'better-auth/plugins'
import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../hooks/isSuperAdmin'
// import { getCurrentURL } from '../utils/url'

export const betterAuthPlugins = [
  admin(),
  apiKey(),
  multiSession(),
  openAPI(),
  nextCookies(),
  // oAuthProxy({
  //   productionURL: process.env.NODE_ENV === 'production' ? 'https://apis.do' : 'http://localhost:3000',
  //   currentURL: getCurrentURL(),
  // }),
  oAuthProxy(),
  genericOAuth({
    config: [
      {
        providerId: 'workos',
        clientId: process.env.WORKOS_CLIENT_ID as string,
        clientSecret: process.env.WORKOS_CLIENT_SECRET as string,
        authorizationUrl: 'https://api.workos.com/sso/authorize',
        tokenUrl: 'https://api.workos.com/sso/token',
        redirectURI: 'https://apis.do/api/auth/callback/workos',
        scopes: ['openid', 'profile', 'email']
      }
    ]
  }),
  oidcProvider({
    metadata: {
      issuer: 'https://apis.do',
      authorization_endpoint: '/api/auth/authorize',
      token_endpoint: '/api/auth/token',
      userinfo_endpoint: '/api/auth/userinfo',
      jwks_uri: '/api/auth/jwks',
      scopes_supported: ['openid', 'profile', 'email', 'api'],
    },
    scopes: ['openid', 'profile', 'email', 'api'],
    defaultScope: 'openid',
    accessTokenExpiresIn: 3600, // 1 hour
    refreshTokenExpiresIn: 604800, // 7 days
    loginPage: '/sign-in',
  }),
]

export type BetterAuthPlugins = typeof betterAuthPlugins

export const betterAuthOptions: BetterAuthOptions = {
  secret: process.env.BETTER_AUTH_SECRET as string,
  appName: '.do',
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: process.env.NODE_ENV === 'production' ? 'https://apis.do/api/auth/callback/google' : 'http://localhost:3000/api/auth/callback/google', // Must remain fixed for better-auth oauth proxy to work correctly
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: process.env.NODE_ENV === 'production' ? 'https://apis.do/api/auth/callback/github' : 'http://localhost:3000/api/auth/callback/github', // Must remain fixed for better-auth oauth proxy to work correctly
      
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
            return { data: { ...user, role: 'superAdmin' } }
          } else {
            return { data: { ...user, role: 'user' } }
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
        // input: false,
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

export const payloadBetterAuthOptions: PayloadBetterAuthPluginOptions = {
  disabled: false,
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

import type { CollectionConfig } from 'payload'
import { getOAuthCallbackURL } from '../utils/url'

export const trustedOrigins = [
  // Only use the NEXT_PUBLIC_ versions as they're available on both server and client
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`,
  `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
  ...(process.env.NODE_ENV === 'production'
    ? ['https://apis.do', 'https://workflows.do', 'https://functions.do', 'https://agents.do', 'https://llm.do']
    : ['http://localhost:3000', 'https://localhost:3000']),
]

export const authProviders = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackUrl: getOAuthCallbackURL('google'),
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackUrl: getOAuthCallbackURL('github'),
  },
  workos: {
    clientId: process.env.WORKOS_CLIENT_ID as string,
    clientSecret: process.env.WORKOS_CLIENT_SECRET as string,
    callbackUrl: getOAuthCallbackURL('workos'),
  },
  linear: {
    clientId: process.env.LINEAR_CLIENT_ID as string,
    clientSecret: process.env.LINEAR_CLIENT_SECRET as string,
    callbackUrl: getOAuthCallbackURL('linear'),
  },
}

export const userCollectionConfig = {
  slug: 'users',
  hidden: true, // Hide the users collection from navigation
  admin: {
    group: 'AuthInternal',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: ['user', 'admin', 'superAdmin'],
    },
    {
      name: 'name',
      type: 'text',
    },
  ],
}

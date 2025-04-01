import { getPayload as getPayloadBase } from 'payload'

import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import dotenv from 'dotenv'

dotenv.config()

// Default database URI for local dev, can be overridden by env var
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/test'

export const payloadConfig = buildConfig({
  admin: {
    user: 'user',
  },
  secret: process.env.PAYLOAD_SECRET || 'super-secret-payload-key',
  custom: {
    // This is needed for the better-auth adapter to work
    hasBetterAuthPlugin: true,
  },
  db: mongooseAdapter({
    url: DATABASE_URI,
    // Add connection options for better reliability in CI environments
    connectOptions: {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      family: 4, // Use IPv4 only
    },
  }),
  collections: [
    {
      slug: 'user',
      admin: {
        useAsTitle: 'name',
      },
      auth: {
        disableLocalStrategy: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
        },
        {
          name: 'emailVerified',
          type: 'checkbox',
          required: true,
        },
        {
          name: 'image',
          type: 'text',
        },
      ],
      timestamps: true,
    },
    {
      slug: 'account',
      admin: {
        useAsTitle: 'accountId',
      },
      fields: [
        {
          name: 'accountId',
          type: 'number',
          required: true,
        },
        {
          name: 'providerId',
          type: 'text',
        },
        {
          name: 'user',
          type: 'relationship',
          required: true,
          // @ts-ignore
          relationTo: 'user',
        },
        {
          name: 'accessToken',
          type: 'text',
        },
        {
          name: 'refreshToken',
          type: 'text',
        },
        {
          name: 'idToken',
          type: 'text',
        },
        {
          name: 'accessTokenExpiresAt',
          type: 'date',
        },
        {
          name: 'refreshTokenExpiresAt',
          type: 'date',
        },
        {
          name: 'scope',
          type: 'text',
        },
        {
          name: 'password',
          type: 'text',
        },
      ],
      timestamps: true,
    },
    {
      slug: 'verification',
      admin: {
        useAsTitle: 'identifier',
      },
      fields: [
        {
          name: 'identifier',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'expiresAt',
          type: 'date',
          required: true,
        },
      ],
      timestamps: true,
    },
    {
      slug: 'session',
      admin: {
        useAsTitle: 'expiresAt',
      },
      fields: [
        {
          name: 'expiresAt',
          type: 'date',
          required: true,
        },
        {
          name: 'token',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'ipAddress',
          type: 'text',
        },
        {
          name: 'userAgent',
          type: 'text',
        },
        {
          name: 'user',
          type: 'relationship',
          required: true,
          // @ts-ignore
          relationTo: 'user',
        },
      ],
      timestamps: true,
    },
  ],
})

export async function getPayload() {
  try {
    return await getPayloadBase({ config: payloadConfig })
  } catch (error) {
    console.error('Error initializing Payload:', error)
    throw error
  }
}

export default payloadConfig

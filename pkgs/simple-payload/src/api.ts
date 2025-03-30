import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
import { createNodePayloadClient } from './adapters/node'
import { createEdgePayloadClient } from './adapters/edge'
import type { PayloadDB, PayloadInstance, PayloadClientOptions } from './types'

/**
 * Context object passed to API handlers
 */
export type ApiContext = {
  params: Record<string, string | string[]>
  url: URL
  path: string
  domain: string
  origin: string
  user: any // Payload user object type
  permissions: any // Payload permissions object type
  payload: any // Payload instance
  db: PayloadDB // Enhanced database access
  req?: any
}

export type ApiHandler<T = any> = (req: NextRequest, ctx: ApiContext) => Promise<T> | T

export type PayloadClientResult = {
  payload: any
  db: PayloadDB
}

export type PayloadClientFn = () => Promise<PayloadClientResult>

/**
 * Initializes a payload client based on the runtime environment
 * @param payload - Payload instance
 * @param isEdgeRuntime - Whether running in edge environment
 * @returns PayloadDB instance
 */
export const initializePayloadClient = (payload: any, isEdgeRuntime: boolean): PayloadDB => {
  if (!payload.db) {
    return isEdgeRuntime ? createEdgePayloadClient(payload) : createNodePayloadClient(payload)
  }
  return payload.db
}

/**
 * Creates a mock payload client for edge environments
 * @returns Mocked payload instance
 */
export const createMockEdgePayload = (): PayloadInstance => {
  const apiUrl = process.env.PAYLOAD_API_URL || (process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  if (!process.env.PAYLOAD_API_URL) {
    console.warn(`PAYLOAD_API_URL not set, falling back to ${apiUrl}`)
  }

  const apiKey = process.env.PAYLOAD_API_KEY

  return {
    auth: {
      me: async () => ({ permissions: {}, user: null }),
    },
    find: async (options: any) => {
      return fetch(`${apiUrl}/api/${options.collection}`, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      }).then((res) => res.json())
    },
    findByID: async (options: any) => {
      return fetch(`${apiUrl}/api/${options.collection}/${options.id}`, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      }).then((res) => res.json())
    },
  }
}

/**
 * Creates a mock payload client for fallback in Node.js environment
 * @returns Mocked payload instance
 */
export const createMockNodePayload = (): PayloadInstance => {
  const apiUrl = process.env.PAYLOAD_API_URL || (process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  if (!process.env.PAYLOAD_API_URL) {
    console.warn(`PAYLOAD_API_URL not set, falling back to ${apiUrl}`)
  }

  const apiKey = process.env.PAYLOAD_API_KEY

  return {
    auth: {
      me: async () => ({ permissions: {}, user: null }),
    },
    find: async (options: any) => {
      return fetch(`${apiUrl}/api/${options.collection}`, {
        headers: apiKey ? { Authorization: `JWT ${apiKey}` } : {},
      }).then((res) => res.json())
    },
    findByID: async (options: any) => {
      return fetch(`${apiUrl}/api/${options.collection}/${options.id}`, {
        headers: apiKey ? { Authorization: `JWT ${apiKey}` } : {},
      }).then((res) => res.json())
    },
  }
}

/**
 * Initializes payload and database connections based on runtime environment
 * @param payloadInstance - Optional injected payload instance
 * @param options - Optional configuration options
 * @returns Object containing payload, db, user, and permissions
 */
export const initializePayloadAndDB = async (
  payloadInstance?: any,
  options?: {
    getPayloadClient?: PayloadClientFn
  }
): Promise<{
  payload: any
  db: PayloadDB
  user: any
  permissions: any
}> => {
  const isEdgeRuntime = typeof process === 'undefined' || process.env.NEXT_RUNTIME === 'edge'

  let payload: any
  let db: PayloadDB
  let permissions: any = {}
  let user: any = {}

  if (payloadInstance) {
    payload = await payloadInstance

    db = initializePayloadClient(payload, isEdgeRuntime)

    try {
      const authResult = await payload.auth.me()
      permissions = authResult?.permissions || {}
      user = authResult?.user || {}
    } catch (authError) {
      console.error('Error fetching auth info:', authError)
    }
  } else if (isEdgeRuntime) {
    payload = createMockEdgePayload()

    db = createEdgePayloadClient(payload)
  } else {
    try {
      if (options?.getPayloadClient) {
        const result = await options.getPayloadClient()
        payload = result.payload
        db = result.db

        try {
          const authResult = await payload.auth.me()
          permissions = authResult?.permissions || {}
          user = authResult?.user || {}
        } catch (authError) {
          console.error('Error fetching auth info:', authError)
        }
      } else {
        throw new Error('No payload instance provided and no getPayloadClient function specified')
      }
    } catch (error) {
      console.error('Error initializing payload:', error)
      console.warn('Falling back to API approach for payload client')

      const mockPayload = createMockNodePayload()

      db = createNodePayloadClient(mockPayload)

      try {
        const apiUrl = process.env.PAYLOAD_API_URL || (process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        const apiKey = process.env.PAYLOAD_API_KEY

        const authResponse = await fetch(`${apiUrl}/api/users/me`, {
          headers: {
            Authorization: `JWT ${apiKey}`,
          },
        })

        if (authResponse.ok) {
          const authData = await authResponse.json()
          permissions = authData.permissions || {}
          user = authData.user || {}
        }
      } catch (authError) {
        console.error('Error fetching auth info:', authError)
      }
    }
  }

  return { payload, db, user, permissions }
}

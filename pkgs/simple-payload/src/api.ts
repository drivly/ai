import { NextRequest, NextResponse } from 'next/server.js'
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

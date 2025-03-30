import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
import { getPayload } from 'payload'
import config from '../payload.config'
import { PayloadDB } from './db'

/**
 * Context object passed to API handlers
 */
export type ApiContext = {
  params: Record<string, string | string[]>
  url: URL
  path: string
  domain: string
  origin: string
  user: any
  permissions: any
  payload: any
  db: PayloadDB
  req: NextRequest
}

export type ApiHandler<T = any> = (req: NextRequest, ctx: ApiContext) => Promise<T> | T

let _currentRequest: NextRequest | null = null
let _currentContext: ApiContext | null = null

/**
 * Creates an API handler with enhanced context
 * @param handler - Function to handle the API request
 * @returns Next.js API handler function
 */
export const createAPI = <T = any>(handler: ApiHandler<T>) => {
  return async (req: NextRequest, context: { params: Promise<Record<string, string | string[]>> }) => {
    try {
      let payload: any
      let db: PayloadDB
      let permissions: any = {}
      let user: any = {}

      try {
        payload = await getPayload({ config })
        
        db = {} as PayloadDB
        
        const collections = payload.collections || {}
        
        for (const collectionName of Object.keys(collections)) {
          db[collectionName] = {
            find: async (query = {}) => {
              return payload.find({
                collection: collectionName,
                where: query,
              })
            },
            findOne: async (query = {}) => {
              const result = await payload.find({
                collection: collectionName,
                where: query,
                limit: 1,
              })
              return result.docs?.[0] || null
            },
            get: async (id, query = {}) => {
              return payload.findByID({
                collection: collectionName,
                id,
                ...query,
              })
            },
            create: async (data, query = {}) => {
              return payload.create({
                collection: collectionName,
                data,
                ...query,
              })
            },
            update: async (id, data, query = {}) => {
              return payload.update({
                collection: collectionName,
                id,
                data,
                ...query,
              })
            },
            upsert: async (id, data, query = {}) => {
              try {
                await payload.findByID({
                  collection: collectionName,
                  id,
                })
                return payload.update({
                  collection: collectionName,
                  id,
                  data,
                  ...query,
                })
              } catch (error) {
                return payload.create({
                  collection: collectionName,
                  data: { id, ...data },
                  ...query,
                })
              }
            },
            set: async (id, data, query = {}) => {
              return payload.update({
                collection: collectionName,
                id,
                data,
                ...query,
              })
            },
            delete: async (id, query = {}) => {
              return payload.delete({
                collection: collectionName,
                id,
                ...query,
              })
            },
          }
        }

        try {
          const authResult = await payload.auth.me()
          permissions = authResult?.permissions || {}
          user = authResult?.user || {}
        } catch (authError) {
          console.error('Error fetching auth info:', authError)
        }
      } catch (error) {
        console.error('Error initializing payload:', error)
        throw error
      }

      const params = await context.params

      const url = new URL(req.url)
      const path = url.pathname
      const domain = punycode.toUnicode(url.hostname)
      const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')

      const ctx: ApiContext = {
        params,
        url,
        path,
        domain,
        origin,
        user,
        permissions,
        payload,
        db,
        req
      }

      _currentRequest = req
      _currentContext = ctx

      const result = await handler(req, ctx)

      _currentRequest = null
      _currentContext = null

      return NextResponse.json(
        {
          api: {
            name: domain,
            description: 'Economically valuable work delivered through simple APIs',
            home: origin,
            login: origin + '/login',
            signup: origin + '/signup',
            admin: origin + '/admin',
            docs: origin + '/docs',
            repo: 'https://github.com/drivly/ai',
          },
          ...result,
          user,
        },
        { headers: { 'content-type': 'application/json; charset=utf-8' } },
      )
    } catch (error) {
      console.error('API Error:', error)

      _currentRequest = null
      _currentContext = null

      const status = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500
      return NextResponse.json(
        {
          error: true,
          message: error instanceof Error ? error.message : 'Internal Server Error',
          ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack?.split('\n') : undefined }),
        },
        { status },
      )
    }
  }
}

export const API = createAPI

/**
 * Modifies a query string parameter in a URL
 * @param param Parameter name to set
 * @param value Parameter value to set
 * @returns New URL string with the modified query parameter
 */
export const modifyQueryString = (param?: string, value?: string | number) => {
  if (!param) {
    throw new Error('Parameter name is required')
  }

  if (value === undefined) {
    throw new Error('Parameter value is required')
  }

  if (!_currentRequest) {
    throw new Error('No URL provided and no current request available')
  }

  const url = new URL(_currentRequest.url)

  url.searchParams.set(param, value.toString())

  return url.toString()
}

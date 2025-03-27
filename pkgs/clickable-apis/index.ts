import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
import configPromise from '@payload-config'
import { BasePayload, CollectionSlug, getPayload, PayloadRequest, SanitizedPermissions } from 'payload'

// Types for our enhanced db operations
type CollectionQuery = Record<string, any>
type CollectionData = Record<string, any>

interface PayloadDBCollection {
  find: (query?: CollectionQuery) => Promise<any>
  findOne: (query?: CollectionQuery) => Promise<any> // Returns first item or null
  get: (id: string, query?: CollectionQuery) => Promise<any> // Alias for findById
  create: (data: CollectionData, query?: CollectionQuery) => Promise<any>
  update: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>
  upsert: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any>
  set: (id: string, data: CollectionData, query?: CollectionQuery) => Promise<any> // Alias for update
  delete: (id: string, query?: CollectionQuery) => Promise<any>
}

// Define the DB type as a collection of collections
type PayloadDB = Record<CollectionSlug, PayloadDBCollection>

type ApiContext = {
  params: Record<string, string | string[]>
  url: URL
  path: string
  domain: string
  origin: string
  user: any // Payload user object type
  permissions: SanitizedPermissions // Payload permissions object type
  payload: BasePayload // Payload instance
  db: PayloadDB // Enhanced database access
  req?: PayloadRequest
}

type ApiHandler<T = any> = (req: NextRequest, ctx: ApiContext) => Promise<T> | T

// Create a global request context
let _currentRequest: NextRequest | null = null
let _currentContext: ApiContext | null = null

export const API = <T = any>(handler: ApiHandler<T>) => {
  return async (req: NextRequest, context: { params: Promise<Record<string, string | string[]>> }) => {
    try {
      // Get Payload instance
      const payload = await getPayload({
        config: configPromise,
      })

      // Get auth info
      const auth = await payload.auth(req)
      const { permissions } = auth
      const user =
        auth.user?.collection === 'users'
          ? {
              email: auth.user.email,
            }
          : {
              app: auth.user?.name,
              appId: auth.user?.id,
            }

      const params = await context.params

      // Parse URL and path info
      const url = new URL(req.url)
      const path = url.pathname
      const domain = punycode.toUnicode(url.hostname)
      const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')

      // Create a db proxy object for more concise collection operations
      const db = new Proxy(
        {},
        {
          get: (target, collectionName) => {
            // Ensure prop is a string (collection name)
            const collection = String(collectionName)

            // Return a proxy for the collection operations
            return new Proxy(
              {},
              {
                get: (_, method) => {
                  const methodName = String(method)

                  // Map common methods to payload collection operations
                  switch (methodName) {
                    case 'find':
                      return (query: CollectionQuery = {}) =>
                        payload.find({
                          collection: collection as any, // Cast to any to bypass CollectionSlug type restriction
                          ...query,
                        })

                    case 'findOne':
                      return (query: CollectionQuery = {}) =>
                        payload
                          .find({
                            collection: collection as any,
                            limit: 1,
                            ...query,
                          })
                          .then((result) => result.docs?.[0] || null)

                    case 'get':
                    case 'findById':
                    case 'findByID':
                      return (id: string, query: CollectionQuery = {}) =>
                        payload.findByID({
                          collection: collection as any,
                          id,
                          ...query,
                        })

                    case 'create':
                      return (data: CollectionData, query: CollectionQuery = {}) =>
                        payload.create({
                          collection: collection as any,
                          data,
                          ...query,
                        })

                    case 'update':
                      return (id: string, data: CollectionData, query: CollectionQuery = {}) =>
                        payload.update({
                          collection: collection as any,
                          id,
                          data,
                          ...query,
                        })

                    case 'upsert':
                    case 'set':
                      return (id: string, data: CollectionData, query: CollectionQuery = {}) =>
                        payload.db.upsert({
                          collection: collection as any,
                          where: { id: { equals: id } },
                          data,
                          ...query,
                        })

                    case 'delete':
                      return (id: string, query: CollectionQuery = {}) =>
                        payload.delete({
                          collection: collection as any,
                          id,
                          ...query,
                        })

                    default:
                      throw new Error(`Method ${methodName} not implemented for collection ${collection}`)
                  }
                },
              },
            )
          },
        },
      ) as PayloadDB

      // Prepare enhanced context
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
      }

      // Set current request and context for helper functions
      _currentRequest = req
      _currentContext = ctx

      // Call the handler with enhanced context
      const result = await handler(req, ctx)

      // Clear current request and context
      _currentRequest = null
      _currentContext = null

      // Convert result to JSON response
      return NextResponse.json(
        {
          api: {
            name: domain,
            description: 'Economically valuable work delivered through simple APIs',
            // url: req.url,
            home: origin,
            login: origin + '/login',
            signup: origin + '/signup',
            admin: origin + '/admin',
            docs: origin + '/docs',
            repo: 'https://github.com/drivly/ai',
            with: 'https://apis.do',
            from: 'https://agi.do',
          },
          ...result,
          user,
        },
        { headers: { 'content-type': 'application/json; charset=utf-8' } },
      )
    } catch (error) {
      console.error('API Error:', error)

      // Clear current request and context in case of error
      _currentRequest = null
      _currentContext = null

      // Return error as JSON with proper status code
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

/**
 * Modifies a query string parameter in a URL
 * @param urlString Optional URL string. If not provided, uses the current request URL
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

  // Parse the URL
  const url = new URL(_currentRequest.url)

  // Modify the query parameter
  url.searchParams.set(param, value.toString())

  return url.toString()
}

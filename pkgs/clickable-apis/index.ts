import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
// Use type-only imports for payload types
import type { PayloadDB } from 'simple-payload'

// Local implementation of what was previously imported from simple-payload
// This avoids runtime dependency on simple-payload

/**
 * Type for payload instance with minimum required methods
 */
type PayloadInstance = {
  find?: (options: any) => Promise<any>
  findByID?: (options: any) => Promise<any>
  create?: (options: any) => Promise<any>
  update?: (options: any) => Promise<any>
  delete?: (options: any) => Promise<any>
  auth?: {
    me?: () => Promise<any>
  }
  [key: string]: any
}

/**
 * Configuration for REST API-based Payload client
 */
type RestPayloadClientConfig = {
  apiUrl: string
  apiKey?: string
  headers?: Record<string, string>
}

/**
 * Combined configuration options for Payload client
 */
type PayloadClientOptions = RestPayloadClientConfig | PayloadInstance

/**
 * Creates a proxy object for more concise collection operations
 * @param options - Payload instance or configuration
 * @returns A proxy object for database operations
 */
const createPayloadClient = (options: PayloadClientOptions): PayloadDB => {
  // Determine if options is a payload instance or config object
  const isPayloadInstance = (value: any): value is PayloadInstance => {
    return (
      value &&
      typeof value === 'object' &&
      !('apiUrl' in value) &&
      (typeof value.find === 'function' ||
        typeof value.findByID === 'function' ||
        typeof value.create === 'function' ||
        typeof value.update === 'function' ||
        typeof value.delete === 'function')
    )
  }

  // Use the payload instance directly or create a REST client
  const payload = isPayloadInstance(options) ? options : createRestClient(options)

  // Create a proxy for the collections
  return new Proxy(
    {},
    {
      get: (target, collectionName) => {
        const collection = String(collectionName)

        return new Proxy(
          {},
          {
            get: (_, method) => {
              const methodName = String(method)

              switch (methodName) {
                case 'find':
                  return (query: any = {}) => {
                    if (!payload.find) {
                      throw new Error('Payload instance missing find method')
                    }
                    return payload.find({
                      collection,
                      ...query,
                    })
                  }

                case 'findOne':
                  return (query: any = {}) => {
                    if (!payload.find) {
                      throw new Error('Payload instance missing find method')
                    }
                    return payload
                      .find({
                        collection,
                        limit: 1,
                        ...query,
                      })
                      .then((result: any) => result.docs?.[0] || null)
                  }

                case 'get':
                case 'findById':
                case 'findByID':
                  return (id: string, query: any = {}) => {
                    if (!payload.findByID) {
                      throw new Error('Payload instance missing findByID method')
                    }
                    return payload.findByID({
                      collection,
                      id,
                      ...query,
                    })
                  }

                case 'create':
                  return (data: any, query: any = {}) => {
                    if (!payload.create) {
                      throw new Error('Payload instance missing create method')
                    }
                    return payload.create({
                      collection,
                      data,
                      ...query,
                    })
                  }

                case 'update':
                  return (id: string, data: any, query: any = {}) => {
                    if (!payload.update) {
                      throw new Error('Payload instance missing update method')
                    }
                    return payload.update({
                      collection,
                      id,
                      data,
                      ...query,
                    })
                  }

                case 'upsert':
                case 'set':
                  return (id: string, data: any, query: any = {}) => {
                    if (payload.upsert) {
                      return payload.upsert({
                        collection,
                        id,
                        data,
                        ...query,
                      })
                    } else if (payload.update && payload.create) {
                      return payload
                        .update({
                          collection,
                          id,
                          data,
                          ...query,
                        })
                        .catch(() => {
                          if (!payload.create) {
                            throw new Error('Payload instance missing create method')
                          }
                          return payload.create({
                            collection,
                            data: { ...data, id },
                            ...query,
                          })
                        })
                    } else {
                      throw new Error('Payload instance missing update and create methods needed for upsert')
                    }
                  }

                case 'delete':
                  return (id: string, query: any = {}) => {
                    if (!payload.delete) {
                      throw new Error('Payload instance missing delete method')
                    }
                    return payload.delete({
                      collection,
                      id,
                      ...query,
                    })
                  }

                default:
                  throw new Error(`Method ${methodName} not implemented for collection ${collection}`)
              }
            },
          },
        )
      },
    },
  ) as PayloadDB
}

/**
 * Creates a REST client for Payload API
 */
const createRestClient = (config: RestPayloadClientConfig): PayloadInstance => {
  const { apiUrl, apiKey, headers: customHeaders = {} } = config

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  // Create a minimal payload-like instance for REST API
  return {
    find: async (options: any) => {
      const { collection, ...query } = options
      const queryParams = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value))
        } else {
          queryParams.append(key, String(value))
        }
      })

      const response = await fetch(`${apiUrl}/api/${collection}?${queryParams.toString()}`, { headers })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    },

    findByID: async (options: any) => {
      const { collection, id, ...query } = options
      const queryParams = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value))
        } else {
          queryParams.append(key, String(value))
        }
      })

      const queryString = queryParams.toString()
      const url = `${apiUrl}/api/${collection}/${id}${queryString ? `?${queryString}` : ''}`

      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    },

    create: async (options: any) => {
      const { collection, data } = options
      const response = await fetch(`${apiUrl}/api/${collection}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    },

    update: async (options: any) => {
      const { collection, id, data } = options
      const response = await fetch(`${apiUrl}/api/${collection}/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    },

    delete: async (options: any) => {
      const { collection, id } = options
      const response = await fetch(`${apiUrl}/api/${collection}/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    },

    auth: {
      me: async () => {
        const response = await fetch(`${apiUrl}/api/users/me`, {
          headers,
        })

        if (!response.ok) {
          return { permissions: {}, user: null }
        }

        return response.json()
      },
    },
  }
}

/**
 * Creates a Payload client for Node.js environments
 * @param options - Payload instance or connection options
 */
const createNodePayloadClient = (options: PayloadClientOptions): PayloadDB => {
  return createPayloadClient(options)
}

/**
 * Creates a Payload client for Edge runtime environments
 * @param options - Payload instance or connection options
 */
const createEdgePayloadClient = (options: PayloadClientOptions): PayloadDB => {
  return createPayloadClient(options)
}

type ApiContext = {
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

export type { ApiContext }

type ApiHandler<T = any> = (req: NextRequest, ctx: ApiContext) => Promise<T> | T

let _currentRequest: NextRequest | null = null
let _currentContext: ApiContext | null = null

export type PayloadClientResult = {
  payload: any
  db: PayloadDB
}

export type PayloadClientFn = () => Promise<PayloadClientResult>

/**
 * Creates an API factory with dependency injection for payload
 * @param payloadInstance - The payload instance to use
 * @returns A function that creates API handlers
 */
export const createAPI = async (payloadInstance?: any) => {
  /**
   * Creates an API handler with enhanced context
   * @param handler - Function to handle the API request
   * @param options - Optional configuration options
   * @returns Next.js API handler function
   */
  return <T = any>(
    handler: ApiHandler<T>,
    options?: {
      getPayloadClient?: PayloadClientFn
    },
  ) => {
    return async (req: NextRequest, context: { params: Promise<Record<string, string | string[]>> }) => {
      try {
        const isEdgeRuntime = typeof process === 'undefined' || process.env.NEXT_RUNTIME === 'edge'

        let payload: any
        let db: PayloadDB
        let permissions: any = {}
        let user: any = {}

        // Use the injected payload instance if provided through factory function
        if (payloadInstance) {
          payload = await payloadInstance

          // Only create db client if we need it and don't already have it in the payload
          if (!payload.db) {
            // Pass the payload instance directly to the payload client creators
            db = isEdgeRuntime ? createEdgePayloadClient(payload) : createNodePayloadClient(payload)
          } else {
            db = payload.db
          }

          try {
            const authResult = await payload.auth.me()
            permissions = authResult?.permissions || {}
            user = authResult?.user || {}
          } catch (authError) {
            console.error('Error fetching auth info:', authError)
          }
        } else if (isEdgeRuntime) {
          const apiUrl = process.env.PAYLOAD_API_URL || (process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
          if (!process.env.PAYLOAD_API_URL) {
            console.warn(`PAYLOAD_API_URL not set, falling back to ${apiUrl}`)
          }
          const apiKey = process.env.PAYLOAD_API_KEY

          // Create a mock payload instance for edge runtime
          payload = {
            auth: async () => ({ permissions: {}, user: null }),
            // Add required API properties for payload client
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

          // Pass the mock payload instance to the client creator
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

            const apiUrl = process.env.PAYLOAD_API_URL || (process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
            if (!process.env.PAYLOAD_API_URL) {
              console.warn(`PAYLOAD_API_URL not set, falling back to ${apiUrl}`)
            }
            const apiKey = process.env.PAYLOAD_API_KEY

            // Create a mock payload instance for the fallback approach
            const mockPayload = {
              auth: {
                me: async () => ({ permissions: {}, user: null }),
              },
              // Add required API properties for payload client
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

            // Pass the mock payload instance to the client creator
            db = createNodePayloadClient(mockPayload)

            try {
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
}

// For backward compatibility
export const API = createAPI()

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

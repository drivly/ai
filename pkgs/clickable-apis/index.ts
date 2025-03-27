import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
import configPromise from '@payload-config'
import { PayloadDB, PayloadDBCollection, createNodePayloadClient, createEdgePayloadClient } from 'simple-payload'

let getPayload: ((options: any) => Promise<any>) | undefined
try {
  if (typeof window === 'undefined') {
    const payload = require('payload')
    getPayload = payload.getPayload
  }
} catch (error) {
  console.warn('Payload not available in this environment')
}

type CollectionSlug = string
type BasePayload = any
type PayloadRequest = any
type SanitizedPermissions = any

// Types for our enhanced db operations
type CollectionQuery = Record<string, any>
type CollectionData = Record<string, any>

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
      const isEdgeRuntime = typeof process === 'undefined' || process.env.NEXT_RUNTIME === 'edge'
      
      let payload: any
      let db: PayloadDB
      let permissions: any = {}
      let user: any = {}
      
      if (isEdgeRuntime) {
        const apiUrl = process.env.PAYLOAD_API_URL || 'http://localhost:3000'
        const apiKey = process.env.PAYLOAD_API_KEY
        
        db = createEdgePayloadClient({ 
          apiUrl,
          apiKey
        })
        
        payload = {
          auth: async () => ({ permissions: {}, user: null }),
        }
      } else {
        if (!getPayload) {
          throw new Error('Payload is not available in this environment')
        }
        
        payload = await getPayload({
          config: configPromise,
        })
        
        const auth = await payload.auth(req)
        permissions = auth.permissions
        user = auth.user?.collection === 'users'
          ? {
              email: auth.user.email,
            }
          : {
              app: auth.user?.name,
              appId: auth.user?.id,
            }
            
        db = createNodePayloadClient(payload)
      }

      const params = await context.params

      const url = new URL(req.url)
      const path = url.pathname
      const domain = punycode.toUnicode(url.hostname)
      const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')

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

import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
import { PayloadDB, createNodePayloadClient, createEdgePayloadClient } from 'simple-payload'

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

type ApiHandler<T = any> = (req: NextRequest, ctx: ApiContext) => Promise<T> | T

let _currentRequest: NextRequest | null = null
let _currentContext: ApiContext | null = null

export type PayloadClientResult = {
  payload: any
  db: PayloadDB
}

export type PayloadClientFn = () => Promise<PayloadClientResult>

/**
 * Creates an API handler with enhanced context
 * @param handler - Function to handle the API request
 * @param options - Optional configuration options
 * @returns Next.js API handler function
 */
export const API = <T = any>(
  handler: ApiHandler<T>, 
  options?: { 
    getPayloadClient?: PayloadClientFn 
  }
) => {
  return async (req: NextRequest, context: { params: Promise<Record<string, string | string[]>> }) => {
    try {
      const isEdgeRuntime = typeof process === 'undefined' || process.env.NEXT_RUNTIME === 'edge'

      let payload: any
      let db: PayloadDB
      let permissions: any = {}
      let user: any = {}

      if (isEdgeRuntime) {
        const apiUrl = process.env.PAYLOAD_API_URL || (process.env.VERCEL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'http://localhost:3000')
        if (!process.env.PAYLOAD_API_URL) {
          console.warn(`PAYLOAD_API_URL not set, falling back to ${apiUrl}`)
        }
        const apiKey = process.env.PAYLOAD_API_KEY

        db = createEdgePayloadClient({
          apiUrl,
          apiKey,
        })

        payload = {
          auth: async () => ({ permissions: {}, user: null }),
        }
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
            throw new Error('getPayloadClient function not provided')
          }
        } catch (error) {
          console.error('Error initializing payload:', error)
          console.warn('Falling back to API approach for payload client')
          
          const apiUrl = process.env.PAYLOAD_API_URL || (process.env.VERCEL 
            ? `https://${process.env.VERCEL_URL}` 
            : 'http://localhost:3000')
          if (!process.env.PAYLOAD_API_URL) {
            console.warn(`PAYLOAD_API_URL not set, falling back to ${apiUrl}`)
          }
          const apiKey = process.env.PAYLOAD_API_KEY
          
          db = createNodePayloadClient({
            apiUrl,
            apiKey,
          })
          
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

  const url = new URL(_currentRequest.url)

  url.searchParams.set(param, value.toString())

  return url.toString()
}

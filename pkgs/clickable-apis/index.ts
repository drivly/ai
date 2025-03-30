import { NextRequest, NextResponse } from 'next/server'
import { 
  PayloadDB, 
  ApiContext, 
  ApiHandler,
  PayloadClientResult,
  PayloadClientFn,
  initializePayloadClient,
  createMockEdgePayload,
  createMockNodePayload,
  createEdgePayloadClient,
  createNodePayloadClient
} from '../simple-payload/src'

export type { ApiContext, PayloadClientResult, PayloadClientFn }


let _currentRequest: NextRequest | null = null
let _currentContext: ApiContext | null = null

/**
 * Creates an API factory with dependency injection for payload
 * @param payloadInstance - The payload instance to use
 * @returns A function that creates API handlers
 */
export const createAPI = (payloadInstance?: any) => {
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

            const mockPayload = createMockNodePayload()

            // Pass the mock payload instance to the client creator
            db = createNodePayloadClient(mockPayload)

            try {
              const apiUrl = process.env.PAYLOAD_API_URL || 
                (process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
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

        const params = await context.params

        const url = new URL(req.url)
        const path = url.pathname
        const domain = url.hostname
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

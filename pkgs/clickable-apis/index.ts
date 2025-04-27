import { NextRequest, NextResponse } from 'next/server.js'
import punycode from 'punycode'
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
  createNodePayloadClient,
} from 'simple-payload'
import { sdks } from '../../domains.config'

/**
 * Interface for the API header object that appears at the top of all JSON responses
 */
export interface ApiHeader {
  /** Name of the API */
  name: string
  /** Description of the API */
  description: string
  /** Home URL */
  home: string
  /** Login URL - only present when user is not logged in */
  login?: string
  /** Signup URL - only present when user is not logged in */
  signup?: string
  /** Admin URL */
  admin: string
  /** Documentation URL */
  docs: string
  /** Repository URL */
  repo: string
  /** SDK URL */
  sdk: string
  /** Site URL */
  site: string
  /** Discord community URL */
  chat?: string
  /** GitHub issues URL */
  issues?: string
  /** With URL - reference to apis.do */
  with?: string
  /** From URL - reference to dotdo.ai or /sites */
  from: string // Made from field required
}

export type { ApiContext, PayloadClientResult, PayloadClientFn }

let _currentRequest: NextRequest | null = null
let _currentContext: ApiContext | null = null

const domainDescriptions: Record<string, string> = {
  'apis.do': 'Economically valuable work delivered through simple APIs',
  'functions.do': 'Reliable structured outputs',
  'workflows.do': 'Declarative state machines for orchestration',
  'agents.do': 'Autonomous digital workers',
  'database.do': 'AI-enriched data',
  'llm.do': 'Intelligent gateway for routing AI requests',
}

const getDomainDescription = (domain: string, customDescriptions?: Record<string, string>): string => {
  const baseDomain = domain.replace(/\.do(\.mw|\.gt)?$/, '')
  const lookupDomain = baseDomain + '.do'
  const descriptions = customDescriptions || domainDescriptions
  return descriptions[lookupDomain] || descriptions['apis.do'] || 'API'
}

const getDomainPackageName = (domain: string): string => {
  const baseDomain = domain.replace(/\.do(\.mw|\.gt)?$/, '')
  return baseDomain + '.do'
}

const getDomainSite = (domain: string): string => {
  const baseDomain = domain.replace(/\.do(\.mw|\.gt)?$/, '')
  return `https://${baseDomain}.do`
}

/**
 * Creates an API factory with dependency injection for payload
 * @param payloadInstance - The payload instance to use
 * @param options - Optional configuration options
 * @returns A function that creates API handlers
 */
export const createAPI = (
  payloadInstance?: any,
  options?: {
    domainDescriptions?: Record<string, string>
  },
) => {
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
      domainDescriptions?: Record<string, string>
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
              const apiUrl = process?.env?.PAYLOAD_API_URL || (process?.env?.VERCEL ? `https://${process?.env?.VERCEL_URL}` : 'http://localhost:3000')
              const apiKey = process?.env?.PAYLOAD_API_KEY

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

        const isPreview = domain === 'localhost' || domain.endsWith('dev.driv.ly')

        let rootDomain = 'workflows'
        if (isPreview && domain !== 'localhost') {
          const parts = domain.split('.')
          if (parts.length > 2) {
            rootDomain = parts[0]
          }
        }

        let site = domain.endsWith('.do') ? `https://${domain}` : 'https://apis.do'
        let from = 'https://dotdo.ai'

        if (isPreview) {
          site = `${origin}/sites/workflows.do` // Always use workflows.do for preview domains
          from = `${origin}/sites`
        }

        const packageName = getDomainPackageName(domain)
        const sdkUrl = sdks.includes(packageName) ? `https://npmjs.com/${packageName}` : 'https://npmjs.com/workflows.do'

        const apiHeader: ApiHeader = {
          name: domain,
          description: getDomainDescription(domain, options?.domainDescriptions),
          home: origin,
          ...(user?.id ? {
            upgrade: origin + '/upgrade',
            account: origin + '/account',
          } : {
            login: origin + '/login',
            signup: origin + '/signup',
          }),
          admin: origin + '/admin',
          docs: origin + '/docs',
          repo: 'https://github.com/drivly/ai',
          sdk: sdkUrl,
          site, // Use the variable we created
          from, // Add the new field
          chat: 'https://discord.gg/tafnNeUQdm',
          issues: 'https://github.com/drivly/ai/issues',
          with: 'https://apis.do',
        }

        return NextResponse.json(
          {
            api: apiHeader,
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
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'

        return NextResponse.json(
          {
            error: {
              message: errorMessage,
              status,
              ...(process?.env?.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack?.split('\n') : undefined }),
            },
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

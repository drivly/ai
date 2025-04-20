import { NextRequest, NextResponse } from 'next/server.js'
import punycode from 'punycode'
import { getPayload } from 'payload'
import config from '../payload.config'
import { PayloadDB } from './db'
import { auth } from '../auth'
import { UAParser } from 'ua-parser-js'
import { geolocation } from '@vercel/functions'
import { continents, countries, flags, locations, metros } from './constants/cf'
import { nanoid } from 'nanoid'
import { getOrganizationByASN } from './utils/asn-lookup'
import { parentDomains, childDomains, sdks } from '../domains.config'

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
  cf?: any // Cloudflare data fetched from cf.json endpoint
}

/**
 * Type definition for the user object in API responses
 */
export interface APIUser {
  id?: string
  email?: string
  name?: string
  authenticated: boolean
  admin?: boolean
  plan: string
  browser?: string
  userAgent?: string
  os?: string
  ip: string
  isp: string
  asOrg?: string
  flag: string
  zipcode: string
  city: string
  metro?: string
  region: string
  country?: string
  continent?: string
  requestId: string
  localTime: string
  timezone: string
  edgeLocation?: string
  edgeDistanceMiles?: number
  edgeDistanceKilometers?: number
  latencyMilliseconds: number
  recentInteractions: number
  trustScore?: number
  serviceLatency?: number
  authMethod?: string
  authWorkerDomain?: string
  links?: {
    profile?: string
    account?: string
    usage?: string
    upgrade?: string
    logs?: string
    [key: string]: string | undefined
  }
}

/**
 * Type definition for the API header object in responses
 */
export interface APIHeader {
  name: string
  description: string
  home: string
  login: string
  signup: string
  admin: string
  docs: string
  repo: string
  sdk: string
  site: string
  from: string // Added from field
  [key: string]: string
}

export type ApiHandler<T = any> = (req: NextRequest, ctx: ApiContext) => Promise<T> | T

/**
 * Function to get user information from the request
 */
export async function getUser(request: NextRequest, payload?: any): Promise<APIUser> {
  const now = new Date()
  const url = new URL(request.url)
  const domain = punycode.toUnicode(url.hostname)
  const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')

  const isCloudflareWorker = 'cf' in request

  const cf = isCloudflareWorker ? (request as any).cf : 
             (request as any)._cf || undefined

  const geo = !isCloudflareWorker ? geolocation(request) : undefined

  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'

  const userAgent = request.headers.get('user-agent') || ''
  const ua = userAgent ? new UAParser(userAgent).getResult() : { browser: { name: 'unknown' }, os: { name: 'unknown' } }

  const asn = request.headers.get('cf-ray')?.split('-')[0] || request.headers.get('x-vercel-ip-asn') || ''

  const asOrg = asn ? getOrganizationByASN(asn) : null

  const isp = cf?.asOrganization?.toString() || request.headers.get('x-vercel-ip-org') || asOrg || 'Unknown ISP'

  let latitude = 0,
    longitude = 0
  if (cf?.latitude && cf?.longitude) {
    latitude = Number(cf.latitude)
    longitude = Number(cf.longitude)
  } else if (geo?.latitude && geo?.longitude) {
    latitude = Number(geo.latitude)
    longitude = Number(geo.longitude)
  }

  const colo = cf?.colo ? locations[cf.colo as keyof typeof locations] : undefined
  let edgeDistance: number | undefined = undefined

  if (colo && latitude && longitude) {
    const latDiff = colo.lat - latitude
    const lonDiff = colo.lon - longitude
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111 // Rough km conversion
    edgeDistance = Math.round(distance / (cf?.country === 'US' || geo?.country === 'US' ? 1.60934 : 1)) // Convert to miles if US
  }

  let localTime = ''
  try {
    localTime = now.toLocaleString('en-US', {
      timeZone: cf?.timezone ? cf.timezone.toString() : 'UTC',
    })
  } catch (error) {
    console.log({ error })
    localTime = now.toLocaleString('en-US', {
      timeZone: 'UTC',
    })
  }

  const links = {
    profile: origin + '/profile',
    account: origin + '/account',
    usage: origin + '/usage',
    upgrade: origin + '/upgrade',
    logs: origin + '/logs',
  }

  const countryCode = cf?.country || geo?.country || ''
  const countryFlag = countryCode ? flags[countryCode as keyof typeof flags] || '🏳️' : '🏳️'
  const countryName = countryCode ? countries[countryCode as keyof typeof countries]?.name : undefined

  const cfWorkerHeader = request.headers.get('cf-worker')
  if (cfWorkerHeader && isCloudflareWorker && payload) {
    try {
      const { isCloudflareIP } = await import('./utils/cloudflare-ip')
      if (await isCloudflareIP(ip)) {
        const workerDomain = cfWorkerHeader.trim()

        const apiKeyWithDomain = await payload.db.apikeys.findOne({
          where: {
            cfWorkerDomains: {
              elemMatch: {
                domain: workerDomain,
              },
            },
          },
        })

        if (apiKeyWithDomain) {
          const user = await payload.db.users.findByID(apiKeyWithDomain.user)
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              authenticated: true,
              admin: user.role === 'admin',
              plan: user.plan || 'Free',
              browser: ua?.browser?.name,
              userAgent: ua?.browser?.name === undefined && userAgent ? userAgent : undefined,
              os: ua?.os?.name as string,
              ip,
              isp,
              asOrg: asOrg || undefined,
              flag: countryFlag,
              zipcode: cf?.postalCode?.toString() || request.headers.get('x-vercel-ip-zipcode') || '',
              city: cf?.city?.toString() || geo?.city || request.headers.get('x-vercel-ip-city') || '',
              metro: cf?.metroCode ? metros[Number(cf.metroCode) as keyof typeof metros] : undefined,
              region: cf?.region?.toString() || geo?.countryRegion || request.headers.get('x-vercel-ip-region') || '',
              country: countryName,
              continent: cf?.continent ? continents[cf.continent as keyof typeof continents] : undefined,
              requestId: cf ? request.headers.get('cf-ray') + '-' + cf.colo : request.headers.get('x-vercel-id') || '',
              localTime,
              timezone: cf?.timezone?.toString() || 'UTC',
              edgeLocation: colo?.city || geo?.region,
              edgeDistanceMiles: cf?.country === 'US' || geo?.country === 'US' ? edgeDistance : undefined,
              edgeDistanceKilometers: cf?.country === 'US' || geo?.country === 'US' ? undefined : edgeDistance,
              latencyMilliseconds: cf?.clientTcpRtt ? Number(cf.clientTcpRtt) : 0,
              recentInteractions: 0,
              trustScore: cf?.botManagement ? (cf.botManagement as any).score : undefined,
              links,
              authMethod: 'cloudflare-worker',
              authWorkerDomain: workerDomain,
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in Cloudflare Worker authentication:', error)
    }
  }

  return {
    authenticated: false, // This would be determined by authentication logic
    admin: undefined, // This would be determined by authentication logic
    plan: 'Free', // This would be determined by user data
    browser: ua?.browser?.name,
    userAgent: ua?.browser?.name === undefined && userAgent ? userAgent : undefined,
    os: ua?.os?.name as string,
    ip,
    isp,
    asOrg: asOrg || undefined,
    flag: countryFlag,
    zipcode: cf?.postalCode?.toString() || request.headers.get('x-vercel-ip-zipcode') || '',
    city: cf?.city?.toString() || geo?.city || request.headers.get('x-vercel-ip-city') || '',
    metro: cf?.metroCode ? metros[Number(cf.metroCode) as keyof typeof metros] : undefined,
    region: cf?.region?.toString() || geo?.countryRegion || request.headers.get('x-vercel-ip-region') || '',
    country: countryName,
    continent: cf?.continent ? continents[cf.continent as keyof typeof continents] : undefined,
    requestId: cf ? request.headers.get('cf-ray') + '-' + cf.colo : request.headers.get('x-vercel-id') || '',
    localTime,
    timezone: cf?.timezone?.toString() || 'UTC',
    edgeLocation: colo?.city || geo?.region,
    edgeDistanceMiles: cf?.country === 'US' || geo?.country === 'US' ? edgeDistance : undefined,
    edgeDistanceKilometers: cf?.country === 'US' || geo?.country === 'US' ? undefined : edgeDistance,
    latencyMilliseconds: cf?.clientTcpRtt ? Number(cf.clientTcpRtt) : 0,
    recentInteractions: 0, // This would be determined by user data
    trustScore: cf?.botManagement ? (cf.botManagement as any).score : undefined,
    links,
  }
}

/**
 * Function to get API header object
 */
export function getApiHeader(request: NextRequest, description?: string): APIHeader {
  const url = new URL(request.url)
  const domain = punycode.toUnicode(url.hostname)
  const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')

  const packageName = domain

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

  const sdkUrl = sdks.includes(packageName) ? `https://npmjs.com/${packageName}` : 'https://npmjs.com/workflows.do'

  return {
    name: domain,
    description: description || 'Economically valuable work delivered through simple APIs',
    home: origin,
    login: origin + '/login',
    signup: origin + '/signup',
    admin: origin + '/admin',
    docs: origin + '/docs',
    repo: 'https://github.com/drivly/ai',
    sdk: sdkUrl,
    site, // Use the variable we created
    from, // Add the new field
  }
}

let _currentRequest: NextRequest | null = null
let _currentContext: ApiContext | null = null

/**
 * Creates an API handler with enhanced context
 * @param handler - Function to handle the API request
 * @returns Next.js API handler function
 */
const createApiHandler = <T = any>(handler: ApiHandler<T>) => {
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
          // const authResult = await payload.auth.me()
          // permissions = authResult?.permissions || {}
          // user = authResult?.user || {}
          const authResult = await payload.auth(req)
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
        req,
        cf: (req as any)._cf, // Include Cloudflare data fetched from middleware
      }

      _currentRequest = req
      _currentContext = ctx

      const result = await handler(req, ctx)

      _currentRequest = null
      _currentContext = null

      const enhancedUser = await getUser(req, payload)

      let authUser: Record<string, any> = {}
      try {
        const session = await auth()
        authUser = session?.user || {}
      } catch (authError) {
        console.error('Error fetching AuthJS session:', authError)
      }

      const mergedUser = {
        ...enhancedUser,
        authenticated: (user?.id || authUser?.id) ? true : false,
        admin: (user?.admin || authUser?.role === 'admin') ? true : undefined,
        plan: user?.plan || 'Free',
        name: authUser?.name || user?.name || enhancedUser.name,
        email: authUser?.email || user?.email || enhancedUser.email,
      }

      const apiDescription =
        typeof result === 'object' && result !== null && result && 'api' in result && typeof (result as any).api === 'object' && (result as any).api !== null
          ? (result as any).api.description
          : undefined
      const api = getApiHeader(req, apiDescription)

      const responseBody = {
        api,
        ...result,
        user: mergedUser,
      }
      return new NextResponse(JSON.stringify(responseBody, null, 2), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
      })
    } catch (error) {
      console.error('API Error:', error)

      _currentRequest = null
      _currentContext = null

      try {
        getPayload({ config })
          .then((payloadInstance) => {
            payloadInstance
              .create({
                collection: 'errors',
                data: {
                  message: error instanceof Error ? error.message : 'Unknown API Error',
                  stack: error instanceof Error ? error.stack : undefined,
                  digest: `api-error-${Date.now()}`,
                  url: req.url,
                  source: 'api-handler',
                },
              })
              .catch((logError: Error) => console.error('Error logging to errors collection:', logError))
          })
          .catch((initError: Error) => console.error('Failed to initialize payload for error logging:', initError))
      } catch (logError) {
        console.error('Failed to log error to collection:', logError)
      }

      const status = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500
      const errorResponseBody = {
        error: true,
        message: error instanceof Error ? error.message : 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack?.split('\n') : undefined }),
      }
      return new NextResponse(JSON.stringify(errorResponseBody, null, 2), {
        status,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      })
    }
  }
}

// NOTE: Do not import from clickable-apis or simple-payload packages until things stabilize.
// We're using the native implementation directly to avoid dependency issues.
// Later we can extract these functions into those packages if needed.

export const API = createApiHandler

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

/**
 * Generates a short unique ID (SQID) for sharing responses
 * @param requestId - The original request ID to encode
 * @returns A short unique ID for sharing
 */
export const generateShareId = (requestId: string): string => {
  return nanoid(10)
}

/**
 * Decodes a share ID back to the original request ID
 * This would typically involve a database lookup in production
 * @param shareId - The share ID to decode
 * @returns The original request ID or null if not found
 */
export const getRequestIdFromShareId = async (shareId: string, db: PayloadDB): Promise<string | null> => {
  try {
    const share = await db.shares?.findOne({ shareId })
    return share?.requestId || null
  } catch (error) {
    console.error('Error retrieving request ID from share ID:', error)
    return null
  }
}

/**
 * Stores a mapping between a share ID and request ID
 * @param shareId - The generated share ID
 * @param requestId - The original request ID
 * @param response - The response data to be shared
 * @param db - Database instance
 */
export const storeShareMapping = async (shareId: string, requestId: string, response: Record<string, any>, db: PayloadDB): Promise<void> => {
  try {
    await db.shares?.create({
      shareId,
      requestId,
      response,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error('Error storing share mapping:', error)
  }
}

/**
 * Generates sharing links for various social platforms
 * @param shareId - The share ID to include in the links
 * @param title - The title or content summary to share
 * @param url - The base URL for sharing (defaults to current domain)
 * @returns Object containing sharing links for various platforms
 */
export const generateSharingLinks = (shareId: string, title: string, url?: string): Record<string, string> => {
  const baseUrl = url || (_currentRequest ? new URL(_currentRequest.url).origin : 'https://api.do')
  const shareUrl = `${baseUrl}/share/${shareId}`

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(shareUrl)

  return {
    url: shareUrl,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    sms: `sms:?body=${encodedTitle} ${shareUrl}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle} ${encodedUrl}`,
    instagram: `https://www.instagram.com/?url=${encodedUrl}`,
    tiktok: `https://www.tiktok.com/upload?url=${encodedUrl}`,
  }
}

/**
 * Generates pagination links for API responses
 * @param request - The NextRequest object
 * @param page - Current page number
 * @param limit - Items per page
 * @param totalItems - Total number of items
 * @returns Object containing home, next, and prev links
 */
export const generatePaginationLinks = (request: NextRequest, page: number, limit: number, totalItems: number): { home: string; next?: string; prev?: string } => {
  const url = new URL(request.url)
  const baseUrl = url.origin + url.pathname
  const searchParams = url.searchParams

  const links: { home: string; next?: string; prev?: string } = {
    home: baseUrl,
  }

  if (totalItems === limit) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', (page + 1).toString())
    links.next = `${baseUrl}?${nextParams.toString()}`
  }

  if (page > 1) {
    const prevParams = new URLSearchParams(searchParams)
    prevParams.set('page', (page - 1).toString())
    links.prev = `${baseUrl}?${prevParams.toString()}`
  }

  return links
}

/**
 * Generates complete pagination links for API responses including first and last pages
 * @param request - The NextRequest object
 * @param page - Current page number
 * @param limit - Items per page
 * @param totalItems - Total number of items
 * @param totalPages - Total number of pages
 * @returns Object containing home, first, last, next, and prev links
 */
export const generateCompletePaginationLinks = (
  request: NextRequest,
  page: number,
  limit: number,
  totalItems: number,
  totalPages: number,
): { home: string; first: string; last?: string; next?: string; prev?: string } => {
  const baseLinks = generatePaginationLinks(request, page, limit, totalItems)
  const url = new URL(request.url)
  const baseUrl = url.origin + url.pathname
  const searchParams = url.searchParams

  const links: {
    home: string
    first: string
    last?: string
    next?: string
    prev?: string
  } = {
    ...baseLinks,
    first: '', // Will be set below
  }

  const firstParams = new URLSearchParams(searchParams)
  firstParams.set('page', '1')
  links.first = `${baseUrl}?${firstParams.toString()}`

  if (totalPages > 1) {
    const lastParams = new URLSearchParams(searchParams)
    lastParams.set('page', totalPages.toString())
    links.last = `${baseUrl}?${lastParams.toString()}`
  }

  return links
}

/**
 * Generates a function link for a given function name
 * @param request - The NextRequest object
 * @param functionName - Name of the function
 * @returns URL string pointing to the function
 */
export const generateFunctionLink = (request: NextRequest, functionName: string): string => {
  const url = new URL(request.url)
  return `${url.origin}/functions/${functionName}`
}

/**
 * Creates a functions object with function names as keys and links as values
 * @param request - The NextRequest object
 * @param functions - Array of function objects with name property
 * @returns Object with function names as keys and links as values
 */
export const createFunctionsObject = (request: NextRequest, functions: Array<{ name: string; [key: string]: any }> | any): Record<string, string> => {
  const functionsObject: Record<string, string> = {}

  if (Array.isArray(functions)) {
    for (let i = 0; i < functions.length; i++) {
      const func = functions[i]
      if (func && typeof func === 'object' && func.name) {
        functionsObject[func.name] = generateFunctionLink(request, func.name)
      }
    }
  } else if (functions && typeof functions === 'object') {
    const keys = Object.keys(functions)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      functionsObject[key] = generateFunctionLink(request, key)
    }
  }

  return functionsObject
}

/**
 * Enhances an API response with sharing capabilities
 * @param response - The original API response
 * @param requestId - The request ID to use for generating the share ID
 * @param title - Optional title for the shared content
 * @returns The enhanced response with sharing links
 */
export const addSharingToResponse = async <T extends Record<string, any>>(
  response: T,
  requestId: string,
  title?: string,
  db?: PayloadDB,
): Promise<T & { share: { id: string; links: Record<string, string> } }> => {
  const shareId = generateShareId(requestId)
  const shareTitle = title || response.title || 'Check out this AI response'

  if (db?.shares) {
    await storeShareMapping(shareId, requestId, response, db)
  }

  return {
    ...response,
    share: {
      id: shareId,
      links: generateSharingLinks(shareId, shareTitle),
    },
  }
}

/**
 * API handler for the /share/:id route
 * Retrieves the original response using the share ID and returns it
 * @param params - Object containing the share ID
 * @param db - Database instance
 * @returns The original response or an error
 */
export const handleShareRequest = async (params: { id: string }, db: PayloadDB): Promise<Record<string, any>> => {
  try {
    const { id } = params

    const share = await db.shares?.findOne({ shareId: id })

    if (!share) {
      return {
        error: true,
        message: 'Shared content not found',
        status: 404,
      }
    }

    return {
      ...share.response,
      shared: true,
      sharedAt: share.createdAt,
    }
  } catch (error) {
    console.error('Error handling share request:', error)
    return {
      error: true,
      message: 'Failed to retrieve shared content',
      status: 500,
    }
  }
}

/**
 * Checks if a domain has a "shortcut path"
 * A shortcut path is a domain that has a direct .do equivalent
 * @param domain - The domain to check
 * @returns Boolean indicating if the domain has a shortcut path
 */
const hasShortcutPath = (domain?: string): boolean => {
  if (!domain) return false

  const baseDomain = domain.replace(/\.do(\.mw|\.gt)?$/, '')
  return parentDomains[baseDomain] !== undefined || Object.values(childDomains).some((children) => children.includes(baseDomain))
}

/**
 * Formats a URL based on domain type and user preference
 * @param path - The relative path (e.g., 'functions')
 * @param options - Options for formatting the URL
 * @returns Formatted URL string
 */
export const formatUrl = (
  path: string,
  options: {
    origin: string
    domain?: string
    showDomains?: boolean
    defaultDomain?: string
  },
): string => {
  const { origin, domain, showDomains, defaultDomain } = options

  const shouldShowDomains = showDomains ?? (domain === 'apis.do' || hasShortcutPath(domain))

  if (shouldShowDomains && defaultDomain) {
    let tldVariant = ''
    if (domain) {
      if (domain.endsWith('.do.gt')) tldVariant = '.gt'
      else if (domain.endsWith('.do.mw')) tldVariant = '.mw'
    }

    const domainWithCorrectTLD = defaultDomain.replace(/\.do$/, `.do${tldVariant}`)
    return `https://${domainWithCorrectTLD}`
  }

  return `${origin}/${path}`
}

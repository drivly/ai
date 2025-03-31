import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
import { getPayload } from 'payload'
import config from '../payload.config'
import { PayloadDB } from './db'
import { UAParser } from 'ua-parser-js'
import { continents, countries, flags, locations, metros } from './constants/cf'

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

/**
 * Type definition for the user object in API responses
 */
export interface APIUser {
  authenticated: boolean
  admin?: boolean
  plan: string
  browser?: string
  userAgent?: string
  os?: string
  ip: string
  isp: string
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
  [key: string]: string
}

export type ApiHandler<T = any> = (req: NextRequest, ctx: ApiContext) => Promise<T> | T

/**
 * Function to get user information from the request
 */
export function getUser(request: NextRequest): APIUser {
  const now = new Date()
  const url = new URL(request.url)
  const domain = punycode.toUnicode(url.hostname)
  const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')
  
  const isCloudflareWorker = 'cf' in request
  
  const cf = isCloudflareWorker ? (request as any).cf : undefined
  
  const ip = request.headers.get('cf-connecting-ip') || 
             request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1'
  
  const userAgent = request.headers.get('user-agent') || ''
  const ua = userAgent ? new UAParser(userAgent).getResult() : { browser: { name: 'unknown' }, os: { name: 'unknown' } }
  
  const asn = request.headers.get('cf-ray')?.split('-')[0] || 
              request.headers.get('x-vercel-ip-asn') || 
              ''
  
  const isp = cf?.asOrganization?.toString() || 
              request.headers.get('x-vercel-ip-org') || 
              'Unknown ISP'
  
  let latitude = 0, longitude = 0
  if (cf?.latitude && cf?.longitude) {
    latitude = Number(cf.latitude)
    longitude = Number(cf.longitude)
  }
  
  const colo = cf?.colo ? locations[cf.colo as keyof typeof locations] : undefined
  let edgeDistance: number | undefined = undefined
  
  if (colo && latitude && longitude) {
    const latDiff = colo.lat - latitude
    const lonDiff = colo.lon - longitude
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111 // Rough km conversion
    edgeDistance = Math.round(distance / (cf?.country === 'US' ? 1.60934 : 1)) // Convert to miles if US
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
  
  return {
    authenticated: false, // This would be determined by authentication logic
    admin: undefined,     // This would be determined by authentication logic
    plan: 'Free',         // This would be determined by user data
    browser: ua?.browser?.name,
    userAgent: ua?.browser?.name === undefined && userAgent ? userAgent : undefined,
    os: ua?.os?.name as string,
    ip,
    isp,
    flag: cf?.country ? flags[cf.country as keyof typeof flags] || '🏳️' : '🏳️',
    zipcode: cf?.postalCode?.toString() || request.headers.get('x-vercel-ip-zipcode') || '',
    city: cf?.city?.toString() || request.headers.get('x-vercel-ip-city') || '',
    metro: cf?.metroCode ? metros[Number(cf.metroCode) as keyof typeof metros] : undefined,
    region: cf?.region?.toString() || request.headers.get('x-vercel-ip-region') || '',
    country: cf?.country ? countries[cf.country as keyof typeof countries]?.name : undefined,
    continent: cf?.continent ? continents[cf.continent as keyof typeof continents] : undefined,
    requestId: cf ? request.headers.get('cf-ray') + '-' + cf.colo : request.headers.get('x-vercel-id') || '',
    localTime,
    timezone: cf?.timezone?.toString() || 'UTC',
    edgeLocation: colo?.city,
    edgeDistanceMiles: cf?.country === 'US' ? edgeDistance : undefined,
    edgeDistanceKilometers: cf?.country === 'US' ? undefined : edgeDistance,
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
  
  return {
    name: domain,
    description: description || 'Economically valuable work delivered through simple APIs',
    home: origin,
    login: origin + '/login',
    signup: origin + '/signup',
    admin: origin + '/admin',
    docs: origin + '/docs',
    repo: 'https://github.com/drivly/ai',
    sdk: `https://npmjs.com/${packageName}`,
    site: domain.endsWith('.do') ? `https://${domain}` : 'https://apis.do',
  }
}

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
        req,
      }

      _currentRequest = req
      _currentContext = ctx

      const result = await handler(req, ctx)

      _currentRequest = null
      _currentContext = null

      const enhancedUser = getUser(req)
      
      const mergedUser = {
        ...enhancedUser,
        authenticated: user?.id ? true : false,
        admin: user?.admin || undefined,
        plan: user?.plan || 'Free',
      }
      
      const apiDescription = typeof result === 'object' && result !== null && 'api' in result && 
                            typeof (result as any).api === 'object' && (result as any).api !== null ? 
                            (result as any).api.description : undefined
      const api = getApiHeader(req, apiDescription)
      
      return NextResponse.json(
        {
          api,
          ...result,
          user: mergedUser,
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

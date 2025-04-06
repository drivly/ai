import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../payload.config'
import { PayloadDB } from './db'
import { UAParser } from 'ua-parser-js'
import { geolocation } from '@vercel/functions'
import { continents, countries, flags, locations, metros } from './constants/cf'
import { nanoid } from 'nanoid'
import { getOrganizationByASN } from './utils/asn-lookup'

/**
 * Function to check if the request is from a bot
 * @param request - The NextRequest object
 * @returns boolean indicating if the request is from a bot
 */
export function isBot(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const lowercaseUA = userAgent.toLowerCase()
  
  const botIdentifiers = [
    'bot', 'crawl', 'spider', 'slurp', 'baiduspider',
    'yandex', 'googlebot', 'bingbot', 'semrushbot',
    'facebook', 'twitter', 'slack', 'telegram', 'discord',
    'whatsapp', 'viber', 'skype', 'linkedin', 'pinterest',
    'facebot', 'telegrambot', 'discordbot', 'whatsappbot',
    'twitterbot', 'pinterestbot', 'linkedinbot',
    'ahrefsbot', 'msnbot', 'petalbot', 'coccocbot',
    'applebot', 'duckduckbot', 'archive.org_bot'
  ]
  
  return botIdentifiers.some(identifier => lowercaseUA.includes(identifier))
}

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
  links?: {
    login?: string
    signup?: string
    admin?: string
  }
}

/**
 * Type definition for the API header in responses
 */
export interface APIHeader {
  name: string
  description?: string
  home: string
  login: string
  signup: string
  admin: string
  docs: string
  repo: string
  sdk: string
  site: string
  version?: string
}

/**
 * Function to get user information from the request
 * @param request - The NextRequest object
 * @returns User information object
 */
export function getUser(request: NextRequest): APIUser {
  const now = new Date()
  const url = new URL(request.url)
  const domain = url.hostname
  const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')
  
  const isCloudflareWorker = 'cf' in request
  
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    request.headers.get('cf-connecting-ip') || 
    '127.0.0.1'
  
  const asn = request.headers.get('cf-ipcountry') ? 
    request.headers.get('cf-asn') || 
    request.headers.get('x-vercel-ip-asn') : 
    undefined
  
  const isp = asn ? 
    getOrganizationByASN(asn) || 
    request.headers.get('cf-asorganization') || 
    request.headers.get('x-vercel-ip-org') || 
    'Unknown' : 
    'Unknown'
  
  const geo = geolocation(request)
  const flag = geo.flag || flags[geo.country as keyof typeof flags] || '🏳️'
  const zipcode = geo.postalCode || ''
  const city = geo.city || ''
  const metro = geo.city ? metros[geo.city as keyof typeof metros] : undefined
  const region = geo.region || ''
  const country = geo.country ? countries[geo.country as keyof typeof countries] : undefined
  const continent = geo.country ? continents[geo.country as keyof typeof continents] : undefined
  const requestId = nanoid()
  
  const timezone = geo.timezone || 'UTC'
  const localTime = new Date().toLocaleString('en-US', { 
    timeZone: timezone 
  })
  
  const localTime2 = new Date().toLocaleString('en-US', { 
    timeZone: timezone 
  })
  
  const links = {
    login: `https://${request.headers.get('host')}/login`,
    signup: `https://${request.headers.get('host')}/signup`,
    admin: `https://${request.headers.get('host')}/admin`,
  }
  
  return {
    authenticated: false,
    plan: 'free',
    browser: new UAParser(request.headers.get('user-agent') || '').getBrowser().name,
    userAgent: request.headers.get('user-agent') || '',
    os: new UAParser(request.headers.get('user-agent') || '').getOS().name,
    ip,
    isp,
    asOrg: isp,
    flag,
    zipcode,
    city,
    metro,
    region,
    country,
    continent,
    requestId,
    localTime,
    timezone,
    links,
  }
}

/**
 * Function to get API header information
 * @param request - The NextRequest object
 * @param description - Optional API description
 * @returns API header object
 */
export function getApiHeader(request: NextRequest, description?: string): APIHeader {
  const url = new URL(request.url)
  const domain = url.hostname
  const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')
  
  const packageName = domain
  
  return {
    name: domain,
    description,
    home: `https://${domain}`,
    login: `https://${domain}/login`,
    signup: `https://${domain}/signup`,
    admin: `https://${domain}/admin`,
    docs: `https://docs.drivly.dev`,
    repo: 'https://github.com/drivly/api',
    sdk: 'https://www.npmjs.com/package/@drivly/api',
    site: `https://${domain}`,
  }
}

/**
 * Creates an API handler function with common functionality
 * @param handler - The handler function to wrap
 * @param options - Options for the API handler
 * @returns Wrapped handler function
 */
export const createApiHandler = (
  handler: (req: NextRequest, ctx: ApiContext) => Promise<any>,
  options: {
    collectionName?: string
    requireAuth?: boolean
    requireAdmin?: boolean
    requirePlan?: string
    requirePermission?: string
    requireRole?: string
  } = {}
) => {
  return async (req: NextRequest, context: { params: Promise<Record<string, string | string[]>> }) => {
    try {
      // Handle share requests
      const shareResult = await handleShareRequest(req)
      if (shareResult) return shareResult

      // Initialize payload and database
      let db: any = {}
      
      if (options.collectionName) {
        try {
          const payload = await getPayload({ 
            config,
            local: process.env.PAYLOAD_PUBLIC_SERVER_URL?.includes('localhost'),
          })
          
          db[options.collectionName] = {
            find: async (query: any = {}, options: any = {}) => {
              try {
                const result = await payload.find({
                  collection: options.collectionName,
                  where: query,
                  ...options,
                })
                
                return result
              } catch (err) {
                console.error('Error finding documents:', err)
                return { docs: [] }
              }
            },
            findOne: async (query: any = {}, options: any = {}) => {
              try {
                return await payload.findByID({
                  collection: options.collectionName,
                  id: query.id,
                  ...options,
                })
              } catch (err) {
                console.error('Error finding document:', err)
                return null
              }
            },
            create: async (data: any, options: any = {}) => {
              try {
                return await payload.create({
                  collection: options.collectionName,
                  data,
                  ...options,
                })
              } catch (err) {
                console.error('Error creating document:', err)
                throw err
              }
            },
            update: async (query: any = {}, data: any, options: any = {}) => {
              try {
                return await payload.update({
                  collection: options.collectionName,
                  id: query.id,
                  data,
                  ...options,
                })
              } catch (err) {
                console.error('Error updating document:', err)
                throw err
              }
            },
            delete: async (query: any = {}, options: any = {}) => {
              try {
                return await payload.delete({
                  collection: options.collectionName,
                  id: query.id,
                  ...options,
                })
              } catch (err) {
                console.error('Error deleting document:', err)
                throw err
              }
            },
          }
        } catch (err) {
          console.error('Error initializing payload:', err)
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
        user: {},
        permissions: {},
        payload: null,
        db,
        req,
      }

      // Get user information
      const user = getUser(req)
      
      // Call handler function
      const result = await handler(req, ctx)
      
      // Merge user information
      const mergedUser = { ...user, ...result?.user }
      
      const apiDescription = result?.api?.description ? 
                            result.api.description : 
                            (result as any).api && typeof (result as any).api === 'object' && 
                            (result as any).api.description ? 
                            (result as any).api.description : undefined
      const api = getApiHeader(req, apiDescription)
      
      if (isBot(req)) {
        const htmlResponse = generateBotHtml(req, api, {
          api,
          ...result,
          user: mergedUser,
        })
        
        return new NextResponse(htmlResponse, {
          headers: { 'content-type': 'text/html; charset=utf-8' }
        })
      }
      
      return NextResponse.json(
        {
          api,
          ...result,
          user: mergedUser,
        },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    } catch (error: any) {
      console.error('API Error:', error)
      
      return NextResponse.json(
        {
          error: error.message || 'An error occurred',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        {
          status: error.status || 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }
  }
}

/**
 * Modifies a query string by adding or updating parameters
 * @param url - The URL to modify
 * @param params - Parameters to add or update
 * @returns Modified URL
 */
const modifyQueryString = (url: string, params: Record<string, string>) => {
  const urlObj = new URL(url)
  
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      urlObj.searchParams.delete(key)
    } else {
      urlObj.searchParams.set(key, value)
    }
  }
  
  return urlObj.toString()
}

/**
 * Generates a share ID for a request
 * @returns Generated share ID
 */
const generateShareId = () => {
  return nanoid(10)
}

/**
 * Gets a request ID from a share ID
 * @param shareId - The share ID
 * @returns Request ID or null if not found
 */
const getRequestIdFromShareId = async (shareId: string) => {
  try {
    // Implement storage lookup here
    return null
  } catch (error) {
    console.error('Error getting request ID from share ID:', error)
    return null
  }
}

/**
 * Stores a mapping between share ID and request ID
 * @param shareId - The share ID
 * @param requestId - The request ID
 * @returns Success status
 */
const storeShareMapping = async (shareId: string, requestId: string) => {
  try {
    // Implement storage here
    return true
  } catch (error) {
    console.error('Error storing share mapping:', error)
    return false
  }
}

/**
 * Generates sharing links for an API response
 * @param req - The NextRequest object
 * @param shareId - The share ID
 * @returns Object with sharing links
 */
const generateSharingLinks = (req: NextRequest, shareId: string) => {
  const url = new URL(req.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const sharePath = `${url.pathname}?share=${shareId}`
  
  return {
    api: `${baseUrl}${sharePath}`,
    html: `${baseUrl}${sharePath}&format=html`,
    md: `${baseUrl}${sharePath}&format=md`,
    json: `${baseUrl}${sharePath}&format=json`,
    csv: `${baseUrl}${sharePath}&format=csv`,
  }
}

/**
 * Generates pagination links for an API response
 * @param req - The NextRequest object
 * @param page - Current page number
 * @param pageSize - Page size
 * @param total - Total number of items
 * @returns Object with pagination links
 */
const generatePaginationLinks = (
  req: NextRequest,
  page: number,
  pageSize: number,
  total: number
) => {
  const url = req.url
  const totalPages = Math.ceil(total / pageSize)
  
  const links: Record<string, string> = {}
  
  if (page > 1) {
    links.first = modifyQueryString(url, { page: '1' })
    links.prev = modifyQueryString(url, { page: (page - 1).toString() })
  }
  
  if (page < totalPages) {
    links.next = modifyQueryString(url, { page: (page + 1).toString() })
    links.last = modifyQueryString(url, { page: totalPages.toString() })
  }
  
  return links
}

/**
 * Generates a function link for an API response
 * @param req - The NextRequest object
 * @param functionName - Function name
 * @returns Function link
 */
const generateFunctionLink = (req: NextRequest, functionName: string) => {
  const url = new URL(req.url)
  return `${url.protocol}//${url.host}${url.pathname}/${functionName}`
}

/**
 * Creates a functions object for an API response
 * @param req - The NextRequest object
 * @param functions - Array of function names
 * @returns Object with function links
 */
const createFunctionsObject = (req: NextRequest, functions: string[]) => {
  if (!functions || !Array.isArray(functions) || functions.length === 0) {
    return undefined
  }
  
  const result: Record<string, string> = {}
  
  for (const functionName of functions) {
    result[functionName] = generateFunctionLink(req, functionName)
  }
  
  return result
}

/**
 * Adds sharing information to an API response
 * @param req - The NextRequest object
 * @param response - The API response object
 * @returns Modified API response with sharing information
 */
const addSharingToResponse = (req: NextRequest, response: any) => {
  const shareId = generateShareId()
  const requestId = response.user?.requestId || nanoid()
  
  storeShareMapping(shareId, requestId)
  
  const sharingLinks = generateSharingLinks(req, shareId)
  
  return {
    ...response,
    share: {
      id: shareId,
      ...sharingLinks,
    },
  }
}

/**
 * Handles a share request
 * @param req - The NextRequest object
 * @returns Response or null if not a share request
 */
export const handleShareRequest = async (
  params: { id: string },
  db: PayloadDB
): Promise<Record<string, any>> => {
  try {
    const { id } = params
    
    const share = await db.shares?.findOne({ shareId: id })
    
    if (!share) {
      return {
        error: true,
        message: 'Shared content not found',
        status: 404
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
      status: 500
    }
  }
}

/**
 * Converts URLs in JSON string values to HTML anchor tags
 * @param obj - The object to process
 * @returns A new object with URLs converted to anchor tags
 */
export function convertUrlsToLinks(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'string') {
    if (obj.trim().startsWith('https://')) {
      return `<a href="${obj}" target="_blank" rel="noopener noreferrer">${obj}</a>`
    }
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertUrlsToLinks(item))
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertUrlsToLinks(obj[key])
      }
    }
    return result
  }
  
  return obj
}

/**
 * Generates HTML with stringified JSON and metadata for bot crawlers
 * @param request - The NextRequest object
 * @param api - The API header object
 * @param response - The API response object to stringify
 * @returns HTML string with metadata and stringified JSON
 */
export function generateBotHtml(
  request: NextRequest,
  api: APIHeader,
  response: Record<string, any>
): string {
  const url = new URL(request.url)
  const domain = url.hostname
  const origin = url.protocol + '//' + domain + (url.port ? ':' + url.port : '')
  
  const title = api.name || domain
  const description = api.description || 'API Response'
  
  // Use the new Next.js opengraph-image path convention
  const jsonPreviewUrl = `${origin}/opengraph-image?title=${encodeURIComponent(title)}`
  
  const processedResponse = convertUrlsToLinks(response)
  
  const formattedJson = JSON.stringify(processedResponse, (key, value) => {
    if (typeof value === 'string' && value.includes('<a href="https://')) {
      return value
    }
    return value
  }, 2)
  
  const htmlFormattedJson = formattedJson
    .replace(/&quot;&lt;a href=&quot;(https:\/\/[^&]*)&quot; target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;&gt;(https:\/\/[^&]*)&lt;\/a&gt;&quot;/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
    .replace(/"<a href="(https:\/\/[^"]*)" target="_blank" rel="noopener noreferrer">(https:\/\/[^"]*)<\/a>"/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>')
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - API Response</title>
  <meta name="description" content="${description}">
  
  <!-- OpenGraph meta tags -->
  <meta property="og:title" content="${title} - API Response">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${jsonPreviewUrl}">
  <meta property="og:url" content="${request.url}">
  <meta property="og:type" content="website">
  
  <!-- Twitter card tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} - API Response">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${jsonPreviewUrl}">
  
  <!-- Additional SEO metadata -->
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${request.url}">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 24px;
      font-size: 32px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
    }
    pre a {
      color: #0366d6;
      text-decoration: none;
    }
    pre a:hover {
      text-decoration: underline;
    }
    .api-info {
      margin-bottom: 24px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    .api-info p {
      margin: 8px 0;
    }
    .api-links {
      margin-top: 16px;
    }
    .api-links a {
      color: #0366d6;
      text-decoration: none;
      margin-right: 16px;
    }
    .api-links a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <h1>${title} - API Response</h1>
  
  <div class="api-info">
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Domain:</strong> ${domain}</p>
    
    <div class="api-links">
      <a href="${api.home}" target="_blank">Home</a>
      <a href="${api.docs}" target="_blank">Documentation</a>
      <a href="${api.repo}" target="_blank">Repository</a>
    </div>
  </div>
  
  <pre>${htmlFormattedJson}</pre>
</body>
</html>`
}

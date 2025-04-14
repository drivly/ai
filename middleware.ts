import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { analyticsMiddleware } from './analytics/src/middleware'
import { collectionSlugs } from './collections/middleware-collections'
import { API_AUTH_PREFIX, publicRoutes } from './lib/routes'
import {
  isGatewayDomain,
  isBrandDomain,
  isDoDomain,
  isDoManagementDomain,
} from './lib/domains'
import { RequestHandler } from './lib/middleware/request-handler'
import {
  handleApiRoute,
  handleApiDocsRoute,
  handleGatewayDomain,
  handleBrandDomain,
  handleDoManagementDomain,
  handleDoDomain,
  handleCustomDomain,
} from './lib/middleware'

/**
 * Middleware Configuration
 * -----------------------
 * This middleware handles routing logic for the .do domain ecosystem and custom domains.
 * It determines whether requests should be routed to API endpoints or website content.
 */

/**
 * Handle PostHog proxy requests
 * Intercepts requests to PostHog API endpoints and forwards them to PostHog servers
 */
async function handlePostHogProxy(request: NextRequest) {
  const url = new URL(request.url)
  
  if (!url.pathname.startsWith('/ingest') && !url.pathname.startsWith('/decide')) {
    return null
  }
  
  const posthogHost = process.env.POSTHOG_HOST || 'https://us.i.posthog.com'
  const posthogUrl = new URL(url.pathname + url.search, posthogHost)
  
  const headers = new Headers(request.headers)
  
  const requestToForward = new Request(posthogUrl, {
    method: request.method,
    headers,
    body: request.body,
    redirect: 'follow',
  })
  
  try {
    const response = await fetch(requestToForward)
    
    const responseHeaders = new Headers(response.headers)
    
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Error proxying PostHog request:', error)
    return new Response('Error proxying request to PostHog', { status: 500 })
  }
}

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
  const posthogResponse = await handlePostHogProxy(request)
  if (posthogResponse) return posthogResponse
  
  return analyticsMiddleware(request, async () => {
    const handler = new RequestHandler(request)
    
    const isLoggedIn = handler.isLoggedIn()
    console.log('🚀 ~ isLoggedIn:', isLoggedIn)
    
    if (handler.isApiAuthRoute() || handler.isPublicRoute()) {
      return NextResponse.next()
    }
    
    if (handler.isApiRoute()) {
      console.log('Handling API route', { hostname: handler.hostname, pathname: handler.pathname, search: handler.search })
      
      if (handler.isApiDocsRoute()) {
        return handleApiDocsRoute(request)
      }
      
      const apiRouteResponse = handleApiRoute(request)
      if (apiRouteResponse) {
        return apiRouteResponse
      }
      
      return NextResponse.next()
    }
    
    if (isGatewayDomain(handler.hostname)) {
      const gatewayResponse = handleGatewayDomain(request)
      if (gatewayResponse) {
        return gatewayResponse
      }
      return NextResponse.next()
    }
    
    if (isBrandDomain(handler.hostname)) {
      const brandResponse = handleBrandDomain(request)
      if (brandResponse) {
        return brandResponse
      }
      return NextResponse.next()
    }
    
    if (isDoManagementDomain(handler.hostname)) {
      const managementResponse = handleDoManagementDomain(request)
      if (managementResponse) {
        return managementResponse
      }
    }
    
    if (isDoDomain(handler.hostname)) {
      const doResponse = handleDoDomain(request)
      if (doResponse) {
        return doResponse
      }
      return NextResponse.next()
    }
    
    return handleCustomDomain(request)
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/ingest',
    '/decide',
  ],
}

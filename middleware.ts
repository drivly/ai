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
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
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
  ],
}

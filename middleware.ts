import type { NextRequest } from 'next/server.js'
import { NextResponse } from 'next/server.js'
import { auth } from '@/auth'
import { analyticsMiddleware } from './analytics/src/middleware'
import { isBrandDomain, isDoDomain, isDoManagementDomain, isGatewayDomain } from './lib/domains'
import { handleApiDocsRoute, handleApiRoute, handleBrandDomain, handleCustomDomain, handleDoDomain, handleDoManagementDomain, handleGatewayDomain } from './lib/middleware'
import { RequestHandler } from './lib/middleware/request-handler'

/**
 * Middleware Configuration
 * -----------------------
 * This middleware handles routing logic for the .do domain ecosystem and custom domains.
 * It determines whether requests should be routed to API endpoints or website content.
 * It also handles authentication using next-auth.
 */

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
  const handler = new RequestHandler(request)

  if (handler.isApiAuthRoute() || handler.isPublicRoute()) {
    return NextResponse.next()
  }

  if (handler.isProtectedRoute()) {
    const session = await auth()

    if (!session) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return analyticsMiddleware(request, async () => {
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

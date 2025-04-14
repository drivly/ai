import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Router } from 'itty-router'
import { analyticsMiddleware } from './analytics/src/middleware'
import { buildContext } from './lib/ctx'
import * as handlers from './lib/ctx/handlers'

/**
 * Middleware Configuration
 * -----------------------
 * This middleware handles routing logic for the .do domain ecosystem and custom domains.
 * It determines whether requests should be routed to API endpoints or website content.
 * 
 * This implementation uses itty-router for clean, declarative routing.
 */

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
  return analyticsMiddleware(request, async () => {
    const ctx = buildContext(request)
    
    const router = Router()
    
    router.all('*', () => {
      if (ctx.isApiAuthRoute || ctx.isPublicRoute) {
        console.log('Passing through auth or public route', { path: ctx.pathname })
        return NextResponse.next()
      }
    })
    
    router.all('*', () => {
      if (ctx.isApiRoute) {
        console.log('Handling API route', { hostname: ctx.hostname, pathname: ctx.pathname, search: ctx.search })
        
        if (ctx.isApiDocsRoute) {
          return handlers.handleApiDocsRoute(ctx)
        }
        
        const apiRouteResponse = handlers.handleApiRoute(ctx)
        if (apiRouteResponse) {
          return apiRouteResponse
        }
        
        return NextResponse.next()
      }
    })
    
    router.all('*', () => {
      if (ctx.isGatewayDomain) {
        const gatewayResponse = handlers.handleGatewayDomain(ctx)
        if (gatewayResponse) {
          return gatewayResponse
        }
        return NextResponse.next()
      }
    })
    
    router.all('*', () => {
      if (ctx.isBrandDomain) {
        const brandResponse = handlers.handleBrandDomain(ctx)
        if (brandResponse) {
          return brandResponse
        }
        return NextResponse.next()
      }
    })
    
    router.all('*', () => {
      if (ctx.isDoManagementDomain) {
        const managementResponse = handlers.handleDoManagementDomain(ctx)
        if (managementResponse) {
          return managementResponse
        }
      }
    })
    
    router.all('*', () => {
      if (ctx.isDoDomain) {
        const doResponse = handlers.handleDoDomain(ctx)
        if (doResponse) {
          return doResponse
        }
        return NextResponse.next()
      }
    })
    
    router.all('*', () => {
      return handlers.handleCustomDomain(ctx)
    })
    
    return router.handle({})
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

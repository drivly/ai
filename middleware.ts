import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Router } from 'itty-router'
import { analyticsMiddleware } from './analytics/src/middleware'
import { API_AUTH_PREFIX, publicRoutes } from './lib/routes'
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
    
    router.all(`${API_AUTH_PREFIX}*`, () => {
      console.log('Passing through auth route', { path: ctx.pathname })
      return NextResponse.next()
    })
    
    publicRoutes.forEach(route => {
      router.all(route, () => {
        console.log('Passing through public route', { path: ctx.pathname })
        return NextResponse.next()
      })
    })
    
    router.all('/api/docs*', () => {
      console.log('Handling API docs route', { hostname: ctx.hostname, pathname: ctx.pathname })
      return handlers.handleApiDocsRoute(ctx)
    })
    
    router.all('/v1/docs*', () => {
      console.log('Handling API docs route', { hostname: ctx.hostname, pathname: ctx.pathname })
      return handlers.handleApiDocsRoute(ctx)
    })
    
    router.all('/api*', () => {
      console.log('Handling API route', { hostname: ctx.hostname, pathname: ctx.pathname })
      const apiRouteResponse = handlers.handleApiRoute(ctx)
      if (apiRouteResponse) {
        return apiRouteResponse
      }
      return NextResponse.next()
    })
    
    router.all('/v1*', () => {
      console.log('Handling API route', { hostname: ctx.hostname, pathname: ctx.pathname })
      const apiRouteResponse = handlers.handleApiRoute(ctx)
      if (apiRouteResponse) {
        return apiRouteResponse
      }
      return NextResponse.next()
    })
    
    router.all('*', () => {
      if (ctx.isGatewayDomain) {
        if (ctx.pathname === '/sites') {
          console.log('Rewriting gateway domain /sites to sites', { hostname: ctx.hostname })
          return handlers.handleGatewayDomain(ctx)
        }
        
        if ((ctx.hostname === 'do.gt' || ctx.hostname === 'do.mw') && ctx.pathname === '/') {
          console.log('Rewriting do.gt/do.mw root to /sites', { hostname: ctx.hostname })
          return handlers.handleGatewayDomain(ctx)
        }
        
        console.log('Passing through gateway domain', { hostname: ctx.hostname })
        return NextResponse.next()
      }
      
      if (ctx.isBrandDomain) {
        if (ctx.pathname === '/docs' || ctx.pathname.startsWith('/docs/') ||
            ctx.pathname === '/admin' || ctx.pathname.startsWith('/admin/') ||
            ctx.pathname === '/api' || ctx.pathname.startsWith('/api/') ||
            ctx.pathname === '/v1' || ctx.pathname.startsWith('/v1/')) {
          console.log('Passing through special path for brand domain', { hostname: ctx.hostname, pathname: ctx.pathname })
          return NextResponse.next()
        }
        
        console.log('Handling brand domain', { hostname: ctx.hostname, pathname: ctx.pathname })
        return handlers.handleBrandDomain(ctx)
      }
      
      if (ctx.isDoManagementDomain) {
        console.log('Handling management domain', { hostname: ctx.hostname, pathname: ctx.pathname })
        return handlers.handleDoManagementDomain(ctx)
      }
      
      if (ctx.isDoDomain) {
        if (ctx.pathname === '/admin' || ctx.pathname.startsWith('/admin/')) {
          console.log('Handling admin path for .do domain', { hostname: ctx.hostname, pathname: ctx.pathname })
          if (ctx.apiName && handlers.collectionSlugs.includes(ctx.apiName)) {
            console.log('Rewriting to admin collection', { hostname: ctx.hostname, collection: ctx.apiName })
            return handlers.handleDoDomain(ctx)
          }
          return NextResponse.next()
        }
        
        if (ctx.pathname === '/docs' || ctx.pathname.startsWith('/docs/')) {
          console.log('Handling docs path for .do domain', { hostname: ctx.hostname })
          return NextResponse.next()
        }
        
        console.log('Handling .do domain', { hostname: ctx.hostname, pathname: ctx.pathname })
        return handlers.handleDoDomain(ctx)
      }
      
      console.log('Handling custom domain', { hostname: ctx.hostname, pathname: ctx.pathname })
      return handlers.handleCustomDomain(ctx)
    })
    
    return router.handle(ctx)
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

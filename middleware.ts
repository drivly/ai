import NextAuth from 'next-auth'
import { NextResponse } from 'next/server.js'
import { analyticsMiddleware } from './analytics/src/middleware'
import authConfig from './auth.config'
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
const { auth } = NextAuth(authConfig)

export default auth(async (request) => {
  const handler = new RequestHandler(request)
  const isLoggedIn = !!request.auth

  await handler.fetchCfData()

  if (handler.isApiAuthRoute() || handler.isPublicRoute()) {
    return NextResponse.next()
  }

  // TEMPORARY CHANGE (ENG-751): Admin routes bypass authentication redirects
  // This is a temporary modification until integrated auth is restored
  if (handler.isProtectedRoute()) {
    if (!handler.isAdminRoute()) {
      if (!isLoggedIn) {
        const signInUrl = new URL('/api/auth/signin', request.url)
        signInUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(signInUrl)
      }
    }
  }

  return analyticsMiddleware(request, async () => {
    if (handler.pathname === '/pricing') {
      console.log('Handling /pricing special case', { hostname: handler.hostname, pathname: handler.pathname })
      const targetHostname = 'functions.do' // Always use functions.do for the /pricing path
      return NextResponse.rewrite(new URL(`${request.nextUrl.origin}/sites/${targetHostname}/pricing${request.nextUrl.search}`, request.url))
    }

    if (isDoDomain(handler.hostname) && !isGatewayDomain(handler.hostname) && !handler.pathname.startsWith('/api/') && !handler.pathname.startsWith('/v1/')) {
      const doResponse = handleDoDomain(request)
      if (doResponse) {
        return doResponse
      }
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
      if (handler.pathname === '/pricing') {
        console.log('Handling /pricing special case for gateway domain', { hostname: handler.hostname, pathname: handler.pathname })
        const targetHostname = 'functions.do' // Always use functions.do for the /pricing path
        return NextResponse.rewrite(new URL(`${request.nextUrl.origin}/sites/${targetHostname}/pricing${request.nextUrl.search}`, request.url))
      }

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
})
// export async function middleware(request: NextRequest) {
//   const handler = new RequestHandler(request)

//   await handler.fetchCfData()

//   if (handler.isApiAuthRoute() || handler.isPublicRoute()) {
//     return NextResponse.next()
//   }

//   if (handler.isProtectedRoute()) {
//     if (!handler.isAdminRoute()) {
//       const session = await auth()

//       console.log('session', session)

//       if (!session) {
//         const signInUrl = new URL('/api/auth/signin', request.url)
//         signInUrl.searchParams.set('callbackUrl', request.url)
//         return NextResponse.redirect(signInUrl)
//       }
//     }
//   }

//   return analyticsMiddleware(request, async () => {
//     if (handler.isApiRoute()) {
//       console.log('Handling API route', { hostname: handler.hostname, pathname: handler.pathname, search: handler.search })

//       if (handler.isApiDocsRoute()) {
//         return handleApiDocsRoute(request)
//       }

//       const apiRouteResponse = handleApiRoute(request)
//       if (apiRouteResponse) {
//         return apiRouteResponse
//       }

//       return NextResponse.next()
//     }

//     if (isGatewayDomain(handler.hostname)) {
//       const gatewayResponse = handleGatewayDomain(request)
//       if (gatewayResponse) {
//         return gatewayResponse
//       }
//       return NextResponse.next()
//     }

//     if (isBrandDomain(handler.hostname)) {
//       const brandResponse = handleBrandDomain(request)
//       if (brandResponse) {
//         return brandResponse
//       }
//       return NextResponse.next()
//     }

//     if (isDoManagementDomain(handler.hostname)) {
//       const managementResponse = handleDoManagementDomain(request)
//       if (managementResponse) {
//         return managementResponse
//       }
//     }

//     if (isDoDomain(handler.hostname)) {
//       const doResponse = handleDoDomain(request)
//       if (doResponse) {
//         return doResponse
//       }
//       return NextResponse.next()
//     }

//     return handleCustomDomain(request)
//   })
// }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/image? (image optimization with query parameters)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|_next\\/image\\?|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

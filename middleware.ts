import NextAuth from 'next-auth'
import { NextResponse } from 'next/server.js'
import { analyticsMiddleware } from './analytics/src/middleware'
import authConfig from './auth.config'
import { isBrandDomain, isDoDomain, isDoManagementDomain, isGatewayDomain, extractApiNameFromDomain, extractApiNameFromManagementDomain, isSiteDomain } from './lib/domains'
import { RequestHandler } from './lib/middleware/request-handler'
import { collectionSlugs } from './collections/slugs'

/**
 * Middleware Configuration
 * =======================
 *
 * This middleware handles routing logic for the .do domain ecosystem and custom domains.
 * It determines whether requests should be routed to API endpoints or website content,
 * and handles authentication using next-auth.
 *
 * 1. Authentication Logic
 * ----------------------
 * - Uses NextAuth for authentication via the auth.config.ts configuration
 * - Public routes (defined in lib/routes.ts) bypass authentication checks:
 *   - /login, /sign-up, /api/users/me, etc.
 *   - Routes starting with /api/auth/ (API_AUTH_PREFIX)
 *   - Routes with favicon paths
 * - Protected routes redirect unauthenticated users to sign-in page:
 *   - /dashboard, /account, /admin, /chat, etc. (defined in lib/routes.ts)
 *   - Redirects to /api/auth/signin with the original URL as callbackUrl
 * - Admin routes have special handling with temporary auth bypass (ENG-751):
 *   - Currently admin routes (/admin/*) bypass authentication redirects
 *   - This is a temporary modification until integrated auth is restored
 *
 * 2. Domain Type Routing
 * ---------------------
 * The middleware identifies and routes different domain types:
 *
 * a) .do Domains:
 *    - Domains ending with .do, .do.gt, or .do.mw (checked via isDoDomain())
 *    - Non-API routes are rewritten to /sites/{hostname}{pathname}
 *    - API routes (/api/* or /v1/*) are rewritten to /{apiName}{path}
 *    - Admin routes are passed through or rewritten to specific collections
 *    - Example: functions.do/about → /sites/functions.do/about
 *
 * b) Gateway Domains:
 *    - Domains like apis.do, do.gt, do.mw (checked via isGatewayDomain())
 *    - /docs path is rewritten to /docs
 *    - /sites path is rewritten to /sites
 *    - Root path for do.gt/do.mw is rewritten to /sites
 *    - /pricing path is always rewritten to functions.do/pricing
 *
 * c) .do.management Domains:
 *    - Domains ending with .do.management (checked via isDoManagementDomain())
 *    - Rewritten to /admin or /admin/collections/{managementApiName}
 *    - Example: functions.do.management → /admin/collections/functions
 *
 * d) Brand Domains:
 *    - Custom domains configured in domains.config.js (checked via isBrandDomain())
 *    - Docs, admin, and API paths are passed through
 *    - Site domains are rewritten to /sites/{hostname}{pathname}
 *    - Root path is rewritten to /sites
 *    - Other paths are rewritten to /sites/.do{pathname}
 *
 * e) Custom Domains:
 *    - Any domain not matching the above categories
 *    - Rewritten to /projects/{hostname}{pathname}
 *
 * 3. Path-Based Routing
 * --------------------
 * The middleware handles specific path patterns:
 *
 * a) API Routes:
 *    - Paths starting with /api/ or /v1/
 *    - For .do domains: rewritten to /{apiName}{path}
 *    - For other domains: passed through
 *
 * b) API Documentation Routes:
 *    - Paths starting with /api/docs/ or /v1/docs/
 *    - Rewritten to docs.apis.do with modified headers
 *
 * c) Documentation Routes:
 *    - Paths starting with /docs/
 *    - For documentation.do: ensures path starts with /docs
 *    - For other domains: passed through
 *
 * d) Admin Routes:
 *    - Paths starting with /admin/
 *    - For .do domains with matching collection: rewritten to /admin/collections/{apiName}
 *    - For other cases: passed through
 *
 * 4. Path Duplication Prevention
 * -----------------------------
 * The middleware prevents path duplication when the domain is included in the path:
 *
 * - Checks if pathname starts with the domain name (e.g., /gpt.do/chat/new)
 * - Removes the domain prefix to prevent duplication
 * - Example: /gpt.do/chat/new → /sites/gpt.do/chat/new (not /sites/gpt.do/gpt.do/chat/new)
 *
 * 5. Special Cases
 * ---------------
 * The middleware handles several special cases:
 *
 * a) documentation.do Domain:
 *    - Ensures all paths start with /docs
 *    - Example: documentation.do/guide → /docs/guide
 *
 * b) /pricing Path:
 *    - Always rewrites to functions.do/pricing regardless of domain
 *    - Example: apis.do/pricing → /sites/functions.do/pricing
 *
 * c) Analytics Middleware:
 *    - All requests pass through analyticsMiddleware for tracking
 */

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
const { auth } = NextAuth(authConfig)

export default auth(async (request) => {
  const handler = new RequestHandler(request)
  const isLoggedIn = !!request.auth

  if (handler.isApiAuthRoute() || handler.isPublicRoute() || handler.pathname.startsWith('/api/') || handler.pathname.startsWith('/v1/')) {
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
    if (isDoDomain(handler.hostname) && !isGatewayDomain(handler.hostname) && !handler.pathname.startsWith('/api/') && !handler.pathname.startsWith('/v1/')) {
      console.log('Handling .do domain non-API route', { hostname: handler.hostname, pathname: handler.pathname })

      const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
      const { pathname, search } = request.nextUrl
      const url = new URL(request.url)

      if (hostname === 'documentation.do') {
        console.log('Handling documentation.do domain', { pathname, search })
        const pathWithDocs = pathname.startsWith('/docs') ? pathname : `/docs${pathname}`
        return NextResponse.rewrite(new URL(`${url.origin}${pathWithDocs}${search}`, url))
      }

      const apiName = extractApiNameFromDomain(hostname)
      const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

      if (isAdminRoute) {
        console.log('Handling admin path for .do domain', { hostname, pathname, search })

        if (apiName && collectionSlugs.includes(apiName)) {
          console.log('Rewriting to admin collection', { hostname, pathname, search, collection: apiName })
          return NextResponse.rewrite(new URL(`/admin/collections/${apiName}${search}`, url))
        }

        console.log('Passing through admin path for .do domain', { hostname, pathname, search })
        return NextResponse.next()
      }

      const response = NextResponse.next()
      response.headers.set('x-pathname', pathname)

      if (pathname === '/docs' || pathname.startsWith('/docs/')) {
        console.log('Handling docs path', { hostname, pathname, search })
        return NextResponse.next()
      }

      if (pathname === '/api' || pathname === '/v1') {
        console.log('Rewriting /api or /v1 to API root', { apiName, hostname, pathname, search })
        const path = pathname === '/api' ? pathname.replace('/api', '') : pathname.replace('/v1', '')
        return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`, url))
      }

      // Fix path duplication by checking if pathname already includes the hostname
      const domainPrefix = `/${hostname}`
      let cleanPathname = pathname

      // If the pathname starts with the domain name (e.g., /gpt.do/chat/new)
      if (pathname.startsWith(domainPrefix)) {
        // Remove the domain prefix to prevent duplication
        cleanPathname = pathname.substring(domainPrefix.length)
        console.log('Removed domain prefix from pathname', {
          hostname,
          originalPathname: pathname,
          cleanPathname,
        })
      }

      const newUrl = `${url.origin}/sites/${hostname}${cleanPathname}${search}`
      console.log('Rewriting to site', { hostname, pathname: cleanPathname, search, url, newUrl })
      return NextResponse.rewrite(new URL(newUrl, url))
    }

    if (handler.isApiRoute()) {
      console.log('Handling API route', { hostname: handler.hostname, pathname: handler.pathname, search: handler.search })

      console.log('Processing regular API route', { hostname: handler.hostname, pathname: handler.pathname })
      const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
      const { pathname, search } = request.nextUrl
      const url = new URL(request.url)

      if (isDoDomain(hostname)) {
        const apiName = extractApiNameFromDomain(hostname)

        console.log('Rewriting /api or /v1 to API root for .do domain', { apiName, hostname, pathname, search })

        const path = pathname.startsWith('/api') ? pathname.replace('/api', '') : pathname.replace('/v1', '')

        return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`))
      }

      console.log('Passing through API request', { hostname, pathname, search })
      return NextResponse.next()
    }

    if (isGatewayDomain(handler.hostname)) {
      console.log('Handling gateway domain', { hostname: handler.hostname, pathname: handler.pathname })
      const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
      const { pathname, search } = request.nextUrl
      const url = new URL(request.url)

      console.log('Handling gateway domain, exiting middleware', {
        hostname,
        pathname,
        search,
      })

      if (pathname === '/docs') {
        console.log('Rewriting gateway domain /docs to docs', {
          hostname,
          pathname,
          search,
        })
        return NextResponse.rewrite(new URL(`/docs${search}`, url))
      }

      if (pathname === '/sites') {
        console.log('Rewriting gateway domain /sites to sites', {
          hostname,
          pathname,
          search,
        })
        return NextResponse.rewrite(new URL(`/sites${search}`, url))
      }

      if ((hostname === 'do.gt' || hostname === 'do.mw') && pathname === '/') {
        console.log('Rewriting do.gt/do.mw root to /sites', {
          hostname,
          pathname,
          search,
        })
        return NextResponse.rewrite(new URL(`/sites${search}`, url))
      }

      return NextResponse.next()
    }

    if (isBrandDomain(handler.hostname)) {
      console.log('Handling brand domain', { hostname: handler.hostname, pathname: handler.pathname })
      const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
      const { pathname, search } = request.nextUrl
      const url = new URL(request.url)

      console.log('Handling brand domain', { hostname, pathname, search })

      if (pathname === '/docs' || pathname.startsWith('/docs/')) {
        console.log('Passing through docs path for brand domain', { hostname, pathname, search })
        return NextResponse.next()
      }

      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        console.log('Passing through admin path for brand domain', { hostname, pathname, search })
        return NextResponse.next()
      }

      if (pathname === '/api' || pathname.startsWith('/api/') || pathname === '/v1' || pathname.startsWith('/v1/')) {
        console.log('Passing through API path for brand domain', { hostname, pathname, search })
        return NextResponse.next()
      }

      if (isSiteDomain(hostname)) {
        console.log(`Rewriting site domain ${hostname} to /sites/${hostname}`, { pathname, search })
        return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname === '/' ? '' : pathname}${search}`, url))
      }

      if (pathname === '/') {
        console.log('Rewriting brand domain root path to /sites', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/sites${search}`, url))
      }

      const cleanPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname

      console.log('Rewriting brand domain to sites domain path using .do', { hostname, cleanPathname, search })
      return NextResponse.rewrite(new URL(`/sites/.do${cleanPathname}${search}`, url))
    }

    if (isDoManagementDomain(handler.hostname)) {
      console.log('Handling do management domain', { hostname: handler.hostname, pathname: handler.pathname })
      const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
      const { pathname, search } = request.nextUrl
      const url = new URL(request.url)

      const managementApiName = extractApiNameFromManagementDomain(hostname)

      if (managementApiName === '') {
        console.log('Skipping rewrite from do.management to /admin', { hostname, pathname, search })
        return NextResponse.next()
      } else {
        if (managementApiName && collectionSlugs.includes(managementApiName)) {
          console.log('Rewriting to admin collection', { hostname, pathname, search, collection: managementApiName })
          return NextResponse.rewrite(new URL(`/admin/collections/${managementApiName}${pathname}${search}`, url))
        }

        console.log('Rewriting to admin path', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, url))
      }
    }

    if (isDoDomain(handler.hostname)) {
      console.log('Handling .do domain fallback', { hostname: handler.hostname, pathname: handler.pathname })
      const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
      const { pathname, search } = request.nextUrl
      const url = new URL(request.url)

      if (hostname === 'documentation.do') {
        console.log('Handling documentation.do domain', { pathname, search })
        const pathWithDocs = pathname.startsWith('/docs') ? pathname : `/docs${pathname}`
        return NextResponse.rewrite(new URL(`${url.origin}${pathWithDocs}${search}`, url))
      }

      const apiName = extractApiNameFromDomain(hostname)
      const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')

      if (isAdminRoute) {
        console.log('Handling admin path for .do domain', { hostname, pathname, search })

        if (apiName && collectionSlugs.includes(apiName)) {
          console.log('Rewriting to admin collection', { hostname, pathname, search, collection: apiName })
          return NextResponse.rewrite(new URL(`/admin/collections/${apiName}${search}`, url))
        }

        console.log('Passing through admin path for .do domain', { hostname, pathname, search })
        return NextResponse.next()
      }

      const response = NextResponse.next()
      response.headers.set('x-pathname', pathname)

      if (pathname === '/docs' || pathname.startsWith('/docs/')) {
        console.log('Handling docs path', { hostname, pathname, search })
        return NextResponse.next()
      }

      if (pathname === '/api' || pathname === '/v1') {
        console.log('Rewriting /api or /v1 to API root', { apiName, hostname, pathname, search })
        const path = pathname === '/api' ? pathname.replace('/api', '') : pathname.replace('/v1', '')
        return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`, url))
      }

      // Fix path duplication by checking if pathname already includes the hostname
      const domainPrefix = `/${hostname}`
      let cleanPathname = pathname

      // If the pathname starts with the domain name (e.g., /gpt.do/chat/new)
      if (pathname.startsWith(domainPrefix)) {
        // Remove the domain prefix to prevent duplication
        cleanPathname = pathname.substring(domainPrefix.length)
        console.log('Removed domain prefix from pathname', {
          hostname,
          originalPathname: pathname,
          cleanPathname,
        })
      }

      console.log('Rewriting to site', { hostname, pathname: cleanPathname, search, url })
      return NextResponse.rewrite(new URL(`${url.origin}/sites/${hostname}${cleanPathname}${search}`, url))
    }

    console.log('Handling custom domain', { hostname: handler.hostname, pathname: handler.pathname })
    const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
    const { pathname, search } = request.nextUrl
    const url = new URL(request.url)

    console.log('Handling custom domain', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/projects/${hostname}${pathname}${search}`, url))
  })
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - /api/ (API routes)
     * - /v1/ (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/|v1/).*)',
  ],
}

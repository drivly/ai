import NextAuth from 'next-auth'
import { NextResponse } from 'next/server.js'
import { analyticsMiddleware } from './analytics/src/middleware'
import authConfig from './auth.config'
import { isBrandDomain, isDoDomain, isDoManagementDomain, isGatewayDomain, extractApiNameFromDomain, extractApiNameFromManagementDomain, isSiteDomain } from './lib/domains'
import { RequestHandler } from './lib/middleware/request-handler'
import { collectionSlugs } from './collections/slugs'

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



  if (handler.isApiAuthRoute() || handler.isPublicRoute() || handler.pathname?.startsWith('/api/')) {
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
    // Always use functions.do for the /pricing path
    if (handler.pathname === '/pricing') {
      console.log('Handling /pricing special case', { hostname: handler.hostname, pathname: handler.pathname })
      const targetHostname = 'functions.do'
      return NextResponse.rewrite(new URL(`${request.nextUrl.origin}/sites/${targetHostname}/pricing${request.nextUrl.search}`, request.url))
    }

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

      if (handler.isApiDocsRoute()) {
        console.log('Rewriting /api/docs or /v1/docs to docs.apis.do', { hostname: handler.hostname, pathname: handler.pathname, search: handler.search })
        const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
        const { pathname, search } = request.nextUrl

        const apiDocsPath = pathname.replace('/api/docs', '').replace('/v1/docs', '')

        const url = new URL(`https://docs.apis.do${apiDocsPath}${search}`)
        const headers = new Headers(request.headers)

        headers.set('Host', 'docs.apis.do')

        const modifiedRequest = new Request(url, {
          method: request.method,
          headers,
          body: request.body,
          redirect: 'manual',
        })

        const response = NextResponse.rewrite(url, {
          request: {
            headers: modifiedRequest.headers,
          },
        })

        response.headers.delete('X-Frame-Options')
        response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://*.driv.ly http://localhost:* https://*.vercel.app;")

        return response
      }

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
      if (handler.pathname === '/pricing') {
        console.log('Handling /pricing special case for gateway domain', { hostname: handler.hostname, pathname: handler.pathname })
        const targetHostname = 'functions.do' // Always use functions.do for the /pricing path
        return NextResponse.rewrite(new URL(`${request.nextUrl.origin}/sites/${targetHostname}/pricing${request.nextUrl.search}`, request.url))
      }

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

      if (pathname === '/pricing') {
        console.log('Rewriting gateway domain /pricing to functions.do/pricing', {
          hostname,
          pathname,
          search,
        })
        return NextResponse.rewrite(new URL(`${url.origin}/sites/functions.do/pricing${search}`, url))
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
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

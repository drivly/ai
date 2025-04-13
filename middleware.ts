import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { analyticsMiddleware } from './analytics/src/middleware'
import { collectionSlugs } from './collections/middleware-collections'
import { brandDomains, isAIGateway } from './domains.config'
import { API_AUTH_PREFIX, publicRoutes } from './lib/routes'
/**
 * Middleware Configuration
 * -----------------------
 * This middleware handles routing logic for the .do domain ecosystem and custom domains.
 * It determines whether requests should be routed to API endpoints or website content.
 */

/**
 * Check if a domain should be treated as a gateway domain
 * Gateway domains show the API response at the root path and don't get rewritten */
const isGatewayDomain = (hostname: string): boolean => {
  return (
    isAIGateway(hostname) ||
    hostname === 'localhost' ||
    hostname === 'apis.do' ||
    hostname === 'do.gt' ||
    hostname === 'do.mw' ||
    hostname.endsWith('dev.driv.ly')
  )
}

/**
 * Check if a domain is a brand domain that should rewrite to /sites
 */
const isBrandDomain = (hostname: string): boolean => {
  return brandDomains.includes(hostname)
}

/**
 * Check if a domain is a .do domain
 */
export const isDoDomain = (hostname: string): boolean => {
  return hostname.endsWith('.do') || hostname.endsWith('.do.gt') || hostname.endsWith('.do.mw')
}

/**
 * Extract API name from a .do, .do.gt, or .do.mw domain
 */
export const extractApiNameFromDomain = (hostname: string): string => {
  return hostname.replace(/\.do(\.mw|\.gt)?$/, '')
}

/**
 * Check if a domain is a .do.management domain
 */
export const isDoManagementDomain = (hostname: string): boolean => {
  return hostname === 'do.management' || hostname.endsWith('.do.management')
}

/**
 * Extract API name from a .do.management domain
 */
export const extractApiNameFromManagementDomain = (hostname: string): string => {
  return hostname === 'do.management' ? '' : hostname.replace('.do.management', '')
}

/**
 * Check if docs exist for a specific API name
 */
export const docsExistForApi = (apiName: string): boolean => {
  const apisWithDocs = ['functions', 'workflows', 'agents', 'llm', 'integrations', 'database', 'evals', 'experiments']
  return apisWithDocs.includes(apiName)
}

/**
 * Get path to correct docs hierarchy for a domain
 */
export const getDocsPath = (hostname: string): string => {
  const apiName = extractApiNameFromDomain(hostname)
  // TODO: we need to refactor this to support nested docs, because not every API will be root level

  return `/docs/${apiName}`
}

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
  return analyticsMiddleware(request, async () => {
    const { hostname: actualHostname, pathname, search } = request.nextUrl
    const hostname = process.env.HOSTNAME_OVERRIDE || actualHostname

    const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX)
    const isPublicRoute = publicRoutes.includes(pathname)

    const isLoggedIn = request.cookies.has('better-auth.session_data')
    console.log('🚀 ~ isLoggedIn:', isLoggedIn)

    if (isApiAuthRoute || isPublicRoute) {
      return NextResponse.next()
    }

    if (pathname === '/api' || pathname.startsWith('/api/') || pathname === '/v1' || pathname.startsWith('/v1/')) {
      console.log('Handling API route', { hostname, pathname, search })
      if (
        pathname === '/api/docs' ||
        pathname.startsWith('/api/docs/') ||
        pathname === '/v1/docs' ||
        pathname.startsWith('/v1/docs/')
      ) {
        console.log('Rewriting /api/docs or /v1/docs to docs.apis.do', { hostname, pathname, search })
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

        response.headers.set(
          'Content-Security-Policy',
          "frame-ancestors 'self' https://*.driv.ly http://localhost:* https://*.vercel.app;",
        )

        return response
      }

      if (isDoDomain(hostname)) {
        const apiName = extractApiNameFromDomain(hostname)
        console.log('Rewriting /api or /v1 to API root for .do domain', { apiName, hostname, pathname, search })
        const url = new URL(request.url)

        const path = pathname.startsWith('/api') ? pathname.replace('/api', '') : pathname.replace('/v1', '')

        return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`))
      }

      console.log('Passing through API request', { hostname, pathname, search })
      return NextResponse.next()
    }

    if (isGatewayDomain(hostname)) {
      console.log('Handling gateway domain, exiting middleware', { hostname, pathname, search })

      if (pathname === '/sites') {
        console.log('Rewriting gateway domain /sites to sites', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
      }
      return NextResponse.next()
    }

    if (isBrandDomain(hostname)) {
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

      if (pathname === '/') {
        console.log('Rewriting brand domain root path to /sites', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
      }

      const cleanPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname

      console.log('Rewriting brand domain to sites domain path using .do', { hostname, cleanPathname, search })
      return NextResponse.rewrite(new URL(`/sites/.do${cleanPathname}${search}`, request.url))
    }

    if (isDoManagementDomain(hostname)) {
      const apiName = extractApiNameFromManagementDomain(hostname)
      
      if (apiName === '') {
        console.log('Rewriting do.management to /admin', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, request.url))
      } else {
        if (collectionSlugs.includes(apiName)) {
          console.log('Rewriting to admin collection', { hostname, pathname, search, collection: apiName })
          return NextResponse.rewrite(new URL(`/admin/collections/${apiName}${pathname}${search}`, request.url))
        }
        
        console.log('Rewriting to admin path', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, request.url))
      }
    }

    if (isDoDomain(hostname)) {
      const apiName = extractApiNameFromDomain(hostname)

      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        console.log('Handling admin path for .do domain', { hostname, pathname, search })

        if (collectionSlugs.includes(apiName)) {
          console.log('Rewriting to admin collection', { hostname, pathname, search, collection: apiName })
          return NextResponse.rewrite(new URL(`/admin/collections/${apiName}${search}`, request.url))
        }

        console.log('Passing through admin path for .do domain', { hostname, pathname, search })
        return NextResponse.next()
      }

      const response = NextResponse.next()
      response.headers.set('x-pathname', pathname)

      /**
       * Handle documentation paths (/docs and /docs/*)
       * - Commented out redirect logic to allow access to root documentation pages
       * - TODO: Figure out how to support domain-specific docs without blocking access to root docs
       */
      if (pathname === '/docs' || pathname.startsWith('/docs/')) {
        console.log('Handling docs path', { hostname, pathname, search })
        // const apiName = extractApiNameFromDomain(hostname)
        // const hash = request.nextUrl.hash || ''

        // if (pathname === '/docs' && docsExistForApi(apiName)) {
        //   const docsPath = getDocsPath(hostname)
        //   return NextResponse.redirect(new URL(`${docsPath}${search}${hash}`, request.url), 307)
        // }

        // if (pathname === '/docs') {
        //   return NextResponse.redirect(new URL(`/docs${search}${hash}`, request.url), 307)
        // }

        return NextResponse.next()
      }

      if (pathname === '/api' || pathname === '/v1') {
        console.log('Rewriting /api or /v1 to API root', { apiName, hostname, pathname, search })
        const url = new URL(request.url)
        const path = pathname === '/api' ? pathname.replace('/api', '') : pathname.replace('/v1', '')
        return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`))
      }

      console.log('Rewriting to site', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, request.url))
    }

    console.log('Handling custom domain', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/tenants/${hostname}${pathname}${search}`, request.url))
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

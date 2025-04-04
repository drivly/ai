import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apis } from './api.config'
import { domainsConfig, getCollections, isAIGateway, brandDomains } from './domains.config'
import { collectionSlugs } from './collections/middleware-collections'
import { analyticsMiddleware } from './analytics/src/middleware'

/**
 * Middleware Configuration
 * -----------------------
 * This middleware handles routing logic for the .do domain ecosystem and custom domains.
 * It determines whether requests should be routed to API endpoints or website content.
 */

/**
 * Check if a domain should be treated as a gateway domain
 * Gateway domains show the API response at the root path and don't get rewritten
 */
const isGatewayDomain = (hostname: string): boolean => {
  return isAIGateway(hostname) || 
         hostname === 'localhost' || 
         hostname === 'apis.do' || 
         hostname.endsWith('do.gt') ||
         hostname.endsWith('dev.driv.ly')
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
const isDoDomain = (hostname: string): boolean => {
  return hostname.endsWith('.do')
}

/**
 * Get path to correct docs hierarchy for a domain
 */
const getDocsPath = (hostname: string): string => {
  const apiName = hostname.replace('.do', '')
  
  return `/docs/${apiName}`
}

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
  return analyticsMiddleware(request, async () => {
    const { hostname, pathname, search } = request.nextUrl
    
    if (isGatewayDomain(hostname)) {
      console.log('Handling gateway domain, exiting middleware', { hostname, pathname, search })
      
      if (pathname === '/sites') {
        console.log('Rewriting gateway domain /sites to sites', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
      }
      
      return NextResponse.next()
    }
    
    if (isBrandDomain(hostname)) {
      console.log('Rewriting brand domain to sites list', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
    }
    
    if (isDoDomain(hostname)) {
      const apiName = hostname.replace('.do', '')
      
      if (pathname.startsWith('/admin')) {
        if (collectionSlugs.includes(apiName)) {
          console.log('Rewriting to admin collection', { hostname, pathname, search, collection: apiName })
          return NextResponse.rewrite(new URL(`/admin/collections/${apiName}${pathname.slice(6)}${search}`, request.url))
        }
      }
      
      if (pathname.startsWith('/docs')) {
        console.log('Rewriting docs path', { hostname, pathname, search })
        const docsPath = getDocsPath(hostname)
        return NextResponse.rewrite(new URL(`${docsPath}${pathname.replace('/docs', '')}${search}`, request.url))
      }
      
      if (pathname === '/api') {
        console.log('Rewriting /api to API root', { apiName, hostname, pathname, search })
        const url = new URL(request.url)
        return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${pathname.replace('/api', '')}${search}`))
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
    // '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/((?!_next/static|_next/image).*)',
  ],
}

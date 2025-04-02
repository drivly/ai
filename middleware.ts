import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apis } from './api.config'
import { domainsConfig, getCollections, isAIGateway } from './domains.config'
import { collectionSlugs } from './collections/middleware-collections'
import { analyticsMiddleware } from './analytics/src/middleware'

/**
 * Middleware Configuration
 * -----------------------
 * This middleware handles routing logic for the .do domain ecosystem.
 * It determines whether requests should be routed to API endpoints or website content.
 */

const siteDomains = ['functions.do', 'workflows.do', 'llm.do', 'llms.do']

const sitePaths = ['/login', '/logout', '/signin', '/signout', '/privacy', '/terms', '/pricing', '/models']

const sitePrefixes = ['/blog', '/docs']

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
  return analyticsMiddleware(request, async () => {
    const { hostname, pathname, search } = request.nextUrl
    
    const apiName = hostname.replace('.do', '')
    const baseHostname = hostname.replace('.do', '')

    const isCollectionName = collectionSlugs.includes(baseHostname)
    const isDomainAlias = Object.keys(domainsConfig.aliases).includes(hostname)
    const isAlias = isDomainAlias
    
    const effectiveCollection = isDomainAlias
      ? domainsConfig.aliases[hostname].replace('.do', '')
      : baseHostname

    if ((isCollectionName || isAlias) && pathname.startsWith('/admin')) {
      console.log('Rewriting to admin collection', { hostname, pathname, search, collection: effectiveCollection })
      return NextResponse.rewrite(new URL(`/admin/collections/${effectiveCollection}${pathname.slice(6)}${search}`, request.url))
    }

    if (sitePaths.includes(pathname) && siteDomains.includes(hostname)) {
      console.log('Rewriting to site', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, request.url))
    }

    if (pathname.startsWith('/docs') && hostname.endsWith('.do')) {
      console.log('Rewriting docs path', { hostname, pathname, search })
      const apiName = hostname.replace('.do', '')
      return NextResponse.rewrite(new URL(`/docs/${apiName}${pathname.replace('/docs', '')}${search}`, request.url))
    }

    if (sitePrefixes.some((prefix) => pathname.startsWith(prefix)) && siteDomains.includes(hostname)) {
      console.log('Rewriting to site w/ prefix', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, request.url))
    }

    if (pathname === '/' && siteDomains.includes(hostname)) {
      console.log('Rewriting to landing page', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, request.url))
    }

    // Special handler for /api path to route to the domain (minus .do) API path
    if (pathname === '/api' && apis[apiName]) {
      console.log('Rewriting /api to API root', { apiName, hostname, pathname, search })
      const url = new URL(request.url)
      return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${search}`))
    }

    if (domainsConfig.aliases[hostname] && pathname === '/') {
      const aliasedDomain = domainsConfig.aliases[hostname]
      const aliasedApiName = aliasedDomain.replace('.do', '')
      console.log('Rewriting aliased domain', { hostname, aliasedDomain, pathname, search })
      const url = new URL(request.url)
      return NextResponse.rewrite(new URL(`${url.origin.replace(hostname, aliasedDomain)}/${aliasedApiName}${search}`))
    }

    if (apis[apiName]) {
      console.log('Rewriting to API', { apiName, hostname, pathname, search })
      const url = new URL(request.url)
      return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${pathname}${search}`))
    }
    
    if (isAIGateway(hostname)) {
      console.log('Handling AI gateway domain', { hostname, pathname, search })
      const url = new URL(request.url)
      return NextResponse.rewrite(new URL(`${url.origin}${pathname}${search}`))
    }

    console.log('no rewrite', { apiName, hostname, pathname, search })
    return NextResponse.next()
  })
}

// export const config = {
// }

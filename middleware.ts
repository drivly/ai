import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apis } from './api.config'
import { domainsConfig, getCollections, isAIGateway, brandDomains } from './domains.config'
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
 * Check if a domain should be treated as a gateway domain
 * Gateway domains show the API response at the root path
 */
const isGatewayDomain = (hostname: string): boolean => {
  return (isAIGateway(hostname) || hostname === 'localhost' || hostname === 'apis.do' || hostname.includes('vercel.app')) 
    && !hostname.includes('dev.driv.ly')
}

/**
 * Main middleware function
 * Handles routing logic for all incoming requests
 */
export async function middleware(request: NextRequest) {
  return analyticsMiddleware(request, async () => {
    const { hostname, pathname, search } = request.nextUrl
    
    
    if (hostname === 'do.mw') {
      console.log('Rewriting do.mw to sites-list (absolute top priority)', { hostname, pathname, search })
      return NextResponse.redirect(new URL(`https://apis.do/sites${search}`, request.url))
    }
    
    if (hostname === 'apis.do' && pathname === '/sites') {
      console.log('Rewriting apis.do/sites to sites-list (absolute top priority)', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites-list${search}`, request.url))
    }
    
    if (hostname.includes('dev.driv.ly')) {
      console.log('Rewriting Vercel preview domain to sites-list (absolute top priority)', { hostname, pathname, search })
      return NextResponse.redirect(new URL(`https://apis.do/sites${search}`, request.url))
    }
    
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

    if (pathname === '/admin/login') {
      console.log('Redirecting to GitHub OAuth', { hostname, pathname, search })
      const currentURL = `https://${hostname}`
      return NextResponse.redirect(new URL(`/api/auth/signin/github?callbackUrl=/admin`, currentURL))
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
    
    if ((pathname === '/' || pathname === '/sites') && brandDomains.includes(hostname)) {
      console.log('Rewriting brand domain to sites list', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites-list${search}`, request.url))
    }

    if (hostname.includes('dev.driv.ly') && (pathname === '/' || pathname === '/sites')) {
      console.log('Rewriting Vercel preview domain to sites-list', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites-list${search}`, request.url))
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
    
    if (hostname === 'apis.do' && pathname === '/sites') {
      console.log('Rewriting apis.do/sites to sites-list', { hostname, pathname, search })
      return NextResponse.rewrite(new URL(`/sites-list${search}`, request.url))
    }
    
    if (isGatewayDomain(hostname)) {
      console.log('Handling gateway domain', { hostname, pathname, search })
      const url = new URL(request.url)
      
      if (pathname === '/sites') {
        console.log('Rewriting gateway domain /sites to sites-list', { hostname, pathname, search })
        return NextResponse.rewrite(new URL(`/sites-list${search}`, request.url))
      }
      
      if (apis[apiName]) {
        console.log('Rewriting to API', { apiName, hostname, pathname, search })
        return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${pathname}${search}`))
      }
      
      return NextResponse.rewrite(new URL(`${url.origin}${pathname}${search}`))
    }
    
    if (apis[apiName] && !brandDomains.includes(hostname)) {
      console.log('Rewriting to API', { apiName, hostname, pathname, search })
      const url = new URL(request.url)
      return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${pathname}${search}`))
    }
    
    if (pathname === '/' && !isGatewayDomain(hostname)) {
      console.log('Redirecting non-gateway domain to sites path', { hostname, pathname, search })
      return NextResponse.redirect(new URL(`/sites/${hostname}${search}`, request.url), 302)
    }

    console.log('no rewrite', { apiName, hostname, pathname, search })
    return NextResponse.next()
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

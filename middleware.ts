import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apis } from './api.config'
import { websites, aliases } from './site.config'

// what domains have websites / landing pages ... otherwise base path / is the API
const siteDomains = Object.keys(websites)
// what pathnames will always go to website content for all domains
const sitePaths = ['/login', '/logout', '/signin', '/signout', '/privacy', '/terms', '/pricing']
// what path prefixes will always go to website content for all domains
const sitePrefixes = ['/blog', '/docs']

/**
 * Middleware function to handle routing for API and website paths
 * Ensures that domain.do/api routes to the corresponding API endpoint
 */
export function middleware(request: NextRequest) {
  const { hostname, pathname, search } = request.nextUrl
  
  // Handle domain aliases (e.g., databases.do -> database.do)
  const normalizedHostname = aliases[hostname as keyof typeof aliases] || hostname
  
  // Get API name from hostname (remove .do)
  const apiName = normalizedHostname.replace('.do', '')

  // Handle website paths first
  if (sitePaths.includes(pathname) && siteDomains.includes(normalizedHostname)) {
    console.log('Rewriting to site', { hostname: normalizedHostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites/${normalizedHostname}${pathname}${search}`, request.url))
  }

  // Handle website path prefixes
  if (sitePrefixes.some((prefix) => pathname.startsWith(prefix)) && siteDomains.includes(normalizedHostname)) {
    console.log('Rewriting to site w/ prefix', { hostname: normalizedHostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites/${normalizedHostname}${pathname}${search}`, request.url))
  }

  // Handle root path for website domains
  if (pathname === '/' && siteDomains.includes(normalizedHostname)) {
    console.log('Rewriting to landing page', { hostname: normalizedHostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites/${normalizedHostname}${pathname}${search}`, request.url))
  }

  // Check if this is a valid API domain
  if (apis[apiName]) {
    // Special handler for /api path to route to the domain (minus .do) API path
    // This ensures that https://functions.do/api is equal to /functions
    // Also ensures that https://workflows.do/api is equal to /workflows, etc.
    if (pathname === '/api' || pathname === '/api/') {
      console.log('Rewriting /api to API root', { apiName, hostname: normalizedHostname, pathname, search })
      return NextResponse.rewrite(new URL(`/${apiName}${search}`, request.url))
    }
    
    // Handle all other API paths
    console.log('Rewriting to API', { apiName, hostname: normalizedHostname, pathname, search })
    return NextResponse.rewrite(new URL(`/${apiName}${pathname}${search}`, request.url))
  }

  console.log('no rewrite', { apiName, hostname: normalizedHostname, pathname, search })
  
  // If no specific routing rule matched but it's a valid API domain,
  // default to routing to the API path
  if (normalizedHostname.endsWith('.do') && apiName in apis) {
    // For /api path, route to the API root
    if (pathname === '/api' || pathname === '/api/') {
      console.log('Default rewriting /api to API root', { apiName, hostname: normalizedHostname, pathname, search })
      return NextResponse.rewrite(new URL(`/${apiName}${search}`, request.url))
    }
    
    // For other paths, route to the API with the path
    console.log('Default rewriting to API', { apiName, hostname: normalizedHostname, pathname, search })
    return NextResponse.rewrite(new URL(`/${apiName}${pathname}${search}`, request.url))
  }
  
  // No rewrite rule matched
  return undefined
}

// TODO: do we need/want middleware for everything?  Should we set up an exclude filter?
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/',
// }

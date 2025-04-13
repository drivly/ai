import { NextRequest, NextResponse } from 'next/server'

/**
 * Handle brand domains
 */
export function handleBrandDomain(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  
  console.log('Handling brand domain', { hostname, pathname, search })
  
  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    console.log('Passing through docs path for brand domain', { hostname, pathname, search })
    return null
  }
  
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    console.log('Passing through admin path for brand domain', { hostname, pathname, search })
    return null
  }
  
  if (pathname === '/api' || pathname.startsWith('/api/') || pathname === '/v1' || pathname.startsWith('/v1/')) {
    console.log('Passing through API path for brand domain', { hostname, pathname, search })
    return null
  }
  
  if (pathname === '/') {
    console.log('Rewriting brand domain root path to /sites', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
  }
  
  const cleanPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  
  console.log('Rewriting brand domain to sites domain path using .do', { hostname, cleanPathname, search })
  return NextResponse.rewrite(new URL(`/sites/.do${cleanPathname}${search}`, request.url))
}

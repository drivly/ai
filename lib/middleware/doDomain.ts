import { NextRequest, NextResponse } from 'next/server'
import { extractApiNameFromDomain, docsExistForApi, getDocsPath } from '../domains'
import { collectionSlugs } from '../../collections/middleware-collections'

/**
 * Handle .do domains
 */
export function handleDoDomain(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const apiName = extractApiNameFromDomain(hostname)
  
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    console.log('Handling admin path for .do domain', { hostname, pathname, search })
    
    if (collectionSlugs.includes(apiName)) {
      console.log('Rewriting to admin collection', { hostname, pathname, search, collection: apiName })
      return NextResponse.rewrite(new URL(`/admin/collections/${apiName}${search}`, request.url))
    }
    
    console.log('Passing through admin path for .do domain', { hostname, pathname, search })
    return null
  }
  
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  
  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    console.log('Handling docs path', { hostname, pathname, search })
    
    
    
    return null
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

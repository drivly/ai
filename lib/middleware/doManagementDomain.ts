import { NextRequest, NextResponse } from 'next/server'
import { extractApiNameFromManagementDomain } from '../domains'
import { collectionSlugs } from '../../collections/middleware-collections'

/**
 * Handle .do.management domains
 */
export function handleDoManagementDomain(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
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

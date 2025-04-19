import { NextRequest, NextResponse } from 'next/server.js'
import { collectionSlugs } from '../../collections/middleware-collections'
import { extractApiNameFromManagementDomain } from '../domains'

export function handleDoManagementDomain(request: NextRequest): NextResponse | null {
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const { pathname, search } = request.nextUrl
  const url = new URL(request.url)

  const managementApiName = extractApiNameFromManagementDomain(hostname)

  if (managementApiName === '') {
    console.log('Rewriting do.management to /admin', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, url))
  } else {
    if (managementApiName && collectionSlugs.includes(managementApiName)) {
      console.log('Rewriting to admin collection', { hostname, pathname, search, collection: managementApiName })
      return NextResponse.rewrite(new URL(`/admin/collections/${managementApiName}${pathname}${search}`, url))
    }

    console.log('Rewriting to admin path', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, url))
  }
}

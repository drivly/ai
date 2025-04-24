import { NextRequest, NextResponse } from 'next/server.js'
import { collectionSlugs } from '@/collections/middleware-collections'
import { extractApiNameFromDomain } from '../domains'

export function handleDoDomain(request: NextRequest): NextResponse | null {
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const { pathname, search } = request.nextUrl
  const url = new URL(request.url)

  if (hostname === 'documentation.do') {
    console.log('Handling documentation.do domain', { pathname, search })
    return NextResponse.rewrite(new URL(`${url.origin}/docs${pathname}${search}`, url))
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
    const path = pathname === '/api' ? pathname.replace('/api', '') : pathname.replace('/v1', '')
    return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`, url))
  }

  console.log('Rewriting to site', { hostname, pathname, search, url })
  return NextResponse.rewrite(new URL(`${url.origin}/sites/${hostname}${pathname}${search}`, url))
}

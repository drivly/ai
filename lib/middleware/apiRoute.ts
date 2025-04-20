import { NextRequest, NextResponse } from 'next/server'
import { isDoDomain, extractApiNameFromDomain } from '../domains'

export function handleApiRoute(request: NextRequest): NextResponse | null {
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const { pathname, search } = request.nextUrl
  const url = new URL(request.url)

  if (isDoDomain(hostname)) {
    const apiName = extractApiNameFromDomain(hostname)

    console.log('Rewriting /api or /v1 to API root for .do domain', { apiName, hostname, pathname, search })

    const path = pathname.startsWith('/api') ? pathname.replace('/api', '') : pathname.replace('/v1', '')

    return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`))
  }

  console.log('Passing through API request', { hostname, pathname, search })
  return null
}

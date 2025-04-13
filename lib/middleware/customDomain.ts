import { NextRequest, NextResponse } from 'next/server'

/**
 * Handle custom domains
 */
export function handleCustomDomain(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  
  console.log('Handling custom domain', { hostname, pathname, search })
  return NextResponse.rewrite(new URL(`/tenants/${hostname}${pathname}${search}`, request.url))
}

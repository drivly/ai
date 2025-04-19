import { NextRequest, NextResponse } from 'next/server'

export function handleCustomDomain(request: NextRequest): NextResponse {
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const { pathname, search } = request.nextUrl
  const url = new URL(request.url)

  console.log('Handling custom domain', { hostname, pathname, search })
  return NextResponse.rewrite(new URL(`/projects/${hostname}${pathname}${search}`, url))
}

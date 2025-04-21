import { NextRequest, NextResponse } from 'next/server.js'

export function handleGatewayDomain(request: NextRequest): NextResponse | null {
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const { pathname, search } = request.nextUrl
  const url = new URL(request.url)

  console.log('Handling gateway domain, exiting middleware', {
    hostname,
    pathname,
    search,
  })

  if (pathname === '/docs') {
    console.log('Rewriting gateway domain /docs to docs', {
      hostname,
      pathname,
      search,
    })
    return NextResponse.rewrite(new URL(`/docs${search}`, url))
  }

  if (pathname === '/sites') {
    console.log('Rewriting gateway domain /sites to sites', {
      hostname,
      pathname,
      search,
    })
    return NextResponse.rewrite(new URL(`/sites${search}`, url))
  }

  if ((hostname === 'do.gt' || hostname === 'do.mw') && pathname === '/') {
    console.log('Rewriting do.gt/do.mw root to /sites', {
      hostname,
      pathname,
      search,
    })
    return NextResponse.rewrite(new URL(`/sites${search}`, url))
  }

  return null
}

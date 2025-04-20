import { NextRequest, NextResponse } from 'next/server.js'
import { isSiteDomain } from '../domains'

export function handleBrandDomain(request: NextRequest): NextResponse | null {
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const { pathname, search } = request.nextUrl
  const url = new URL(request.url)

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

  if (isSiteDomain(hostname)) {
    console.log(`Rewriting site domain ${hostname} to /sites/${hostname}`, { pathname, search })
    return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname === '/' ? '' : pathname}${search}`, url))
  }

  if (pathname === '/') {
    console.log('Rewriting brand domain root path to /sites', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites${search}`, url))
  }

  const cleanPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname

  console.log('Rewriting brand domain to sites domain path using .do', { hostname, cleanPathname, search })
  return NextResponse.rewrite(new URL(`/sites/.do${cleanPathname}${search}`, url))
}

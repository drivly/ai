import { NextRequest, NextResponse } from 'next/server'

/**
 * Handle gateway domains
 */
export function handleGatewayDomain(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  
  console.log('Handling gateway domain, exiting middleware', { 
    hostname, 
    pathname, 
    search 
  })
  
  if (pathname === '/sites') {
    console.log('Rewriting gateway domain /sites to sites', { 
      hostname, 
      pathname, 
      search 
    })
    return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
  }
  
  if ((hostname === 'do.gt' || hostname === 'do.mw') && pathname === '/') {
    console.log('Rewriting do.gt/do.mw root to /sites', { 
      hostname, 
      pathname, 
      search 
    })
    return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
  }
  
  return null
}

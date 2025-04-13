import { NextRequest, NextResponse } from 'next/server'

/**
 * Handle gateway domains
 */
export function handleGatewayDomain(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl
  
  console.log('Handling gateway domain, exiting middleware', { 
    hostname: process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname, 
    pathname, 
    search 
  })
  
  if (pathname === '/sites') {
    console.log('Rewriting gateway domain /sites to sites', { 
      hostname: process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname, 
      pathname, 
      search 
    })
    return NextResponse.rewrite(new URL(`/sites${search}`, request.url))
  }
  
  return null
}

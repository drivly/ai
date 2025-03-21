import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const siteDomains = ['functions.do', 'workflows.do', 'llm.do', 'llms.do']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { hostname } = request.nextUrl
  if (siteDomains.includes(hostname)) {
    return NextResponse.rewrite(new URL('/websites', request.url))
    // return NextResponse.rewrite(new URL(`/${hostname}`, request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}

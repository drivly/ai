import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set('X-Payload-Serialize-Functions', 'true')

  return response
}

export const config = {
  matcher: '/api/(.*)' // Apply to all API routes
}

import { NextRequest } from 'next/server'
import { API_AUTH_PREFIX, publicRoutes } from '../routes'

/**
 * Request handler for middleware
 * Encapsulates request parsing and route type detection
 */
export class RequestHandler {
  request: NextRequest
  hostname: string
  pathname: string
  search: string
  url: URL
  
  constructor(request: NextRequest) {
    this.request = request
    const { hostname: actualHostname, pathname, search } = request.nextUrl
    this.hostname = process.env.HOSTNAME_OVERRIDE || actualHostname
    this.pathname = pathname
    this.search = search
    this.url = new URL(request.url)
  }
  
  isApiAuthRoute(): boolean {
    return this.pathname.startsWith(API_AUTH_PREFIX)
  }
  
  isPublicRoute(): boolean {
    return publicRoutes.includes(this.pathname)
  }
  
  isApiRoute(): boolean {
    return (
      this.pathname === '/api' || 
      this.pathname.startsWith('/api/') || 
      this.pathname === '/v1' || 
      this.pathname.startsWith('/v1/')
    )
  }
  
  isApiDocsRoute(): boolean {
    return (
      this.pathname === '/api/docs' ||
      this.pathname.startsWith('/api/docs/') ||
      this.pathname === '/v1/docs' ||
      this.pathname.startsWith('/v1/docs/')
    )
  }
  
  isDocsRoute(): boolean {
    return this.pathname === '/docs' || this.pathname.startsWith('/docs/')
  }
  
  isAdminRoute(): boolean {
    return this.pathname === '/admin' || this.pathname.startsWith('/admin/')
  }

  isLoggedIn(): boolean {
    return this.request.cookies.has('better-auth.session_data')
  }
}

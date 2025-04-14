import { NextRequest } from 'next/server'
import { API_AUTH_PREFIX, publicRoutes } from '../routes'

export class RequestHandler {
  request: NextRequest
  hostname: string
  pathname: string
  search: string

  constructor(request: NextRequest) {
    this.request = request
    this.hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
    this.pathname = request.nextUrl.pathname
    this.search = request.nextUrl.search
  }

  isLoggedIn(): boolean {
    return this.request.cookies.has('better-auth.session_data')
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
}

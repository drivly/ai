import { NextRequest } from 'next/server'
import { API_AUTH_PREFIX, protectedRoutes, publicRoutes } from '../routes'

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
    return this.request.cookies.has('next-auth.session-token') || this.request.cookies.has('__Secure-next-auth.session-token')
  }

  isAutoLogin(): boolean {
    return this.pathname === '/admin/login' && process.env.NODE_ENV === 'production'
  }

  isApiAuthRoute(): boolean {
    return this.pathname.startsWith(API_AUTH_PREFIX) || this.pathname.startsWith('/api/auth')
  }

  isPublicRoute(): boolean {
    return publicRoutes.includes(this.pathname) || this.pathname?.includes('/favicon/') || this.pathname.startsWith('/sign-in') || this.pathname.startsWith('/sign-up')
  }

  isProtectedRoute(): boolean {
    return (
      protectedRoutes.some((route) => {
        if (route.endsWith('*')) {
          const prefix = route.slice(0, -1)
          return this.pathname === prefix || this.pathname.startsWith(prefix)
        }
        return this.pathname === route
      }) || this.isAdminRoute()
    )
  }

  isApiRoute(): boolean {
    return this.pathname === '/api' || this.pathname.startsWith('/api/') || this.pathname === '/v1' || this.pathname.startsWith('/v1/')
  }

  isApiDocsRoute(): boolean {
    return this.pathname === '/api/docs' || this.pathname.startsWith('/api/docs/') || this.pathname === '/v1/docs' || this.pathname.startsWith('/v1/docs/')
  }

  isDocsRoute(): boolean {
    return this.pathname === '/docs' || this.pathname.startsWith('/docs/')
  }

  isAdminRoute(): boolean {
    return this.pathname === '/admin' || this.pathname.startsWith('/admin/')
  }
}

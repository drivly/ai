import { NextRequest } from 'next/server'
import { API_AUTH_PREFIX, protectedRoutes, publicRoutes } from '../routes'

const cfCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

export class RequestHandler {
  request: NextRequest
  hostname: string
  pathname: string
  search: string
  cf?: any

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
    return this.pathname.startsWith(API_AUTH_PREFIX)
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

  /**
   * Fetches Cloudflare metadata from cf.json endpoint
   * Always fetches data from Cloudflare API in all environments
   * Uses caching to prevent excessive requests
   * Attaches data to request object for access in API handlers
   */
  async fetchCfData(): Promise<any> {
    const ip = this.request.headers.get('cf-connecting-ip') || this.request.headers.get('x-forwarded-for') || this.request.headers.get('x-real-ip') || '127.0.0.1'
    console.log('Fetching Cloudflare data for IP:', ip);
    
    // Check cache first to avoid excessive requests
    const cachedData = cfCache.get(ip)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log('Using cached Cloudflare data for IP:', ip);
      this.cf = cachedData.data
      ;(this.request as any)._cf = this.cf
      
      if (this.cf?.asOrganization) {
        const headers = new Headers(this.request.headers)
        headers.set('x-cf-as-organization', this.cf.asOrganization.toString())
        this.request = new NextRequest(this.request.url, {
          method: this.request.method,
          headers,
          body: this.request.body,
          cache: this.request.cache,
          credentials: this.request.credentials,
          integrity: this.request.integrity,
          keepalive: this.request.keepalive,
          mode: this.request.mode,
          redirect: this.request.redirect,
          referrer: this.request.referrer,
          referrerPolicy: this.request.referrerPolicy,
        })
        console.log('Set x-cf-as-organization header from cache:', this.cf.asOrganization.toString());
      }
      
      return this.cf
    }

    try {
      console.log('Making fetch request to Cloudflare API...');
      const response = await fetch('https://workers.cloudflare.com/cf.json')
      if (response.ok) {
        const data = await response.json()
        console.log('Cloudflare Data:', {
          ip,
          hasAsOrg: !!data?.asOrganization,
          asOrganization: data?.asOrganization?.toString()
        });
        
        // Add Cloudflare asOrganization as a custom header to preserve it between middleware and API handlers
        if (data?.asOrganization) {
          const headers = new Headers(this.request.headers)
          headers.set('x-cf-as-organization', data.asOrganization.toString())
          this.request = new NextRequest(this.request.url, {
            method: this.request.method,
            headers,
            body: this.request.body,
            cache: this.request.cache,
            credentials: this.request.credentials,
            integrity: this.request.integrity,
            keepalive: this.request.keepalive,
            mode: this.request.mode,
            redirect: this.request.redirect,
            referrer: this.request.referrer,
            referrerPolicy: this.request.referrerPolicy,
          })
          console.log('Set x-cf-as-organization header from API:', data.asOrganization.toString());
        } else {
          console.log('No asOrganization found in Cloudflare API response');
        }
        
        cfCache.set(ip, {
          data,
          timestamp: Date.now(),
        })

        this.cf = data
        ;(this.request as any)._cf = this.cf
        return data
      } else {
        console.log('Cloudflare API response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error fetching Cloudflare data:', error)
    }

    console.log('No Cloudflare data available for IP:', ip);
    return null
  }

  /**
   * Returns Cloudflare data from either native cf object or fetched data
   */
  getCf(): any {
    return 'cf' in this.request ? (this.request as any).cf : this.cf
  }
}

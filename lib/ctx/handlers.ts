import { NextResponse } from 'next/server'
import { collectionSlugs } from '../../collections/middleware-collections'
import { Context } from './index'

/**
 * Handle API routes (/api/* and /v1/*)
 */
export function handleApiRoute(ctx: Context): NextResponse | null {
  const { hostname, pathname, search, url, isDoDomain, apiName } = ctx
  
  if (isDoDomain && apiName) {
    console.log('Rewriting /api or /v1 to API root for .do domain', { apiName, hostname, pathname, search })
    
    const path = pathname.startsWith('/api') ? pathname.replace('/api', '') : pathname.replace('/v1', '')
    
    return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`))
  }
  
  console.log('Passing through API request', { hostname, pathname, search })
  return null
}

/**
 * Handle API docs routes (/api/docs/* and /v1/docs/*)
 */
export function handleApiDocsRoute(ctx: Context): NextResponse {
  const { request, hostname, pathname, search } = ctx
  
  console.log('Rewriting /api/docs or /v1/docs to docs.apis.do', { hostname, pathname, search })
  const apiDocsPath = pathname.replace('/api/docs', '').replace('/v1/docs', '')
  
  const url = new URL(`https://docs.apis.do${apiDocsPath}${search}`)
  const headers = new Headers(request.headers)
  
  headers.set('Host', 'docs.apis.do')
  
  const modifiedRequest = new Request(url, {
    method: request.method,
    headers,
    body: request.body,
    redirect: 'manual',
  })
  
  const response = NextResponse.rewrite(url, {
    request: {
      headers: modifiedRequest.headers,
    },
  })
  
  response.headers.delete('X-Frame-Options')
  
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.driv.ly http://localhost:* https://*.vercel.app;",
  )
  
  return response
}

/**
 * Handle gateway domains
 */
export function handleGatewayDomain(ctx: Context): NextResponse | null {
  const { hostname, pathname, search, url } = ctx
  
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
    return NextResponse.rewrite(new URL(`/sites${search}`, url))
  }
  
  if ((hostname === 'do.gt' || hostname === 'do.mw') && pathname === '/') {
    console.log('Rewriting do.gt/do.mw root to /sites', { 
      hostname, 
      pathname, 
      search 
    })
    return NextResponse.rewrite(new URL(`/sites${search}`, url))
  }
  
  return null
}

/**
 * Handle brand domains
 */
export function handleBrandDomain(ctx: Context): NextResponse | null {
  const { hostname, pathname, search, url } = ctx
  
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
  
  if (pathname === '/') {
    console.log('Rewriting brand domain root path to /sites', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites${search}`, url))
  }
  
  const cleanPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  
  console.log('Rewriting brand domain to sites domain path using .do', { hostname, cleanPathname, search })
  return NextResponse.rewrite(new URL(`/sites/.do${cleanPathname}${search}`, url))
}

/**
 * Handle .do.management domains
 */
export function handleDoManagementDomain(ctx: Context): NextResponse | null {
  const { hostname, pathname, search, url, managementApiName } = ctx
  
  if (managementApiName === '') {
    console.log('Rewriting do.management to /admin', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, url))
  } else {
    if (managementApiName && collectionSlugs.includes(managementApiName)) {
      console.log('Rewriting to admin collection', { hostname, pathname, search, collection: managementApiName })
      return NextResponse.rewrite(new URL(`/admin/collections/${managementApiName}${pathname}${search}`, url))
    }
    
    console.log('Rewriting to admin path', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/admin${pathname}${search}`, url))
  }
}

/**
 * Handle .do domains
 */
export function handleDoDomain(ctx: Context): NextResponse | null {
  const { hostname, pathname, search, url, apiName, isAdminRoute } = ctx
  
  if (isAdminRoute) {
    console.log('Handling admin path for .do domain', { hostname, pathname, search })
    
    if (apiName && collectionSlugs.includes(apiName)) {
      console.log('Rewriting to admin collection', { hostname, pathname, search, collection: apiName })
      return NextResponse.rewrite(new URL(`/admin/collections/${apiName}${search}`, url))
    }
    
    console.log('Passing through admin path for .do domain', { hostname, pathname, search })
    return null
  }
  
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  
  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    console.log('Handling docs path', { hostname, pathname, search })
    return null
  }
  
  if (pathname === '/api' || pathname === '/v1') {
    console.log('Rewriting /api or /v1 to API root', { apiName, hostname, pathname, search })
    const path = pathname === '/api' ? pathname.replace('/api', '') : pathname.replace('/v1', '')
    return NextResponse.rewrite(new URL(`${url.origin}/${apiName}${path}${search}`, url))
  }
  
  console.log('Rewriting to site', { hostname, pathname, search })
  return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, url))
}

/**
 * Handle custom domains
 */
export function handleCustomDomain(ctx: Context): NextResponse {
  const { hostname, pathname, search, url } = ctx
  
  console.log('Handling custom domain', { hostname, pathname, search })
  return NextResponse.rewrite(new URL(`/tenants/${hostname}${pathname}${search}`, url))
}

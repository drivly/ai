import { API_AUTH_PREFIX, publicRoutes } from '../routes'

/**
 * Check if a path is an API auth route
 */
export const isApiAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith(API_AUTH_PREFIX)
}

/**
 * Check if a path is a public route
 */
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.includes(pathname)
}

/**
 * Check if a path is an API route
 */
export const isApiRoute = (pathname: string): boolean => {
  return (
    pathname === '/api' || 
    pathname.startsWith('/api/') || 
    pathname === '/v1' || 
    pathname.startsWith('/v1/')
  )
}

/**
 * Check if a path is an API docs route
 */
export const isApiDocsRoute = (pathname: string): boolean => {
  return (
    pathname === '/api/docs' ||
    pathname.startsWith('/api/docs/') ||
    pathname === '/v1/docs' ||
    pathname.startsWith('/v1/docs/')
  )
}

/**
 * Check if a path is a docs route
 */
export const isDocsRoute = (pathname: string): boolean => {
  return pathname === '/docs' || pathname.startsWith('/docs/')
}

/**
 * Check if a path is an admin route
 */
export const isAdminRoute = (pathname: string): boolean => {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

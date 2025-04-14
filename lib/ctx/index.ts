import { NextRequest } from 'next/server'
import * as domainUtils from './domains'
import * as routeUtils from './routes'

/**
 * Context object for middleware and route handlers
 */
export interface Context {
  request: NextRequest
  hostname: string
  pathname: string
  search: string
  url: URL
  
  isGatewayDomain: boolean
  isBrandDomain: boolean
  isDoDomain: boolean
  isDoManagementDomain: boolean
  
  apiName: string | null
  managementApiName: string | null
  
  isApiAuthRoute: boolean
  isPublicRoute: boolean
  isApiRoute: boolean
  isApiDocsRoute: boolean
  isDocsRoute: boolean
  isAdminRoute: boolean
  
  isLoggedIn: boolean
}

/**
 * Build a standardized context object with domain and path information
 */
export function buildContext(request: NextRequest): Context {
  const { pathname, search } = request.nextUrl
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const url = new URL(request.url)
  
  const isGatewayDomain = domainUtils.isGatewayDomain(hostname)
  const isBrandDomain = domainUtils.isBrandDomain(hostname)
  const isDoDomain = domainUtils.isDoDomain(hostname)
  const isDoManagementDomain = domainUtils.isDoManagementDomain(hostname)
  
  const apiName = isDoDomain ? domainUtils.extractApiNameFromDomain(hostname) : null
  const managementApiName = isDoManagementDomain ? domainUtils.extractApiNameFromManagementDomain(hostname) : null
  
  const isApiAuthRoute = routeUtils.isApiAuthRoute(pathname)
  const isPublicRoute = routeUtils.isPublicRoute(pathname)
  const isApiRoute = routeUtils.isApiRoute(pathname)
  const isApiDocsRoute = routeUtils.isApiDocsRoute(pathname)
  const isDocsRoute = routeUtils.isDocsRoute(pathname)
  const isAdminRoute = routeUtils.isAdminRoute(pathname)
  
  const isLoggedIn = request.cookies.has('better-auth.session_data')
  
  return {
    request,
    hostname,
    pathname,
    search,
    url,
    isGatewayDomain,
    isBrandDomain,
    isDoDomain,
    isDoManagementDomain,
    apiName,
    managementApiName,
    isApiAuthRoute,
    isPublicRoute,
    isApiRoute,
    isApiDocsRoute,
    isDocsRoute,
    isAdminRoute,
    isLoggedIn
  }
}

export { domainUtils, routeUtils }

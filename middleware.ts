import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apis } from './api.config'

// what domains have websites / landing pages ... otherwise base path / is the API
const siteDomains = ['functions.do', 'workflows.do', 'llm.do', 'llms.do']
// what pathnames will always go to website content for all domains
const sitePaths = ['/login', '/logout', '/signin', '/signout', '/privacy', '/terms', '/pricing']
// what path prefixes will always go to website content for all domains
const sitePrefixes = ['/blog', '/docs']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { hostname, pathname, search } = request.nextUrl
  const apiName = hostname.replace('.do', '')

  // TODO: should we use something like `itty-router` here?

  if (sitePaths.includes(pathname) && siteDomains.includes(hostname)) {
    console.log('Rewriting to site', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, request.url))
  }

  // TODO: Is this the correct logic for docs?
  if (sitePrefixes.some((prefix) => pathname.startsWith(prefix)) && siteDomains.includes(hostname)) {
    console.log('Rewriting to site w/ prefix', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, request.url))
  }

  if (pathname === '/' && siteDomains.includes(hostname)) {
    console.log('Rewriting to landing page', { hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/sites/${hostname}${pathname}${search}`, request.url))
    // return NextResponse.rewrite(new URL(`/${hostname}`, request.url))
  }

  // TODO: we need to ensure that all of the apis are at the root by default
  // I think this is preferred as it is what we want for localhost and API gateways like apis.do
  console.log({ apiName, apis, name: apis[apiName] })
  if (apis[apiName]) {
    console.log('Rewriting to API', { apiName, hostname, pathname, search })
    return NextResponse.rewrite(new URL(`/${apiName}${pathname}${search}`, request.url))
  }

  console.log('no rewrite', { apiName, hostname, pathname, search })
}

// TODO: do we need/want middleware for everything?  Should we set up an exclude filter?
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/',
// }

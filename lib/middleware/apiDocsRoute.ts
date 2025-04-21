import { NextRequest, NextResponse } from 'next/server.js'

export function handleApiDocsRoute(request: NextRequest): NextResponse {
  const hostname = process.env.HOSTNAME_OVERRIDE || request.nextUrl.hostname
  const { pathname, search } = request.nextUrl

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

  response.headers.set('Content-Security-Policy', "frame-ancestors 'self' https://*.driv.ly http://localhost:* https://*.vercel.app;")

  return response
}

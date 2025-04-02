import { NextRequest, NextResponse } from 'next/server'
import Grant from 'grant'
import { getGrantConfig } from '../../../lib/auth/grant-config'
import { getPayload } from '../../../lib/auth/payload-auth'

const grantInstance = Grant.express({
  config: getGrantConfig(),
})

export async function grantMiddleware(request: NextRequest) {
  const payload = await getPayload()
  const { betterAuth } = payload
  const session = await betterAuth.sessions.getSessionFromRequest(request)
  const isAuthenticated = !!session?.user

  if (!isAuthenticated) {
    const url = new URL(request.url)
    const currentPath = url.pathname + url.search
    
    const callbackUrl = `/api/oauth/continue?${new URLSearchParams({
      redirect: currentPath,
    }).toString()}`
    
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url)
    )
  }

  return new Promise((resolve) => {
    const req = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    }
    
    const mockRes: {
      setHeader: () => void;
      end: (content: string) => void;
    } = {
      setHeader: () => {},
      end: (content: string) => {
        try {
          const data = JSON.parse(content)
          if (data.redirect) {
            resolve(NextResponse.redirect(new URL(data.redirect, request.url)))
          } else {
            resolve(NextResponse.json(data))
          }
        } catch (error) {
          resolve(NextResponse.json({ error: 'Invalid response' }, { status: 500 }))
        }
      },
    }
    
    const grantFn = grantInstance as any
    grantFn(req, mockRes)
  })
}

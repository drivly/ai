import { NextRequest, NextResponse } from 'next/server.js'
import { getAuthRedirectForDomain } from '@/lib/utils/url'
import { auth, signIn } from '@/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const { origin } = request.nextUrl
  const referer = request.headers.get('referer')
  console.log({ referer })

  const isCli = searchParams.get('cli') === 'true'
  const state = searchParams.get('state')
  const callback = searchParams.get('callback')

  if (isCli && state && callback) {
    return NextResponse.redirect(new URL(`/cli/auth?state=${state}&callback=${encodeURIComponent(callback)}`, request.url))
  }

  return signIn('github', {
    callbackUrl: referer || `${origin}/waitlist`
  })
}

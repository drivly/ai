import { NextRequest, NextResponse } from 'next/server.js'
import { getAuthRedirectForDomain } from '@/lib/utils/url'
import { auth, signIn } from '@/auth'

export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl
  const referer = request.headers.get('referer')
  console.log({ referer })

  return signIn('github', {
    callbackUrl: referer || `${origin}/waitlist`
  })
}

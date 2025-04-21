import { NextRequest, NextResponse } from 'next/server'
import { getAuthRedirectForDomain } from '@/lib/utils/url'
import { signIn } from '@/auth'

export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl
  const referer = request.headers.get('referer')
  
  return signIn('github', {
    callbackUrl: referer || `${origin}/waitlist`
  })
}

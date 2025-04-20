import { NextRequest, NextResponse } from 'next/server.js'
import { getAuthRedirectForDomain } from '@/lib/utils/url'
import { auth } from '@/app/(auth)/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const isCli = searchParams.get('cli') === 'true'
  const state = searchParams.get('state')
  const callback = searchParams.get('callback')

  if (isCli && state && callback) {
    return NextResponse.redirect(new URL(`/cli/auth?state=${state}&callback=${encodeURIComponent(callback)}`, request.url))
  }

  return NextResponse.redirect(new URL('/api/auth/signin', request.url))
}

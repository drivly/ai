import { NextRequest, NextResponse } from 'next/server'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { getAuthRedirectForDomain } from '@/lib/utils/url'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const isCli = searchParams.get('cli') === 'true'
  const state = searchParams.get('state')
  const callback = searchParams.get('callback')

  if (isCli && state && callback) {
    return NextResponse.redirect(new URL(`/cli-auth?state=${state}&callback=${encodeURIComponent(callback)}`, request.url))
  }

  const { login } = await import('@/lib/auth/route')
  return login(request)
}

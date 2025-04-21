import { NextRequest, NextResponse } from 'next/server'
import { getAuthRedirectForDomain } from '@/lib/utils/url'
import { signIn } from '@/auth'

export async function GET(request: NextRequest) {
  const domain = 'gpt.do'
  return signIn('github', {
    callbackUrl: getAuthRedirectForDomain(request, domain)
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { getAuthRedirectForDomain } from '@/lib/utils/url'
import { signIn } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params
  
  return signIn('github', {
    callbackUrl: getAuthRedirectForDomain(request, domain)
  })
}

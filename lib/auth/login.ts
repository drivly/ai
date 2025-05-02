import { signIn } from '@/auth'
import { getAuthRedirectForDomain } from '@/lib/utils/url'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const host = request.headers.get('host') || ''
  const referer = request.headers.get('referer')
  const callbackUrlFromQuery = searchParams.get('callbackUrl')

  if (request.url.includes('/apis/signin')) {
    return NextResponse.redirect(new URL('/api/auth/signin/github', request.url))
  }

  try {
    // Use callbackUrl from query params if available, otherwise fall back to referer or default
    const redirectTo = callbackUrlFromQuery || referer || getAuthRedirectForDomain(host, 'waitlist')

    return signIn('github', { redirectTo })
  } catch (error) {
    console.error('Error during login:', error)

    if (error instanceof Error) {
      console.error(`Auth debug - Error name: ${error.name}, message: ${error.message}`)
    }

    throw new Error('Failed to sign in')
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentURL, getAuthRedirectForDomain } from '@/lib/utils/url'
import { signIn } from '@/auth'

export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl
  const host = request.headers.get('host') || ''
  const referer = request.headers.get('referer')
  
  if (request.url.includes('/apis/signin')) {
    return NextResponse.redirect(new URL('/api/auth/signin/github', request.url))
  }
  
  try {
    return signIn('github', {
      callbackUrl: referer || getAuthRedirectForDomain(host, 'waitlist')
    })
  } catch (error) {
    console.error('Error during login:', error)
    
    if (error instanceof Error) {
      console.error(`Auth debug - Error name: ${error.name}, message: ${error.message}`)
    }
    
    throw new Error('Failed to sign in')
  }
}

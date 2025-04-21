import { getCurrentURL } from '@/lib/utils/url'
import { NextRequest, NextResponse } from 'next/server'
import { auth, signIn, signOut } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes'

export async function login(request: NextRequest) {
  const currentURL = getCurrentURL(request.headers)
  const host = request.headers.get('host') || ''
  console.log('Auth route hit - starting OAuth flow', {
    currentURL,
    host,
  })

  const destination = request.nextUrl.searchParams.get('destination') || 'admin'
  const provider = request.nextUrl.searchParams.get('provider') || 'github'

  try {
    console.log(`Auth debug - Starting ${provider} login on: ${host}`)

    console.log(`Auth debug - Using signIn function with redirectTo: ${DEFAULT_LOGIN_REDIRECT}`)
    
    return await signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT })
  } catch (error) {
    console.error('Error during login:', error)

    if (error instanceof Error) {
      console.error(`Auth debug - Error name: ${error.name}, message: ${error.message}`)
    }

    throw new Error('Failed to sign in')
  }
}

export const logout = async (request: NextRequest) => {
  try {
    await signOut({ redirect: false })
  } catch (error) {
    console.error('Error during logout:', error)
  }

  // Always redirect to home page
  return NextResponse.redirect(new URL('/', getCurrentURL(request.headers)))
}

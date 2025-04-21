import { getCurrentURL } from '@/lib/utils/url'
import { NextRequest, NextResponse } from 'next/server'
import { auth, signIn, signOut } from '@/auth'

export async function login(request: NextRequest) {
  const currentURL = getCurrentURL(request.headers)
  const host = request.headers.get('host') || ''
  console.log('Auth route hit - starting OAuth flow', {
    currentURL,
    host,
  })

  const destination = request.nextUrl.searchParams.get('destination') || 'admin'
  const provider = request.nextUrl.searchParams.get('provider') || 'github'
  
  const referer = request.headers.get('referer')
  const redirectTo = referer ? new URL(referer).origin + '/waitlist' : new URL('/waitlist', currentURL).toString()
  
  try {
    console.log(`Auth debug - Starting ${provider} login on: ${host}`)
    console.log(`Auth debug - Using signIn function with redirectTo: ${redirectTo}`)
    
    return await signIn(provider, { redirectTo })
  } catch (error) {
    console.error('Error during login:', error)

    if (error instanceof Error) {
      console.error(`Auth debug - Error name: ${error.name}, message: ${error.message}`)
    }

    throw new Error('Failed to sign in')
  }
}

export async function cliLogin(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get('state')
  const callback = searchParams.get('callback')

  if (!state || !callback) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    return NextResponse.redirect(new URL(`/cli/auth?state=${state}&callback=${encodeURIComponent(callback)}`, request.url))
  } catch (error) {
    console.error('Error during CLI login:', error)
    return NextResponse.json(
      { error: 'Failed to process CLI login', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
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

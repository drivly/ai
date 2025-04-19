import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { getAuthRedirectForDomain, getCurrentURL } from '@/lib/utils/url'
import { NextRequest, NextResponse } from 'next/server'

export async function login(request: NextRequest) {
  const currentURL = getCurrentURL(request.headers)
  const host = request.headers.get('host') || ''
  console.log('Auth route hit - starting OAuth flow', {
    currentURL,
    host,
  })

  const payload = await getPayloadWithAuth()
  const destination = request.nextUrl.searchParams.get('destination') || 'admin'

  // Get the appropriate redirect path for the current domain
  const callbackPath = getAuthRedirectForDomain(host, destination)

  try {
    console.log(`Auth debug - Starting GitHub login on: ${host}`)
    console.log(`Auth debug - Using callback path: ${callbackPath}`)

    // Let the betterAuth plugin handle authentication with the oAuthProxy
    const data = await payload.betterAuth.api.signInSocial({
      body: {
        provider: 'github',
        callbackURL: callbackPath,
      },
    })

    console.log(`Auth debug - Got redirect URL: ${data.url || '(empty URL)'}`)

    // Trust the URL provided by the plugin
    if (data.url) {
      return NextResponse.redirect(data.url)
    } else {
      console.error('Auth debug - No redirect URL returned')
      return NextResponse.redirect(currentURL)
    }
  } catch (error) {
    console.error('Error during signInSocial:', error)
    console.log('Attempted callbackPath:', callbackPath, 'for hostname:', host)

    if (error instanceof Error) {
      console.error(`Auth debug - Error name: ${error.name}, message: ${error.message}`)
    }

    throw new Error('Failed to sign in')
  }
}

export const logout = async (request: NextRequest) => {
  const payload = await getPayloadWithAuth()

  try {
    await payload.betterAuth.api.signOut({
      asResponse: true,
      headers: request.headers,
    })
  } catch (error) {
    console.error('Error during logout:', error)
  }

  // Always redirect to home page
  return NextResponse.redirect(new URL('/', getCurrentURL(request.headers)))
}

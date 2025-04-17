import { NextResponse, NextRequest } from 'next/server'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { getAuthRedirectForDomain } from '@/lib/utils/url'

export async function GET(request: NextRequest) {
  console.log('Auth route hit - starting OAuth flow', {
    host: request.headers.get('host'),
    url: request.url,
  })

  const payload = await getPayloadWithAuth()
  const hostname = request.headers.get('host') || ''

  // Get the appropriate redirect path for the current domain
  const callbackPath = getAuthRedirectForDomain(hostname)

  try {
    console.log(`Auth debug - Starting GitHub login on hostname: ${hostname}`)
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
      return NextResponse.redirect(`https://${hostname}`)
    }
  } catch (error) {
    console.error('Error during signInSocial:', error)
    console.log('Attempted callbackPath:', callbackPath, 'for hostname:', hostname)

    if (error instanceof Error) {
      console.error(`Auth debug - Error name: ${error.name}, message: ${error.message}`)
    }

    throw new Error('Failed to sign in')
  }
}

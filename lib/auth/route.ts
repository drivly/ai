import { NextResponse, NextRequest } from 'next/server'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { getAuthRedirectForDomain } from '@/lib/utils/url'

export async function GET(request: NextRequest) {
  const payload = await getPayloadWithAuth()
  const hostname = request.headers.get('host') || ''

  // Get the appropriate redirect path for the current domain
  const callbackPath = getAuthRedirectForDomain(hostname)

  try {
    console.log(`Auth debug - Starting GitHub login on hostname: ${hostname}`)
    console.log(`Auth debug - Using callback path: ${callbackPath}`)

    const data = await payload.betterAuth.api.signInSocial({
      body: { provider: 'github', callbackURL: callbackPath },
    })

    return NextResponse.redirect(String(data.url))
  } catch (error) {
    console.error('Error during signInSocial:', error)
    console.log('Attempted callbackPath:', callbackPath, 'for hostname:', hostname)

    // Try to extract useful details from the error
    if (error instanceof Error) {
      console.error(`Auth debug - Error name: ${error.name}, message: ${error.message}`)
      if ('code' in error && 'input' in error) {
        console.error(`Auth debug - Error code: ${(error as any).code}, input: ${(error as any).input}`)
      }
    }

    throw new Error('Failed to sign in')
  }
}

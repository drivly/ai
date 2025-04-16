import { NextResponse, NextRequest } from 'next/server'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'

export async function GET(request: NextRequest) {
  const payload = await getPayloadWithAuth()
  const hostname = request.headers.get('host') || ''

  // Fix: Ensure we have a complete URL with protocol
  // First try to get origin from nextUrl which should include protocol

  const callbackUrl = hostname.endsWith('.do') && !hostname.includes('apis.do') ? `/admin/collections/${hostname.replace('.do', '')}` : '/admin'

  // If for some reason the origin doesn't have a protocol, add https://

  try {
    const data = await payload.betterAuth.api.signInSocial({
      body: { provider: 'github', callbackURL: callbackUrl },
    })

    return NextResponse.redirect(String(data.url))
  } catch (error) {
    console.error('Error during signInSocial:', error)
    throw new Error('Failed to sign in')
  }
}

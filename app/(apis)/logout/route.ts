import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { getCurrentURL } from '@/lib/utils/url'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const payload = await getPayloadWithAuth()

  try {
    await payload.betterAuth.api.signOut({
      headers: request.headers,
    })
  } catch (error) {
    console.error('Error during logout:', error)
  }

  // Always redirect to home page
  return NextResponse.redirect(new URL('/', getCurrentURL(request.headers)))
}

import { API } from '@/lib/api'
import { auth } from '@/app/(auth)/auth'
import { NextResponse } from 'next/server.js'

export const GET = API(async (request, { url, params }) => {
  try {
    const { provider } = await params
    const nextAuthCallbackUrl = `/api/auth/callback/${provider}${url.search}`
    
    return NextResponse.redirect(new URL(nextAuthCallbackUrl, url.origin))
  } catch (error) {
    console.error('OAuth callback error:', error)
    return {
      error: 'server_error',
      error_description: 'An error occurred processing the callback',
      status: 500,
    }
  }
})

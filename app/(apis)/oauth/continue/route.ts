import { NextRequest, NextResponse } from 'next/server'
import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const redirect = url.searchParams.get('redirect')
    
    if (!redirect) {
      return NextResponse.json({ 
        error: 'invalid_request', 
        error_description: 'Missing redirect parameter' 
      }, { status: 400 })
    }
    
    const payload = await getPayload()
    const { betterAuth } = payload
    const session = await betterAuth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.redirect(
        new URL(`/api/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`, request.url)
      )
    }
    
    return NextResponse.redirect(new URL(redirect, request.url))
  } catch (error) {
    console.error('OAuth continue error:', error)
    return NextResponse.json({ 
      error: 'server_error', 
      error_description: 'An error occurred' 
    }, { status: 500 })
  }
}

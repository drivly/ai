import { NextResponse, NextRequest } from 'next/server'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadWithAuth()
    const searchParams = request.nextUrl.searchParams
    
    const state = searchParams.get('state')
    const callback = searchParams.get('callback')
    
    if (!state || !callback) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    try {
      const callbackUrl = new URL(callback)
      if (callbackUrl.hostname !== 'localhost' && callbackUrl.hostname !== '127.0.0.1') {
        return NextResponse.json(
          { error: 'Invalid callback URL. Must be localhost.' },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid callback URL format' },
        { status: 400 }
      )
    }
    
    const session = await payload.betterAuth.api.getSession({
      headers: request.headers,
    })
    
    if (!session?.user) {
      const loginUrl = `/login?cli=true&state=${state}&callback=${encodeURIComponent(callback)}`
      return NextResponse.redirect(new URL(loginUrl, request.url))
    }
    
    const prefix = 'cli_' + crypto.randomBytes(4).toString('hex')
    
    const apiKey = await payload.betterAuth.api.createApiKey({
      body: {
        name: `CLI Key (${new Date().toISOString()})`,
        prefix,
        permissions: { cli: ['use'] },
        metadata: {
          createdFromCLI: true,
          device: process.platform,
          createdAt: new Date().toISOString(),
        },
      }
    })
    
    const redirectUrl = new URL(callback)
    redirectUrl.searchParams.set('state', state)
    redirectUrl.searchParams.set('apiKey', apiKey.key)
    
    return NextResponse.redirect(redirectUrl)
    
  } catch (error) {
    console.error('CLI auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

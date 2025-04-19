import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const state = searchParams.get('state')
    const callback = searchParams.get('callback')

    if (!state || !callback) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    try {
      const callbackUrl = new URL(callback)
      if (callbackUrl.hostname !== 'localhost' && callbackUrl.hostname !== '127.0.0.1') {
        return NextResponse.json({ error: 'Invalid callback URL. Must be localhost.' }, { status: 400 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid callback URL format' }, { status: 400 })
    }

    const session = await auth()

    if (!session?.user) {
      const loginUrl = `/sign-in?cli=true&state=${state}&callback=${encodeURIComponent(callback)}`
      return NextResponse.redirect(new URL(loginUrl, request.url))
    }

    const prefix = 'cli_' + crypto.randomBytes(4).toString('hex')
    const key = prefix + '.' + crypto.randomBytes(32).toString('hex')
    
    const apiKey = {
      key,
      user: session.user,
      createdAt: new Date().toISOString(),
    }

    const redirectUrl = new URL(callback)
    redirectUrl.searchParams.set('state', state)
    redirectUrl.searchParams.set('apiKey', apiKey.key)

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('CLI auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

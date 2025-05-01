import { setCookie } from '@/lib/actions/cookie.action'
import { verifyToken } from '@/lib/actions/token.action'
import { EXPIRATION_TIMES } from '@/lib/utils/cookie'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { token, isProduction } = await req.json()

    // Basic validation - verify this is a valid JWT
    const isValid = await verifyToken(token)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Use correct token name based on environment
    const tokenName = isProduction ? '__Secure-authjs.session-token' : 'authjs.session-token'

    // Set token in HTTP cookie
    await setCookie(tokenName, token, {
      expiration: EXPIRATION_TIMES.ONE_MONTH,
      maxAge: EXPIRATION_TIMES.ONE_MONTH,
      path: '/',
      sameSite: 'lax',
      secure: isProduction,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth sync error:', error)
    return NextResponse.json({ error: 'Failed to sync authentication' }, { status: 500 })
  }
}

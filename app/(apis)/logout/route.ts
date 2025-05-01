import { NextRequest, NextResponse } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { signOut } from '@/auth'
import { deleteCookies } from '@/lib/actions/cookie.action'

export async function GET(request: NextRequest) {
  try {
    await signOut({ redirect: false })
  } catch (error) {
    console.error('Error during logout:', error)
  }

  return NextResponse.redirect(new URL('/', getCurrentURL(request.headers)))
}

export async function POST(req: NextRequest) {
  try {
    const { isProduction } = await req.json()

    // Use correct token name based on environment
    const tokenName = isProduction ? '__Secure-authjs.session-token' : 'authjs.session-token'

    // Delete the auth cookie
    await deleteCookies([tokenName])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth logout sync error:', error)
    return NextResponse.json({ error: 'Failed to sync logout' }, { status: 500 })
  }
}

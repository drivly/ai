import { NextRequest, NextResponse } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { signOut } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    await signOut({ redirect: false })
  } catch (error) {
    console.error('Error during logout:', error)
  }

  return NextResponse.redirect(new URL('/', getCurrentURL(request.headers)))
}

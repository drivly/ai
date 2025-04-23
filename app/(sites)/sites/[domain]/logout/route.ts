import { NextRequest, NextResponse } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { signOut } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    await signOut({ redirect: false })
  } catch (error) {
    console.error('Error during logout:', error)
  }
  
  const { domain } = await params
  const url = getCurrentURL(request.headers)
  return NextResponse.redirect(new URL('/', url))
}

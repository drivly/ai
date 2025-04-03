import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { signOut } from '@/lib/auth/auth-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    await signOut({
      fetchOptions: {
        headers: request.headers,
      }
    })
  } catch (error) {
    console.error('Error during logout:', error)
  }
  
  const { domain } = await params
  
  return NextResponse.redirect(new URL(`/sites/${domain}`, getCurrentURL(request.headers)))
}

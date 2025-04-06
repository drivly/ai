import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { API } from '@/lib/api'
import { signOut } from '@/lib/auth/auth-client'

export const GET = API(async (request: NextRequest, { user }) => {
  if (user?.id) {
    try {
      await signOut({
        fetchOptions: {
          headers: request.headers,
        },
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
  return NextResponse.redirect(new URL('/', getCurrentURL(request.headers)))
})

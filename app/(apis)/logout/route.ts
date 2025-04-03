import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'

export const GET = API(async (request: NextRequest, { user }) => {
  if (user?.id) {
    try {
      const payload = await getPayload()
      await payload.logout({ 
        req: {
          headers: request.headers,
        } 
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
  return NextResponse.redirect(new URL('/', getCurrentURL(request.headers)))
})

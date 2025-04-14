import { API } from '@/lib/api'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'


// Without the API wrapper
export const GET = async (request: NextRequest) => {
  const hostname = request.headers.get('host') || ''
  const callbackUrl = hostname.endsWith('.do') && !hostname.includes('apis.do') ? `/admin/collections/${hostname.replace('.do', '')}` : '/admin'
  const currentURL = getCurrentURL(request.headers)
  
  return NextResponse.redirect(new URL(`/api/auth/signin/github?callbackUrl=${callbackUrl}`, currentURL))
}

// export const GET = API(async (request: NextRequest) => {
//   const payload = await getPayloadWithAuth()
//   const hostname = request.headers.get('host') || ''
//   const callbackUrl = hostname.endsWith('.do') && !hostname.includes('apis.do') ? `/admin/collections/${hostname.replace('.do', '')}` : '/admin'

//   try {
//     const data = await payload.betterAuth.api.signInSocial({
//       body: { provider: 'github', callbackURL: callbackUrl },
//     })

//     return NextResponse.redirect(String(data.url))
//   } catch (error) {
//     throw new Error('Failed to sign in')
//   }
// })

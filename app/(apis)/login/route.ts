import { NextResponse, NextRequest } from 'next/server'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'

export async function GET(request: NextRequest) {
  const payload = await getPayloadWithAuth()
  const hostname = request.headers.get('host') || ''
  const callbackUrl = hostname.endsWith('.do') && !hostname.includes('apis.do') ? `/admin/collections/${hostname.replace('.do', '')}` : '/admin'

  try {
    
    const data = await payload.betterAuth.api.signInSocial({
      body: { provider: 'github', callbackURL: callbackUrl },
    })

    return NextResponse.redirect(String(data.url))
  } catch (error) {
    console.error('Error during signInSocial:', error)
    throw new Error('Failed to sign in')
  }
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

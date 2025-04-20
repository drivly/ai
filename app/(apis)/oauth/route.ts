import { API } from '@/lib/api'
import { NextResponse } from 'next/server.js'
import { auth } from '@/app/(auth)/auth'

export const GET = API(async (request, { url }) => {
  const provider = url.searchParams.get('provider')
  const redirectUri = url.searchParams.get('redirect_uri')
  const state = url.searchParams.get('state')

  if (!provider) {
    return { error: 'invalid_request', error_description: 'Missing provider parameter' }
  }

  if (!redirectUri) {
    return { error: 'invalid_request', error_description: 'Missing redirect_uri parameter' }
  }

  const session = await auth()
  
  if (session?.user) {
    const callbackUrl = new URL(`/api/auth/callback/${provider}`, url.origin)
    callbackUrl.searchParams.set('redirect_uri', redirectUri)
    if (state) {
      callbackUrl.searchParams.set('state', state)
    }
    
    return NextResponse.redirect(callbackUrl)
  } else {
    const signInUrl = new URL(`/api/auth/signin/${provider}`, url.origin)
    
    const callbackUrl = new URL(request.url)
    signInUrl.searchParams.set('callbackUrl', callbackUrl.toString())
    
    if (state) {
      signInUrl.searchParams.set('state', state)
    }
    
    return NextResponse.redirect(signInUrl)
  }
})

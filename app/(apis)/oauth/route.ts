import { API } from '@/lib/api'
import { NextResponse } from 'next/server.js'
import { auth } from '@/app/(auth)/auth'

/**
 * OAuth endpoint that handles both general OAuth and WorkOS-specific flows
 */
export const GET = API(async (request, { url }) => {
  const provider = url.searchParams.get('provider')
  const clientId = url.searchParams.get('client_id')
  const redirectUri = url.searchParams.get('redirect_uri')
  const state = url.searchParams.get('state')
  const scope = url.searchParams.get('scope')
  const responseType = url.searchParams.get('response_type') || 'code'

  if (!provider && clientId) {
    if (!redirectUri) {
      return { error: 'invalid_request', error_description: 'Missing redirect_uri parameter' }
    }
    
    const workosAuthUrl = new URL('https://api.workos.com/sso/authorize')
    workosAuthUrl.searchParams.set('client_id', process.env.WORKOS_CLIENT_ID || '')
    workosAuthUrl.searchParams.set('redirect_uri', `${url.origin}/api/oauth/callback`)
    workosAuthUrl.searchParams.set('response_type', responseType)
    workosAuthUrl.searchParams.set('scope', scope || 'openid profile email')
    
    if (state) {
      workosAuthUrl.searchParams.set('state', state)
    }
    
    const stateData = {
      originalRedirectUri: redirectUri,
      originalClientId: clientId,
      originalState: state,
    }
    
    const encodedStateData = Buffer.from(JSON.stringify(stateData)).toString('base64')
    workosAuthUrl.searchParams.set('state', encodedStateData)
    
    return NextResponse.redirect(workosAuthUrl)
  }
  
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

import { API } from '@/lib/api'
import { NextResponse } from 'next/server'

/**
 * Proxy endpoint for WorkOS OAuth authorization
 * Redirects to WorkOS authorization URL with appropriate parameters
 */
export const GET = API(async (request, { url }) => {
  const clientId = url.searchParams.get('client_id')
  const redirectUri = url.searchParams.get('redirect_uri')
  const state = url.searchParams.get('state')
  const scope = url.searchParams.get('scope') || 'openid profile email'
  const responseType = url.searchParams.get('response_type') || 'code'
  
  if (!clientId) {
    return { error: 'invalid_request', error_description: 'Missing client_id parameter' }
  }
  
  if (!redirectUri) {
    return { error: 'invalid_request', error_description: 'Missing redirect_uri parameter' }
  }
  
  const workosAuthUrl = new URL('https://api.workos.com/sso/authorize')
  workosAuthUrl.searchParams.set('client_id', process.env.WORKOS_CLIENT_ID || '')
  workosAuthUrl.searchParams.set('redirect_uri', `${url.origin}/api/oauth/workos/callback`)
  workosAuthUrl.searchParams.set('response_type', responseType)
  workosAuthUrl.searchParams.set('scope', scope)
  
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
})

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '../../../../../lib/auth/payload-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    if (error) {
      return NextResponse.json({ 
        error, 
        error_description: url.searchParams.get('error_description') || 'Authentication failed' 
      }, { status: 400 })
    }
    
    if (!code) {
      return NextResponse.json({ 
        error: 'invalid_request', 
        error_description: 'Missing code parameter' 
      }, { status: 400 })
    }
    
    let redirectUri = ''
    let originalState = ''
    
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state))
        redirectUri = stateData.redirect_uri || ''
        originalState = stateData.state || ''
      } catch (e) {
        originalState = state
      }
    }
    
    const payload = await getPayload()
    const { betterAuth } = payload
    const session = await betterAuth.sessions.getSessionFromRequest(request)
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'unauthorized', 
        error_description: 'User is not authenticated' 
      }, { status: 401 })
    }
    
    const oauthCode = await betterAuth.oauthAccessToken?.generateAuthorizationCode?.({
      clientId: provider,
      userId: session.user.id,
      redirectUri,
      scope: 'profile',
    }) || Math.random().toString(36).substring(2, 15)
    
    if (redirectUri) {
      const redirectUrl = new URL(redirectUri)
      redirectUrl.searchParams.set('code', oauthCode)
      if (originalState) {
        redirectUrl.searchParams.set('state', originalState)
      }
      
      return NextResponse.redirect(redirectUrl.toString())
    }
    
    return NextResponse.json({ code: oauthCode, state: originalState })
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json({ 
      error: 'server_error', 
      error_description: 'An error occurred processing the callback' 
    }, { status: 500 })
  }
}

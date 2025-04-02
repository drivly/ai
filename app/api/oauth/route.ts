import { NextRequest, NextResponse } from 'next/server'
import { grantMiddleware } from './middleware'
import { getPayload } from '../../../lib/auth/payload-auth'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const provider = url.searchParams.get('provider')
    const redirectUri = url.searchParams.get('redirect_uri')
    const clientId = url.searchParams.get('client_id')
    const state = url.searchParams.get('state')
    
    if (!provider || !redirectUri) {
      return NextResponse.json({ 
        error: 'invalid_request', 
        error_description: 'Missing required parameters' 
      }, { status: 400 })
    }
    
    const payload = await getPayload()
    const { betterAuth } = payload
    
    if (clientId) {
      const client = await betterAuth.database.findOne(betterAuth.oauthApplication?.modelName || 'oauthApplications', {
        where: { clientId }
      })
      
      if (!client) {
        return NextResponse.json({ 
          error: 'invalid_client', 
          error_description: 'Client not found' 
        }, { status: 400 })
      }
      
      const allowedRedirectURLs = client.redirectURLs?.split(',').map((url: string) => url.trim()) || []
      if (!allowedRedirectURLs.includes(redirectUri)) {
        return NextResponse.json({ 
          error: 'invalid_request', 
          error_description: 'Redirect URI not allowed' 
        }, { status: 400 })
      }
    }
    
    if (redirectUri) {
      url.searchParams.set('callback', redirectUri)
      if (state) {
        url.searchParams.set('state', state)
      }
    }
    
    return grantMiddleware(request)
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json({ 
      error: 'server_error', 
      error_description: 'An error occurred' 
    }, { status: 500 })
  }
}

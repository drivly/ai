import { API } from '@/lib/api'
import { NextResponse } from 'next/server'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import { auth } from '@/app/(auth)/auth'
import crypto from 'crypto'

/**
 * Callback endpoint for WorkOS OAuth
 * Handles the authorization code from WorkOS and exchanges it for tokens
 */
export const GET = API(async (request, { url }) => {
  const code = url.searchParams.get('code')
  const stateParam = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const errorDescription = url.searchParams.get('error_description')
  
  if (error) {
    console.error('WorkOS OAuth error:', error, errorDescription)
    return {
      error,
      error_description: errorDescription || 'An error occurred during authentication',
    }
  }
  
  if (!code) {
    return { error: 'invalid_request', error_description: 'Missing code parameter' }
  }
  
  if (!stateParam) {
    return { error: 'invalid_request', error_description: 'Missing state parameter' }
  }
  
  let stateData
  try {
    stateData = JSON.parse(Buffer.from(stateParam, 'base64').toString())
  } catch (error) {
    console.error('Error decoding state:', error)
    return { error: 'invalid_state', error_description: 'Invalid state parameter' }
  }
  
  const { originalRedirectUri, originalClientId, originalState } = stateData
  
  try {
    const tokenResponse = await fetch('https://api.workos.com/sso/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.WORKOS_CLIENT_ID || '',
        client_secret: process.env.WORKOS_CLIENT_SECRET || '',
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${url.origin}/api/oauth/workos/callback`,
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('WorkOS token exchange error:', errorData)
      return {
        error: 'invalid_grant',
        error_description: errorData.error_description || 'Failed to exchange code for token',
      }
    }
    
    const tokenData = await tokenResponse.json()
    
    const userInfoResponse = await fetch('https://api.workos.com/sso/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
    
    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.json()
      console.error('WorkOS userinfo error:', errorData)
      return {
        error: 'invalid_token',
        error_description: 'Failed to retrieve user information',
      }
    }
    
    const userInfo = await userInfoResponse.json()
    
    const payload = await getPayloadWithAuth()
    
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: userInfo.email },
      },
    })
    
    let userId
    
    if (existingUsers.docs.length > 0) {
      userId = existingUsers.docs[0].id
    } else {
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: userInfo.email,
          name: userInfo.name,
          role: 'user',
        },
      })
      
      userId = newUser.id
    }
    
    const accessToken = crypto.randomBytes(32).toString('hex')
    const refreshToken = crypto.randomBytes(32).toString('hex')
    
    const expiresAtDate = new Date()
    expiresAtDate.setHours(expiresAtDate.getHours() + 1)
    
    await payload.create({
      collection: 'oauthTokens',
      data: {
        token: accessToken,
        provider: 'workos',
        userId,
        clientId: originalClientId,
        expiresAt: expiresAtDate,
        scope: 'read write',
      },
    })
    
    const redirectUrl = new URL(originalRedirectUri)
    redirectUrl.searchParams.set('code', accessToken)
    
    if (originalState) {
      redirectUrl.searchParams.set('state', originalState)
    }
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('WorkOS callback error:', error)
    return {
      error: 'server_error',
      error_description: 'An error occurred during authentication',
    }
  }
})

import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import crypto from 'crypto'

/**
 * Exchanges an authorization code for an access token
 */
const exchangeCodeForToken = async (code: string, redirectUri: string, clientId: string, payload: any, clientSecret?: string) => {
  const codeResult = await payload.find({
    collection: 'oauth-codes' as 'oauth-codes',
    where: {
      code: { equals: code },
      used: { equals: false }
    }
  })
  
  if (!codeResult.docs.length) {
    throw new Error('Invalid authorization code')
  }
  
  const codeEntry = codeResult.docs[0]
  
  const expiresAt = new Date(codeEntry.expiresAt)
  if (expiresAt < new Date()) {
    throw new Error('Authorization code expired')
  }
  
  const clientResult = await payload.find({
    collection: 'oauth-clients' as 'oauth-clients',
    where: {
      clientId: { equals: clientId },
      disabled: { equals: false }
    }
  })
  
  if (!clientResult.docs.length) {
    throw new Error('Invalid client ID')
  }
  
  const client = clientResult.docs[0]
  
  if (clientSecret && client.clientSecret !== clientSecret) {
    throw new Error('Invalid client secret')
  }
  
  if (redirectUri && codeEntry.redirectUri !== redirectUri) {
    throw new Error('Redirect URI mismatch')
  }
  
  await payload.update({
    collection: 'oauth-codes' as 'oauth-codes',
    id: codeEntry.id,
    data: {
      used: true
    }
  })
  
  const accessToken = crypto.randomBytes(32).toString('hex')
  const refreshToken = crypto.randomBytes(32).toString('hex')
  
  const accessTokenExpiresAt = new Date()
  accessTokenExpiresAt.setHours(accessTokenExpiresAt.getHours() + 1)
  
  const refreshTokenExpiresAt = new Date()
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30)
  
  await payload.create({
    collection: 'oauth-tokens' as 'oauth-tokens',
    data: {
      token: accessToken,
      provider: codeEntry.provider,
      userId: codeEntry.userId,
      clientId,
      expiresAt: accessTokenExpiresAt,
      scope: 'read write'
    }
  })
  
  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken,
    scope: 'read write'
  }
}

export const POST = API(async (request, { url }) => {
  let body: any = {}
  const contentType = request.headers.get('content-type') || ''
  
  if (contentType.includes('application/json')) {
    body = await request.json()
  } else {
    const formData = await request.formData()
    for (const [key, value] of formData.entries()) {
      body[key] = value
    }
  }
  
  const { 
    grant_type, 
    code, 
    redirect_uri, 
    client_id, 
    client_secret 
  } = body
  
  if (!grant_type || !code || !client_id) {
    return { 
      error: 'invalid_request', 
      error_description: 'Missing required parameters' 
    }
  }
  
  if (grant_type !== 'authorization_code') {
    return { 
      error: 'unsupported_grant_type', 
      error_description: 'Only authorization_code grant type is supported' 
    }
  }
  
  try {
    const payload = await getPayload()
    const token = await exchangeCodeForToken(code, redirect_uri, client_id, payload, client_secret)
    return token
  } catch (error) {
    console.error('Token exchange error:', error)
    return { 
      error: 'invalid_grant', 
      error_description: 'Invalid authorization code or client credentials' 
    }
  }
})

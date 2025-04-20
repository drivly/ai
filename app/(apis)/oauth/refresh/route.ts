import { API } from '@/lib/api'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import crypto from 'crypto'

/**
 * Endpoint for refreshing OAuth tokens
 */
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
  
  const { grant_type, refresh_token, client_id, client_secret } = body
  
  if (!grant_type || !refresh_token || !client_id) {
    return {
      error: 'invalid_request',
      error_description: 'Missing required parameters',
    }
  }
  
  if (grant_type !== 'refresh_token') {
    return {
      error: 'unsupported_grant_type',
      error_description: 'Only refresh_token grant type is supported for this endpoint',
    }
  }
  
  try {
    const payload = await getPayloadWithAuth()
    
    const clientResult = await payload.find({
      collection: 'oauthClients',
      where: {
        clientId: { equals: client_id },
        disabled: { equals: false },
      },
    })
    
    if (!clientResult.docs.length) {
      return {
        error: 'invalid_client',
        error_description: 'Invalid client ID',
      }
    }
    
    if (client_secret && clientResult.docs[0].clientSecret !== client_secret) {
      return {
        error: 'invalid_client',
        error_description: 'Invalid client secret',
      }
    }
    
    const accessToken = crypto.randomBytes(32).toString('hex')
    const newRefreshToken = crypto.randomBytes(32).toString('hex')
    
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)
    
    const tokenResult = await payload.find({
      collection: 'oauthTokens',
      where: {
        token: { equals: refresh_token },
      },
    })
    
    if (!tokenResult.docs.length) {
      return {
        error: 'invalid_grant',
        error_description: 'Invalid refresh token',
      }
    }
    
    const existingToken = tokenResult.docs[0]
    
    await payload.create({
      collection: 'oauthTokens',
      data: {
        token: accessToken,
        provider: existingToken.provider,
        userId: existingToken.userId,
        clientId: client_id,
        expiresAt,
        scope: existingToken.scope || 'read write',
      },
    })
    
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: newRefreshToken,
      scope: existingToken.scope || 'read write',
    }
  } catch (error) {
    console.error('Token refresh error:', error)
    return {
      error: 'server_error',
      error_description: 'An error occurred during token refresh',
    }
  }
})

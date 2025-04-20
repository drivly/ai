import { API } from '@/lib/api'
import { getPayloadWithAuth } from '@/lib/auth/payload-auth'
import crypto from 'crypto'
import { auth } from '@/app/(auth)/auth'

/**
 * Generates an OAuth token for the authenticated user
 */
const generateOAuthToken = async (clientId: string, payload: any) => {
  try {
    const clientResult = await payload.find({
      collection: 'oauthClients',
      where: {
        clientId: { equals: clientId },
        disabled: { equals: false },
      },
    })

    if (!clientResult.docs.length) {
      throw new Error('Invalid client ID')
    }

    const accessToken = crypto.randomBytes(32).toString('hex')
    const refreshToken = crypto.randomBytes(32).toString('hex')

    const accessTokenExpiresAt = new Date()
    accessTokenExpiresAt.setHours(accessTokenExpiresAt.getHours() + 1)

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: 'read write',
    }
  } catch (error) {
    console.error('Token generation error:', error)
    throw error
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

  const { grant_type, code, redirect_uri, client_id, client_secret } = body

  if (!grant_type || !client_id) {
    return {
      error: 'invalid_request',
      error_description: 'Missing required parameters',
    }
  }

  if (grant_type !== 'authorization_code') {
    return {
      error: 'unsupported_grant_type',
      error_description: 'Only authorization_code grant type is supported',
    }
  }

  try {
    const session = await auth()

    if (!session?.user) {
      return {
        error: 'unauthorized',
        error_description: 'User is not authenticated',
      }
    }

    const payload = await getPayloadWithAuth()
    const token = await generateOAuthToken(client_id, payload)

    return token
  } catch (error) {
    console.error('Token exchange error:', error)
    return {
      error: 'invalid_grant',
      error_description: 'Invalid authorization code or client credentials',
    }
  }
})

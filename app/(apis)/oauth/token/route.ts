import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'

export const POST = API(async (request, { url }) => {
  const payload = await getPayload()
  const { betterAuth } = payload
  
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
    const token = await betterAuth.api.oAuthProxy.exchangeCodeForToken(code, redirect_uri, client_id, client_secret)
    return token
  } catch (error) {
    console.error('Token exchange error:', error)
    return { 
      error: 'invalid_grant', 
      error_description: 'Invalid authorization code or client credentials' 
    }
  }
})

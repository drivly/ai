import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import crypto from 'crypto'

/**
 * Generates an OAuth authorization code and stores it in the database
 */
const generateAuthCode = async (provider: string, redirectUri: string, userId: string, payload: any) => {
  const code = crypto.randomBytes(16).toString('hex')
  
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 10)
  
  await payload.create({
    collection: 'oauth-codes',
    data: {
      code,
      provider,
      redirectUri,
      userId,
      expiresAt,
      used: false
    }
  })
  
  return code
}

export const GET = API(async (request, { url, user }) => {
  const provider = url.searchParams.get('provider')
  const redirectUri = url.searchParams.get('redirect_uri')
  const state = url.searchParams.get('state')
  
  if (!provider) {
    return { error: 'invalid_request', error_description: 'Missing provider parameter' }
  }
  
  if (!redirectUri) {
    return { error: 'invalid_request', error_description: 'Missing redirect_uri parameter' }
  }
  
  const payload = await getPayload()
  
  if (user) {
    const code = await generateAuthCode(provider, redirectUri, user.id, payload)
    
    const redirectUrl = new URL(redirectUri)
    redirectUrl.searchParams.set('code', code)
    if (state) {
      redirectUrl.searchParams.set('state', state)
    }
    
    return { redirect: redirectUrl.toString() }
  } else {
    const loginUrl = new URL('/auth/login', url.origin)
    
    const oauthState = JSON.stringify({
      provider,
      redirect_uri: redirectUri,
      state
    })
    
    loginUrl.searchParams.set('redirect', `/oauth?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state ? encodeURIComponent(state) : ''}`)
    
    return { redirect: loginUrl.toString() }
  }
})

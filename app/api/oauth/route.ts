import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import crypto from 'crypto'

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
  const { betterAuth } = payload
  
  if (user) {
    const code = crypto.randomUUID()
    
    const redirectUrl = new URL(redirectUri)
    redirectUrl.searchParams.set('code', code)
    if (state) {
      redirectUrl.searchParams.set('state', state)
    }
    
    return { redirect: redirectUrl.toString() }
  } else {
    const loginUrl = new URL('/api/auth/login', url.origin)
    
    const oauthState = JSON.stringify({
      provider,
      redirect_uri: redirectUri,
      state
    })
    
    loginUrl.searchParams.set('redirect', `/api/oauth?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state ? encodeURIComponent(state) : ''}`)
    
    return { redirect: loginUrl.toString() }
  }
})

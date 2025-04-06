import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import crypto from 'crypto'

export const GET = API(async (request, { url, params, user }) => {
  try {
    const { provider } = await params
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')

    if (error) {
      return {
        error,
        error_description: url.searchParams.get('error_description') || 'Authentication failed',
        status: 400,
      }
    }

    if (!code) {
      return {
        error: 'invalid_request',
        error_description: 'Missing code parameter',
        status: 400,
      }
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
    const auth = payload.auth

    if (!user) {
      return {
        error: 'unauthorized',
        error_description: 'User is not authenticated',
        status: 401,
      }
    }

    const oauthCode = crypto.randomBytes(16).toString('hex')

    if (redirectUri) {
      const redirectUrl = new URL(redirectUri)
      redirectUrl.searchParams.set('code', oauthCode)
      if (originalState) {
        redirectUrl.searchParams.set('state', originalState)
      }

      return { redirect: redirectUrl.toString() }
    }

    return { code: oauthCode, state: originalState }
  } catch (error) {
    console.error('OAuth callback error:', error)
    return {
      error: 'server_error',
      error_description: 'An error occurred processing the callback',
      status: 500,
    }
  }
})

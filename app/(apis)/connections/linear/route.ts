import { API } from '@/lib/api'
import config from '@payload-config'
import { getPayload } from 'payload'

export const GET = API(async (request, { db, user, url }) => {
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const code = url.searchParams.get('code')
  if (!code) {
    return new Response('Missing code parameter', { status: 400 })
  }

  const connectionId = url.searchParams.get('state')
  if (!connectionId) {
    return new Response('Missing state parameter', { status: 400 })
  }

  const payloadInstance = await getPayload({ config })

  const connection = await payloadInstance.findByID({
    collection: 'connectAccounts',
    id: connectionId,
  })

  if (!connection) {
    return new Response('Connection not found', { status: 404 })
  }

  const tokenResponse = await fetch('https://api.linear.app/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      client_id: process.env.LINEAR_CLIENT_ID,
      client_secret: process.env.LINEAR_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/connections/linear`,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json()
    await payloadInstance.update({
      collection: 'connectAccounts',
      id: connectionId,
      data: {
        status: 'rejected',
        metadata: {
          ...(typeof connection.metadata === 'object' && connection.metadata ? connection.metadata : {}),
          error: errorData,
        },
      },
    })
    return new Response(`Failed to exchange code for token: ${JSON.stringify(errorData)}`, { status: 400 })
  }

  const tokenData = await tokenResponse.json()

  await payloadInstance.update({
    collection: 'connectAccounts',
    id: connectionId,
    data: {
      status: 'active',
      metadata: {
        ...(typeof connection.metadata === 'object' && connection.metadata ? connection.metadata : {}),
        accessToken: tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
        refreshToken: tokenData.refresh_token,
        scope: tokenData.scope,
        createdAt: new Date().toISOString(),
      },
    },
  })

  const redirectUrl =
    typeof connection.metadata === 'object' && connection.metadata && !Array.isArray(connection.metadata) && 'redirectUrl' in connection.metadata
      ? (connection.metadata.redirectUrl as string)
      : `${url.origin}/dashboard/connections`
  return Response.redirect(redirectUrl)
})

export const POST = API(async (request, { db, user, origin, url }) => {
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!process.env.LINEAR_CLIENT_ID) {
    return new Response('LINEAR_CLIENT_ID is not configured', { status: 500 })
  }

  const body = await request.json()
  const { integrationId, redirectUrl } = body

  if (!integrationId) {
    return new Response('Integration ID is required', { status: 400 })
  }

  const payloadInstance = await getPayload({ config })
  const integration = await payloadInstance.findByID({
    collection: 'integrations',
    id: integrationId,
  })

  if (!integration || integration.provider !== 'linear') {
    return new Response('Linear integration not found', { status: 404 })
  }

  const connection = await payloadInstance.create({
    collection: 'connectAccounts',
    data: {
      name: `${user.email} - Linear`,
      user: user.id,
      integration: integrationId,
      project: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Default project ID
      stripeAccountId: 'linear-integration', // Placeholder for Linear integration
      accountType: 'standard', // Default account type
      status: 'pending',
      metadata: {
        redirectUrl,
        createdAt: new Date().toISOString(),
      },
    },
  })

  const scopes = ['read', 'write', 'issues:create', 'issues:read', 'issues:write']
  const authorizationUrl = new URL('https://linear.app/oauth/authorize')
  authorizationUrl.searchParams.set('client_id', process.env.LINEAR_CLIENT_ID)
  authorizationUrl.searchParams.set('redirect_uri', `${origin}/api/connections/linear`)
  authorizationUrl.searchParams.set('scope', scopes.join(' '))
  authorizationUrl.searchParams.set('state', connection.id)
  authorizationUrl.searchParams.set('response_type', 'code')

  return {
    connection: {
      id: connection.id,
      status: connection.status,
    },
    authorization_url: authorizationUrl.toString(),
  }
})

import { API } from '@/lib/api'
import { Composio } from 'composio-core'

export const GET = API(async (request, { db, user, origin, url, domain, params }) => {
  const { app } = params
  const { type } = Object.fromEntries(new URL(request.url).searchParams) as {
    type: 'OAUTH2' | 'OAUTH1' | 'OAUTH1A' | 'API_KEY' | 'BASIC' | 'BEARER_TOKEN' | 'GOOGLE_SERVICE_ACCOUNT' | 'NO_AUTH' | 'BASIC_WITH_JWT'
  }

  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY })

  if (!user.email) {
    return {
      success: false,
      type: 'UNAUTHORIZED',
      error: 'Unauthorized',
      status: 401,
    }
  }

  // Check if the app is already in a pending state
  const pendingConnections = await composio.connectedAccounts
    .list({
      entityId: user.email as string,
      status: 'INITIATED',
    })
    .then((x) => x.items)

  if (!pendingConnections.length) {
    // Create the connection request.
    const connection = await composio.connectedAccounts.initiate({
      appName: app as string,
      entityId: user.email as string,
      authMode: type,
    })

    return Response.redirect(connection.redirectUrl || '')
  } else {
    return Response.redirect(pendingConnections[0].connectionParams?.redirectUrl as string)
  }
})

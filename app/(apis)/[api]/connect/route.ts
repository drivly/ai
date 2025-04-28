import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'
import { apis } from '@/api.config'
import { domainsConfig } from '@/domains.config'

export const POST = API(async (request, { db, user, origin, url, params }) => {
  if (!process.env.COMPOSIO_API_KEY) {
    return { error: { message: 'API key not configured', status: 500 } }
  }

  const { api } = params as { api: string }
  const apiExists = api in apis
  const isAlias = api in domainsConfig.aliases
  const effectiveApi = isAlias ? domainsConfig.aliases[api] : api

  if (!apiExists && !isAlias) {
    return { error: { message: `API '${api}' not found.`, status: 404 } }
  }

  if (!user) {
    return { error: { message: 'Authentication required', status: 401 } }
  }

  const body = await request.json()
  const { integrationId, taskId, redirectUrl, metadata = {} } = body

  if (!integrationId) {
    return { error: { message: 'Integration ID is required', status: 400, details: null } }
  }

  const payloadInstance = await getPayload({ config })
  const integration = await payloadInstance.findByID({
    collection: 'integrations',
    id: integrationId,
  })

  if (!integration) {
    return { error: { message: 'Integration not found', status: 404 } }
  }

  const connection = await payloadInstance.create({
    collection: 'connectAccounts',
    data: {
      name: `${user.email} - ${integration.name} (${effectiveApi})`,
      user: user.id,
      integration: integrationId,
      project: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Default project ID
      stripeAccountId: `${integration.provider}-integration`, // Placeholder for integration
      accountType: 'standard', // Default account type
      status: 'pending',
      metadata: {
        taskId,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        api: effectiveApi, // Store API information in metadata
        ...metadata,
      },
    },
  })

  const callbackUrl = `${origin}/api/webhooks/composio?connectionId=${connection.id}`

  const finalRedirectUrl = redirectUrl || `${origin}/dashboard/connections`

  const response = await fetch('https://backend.composio.dev/api/v1/connections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.COMPOSIO_API_KEY,
    },
    body: JSON.stringify({
      app_key: integration.id,
      redirect_uri: finalRedirectUrl,
      callback_uri: callbackUrl,
      user_id: user.id,
      connection_id: connection.id,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    await payloadInstance.update({
      collection: 'connectAccounts',
      id: connection.id,
      data: {
        status: 'rejected',
        metadata: Object.assign({}, typeof connection.metadata === 'object' && connection.metadata !== null ? connection.metadata : {}, { 
          error: data,
          errorTimestamp: new Date().toISOString(),
          errorStatus: response.status
        }),
      },
    })

    return { error: { message: 'Failed to initiate connection', details: data, status: response.status } }
  }

  await payloadInstance.update({
    collection: 'connectAccounts',
    id: connection.id,
    data: {
      metadata: Object.assign({}, typeof connection.metadata === 'object' && connection.metadata !== null ? connection.metadata : {}, { authorizationUrl: data.authorization_url }),
    },
  })

  if (taskId) {
    try {
      await payloadInstance.update({
        collection: 'tasks',
        id: taskId,
        data: {
          status: 'in-progress',
        },
      })
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  return {
    connection: {
      id: connection.id,
      status: connection.status,
      api: effectiveApi, // Include API information in the response
    },
    authorization_url: data.authorization_url,
  }
})

export const GET = API(async (request, { db, user, params }) => {
  if (!user) {
    return { error: { message: 'Authentication required', status: 401 } }
  }

  const { api } = params as { api: string }
  const apiExists = api in apis
  const isAlias = api in domainsConfig.aliases
  const effectiveApi = isAlias ? domainsConfig.aliases[api] : api

  if (!apiExists && !isAlias) {
    return { error: { message: `API '${api}' not found.`, status: 404 } }
  }

  const payloadInstance = await getPayload({ config })

  const connections = await payloadInstance.find({
    collection: 'connectAccounts',
    where: {
      and: [
        {
          user: {
            equals: user.id,
          },
        },
        {
          'metadata.api': {
            equals: effectiveApi,
          },
        },
      ],
    },
    depth: 1,
  })

  return { connections: connections.docs }
})

import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@payload-config'
import { initiateComposioConnection } from '@/tasks/integrations/initiateComposioConnection'

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  if (!process.env.COMPOSIO_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  if (!user) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 })
  }

  const body = await request.json()
  const { integrationId, taskId, redirectUrl } = body

  if (!integrationId) {
    return new Response(JSON.stringify({ error: 'Integration ID is required' }), { status: 400 })
  }

  const payloadInstance = await getPayload({ config })
  const integration = await payloadInstance.findByID({
    collection: 'integrations',
    id: integrationId,
  })

  if (!integration) {
    return new Response(JSON.stringify({ error: 'Integration not found' }), { status: 404 })
  }

  const connection = await payloadInstance.create({
    collection: 'connectAccounts',
    data: {
      name: `${user.email} - ${integration.name}`,
      user: user.id,
      integration: integrationId,
      status: 'pending',
      metadata: {
        taskId,
        createdAt: new Date().toISOString(),
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
        metadata: Object.assign({}, typeof connection.metadata === 'object' && connection.metadata !== null ? connection.metadata : {}, { error: data }),
      },
    })

    return new Response(JSON.stringify({ error: 'Failed to initiate connection', details: data }), { status: response.status })
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
    },
    authorization_url: data.authorization_url,
  }
})

export const GET = API(async (request, { db, user, origin, url }) => {
  if (!user) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 })
  }

  const payloadInstance = await getPayload({ config })

  const connections = await payloadInstance.find({
    collection: 'connectAccounts',
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 1,
  })

  return { connections: connections.docs }
})

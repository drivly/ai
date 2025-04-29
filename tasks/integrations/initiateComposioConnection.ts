import { TaskConfig } from 'payload'

export const initiateComposioConnectionTask = {
  slug: 'initiateComposioConnection',
  label: 'Initiate Composio Connection',
  inputSchema: [
    { name: 'integrationId', type: 'text', required: true },
    { name: 'userId', type: 'text', required: true },
    { name: 'taskId', type: 'text' },
    { name: 'redirectUrl', type: 'text' },
    { name: 'metadata', type: 'json' },
  ],
  outputSchema: [
    { name: 'connection', type: 'json' },
    { name: 'authorization_url', type: 'text' },
  ],
  handler: async (
    {
      integrationId,
      userId,
      taskId,
      redirectUrl,
      metadata = {},
    }: {
      integrationId: string
      userId: string
      taskId?: string
      redirectUrl?: string
      metadata?: Record<string, any>
    },
    { payload }: { payload: any },
  ) => {
    if (!process.env.COMPOSIO_API_KEY) {
      throw new Error('COMPOSIO_API_KEY is not configured')
    }

    const integration = await payload.findByID({
      collection: 'integrations',
      id: integrationId,
    })

    if (!integration) {
      throw new Error('Integration not found')
    }

    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      throw new Error('User not found')
    }

    const connection = await payload.create({
      collection: 'connectAccounts',
      data: {
        name: `${user.email} - ${integration.name}`,
        user: userId,
        integration: integrationId,
        project: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Default project ID
        stripeAccountId: `${integration.provider}-integration`, // Placeholder for integration
        accountType: 'standard', // Default account type
        status: 'pending',
        metadata: {
          taskId,
          createdAt: new Date().toISOString(),
          lastUsed: new Date().toISOString(),
          ...metadata,
        },
      },
    })

    const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ai.driv.ly'
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
        user_id: userId,
        connection_id: connection.id,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      await payload.update({
        collection: 'connectAccounts',
        id: connection.id,
        data: {
          status: 'rejected',
          metadata: Object.assign({}, typeof connection.metadata === 'object' && connection.metadata !== null ? connection.metadata : {}, {
            error: data,
            errorTimestamp: new Date().toISOString(),
            errorStatus: response.status,
          }),
        },
      })

      throw new Error(`Failed to initiate connection: ${JSON.stringify(data)}`)
    }

    await payload.update({
      collection: 'connectAccounts',
      id: connection.id,
      data: {
        metadata: Object.assign({}, typeof connection.metadata === 'object' && connection.metadata !== null ? connection.metadata : {}, {
          authorizationUrl: data.authorization_url,
        }),
      },
    })

    if (taskId) {
      try {
        await payload.update({
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
  },
} as unknown as TaskConfig

export const initiateComposioConnection = initiateComposioConnectionTask.handler

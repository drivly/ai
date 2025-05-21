'use server'

import { serverAuth } from '@/hooks/server-auth'
import { camelToHumanCase } from '@/lib/utils'
import camelcase from 'camelcase'
import { Composio, VercelAIToolSet } from 'composio-core'
import { unstable_cache as cache } from 'next/cache'
import type { ComposioDataPromise, IntegrationAction } from '../lib/types'

/**
 * Fetches either Composio integrations or actions for a specific integration
 * @param options.integrationName - Optional integration name to fetch actions for
 * @returns Either AvailableIntegration[] or IntegrationActions[] based on input
 */
// export async function getComposioData(): Promise<Integration[]>
// export async function getComposioData(integrationName: string): Promise<IntegrationAction[]>
export async function getComposioData(integrationName?: string | null): ComposioDataPromise {
  const composioToolset = new VercelAIToolSet({
    apiKey: process.env.COMPOSIO_API_KEY,
  })

  // Return integrations list
  if (!integrationName) {
    try {
      const availableApps = await composioToolset.apps.list()

      if (!availableApps || !Array.isArray(availableApps)) {
        console.error('Unexpected response format from composio.apps.list():', availableApps)
        return []
      }

      const availableIntegrations = availableApps.map((app) => {
        const metaObj = 'meta' in app && app.meta !== null && typeof app.meta === 'object' ? app.meta : {}
        return {
          value: app.key || app.name,
          label: 'displayName' in app && typeof app.displayName === 'string' ? app.displayName : app.name,
          logoUrl: app.logo,
          actionsCount: 'actionsCount' in metaObj && typeof metaObj.actionsCount === 'number' ? metaObj.actionsCount : 'is_custom_app' in metaObj && metaObj.is_custom_app ? 1 : 0,
        }
      })

      return availableIntegrations.filter((app) => app.actionsCount > 0).sort((a, b) => a.value.localeCompare(b.value))
    } catch (error) {
      console.error('Error fetching available Composio integrations:', error)
      return []
    }
  }

  // Return actions for specified integration
  else if (integrationName) {
    const user = await serverAuth()

    if (!user || !user.email) {
      return []
    }

    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY })
    const connections = await composio.connectedAccounts.list({
      user_uuid: user.email,
    })

    const connection = connections.items.find((conn) => conn.appName.toLowerCase() === integrationName.toLowerCase())

    // Update toolset with connected account
    const toolsetWithConnection = new VercelAIToolSet({
      apiKey: process.env.COMPOSIO_API_KEY,
      connectedAccountIds: { [connection?.appName || '']: connection?.id || '' },
    })

    const integration = await toolsetWithConnection.apps.get({
      appKey: connection?.appName || integrationName,
    })

    const tools = await toolsetWithConnection.getTools({
      apps: [integration.key],
    })

    const flatToolList: IntegrationAction[] = []
    for (const [originalName, _toolData] of Object.entries(tools)) {
      const parts = originalName.split('_')
      if (parts.length < 1) continue

      // Fix for integration names with underscores (like active_campaign)
      // We need to match the integration name exactly as it's used in the URL
      const appName = integrationName.toLowerCase()

      // Get action name by removing the integration prefix from the original name
      const integrationPrefix = appName + '_'
      const actionNameRaw = originalName.startsWith(integrationPrefix) ? originalName.substring(integrationPrefix.length) : parts.slice(1).join('_')

      const actionLabelCamelCase = camelcase(actionNameRaw.toLowerCase())
      const value = `${appName}.${actionLabelCamelCase}`

      flatToolList.push({
        createdBy: appName,
        label: camelToHumanCase(actionLabelCamelCase),
        value: value,
        logoUrl: integration.logo,
      })
    }
    return flatToolList
  }

  return []
}

export const getComposioActionsByIntegration = async ({ queryKey }: { queryKey: [string, string | null | undefined] }) => {
  const integrationName = queryKey[1]
  if (!integrationName) {
    return getComposioData()
  }
  return getComposioData(integrationName)
}

// Cached functions
export const getComposioActionsByIntegrationCached = cache(getComposioActionsByIntegration, ['composio_actions'], {
  tags: ['composio_actions'],
})

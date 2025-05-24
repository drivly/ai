import { apis } from '@/api.config'
import { domainsConfig } from '@/domains.config'
import { API } from '@/lib/api'
import { actions } from '@/sdks/actions.do'

let actionsCache: any[] | null = null
let actionsCacheTime: number = 0
const CACHE_TTL = 60 * 1000 // 1 minute cache TTL

/**
 * Fetch all actions from Composio API with caching
 */
async function fetchComposioActions(): Promise<any[]> {
  const now = Date.now()

  if (actionsCache && now - actionsCacheTime < CACHE_TTL) {
    return actionsCache
  }

  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    throw new Error('Composio API key not configured')
  }

  const response = await fetch('https://backend.composio.dev/api/v2/actions/list/all', {
    headers: {
      'x-api-key': apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch actions: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const actions = data.actions || []

  actionsCache = actions
  actionsCacheTime = now

  return actions
}

/**
 * Helper function to resolve action ID from api and action name
 */
async function resolveActionId(api: string, actionName: string): Promise<string | null> {
  try {
    const allActions = await fetchComposioActions()

    const conventionId = `${api}:${actionName}`
    const directMatch = allActions.find((a) => a.id === conventionId)
    if (directMatch) {
      return directMatch.id
    }

    const apiUpper = api.toUpperCase()
    const actionUpper = actionName.replace(/([A-Z])/g, '_$1').toUpperCase()
    const composioStyleId = `${apiUpper}_${actionUpper.startsWith('_') ? actionUpper.substring(1) : actionUpper}`

    const composioMatch = allActions.find((a) => a.id === composioStyleId)
    if (composioMatch) {
      return composioMatch.id
    }

    // Match by API prefix and action name
    const apiPrefix = `${api}:`
    const matchingApiActions = allActions.filter((a) => a.id.startsWith(apiPrefix))

    const nameMatch = matchingApiActions.find((a) => {
      const extractedName = a.id.substring(apiPrefix.length)
      return extractedName.toLowerCase() === actionName.toLowerCase()
    })

    if (nameMatch) {
      return nameMatch.id
    }

    return null
  } catch (error) {
    console.error('Error resolving action ID:', error)
    return null
  }
}

/**
 * GET handler for action information
 * Returns details about a specific action for an API
 */
export const GET = API(async (request, { params, url }) => {
  const { api, action } = params as { api: string; action: string }

  const apiExists = api in apis
  const isAlias = api in domainsConfig.aliases
  const aliasedApi = isAlias ? domainsConfig.aliases[api] : null
  const effectiveApi = isAlias ? (aliasedApi as string) : api

  if (!apiExists && !isAlias) {
    return {
      error: {
        message: `API '${api}' not found`,
        status: 404,
      },
    }
  }

  try {
    const allActions = await fetchComposioActions()
    const actionId = await resolveActionId(effectiveApi, action)

    if (!actionId) {
      return {
        error: {
          message: `Action '${action}' not found for API '${effectiveApi}'`,
          status: 404,
        },
      }
    }

    const actionDetails = allActions.find((a) => a.id === actionId)

    if (!actionDetails) {
      return {
        error: {
          message: `Action details not found for ID: ${actionId}`,
          status: 404,
        },
      }
    }

    return {
      api: effectiveApi,
      action,
      id: actionId,
      description: actionDetails.description || `Execute ${action} action for ${effectiveApi} API`,
      parameters: actionDetails.parameters || {},
      links: {
        execute: `${url.origin}/${effectiveApi}/${action}`,
        api: `${url.origin}/${effectiveApi}`,
        home: url.origin,
      },
    }
  } catch (error) {
    console.error(`Error fetching action information:`, error)
    return {
      error: {
        message: error instanceof Error ? error.message : 'Error fetching action information',
        status: 500,
      },
    }
  }
})

/**
 * POST handler for executing actions
 * Executes a specific action with provided parameters
 */
export const POST = API(async (request, { params, url }) => {
  const { api, action } = params as { api: string; action: string }

  const apiExists = api in apis
  const isAlias = api in domainsConfig.aliases
  const aliasedApi = isAlias ? domainsConfig.aliases[api] : null
  const effectiveApi = isAlias ? (aliasedApi as string) : api

  if (!apiExists && !isAlias) {
    return {
      error: {
        message: `API '${api}' not found`,
        status: 404,
      },
    }
  }

  try {
    // Parse request parameters
    let requestParams
    try {
      requestParams = await request.json()
    } catch (error) {
      return {
        error: {
          message: 'Invalid JSON payload',
          status: 400,
        },
      }
    }

    const actionId = await resolveActionId(effectiveApi, action)

    if (!actionId) {
      return {
        error: {
          message: `Action '${action}' not found for API '${effectiveApi}'`,
          status: 404,
        },
      }
    }

    const result = await actions.execute(actionId, requestParams)

    return {
      success: true,
      api: effectiveApi,
      action,
      id: actionId,
      result,
      links: url
        ? {
            api: `${url.origin}/${effectiveApi}`,
            home: url.origin,
          }
        : undefined,
    }
  } catch (error) {
    console.error(`Error executing action:`, error)
    return {
      error: {
        message: error instanceof Error ? error.message : 'Error executing action',
        status: error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500,
      },
    }
  }
})

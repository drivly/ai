import { API } from '@/lib/api'
import { actions } from '@/sdks/actions.do'
import { apis } from '@/api.config'
import { domainsConfig } from '@/domains.config'

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
      error: true,
      message: `API '${api}' not found`,
      statusCode: 404,
    }
  }

  try {
    const apiKey = process.env.COMPOSIO_API_KEY
    if (!apiKey) {
      return {
        error: true,
        message: 'Composio API key not configured',
        statusCode: 500,
      }
    }

    const response = await fetch('https://backend.composio.dev/api/v2/actions/list/all', {
      headers: {
        'x-api-key': apiKey,
      },
    })

    const data = await response.json()
    const allActions = data.actions || []
    
    const actionId = await resolveActionId(effectiveApi, action, allActions)
    
    if (!actionId) {
      return {
        error: true,
        message: `Action '${action}' not found for API '${effectiveApi}'`,
        statusCode: 404,
      }
    }

    const actionDetails = allActions.find((a: any) => a.id === actionId)
    
    if (!actionDetails) {
      return {
        error: true,
        message: `Action details not found for ID: ${actionId}`,
        statusCode: 404,
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
      }
    }
  } catch (error) {
    console.error(`Error fetching action information:`, error)
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Error fetching action information',
      statusCode: 500,
    }
  }
})

/**
 * POST handler for executing actions
 * Executes a specific action with provided parameters
 */
export const POST = API(async (request, { params }) => {
  const { api, action } = params as { api: string; action: string }

  const apiExists = api in apis
  const isAlias = api in domainsConfig.aliases
  const aliasedApi = isAlias ? domainsConfig.aliases[api] : null
  const effectiveApi = isAlias ? (aliasedApi as string) : api

  if (!apiExists && !isAlias) {
    return {
      error: true,
      message: `API '${api}' not found`,
      statusCode: 404,
    }
  }

  try {
    let requestParams
    try {
      requestParams = await request.json()
    } catch (error) {
      return {
        error: true,
        message: 'Invalid JSON payload',
        statusCode: 400,
      }
    }

    const apiKey = process.env.COMPOSIO_API_KEY
    if (!apiKey) {
      return {
        error: true,
        message: 'Composio API key not configured',
        statusCode: 500,
      }
    }

    const response = await fetch('https://backend.composio.dev/api/v2/actions/list/all', {
      headers: {
        'x-api-key': apiKey,
      },
    })

    const data = await response.json()
    const allActions = data.actions || []
    
    const actionId = await resolveActionId(effectiveApi, action, allActions)
    
    if (!actionId) {
      return {
        error: true,
        message: `Action '${action}' not found for API '${effectiveApi}'`,
        statusCode: 404,
      }
    }

    const result = await actions.execute(actionId, requestParams)
    
    return {
      success: true,
      api: effectiveApi,
      action,
      id: actionId,
      result,
    }
  } catch (error) {
    console.error(`Error executing action:`, error)
    return {
      error: true,
      message: error instanceof Error ? error.message : 'Error executing action',
      statusCode: error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500,
    }
  }
})

/**
 * Helper function to resolve action ID from api and action name
 * Uses a naming convention of `${api}:${actionName}` or searches for matching action
 */
async function resolveActionId(api: string, actionName: string, allActions: any[]): Promise<string | null> {
  const conventionId = `${api}:${actionName}`
  const directMatch = allActions.find((a: any) => a.id === conventionId)
  if (directMatch) {
    return directMatch.id
  }
  
  const apiPrefix = `${api}:`
  const matchingApiActions = allActions.filter((a: any) => a.id.startsWith(apiPrefix))
  
  const nameMatch = matchingApiActions.find((a: any) => {
    const extractedName = a.id.substring(apiPrefix.length)
    return extractedName.toLowerCase() === actionName.toLowerCase()
  })
  
  if (nameMatch) {
    return nameMatch.id
  }
  
  const fuzzyMatch = matchingApiActions.find((a: any) => {
    if (a.name && a.name.toLowerCase().includes(actionName.toLowerCase())) {
      return true
    }
    if (a.description && a.description.toLowerCase().includes(actionName.toLowerCase())) {
      return true
    }
    return false
  })
  
  if (fuzzyMatch) {
    return fuzzyMatch.id
  }
  
  return null
}

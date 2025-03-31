import { API } from '@/lib/api'
import { apis } from '@/api.config'
import { collectionSlugs } from '@/collections/index'
import { aliases } from '@/site.config'

export const GET = API(async (request, { db, user, params }) => {
  const { api } = params as { api: string }
  
  const apiExists = api in apis
  const isAlias = api in aliases
  const aliasedApi = isAlias ? aliases[api as keyof typeof aliases] : null
  const effectiveApi = isAlias ? aliasedApi : api
  
  if (!apiExists && !isAlias) {
    return {
      error: true,
      message: `API '${api}' not found. Available APIs: ${Object.keys(apis).join(', ')}`,
      statusCode: 404,
    }
  }
  
  const collectionExists = collectionSlugs.includes(effectiveApi)
  
  if (collectionExists && db[effectiveApi]) {
    try {
      const items = await db[effectiveApi].find()
      return { [effectiveApi]: items }
    } catch (error) {
      console.error(`Error fetching ${effectiveApi}:`, error)
      return {
        error: true,
        message: `Error fetching data from ${effectiveApi}`,
        statusCode: 500,
      }
    }
  }
  
  return {
    [effectiveApi]: {
      description: apis[effectiveApi] || `${effectiveApi} API`,
      message: `This is the ${api} API${isAlias ? ` (alias for ${aliasedApi})` : ''}. No collection data available.`,
    }
  }
})

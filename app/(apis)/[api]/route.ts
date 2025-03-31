import { API } from '@/lib/api'
import { apis } from '@/api.config'
import { collectionSlugs } from '@/collections/index'

export const GET = API(async (request, { db, user, params }) => {
  const { api } = params as { api: string }
  
  const apiExists = api in apis
  
  if (!apiExists) {
    return {
      error: true,
      message: `API '${api}' not found. Available APIs: ${Object.keys(apis).join(', ')}`,
      statusCode: 404,
    }
  }
  
  const collectionExists = collectionSlugs.includes(api)
  
  if (collectionExists && db[api]) {
    try {
      const items = await db[api].find()
      return { [api]: items }
    } catch (error) {
      console.error(`Error fetching ${api}:`, error)
      return {
        error: true,
        message: `Error fetching data from ${api}`,
        statusCode: 500,
      }
    }
  }
  
  return {
    [api]: {
      description: apis[api] || `${api} API`,
      message: `This is the ${api} API. No collection data available.`,
    }
  }
})

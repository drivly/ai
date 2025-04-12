import { API, generateCompletePaginationLinks } from '@/lib/api'
import { apis } from '@/api.config'
import { collectionSlugs } from '@/collections/index'
import { domainsConfig, primaryCollectionSlugs } from '@/domains.config'

export const GET = API(async (request, { db, user, params, url }) => {
  const { api } = params as { api: string }

  const apiExists = api in apis
  const isAlias = api in domainsConfig.aliases
  const aliasedApi = isAlias ? domainsConfig.aliases[api] : null
  const effectiveApi = isAlias ? (aliasedApi as string) : api

  if (!apiExists && !isAlias) {
    return {
      error: true,
      message: `API '${api}' not found. Available APIs: ${primaryCollectionSlugs.map((slug) => `${slug}: origin/${slug}`).join(', ')}`,
      statusCode: 404,
    }
  }

  const collectionExists = collectionSlugs.includes(effectiveApi)

  if (collectionExists && db[effectiveApi]) {
    try {
      const searchParams = request.nextUrl.searchParams
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      
      const result = await db[effectiveApi].find({
        page,
        limit,
      })
      
      const items = result.docs || []
      const totalItems = result.totalDocs || items.length
      const totalPages = result.totalPages || 1
      
      const links = generateCompletePaginationLinks(request, page, limit, totalItems, totalPages)
      
      const collectionItems: Record<string, string> = {}
      
      for (const item of items) {
        if (item && typeof item === 'object' && item.id) {
          const itemKey = item.name || item.title || item.id
          collectionItems[itemKey] = `${url.origin}/${effectiveApi}/${item.id}`
        }
      }
      
      return {
        [effectiveApi]: collectionItems,
        links,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      }
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
    },
  }
})

export const POST = API(async (request, { db, params }) => {
  const { api } = params as { api: string }
  
  const apiExists = api in apis
  const isAlias = api in domainsConfig.aliases
  const aliasedApi = isAlias ? domainsConfig.aliases[api] : null
  const effectiveApi = isAlias ? (aliasedApi as string) : api
  
  if (!apiExists && !isAlias) {
    return {
      error: true,
      message: `API '${api}' not found. Available APIs: ${primaryCollectionSlugs.map((slug) => `${slug}: origin/${slug}`).join(', ')}`,
      statusCode: 404,
    }
  }
  
  const collectionExists = collectionSlugs.includes(effectiveApi)
  
  if (!collectionExists || !db[effectiveApi]) {
    return {
      error: true,
      message: `Collection '${effectiveApi}' not found or not available for mutation`,
      statusCode: 404,
    }
  }
  
  let data
  try {
    data = await request.json()
  } catch (error) {
    return {
      error: true,
      message: 'Invalid JSON payload',
      statusCode: 400,
    }
  }
  
  try {
    const newItem = await db[effectiveApi].create(data)
    
    return {
      success: true,
      message: `Created new item in collection: ${effectiveApi}`,
      [effectiveApi]: newItem,
    }
  } catch (error) {
    console.error(`Error creating item in collection ${effectiveApi}:`, error)
    return {
      error: true,
      message: `Error creating item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      statusCode: error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500,
    }
  }
})

import { API, generateCompletePaginationLinks } from '@/lib/api'
import { collectionSlugs } from '@/collections'

export const GET = API(async (request, { db, params, url }) => {
  const { api: collection } = params as { api: string }
  
  if (!collectionSlugs.includes(collection)) {
    return {
      error: true,
      message: `Collection '${collection}' not found`,
      statusCode: 404,
    }
  }
  
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  try {
    const result = await db[collection].find({
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
        collectionItems[itemKey] = `${url.origin}/${collection}/${item.id}`
      }
    }
    
    return {
      [collection]: collectionItems,
      links,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    }
  } catch (error) {
    console.error(`Error fetching collection ${collection}:`, error)
    return {
      error: true,
      message: `Error retrieving data from collection: ${collection}`,
      statusCode: 500,
    }
  }
})

export const POST = API(async (request, { db, params }) => {
  const { api: collection } = params as { api: string }
  
  if (!collectionSlugs.includes(collection)) {
    return {
      error: true,
      message: `Collection '${collection}' not found`,
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
    const newItem = await db[collection].create(data)
    
    return {
      success: true,
      message: `Created new item in collection: ${collection}`,
      [collection]: newItem,
    }
  } catch (error) {
    console.error(`Error creating item in collection ${collection}:`, error)
    return {
      error: true,
      message: `Error creating item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      statusCode: error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500,
    }
  }
})

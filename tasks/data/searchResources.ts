import { getPayload } from 'payload'
import { generateEmbedding } from './generateEmbedding'

/**
 * Search Resources collection using vector search
 * @param query Search query text
 * @param limit Maximum number of results to return
 * @returns Array of matching Resource documents
 */
export async function searchResources(query: string, limit: number = 10): Promise<any[]> {
  try {
    const queryEmbedding = await generateEmbedding(query)

    const payload = await getPayload({ config: (await import('@/payload.config')).default })

    const db = payload.db.connection

    const resourcesCollection = db.collection('resources')

    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: limit * 10, // Search through more candidates for better results
          limit: limit,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          data: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]

    const results = await resourcesCollection.aggregate(pipeline).toArray()

    return results
  } catch (error) {
    console.error('Error searching Resources:', error)
    throw error
  }
}

/**
 * Hybrid search combining vector search with text search
 * @param query Search query text
 * @param limit Maximum number of results to return
 * @returns Array of matching Resource documents
 */
export async function hybridSearchResources(query: string, limit: number = 10): Promise<any[]> {
  try {
    const queryEmbedding = await generateEmbedding(query)

    const payload = await getPayload({ config: (await import('@/payload.config')).default })

    const db = payload.db.connection

    const resourcesCollection = db.collection('resources')

    const pipeline = [
      {
        $search: {
          index: 'default',
          compound: {
            should: [
              {
                vectorSearch: {
                  path: 'embedding',
                  queryVector: queryEmbedding,
                  score: { boost: { value: 1.5 } }, // Boost vector search results
                },
              },
              {
                text: {
                  query: query,
                  path: ['name', 'data'],
                  score: { boost: { value: 1.0 } },
                },
              },
            ],
          },
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          data: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ]

    const results = await resourcesCollection.aggregate(pipeline).toArray()

    return results
  } catch (error) {
    console.error('Error performing hybrid search on Resources:', error)
    throw error
  }
}

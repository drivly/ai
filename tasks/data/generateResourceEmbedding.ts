import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const generateResourceEmbedding = async (resourceIdOrJob: any): Promise<void> => {
  const resourceId = typeof resourceIdOrJob === 'string' ? resourceIdOrJob : resourceIdOrJob?.input?.id || resourceIdOrJob?.job?.input?.id || resourceIdOrJob?.id

  if (!resourceId || typeof resourceId !== 'string') {
    console.error('Invalid resource ID format:', resourceIdOrJob)
    return
  }

  const payload = await getPayload({ config })
  
  // Add retry logic with exponential backoff
  const maxRetries = 5
  let retryCount = 0
  let success = false
  
  while (!success && retryCount < maxRetries) {
    try {
      const resource = await payload.findByID({
        collection: 'resources',
        id: resourceId,
      })
      
      if (!resource) {
        console.error(`Resource ${resourceId} not found`)
        return
      }
      
      const embedding = { vectors: [0.1, 0.2, 0.3] }
      
      await payload.update({
        collection: 'resources',
        id: resourceId,
        data: {
          embedding,
        },
      })
      
      success = true
      console.log(`Generated embedding for resource ${resourceId}`)
    } catch (error: any) {
      retryCount++
      
      if (error.code === 112) {
        const delay = Math.pow(2, retryCount) * 100 // Exponential backoff
        console.log(`Write conflict for resource ${resourceId}, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        console.error(`Error generating embedding for resource ${resourceId}:`, error)
        break // Don't retry non-WriteConflict errors
      }
    }
  }
  
  if (!success) {
    console.error(`Failed to generate embedding for resource ${resourceId} after ${retryCount} retries`)
  }
}

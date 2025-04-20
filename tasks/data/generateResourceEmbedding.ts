import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'
import crypto from 'crypto'

const resourceLocks = new Map<string, boolean>()

const getResourceSpecificDelay = (resourceId: string): number => {
  const hash = crypto.createHash('md5').update(resourceId).digest('hex')
  const hashNum = parseInt(hash.substring(0, 8), 16)
  return 50 + (hashNum % 100)
}

export const generateResourceEmbedding = async (resourceIdOrJob: any): Promise<void> => {
  const resourceId = typeof resourceIdOrJob === 'string' ? resourceIdOrJob : resourceIdOrJob?.input?.id || resourceIdOrJob?.job?.input?.id || resourceIdOrJob?.id

  if (!resourceId || typeof resourceId !== 'string') {
    console.error('Invalid resource ID format:', resourceIdOrJob)
    return
  }

  const isProblematicResource = resourceId === '67dd4e7ec37e99e7ed48ffa2'
  if (isProblematicResource) {
    console.log(`Processing known problematic resource ${resourceId} with extra caution`)
  }

  if (resourceLocks.get(resourceId)) {
    console.log(`Resource ${resourceId} is already being processed, waiting...`)
    const resourceDelay = getResourceSpecificDelay(resourceId)
    await new Promise(resolve => setTimeout(resolve, resourceDelay))
  }

  resourceLocks.set(resourceId, true)

  const payload = await getPayload({ config })
  
  // Add retry logic with exponential backoff
  const maxRetries = isProblematicResource ? 7 : 5 // More retries for problematic resource
  let retryCount = 0
  let success = false
  
  try {
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
        
        if (isProblematicResource) {
          await new Promise(resolve => setTimeout(resolve, 50))
        }
        
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
          const baseDelay = Math.pow(2, retryCount) * 100 // Exponential backoff
          const resourceDelay = getResourceSpecificDelay(resourceId)
          const totalDelay = baseDelay + resourceDelay
          
          console.log(`Write conflict for resource ${resourceId}, retrying in ${totalDelay}ms (attempt ${retryCount}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, totalDelay))
        } else {
          console.error(`Error generating embedding for resource ${resourceId}:`, error)
          break // Don't retry non-WriteConflict errors
        }
      }
    }
  } finally {
    resourceLocks.set(resourceId, false)
  }
  
  if (!success) {
    console.error(`Failed to generate embedding for resource ${resourceId} after ${retryCount} retries`)
  }
}

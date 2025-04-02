import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '../payload.config'

export const generateResourceEmbedding = async (resourceId: string): Promise<void> => {
  const payload = await getPayload({ config })
  
  try {
    const resource = await payload.findByID({
      collection: 'resources', // Collection slug
      id: resourceId,
    })
    
    if (!resource) {
      console.error(`Resource ${resourceId} not found`)
      return
    }
    
    const embedding = { vectors: [0.1, 0.2, 0.3] } // Replace with actual embedding generation
    
    await payload.update({
      collection: 'resources', // Collection slug
      id: resourceId,
      data: {
        embedding,
      },
    })
    
    console.log(`Generated embedding for resource ${resourceId}`)
  } catch (error) {
    console.error(`Error generating embedding for resource ${resourceId}:`, error)
  }
}

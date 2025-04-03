/**
 * Script to generate embeddings for all existing Resource documents
 */
import { getPayload } from 'payload'
import { generateResourceEmbedding } from '../tasks/generateResourceEmbedding'

async function generateAllResourceEmbeddings() {
  try {
    console.log('Starting embedding generation for all Resources...')
    
    const payload = await getPayload({ config: (await import('../payload.config')).default })
    
    const response = await payload.find({
      collection: 'resources',
      where: {
        embedding: { exists: false }
      },
      limit: 1000,
    })
    
    const resources = response.docs
    console.log(`Found ${resources.length} Resources without embeddings`)
    
    for (const resource of resources) {
      try {
        console.log(`Generating embedding for Resource ${resource.id}: ${resource.name || 'Unnamed'}`)
        await generateResourceEmbedding(String(resource.id))
        console.log(`✓ Successfully generated embedding for Resource ${resource.id}`)
      } catch (error) {
        console.error(`Error generating embedding for Resource ${resource.id}:`, error)
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('Finished generating embeddings for all Resources')
  } catch (error) {
    console.error('Error generating embeddings:', error)
  } finally {
    process.exit(0)
  }
}

generateAllResourceEmbeddings()

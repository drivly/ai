/**
 * Script to generate embeddings for all existing Thing documents
 */
import { getPayload } from 'payload'
import { generateThingEmbedding } from '../tasks/generateThingEmbedding'

async function generateAllEmbeddings() {
  try {
    console.log('Starting embedding generation for all Things...')
    
    const payload = await getPayload({ config: (await import('../payload.config')).default })
    
    const response = await payload.find({
      collection: 'things',
      where: {
        embedding: { exists: false }
      },
      limit: 1000,
    })
    
    const things = response.docs
    console.log(`Found ${things.length} Things without embeddings`)
    
    for (const thing of things) {
      try {
        console.log(`Generating embedding for Thing ${thing.id}: ${thing.name || 'Unnamed'}`)
        await generateThingEmbedding(thing.id)
        console.log(`✓ Successfully generated embedding for Thing ${thing.id}`)
      } catch (error) {
        console.error(`Error generating embedding for Thing ${thing.id}:`, error)
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('Finished generating embeddings for all Things')
  } catch (error) {
    console.error('Error generating embeddings:', error)
  } finally {
    process.exit(0)
  }
}

generateAllEmbeddings()

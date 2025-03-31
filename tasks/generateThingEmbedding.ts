import { getPayload } from 'payload'
import { generateEmbedding, prepareTextForEmbedding } from './generateEmbedding'

/**
 * Task to generate and store an embedding for a Thing document
 * @param id ID of the Thing document to generate embedding for
 * @returns The updated Thing document with embedding
 */
export async function generateThingEmbedding(id: string): Promise<any> {
  try {
    const payload = await getPayload({ config: (await import('../payload.config')).default })
    
    const thing = await payload.findByID({
      collection: 'things',
      id,
    })

    if (!thing) {
      throw new Error(`Thing with ID ${id} not found`)
    }

    const text = prepareTextForEmbedding(thing)
    
    if (!text) {
      console.log(`No text to embed for Thing ${id}`)
      return thing
    }

    const embedding = await generateEmbedding(text)
    
    const updatedThing = await payload.update({
      collection: 'things',
      id,
      data: {
        embedding,
      },
    })

    return updatedThing
  } catch (error) {
    console.error(`Error generating embedding for Thing ${id}:`, error)
    throw error
  }
}

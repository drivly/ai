/**
 * Script to generate embeddings for Resources in batches
 * Addresses ENG-721: Simplify Resources embedding process
 */
import { getPayload } from 'payload'
import { openai } from '@ai-sdk/openai'
import { embedMany } from 'ai'
import config from '../payload.config'

const MODEL = 'text-embedding-3-large'
const DIMENSIONS = 256
const BATCH_SIZE = 50
const PROBLEMATIC_RESOURCE_ID = '67dd4e7ec37e99e7ed48ffa2'

/**
 * Prepares text content from a resource for embedding
 * @param resource Resource document to extract text from
 * @returns String of text to embed
 */
function prepareResourceTextForEmbedding(resource: any): string {
  const parts = [resource.name || '', resource.content || '', resource.yaml || '', typeof resource.data === 'object' ? JSON.stringify(resource.data) : resource.data || '']

  return parts.filter(Boolean).join(' ').trim()
}

/**
 * Generate embeddings for resources without embeddings using batch processing
 * @param batchSize Number of resources to process in a batch
 */
async function generateResourceEmbeddingsBatch(batchSize = BATCH_SIZE) {
  try {
    console.log('Starting batch embedding generation for Resources...')

    const payload = await getPayload({ config })

    const response = await payload.find({
      collection: 'resources',
      where: {
        embedding: { exists: false },
      },
      limit: batchSize,
    })

    const resources = response.docs
    if (resources.length === 0) {
      console.log('No resources found without embeddings')
      return
    }

    console.log(`Found ${resources.length} Resources without embeddings`)

    const problematicResourceIndex = resources.findIndex((r) => r.id === PROBLEMATIC_RESOURCE_ID)
    if (problematicResourceIndex !== -1) {
      console.log(`Found problematic resource ${PROBLEMATIC_RESOURCE_ID}, will process separately`)
      const problematicResource = resources.splice(problematicResourceIndex, 1)[0]

      try {
        const textToEmbed = prepareResourceTextForEmbedding(problematicResource)
        console.log(`Processing problematic resource with text length: ${textToEmbed.length}`)

        const embeddingModel = openai.textEmbeddingModel(MODEL)
        const result = await embeddingModel.doEmbed({ values: [textToEmbed] })
        const embedding = result.embeddings[0]

        await payload.update({
          collection: 'resources',
          id: problematicResource.id,
          data: {
            embedding: { vectors: embedding },
          },
          depth: 0,
        })

        console.log(`✓ Successfully processed problematic resource ${problematicResource.id}`)
      } catch (error) {
        console.error(`Error processing problematic resource ${problematicResource.id}:`, error)
      }
    }

    if (resources.length === 0) {
      console.log('No remaining resources to process in batch')
      return
    }

    const textsToEmbed = resources.map((resource) => {
      return prepareResourceTextForEmbedding(resource)
    })

    console.log(`Generating embeddings for ${resources.length} resources in batch...`)
    const { embeddings } = await embedMany({
      model: openai.embedding(MODEL),
      values: textsToEmbed,
    })

    console.log('Updating resources with generated embeddings...')
    const updatePromises = resources.map((resource, i) => {
      return payload
        .update({
          collection: 'resources',
          id: resource.id,
          data: {
            embedding: { vectors: embeddings[i] },
          },
          depth: 0,
        })
        .then(() => console.log(`✓ Successfully updated embedding for Resource ${resource.id}`))
        .catch((error) => console.error(`Error updating embedding for Resource ${resource.id}:`, error))
    })

    await Promise.all(updatePromises)
    console.log(`Processed batch of ${resources.length} resources`)
  } catch (error) {
    console.error('Error in batch embedding generation:', error)
  }
}

const customBatchSize = process.argv[2] ? parseInt(process.argv[2], 10) : BATCH_SIZE

generateResourceEmbeddingsBatch(customBatchSize)
  .then(() => {
    console.log('Batch embedding generation completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error in batch embedding generation:', error)
    process.exit(1)
  })

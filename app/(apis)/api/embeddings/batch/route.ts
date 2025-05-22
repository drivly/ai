import { API } from '@/lib/api'
import { getPayload } from 'payload'
import { openai } from '@ai-sdk/openai'
import { embedMany } from 'ai'
import config from '@/payload.config'

const MODEL = 'text-embedding-3-large'
const BATCH_SIZE = 100
const TIME_LIMIT = 60000 // 1 minute in milliseconds
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
 * API route handler for resource embedding batch processing
 * Designed to be called by a cron job every minute
 */
export const GET = API(async (request, { db, user, origin, url, domain }) => {
  const startTime = Date.now()
  console.log('Starting resource embedding batch processing')

  try {
    const payload = await getPayload({ config })
    let processed = 0
    let continueProcessing = true

    const problematicResourceResponse = await payload.find({
      collection: 'resources',
      where: {
        id: { equals: PROBLEMATIC_RESOURCE_ID },
        embedding: { exists: false },
      },
      limit: 1,
    })

    if (problematicResourceResponse.docs.length > 0) {
      const problematicResource = problematicResourceResponse.docs[0]
      console.log(`Processing known problematic resource ${PROBLEMATIC_RESOURCE_ID} with extra caution`)

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
        processed++
      } catch (error) {
        console.error(`Error processing problematic resource ${PROBLEMATIC_RESOURCE_ID}:`, error)
      }
    }

    while (continueProcessing && Date.now() - startTime < TIME_LIMIT - 5000) {
      // 5s buffer
      const response = await payload.find({
        collection: 'resources',
        where: {
          embedding: { exists: false },
          id: { not_equals: PROBLEMATIC_RESOURCE_ID }, // Skip the problematic resource we've already handled
        },
        limit: BATCH_SIZE,
      })

      const resources = response.docs
      if (resources.length === 0) {
        console.log('No more resources to process')
        break
      }

      console.log(`Found ${resources.length} resources without embeddings`)

      const textsToEmbed = resources.map(prepareResourceTextForEmbedding)

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
      processed += resources.length

      if (Date.now() - startTime > TIME_LIMIT - 5000) {
        // 5s buffer
        continueProcessing = false
      }
    }

    const executionTime = Date.now() - startTime
    console.log(`Batch embedding generation completed in ${executionTime}ms. Processed ${processed} resources.`)

    return {
      success: true,
      processedCount: processed,
      executionTimeMs: executionTime,
    }
  } catch (error) {
    console.error('Error in batch embedding generation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
})

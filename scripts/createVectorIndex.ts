/**
 * Script to create a vector index on the Things collection
 */
import { getPayload } from 'payload'

async function createVectorIndex() {
  try {
    console.log('Creating vector index for Things collection...')

    const payload = await getPayload({ config: (await import('../payload.config')).default })

    const db = payload.db.connection

    const thingsCollection = db.collection('things')

    const indexes = await thingsCollection.listIndexes().toArray()
    const indexExists = indexes.some((index) => index.name === 'vector_index')

    if (indexExists) {
      console.log('Vector index already exists')
      return
    }

    await thingsCollection.createIndex(
      { embedding: 1 }, // Standard index field specification
      {
        name: 'vector_index',
        background: true,
      },
    )

    console.log('Successfully created vector index for Things collection')
  } catch (error) {
    console.error('Error creating vector index:', error)
  } finally {
    process.exit(0)
  }
}

createVectorIndex()

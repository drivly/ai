import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Script to generate API documentation for all collections
 * This creates MDX files in the /content/apis directory
 */
const generateApiDocs = async () => {
  try {
    console.log('Initializing Payload...')
    const payload = await getPayload({
      config,
    })

    console.log('Queueing API documentation generation task...')
    const job = await payload.jobs.queue({
      task: 'generateApiDocs',
      input: {},
    } as any)

    console.log('Running API documentation generation task...')
    try {
      await payload.jobs.runByID(job)
      console.log('API documentation generated successfully!')
    } catch (jobError) {
      console.error('Error generating API documentation:', jobError)
    }

    if (payload.db && typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

generateApiDocs()

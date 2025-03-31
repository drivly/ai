'use server'

import { getPayload } from 'payload'
import config from '../../payload.config'

/**
 * Server action to record errors in the Payload Errors collection
 */
export async function recordError(error: Error & { digest?: string }, url?: string) {
  try {
    const payload = await getPayload({ config })
    
    return await payload.create({
      collection: 'errors',
      data: {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        url,
        source: 'global-error-handler',
      },
    })
  } catch (createError) {
    console.error('Failed to record error:', createError)
    return null
  }
}

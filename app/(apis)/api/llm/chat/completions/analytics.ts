import config from '@/payload.config'
import { after } from 'next/server'
import { getPayload } from 'payload'

type EventType = 'llm.tool-use' | 'llm.completion' | 'llm.usage'

// Must at least have a user, everything else is optional.
type Metadata = {
  user: string
  [key: string]: any
}

export function createDataPoint(type: EventType, metadata: Metadata, data: Record<string, any>) {
  // Send analytics after the request is done.
  // This is the newer version of waitUntil.
  after(async () => {
    const payload = await getPayload({ config })

    try {
      await payload.create({
        collection: 'events',
        data: {
          type,
          source: 'llm.do',
          data,
          metadata,
          tenant: process.env.DEFAULT_TENANT || '67eff7d61cb630b09c9de598', // Default project ID (Do More Work tenant)
        },
      })
    } catch (error) {
      console.error('[ANALYTICS] Error creating log', error)
    }
  })
}

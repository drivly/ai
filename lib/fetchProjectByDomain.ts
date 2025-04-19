import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Fetches a project by its domain
 * @param domain The domain to search for
 * @returns The project data or null if not found
 */
export async function fetchProjectByDomain(domain: string) {
  if (!domain) {
    throw new Error('Domain is required')
  }

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'projects',
      where: {
        domain: { equals: domain },
      },
      limit: 1,
    })

    if (docs && docs.length > 0) {
      return docs[0]
    }

    const { docs: docsFromRelation } = await payload.find({
      collection: 'projects',
      where: {
        'domains.domain': { equals: domain },
      },
      limit: 1,
    })

    if (docsFromRelation && docsFromRelation.length > 0) {
      return docsFromRelation[0]
    }

    return null
  } catch (error) {
    console.error(`Error fetching project by domain '${domain}':`, error)
    throw new Error('Failed to fetch project by domain')
  }
}

import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Fetches all nouns associated with a project
 * @param projectId The project ID to fetch nouns for
 * @returns Array of nouns with their configurations
 */
export async function getNounsForProject(projectId: string) {
  if (!projectId) {
    throw new Error('Project ID is required')
  }

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'nouns',
      where: {
        project: { equals: projectId },
      },
      sort: 'order',
    })

    return docs || []
  } catch (error) {
    console.error(`Error fetching nouns for project '${projectId}':`, error)
    throw new Error('Failed to fetch nouns for project')
  }
}

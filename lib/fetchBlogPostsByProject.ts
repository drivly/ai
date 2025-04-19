import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Fetches blog posts for a specific project
 * @param projectId The ID of the project to fetch blog posts for
 * @returns Array of blog posts for the project
 */
export async function fetchBlogPostsByProject(projectId: string): Promise<any[]> {
  if (!projectId) {
    throw new Error('Project ID is required')
  }

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'resources',
      where: {
        tenant: { equals: projectId },
        'type.name': { equals: 'BlogPost' },
      },
      sort: '-createdAt',
    })

    return docs
  } catch (error) {
    console.error(`Error fetching blog posts for project '${projectId}':`, error)
    throw new Error('Failed to fetch blog posts for project')
  }
}

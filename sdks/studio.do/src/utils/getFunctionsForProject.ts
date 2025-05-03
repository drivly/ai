import { client } from 'apis.do'

/**
 * Fetches all functions associated with a project
 * @param projectId The project ID to fetch functions for
 * @returns Array of functions with their configurations
 */
export async function getFunctionsForProject(projectId: string) {
  if (!projectId) {
    throw new Error('Project ID is required')
  }

  try {
    const response = await client.list('functions', {
      where: {
        project: { equals: projectId },
      },
      sort: 'order',
    })

    return response.data || []
  } catch (error) {
    console.error(`Error fetching functions for project '${projectId}':`, error)
    throw new Error('Failed to fetch functions for project')
  }
}

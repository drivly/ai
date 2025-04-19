import { api } from 'apis.do'

/**
 * Fetches all workflows associated with a project
 * @param projectId The project ID to fetch workflows for
 * @returns Array of workflows with their configurations
 */
export async function getWorkflowsForProject(projectId: string) {
  if (!projectId) {
    throw new Error('Project ID is required')
  }

  try {
    const response = await api.list('workflows', {
      where: {
        project: { equals: projectId },
      },
      sort: 'order',
    })

    return response.data || []
  } catch (error) {
    console.error(`Error fetching workflows for project '${projectId}':`, error)
    throw new Error('Failed to fetch workflows for project')
  }
}

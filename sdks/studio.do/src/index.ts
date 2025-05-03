/**
 * studio.do - SDK for creating custom-branded Payload CMS instances
 */

import { API } from 'apis.do'
import { StudioSDKOptions, PayloadClient } from './types'
import { getFunctionsForProject } from './utils/getFunctionsForProject'
import { getWorkflowsForProject } from './utils/getWorkflowsForProject'
import { generateCollectionsFromProject } from './utils/generateCollectionsFromProject'

const client = new API()

export * from './types'

interface Plugin {
  name: string
  options: Record<string, any>
}

interface Project {
  id: string
  name: string
  [key: string]: any
}

/**
 * Creates a studio client for a project
 * @param options Configuration options for the studio client
 * @returns A Payload client configured for the project
 */
export async function createStudioClient(options: StudioSDKOptions): Promise<PayloadClient> {
  const { projectId, theme, agentOptions } = options

  try {
    const project = await client.getById<Project>('projects', projectId)

    if (!project) {
      throw new Error(`Project with ID '${projectId}' not found`)
    }

    const nounsPromise = client.list('nouns', {
      where: { project: { equals: projectId } },
      sort: 'order',
    })

    const functionsPromise = getFunctionsForProject(projectId)
    const workflowsPromise = getWorkflowsForProject(projectId)

    const [nounsResponse, functions, workflows] = await Promise.all([nounsPromise, functionsPromise, workflowsPromise])

    const nouns = nounsResponse.data || []

    const collections = generateCollectionsFromProject(nouns, functions, workflows)

    const plugins: Plugin[] = []

    if (theme) {
      plugins.push({
        name: 'themePlugin',
        options: theme,
      })
    }

    if (agentOptions) {
      plugins.push({
        name: 'payloadAgentPlugin',
        options: agentOptions,
      })
    }

    const payloadClient = await client.post<PayloadClient>('/v1/payload/client', {
      collections,
      plugins,
      project: {
        id: projectId,
        name: project.name,
      },
    })

    return payloadClient
  } catch (error) {
    console.error(`Error creating studio client for project '${projectId}':`, error)
    if (error instanceof Error && error.message.includes('not found')) {
      throw error
    }
    throw new Error('Failed to create studio client')
  }
}

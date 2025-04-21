import { TaskConfig } from 'payload'
import { LinearClient } from '@linear/sdk'

/**
 * Sync a task to Linear when it's created or updated
 */
export const syncTaskToLinearHandler = async ({ data, originalDoc, req }: { data: any; originalDoc: any; req: any }, { payload }: { payload: any }) => {
  try {
    if (!data?.assigned?.length) {
      return { status: 'skipped', message: 'Task has no assignees' }
    }

    const assigneeIds = data.assigned.filter((assigned: any) => assigned.relationTo === 'users').map((assigned: any) => assigned.value)

    if (assigneeIds.length === 0) {
      return { status: 'skipped', message: 'Task has no user assignees' }
    }

    const user = await payload.findByID({
      collection: 'users',
      id: assigneeIds[0],
    })

    if (!user) {
      return { status: 'skipped', message: 'Assigned user not found' }
    }

    const connections = await payload.find({
      collection: 'connectAccounts',
      where: {
        and: [
          { user: { equals: user.id } },
          {
            integration: {
              relationTo: 'integrations',
              where: {
                provider: { equals: 'linear' },
              },
            },
          },
          { status: { equals: 'active' } },
        ],
      },
      depth: 0,
    })

    if (!connections.docs.length) {
      return { status: 'skipped', message: 'User has no active Linear connection' }
    }

    const connection = connections.docs[0]

    if (!connection.metadata?.accessToken) {
      return { status: 'error', message: 'Linear connection missing access token' }
    }

    const linearClient = new LinearClient({
      accessToken: connection.metadata.accessToken,
    })

    const linearIssueId = data.metadata?.linearIssueId || data.linearMetadata?.id

    const issueData = {
      title: data.title,
      description: data.description || '',
    }

    let result: any

    if (linearIssueId) {
      const updateIssueMutation = `
        mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
          issueUpdate(id: $id, input: $input) {
            success
            issue {
              id
              url
            }
          }
        }
      `

      result = await linearClient.client.request(updateIssueMutation, {
        id: linearIssueId,
        input: issueData,
      })

      if (!result.issueUpdate.success) {
        return { status: 'error', message: 'Failed to update Linear issue' }
      }
    } else {
      const teamsQuery = `
        query Teams {
          teams {
            nodes {
              id
            }
          }
        }
      `

      const teamsResult = (await linearClient.client.request(teamsQuery, {})) as { teams: { nodes: { id: string }[] } }
      const teams = teamsResult.teams

      if (!teams.nodes.length) {
        return { status: 'error', message: 'No Linear teams found for user' }
      }

      const teamId = teams.nodes[0].id

      const createIssueMutation = `
        mutation IssueCreate($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue {
              id
              url
            }
          }
        }
      `

      result = await linearClient.client.request(createIssueMutation, {
        input: {
          ...issueData,
          teamId,
        },
      })

      if (!result.issueCreate.success) {
        return { status: 'error', message: 'Failed to create Linear issue' }
      }

      const linearMetadata = {
        id: result.issueCreate.issue.id,
        url: result.issueCreate.issue.url,
        teamId: teamId,
      }

      await payload.update({
        collection: 'tasks',
        id: data.id,
        data: {
          linearMetadata,
        },
      })
    }

    const issueResult = linearIssueId ? result.issueUpdate : result.issueCreate

    return {
      status: 'success',
      message: linearIssueId ? 'Linear issue updated' : 'Linear issue created',
      linearIssueId: issueResult.issue.id,
      linearIssueUrl: issueResult.issue.url,
    }
  } catch (error: any) {
    console.error('Error syncing task to Linear:', error)
    return { status: 'error', message: error.message || 'Unknown error' }
  }
}

/**
 * Task configuration for syncTaskToLinear
 */
export const syncTaskToLinearTask = {
  slug: 'syncTaskToLinear',
  label: 'Sync Task to Linear',
  inputSchema: [
    { name: 'data', type: 'json', required: true },
    { name: 'originalDoc', type: 'json' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'message', type: 'text' },
    { name: 'linearIssueId', type: 'text' },
    { name: 'linearIssueUrl', type: 'text' },
  ],
  handler: syncTaskToLinearHandler,
} as unknown as TaskConfig

export const syncTaskToLinear = syncTaskToLinearHandler

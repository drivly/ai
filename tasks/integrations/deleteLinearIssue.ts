import { TaskConfig } from 'payload'
import { LinearClient } from '@linear/sdk'

/**
 * Delete a Linear issue when the corresponding task is deleted
 */
export const deleteLinearIssueHandler = async ({ data, originalDoc, req }: { data: any; originalDoc: any; req: any }, { payload }: { payload: any }) => {
  try {
    if (!originalDoc) {
      return { status: 'skipped', message: 'No original document provided' }
    }

    const linearIssueId = originalDoc.metadata?.linearIssueId || originalDoc.linearMetadata?.id

    if (!linearIssueId) {
      return { status: 'skipped', message: 'Task has no linked Linear issue' }
    }

    if (!originalDoc?.assigned?.length) {
      return { status: 'skipped', message: 'Task had no assignees' }
    }

    const assigneeIds = originalDoc.assigned.filter((assigned: any) => assigned.relationTo === 'users').map((assigned: any) => assigned.value)

    if (assigneeIds.length === 0) {
      return { status: 'skipped', message: 'Task had no user assignees' }
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

    const archiveIssueMutation = `
      mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
        }
      }
    `

    const result = (await linearClient.client.request(archiveIssueMutation, {
      id: linearIssueId,
      input: {
        canceledAt: new Date().toISOString(),
      },
    })) as { issueUpdate: { success: boolean } }

    if (!result.issueUpdate.success) {
      return { status: 'error', message: 'Failed to archive Linear issue' }
    }

    return {
      status: 'success',
      message: 'Linear issue archived',
    }
  } catch (error: any) {
    console.error('Error deleting Linear issue:', error)
    return { status: 'error', message: error.message || 'Unknown error' }
  }
}

/**
 * Task configuration for deleteLinearIssue
 */
export const deleteLinearIssueTask = {
  slug: 'deleteLinearIssue',
  label: 'Delete Linear Issue',
  inputSchema: [
    { name: 'data', type: 'json', required: true },
    { name: 'originalDoc', type: 'json' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'message', type: 'text' },
  ],
  handler: deleteLinearIssueHandler,
} as unknown as TaskConfig

export const deleteLinearIssue = deleteLinearIssueHandler

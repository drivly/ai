import { TaskConfig } from 'payload'

interface LinearWebhookPayload {
  action: string
  data: {
    id: string
    title: string
    description?: string
    state?: {
      name: string
    }
    assignee?: {
      id: string
      name: string
      email: string
    }
    team?: {
      id: string
      name: string
    }
    priority?: number
    url?: string
    [key: string]: any
  }
  [key: string]: any
}

const mapLinearStatusToTaskStatus = (linearStatus: string): string => {
  const statusMap: Record<string, string> = {
    Backlog: 'backlog',
    Todo: 'todo',
    'In Progress': 'in-progress',
    'In Review': 'review',
    Done: 'done',
    Canceled: 'done',
  }

  return statusMap[linearStatus] || 'backlog'
}

export const handleLinearWebhook = async ({ job, payload }: any) => {
  try {
    const { action, data } = job.input.payload as LinearWebhookPayload

    console.log(`Processing Linear webhook: ${action}`, data)

    if (['create', 'update'].includes(action)) {
      const existingTasks = await payload.find({
        collection: 'tasks',
        where: {
          'linearMetadata.id': {
            equals: data.id,
          },
        },
      })

      const taskData = {
        title: data.title,
        description: data.description || '',
        status: data.state ? mapLinearStatusToTaskStatus(data.state.name) : 'backlog',
        linearMetadata: {
          id: data.id,
          url: data.url,
          priority: data.priority,
          teamId: data.team?.id,
          teamName: data.team?.name,
        },
      }

      if (existingTasks.docs.length > 0) {
        const existingTask = existingTasks.docs[0]
        console.log(`Updating existing task: ${existingTask.id}`)

        await payload.update({
          collection: 'tasks',
          id: existingTask.id,
          data: taskData,
        })

        return { success: true, action: 'update', taskId: existingTask.id }
      } else {
        console.log('Creating new task from Linear')

        const newTask = await payload.create({
          collection: 'tasks',
          data: taskData,
        })

        return { success: true, action: 'create', taskId: newTask.id }
      }
    } else if (action === 'remove') {
      const existingTasks = await payload.find({
        collection: 'tasks',
        where: {
          'linearMetadata.id': {
            equals: data.id,
          },
        },
      })

      if (existingTasks.docs.length > 0) {
        const existingTask = existingTasks.docs[0]
        console.log(`Marking task as done due to Linear deletion: ${existingTask.id}`)

        await payload.update({
          collection: 'tasks',
          id: existingTask.id,
          data: {
            status: 'done',
          },
        })

        return { success: true, action: 'mark-done', taskId: existingTask.id }
      }
    }

    return { success: true, action: 'no-op' }
  } catch (error) {
    console.error('Error processing Linear webhook:', error)
    throw error // Rethrow to trigger retry mechanism
  }
}

export const handleLinearWebhookTask = {
  slug: 'handleLinearWebhook',
  label: 'Handle Linear Webhook',
  inputSchema: [{ name: 'payload', type: 'json', required: true }],
  handler: handleLinearWebhook,
} as unknown as TaskConfig

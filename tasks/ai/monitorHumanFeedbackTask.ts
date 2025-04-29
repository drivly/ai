import { TaskConfig } from 'payload'

export const monitorHumanFeedbackTask = async ({ input, payload }: any) => {
  const { taskId, functionName, timeout } = input

  if (!taskId) {
    throw new Error('Task ID is required')
  }

  try {
    const task = await payload.findByID({
      collection: 'tasks',
      id: taskId,
    })

    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    if (task.status === 'completed') {
      const response = task.metadata?.response

      if (input.callback) {
        await payload.jobs.queue({
          task: 'deliverWebhook',
          input: {
            url: input.callback,
            data: {
              taskId,
              functionName,
              response,
              status: 'completed',
            },
          },
        })
      }

      return {
        status: 'completed',
        taskId,
        response,
      }
    } else if (task.status === 'in-progress') {
      const checkInterval = 30000 // 30 seconds

      const createdAt = new Date(task.metadata?.createdAt || task.createdAt).getTime()
      const now = Date.now()

      if (now - createdAt < timeout) {
        await payload.jobs.queue({
          task: 'monitorHumanFeedbackTask',
          input,
          options: {
            delay: checkInterval,
          },
        })

        return {
          status: 'in-progress',
          taskId,
          nextCheck: new Date(now + checkInterval).toISOString(),
        }
      } else {
        await payload.update({
          collection: 'tasks',
          id: taskId,
          data: {
            status: 'completed',
            metadata: {
              ...task.metadata,
              timedOut: true,
              completedAt: new Date().toISOString(),
            },
          },
        })

        return {
          status: 'timeout',
          taskId,
        }
      }
    }

    return {
      status: task.status,
      taskId,
    }
  } catch (error: any) {
    console.error(`Error monitoring human feedback task ${taskId}:`, error)
    throw error
  }
}

export const monitorHumanFeedbackTaskConfig = {
  slug: 'monitorHumanFeedbackTask',
  label: 'Monitor Human Feedback Task',
  inputSchema: [
    { name: 'taskId', type: 'text', required: true },
    { name: 'functionName', type: 'text', required: true },
    { name: 'timeout', type: 'number' },
    { name: 'callback', type: 'text' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'taskId', type: 'text' },
    { name: 'response', type: 'json' },
    { name: 'nextCheck', type: 'text' },
  ],
  handler: monitorHumanFeedbackTask,
} as unknown as TaskConfig

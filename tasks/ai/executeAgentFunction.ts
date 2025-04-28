import { TaskConfig } from 'payload'

export const executeAgentFunction = async ({ input, payload }: any) => {
  const { agentId, prompt, context, taskId, options } = input

  if (!agentId) {
    throw new Error('Agent ID is required')
  }

  if (!taskId) {
    throw new Error('Task ID is required')
  }

  try {
    await payload.update({
      collection: 'tasks',
      id: taskId,
      data: {
        status: 'processing',
        metadata: {
          agentId,
          prompt,
          context,
          startedAt: new Date().toISOString(),
        },
      },
    })
    
    const agentResponse = {
      result: `Agent ${agentId} processed request: ${prompt}`,
      status: 'completed',
      timestamp: new Date().toISOString(),
    }

    await payload.update({
      collection: 'tasks',
      id: taskId,
      data: {
        status: 'completed',
        metadata: {
          completedAt: new Date().toISOString(),
          response: agentResponse,
        },
      },
    })

    return {
      status: 'completed',
      taskId,
      response: agentResponse,
    }
  } catch (error: any) {
    console.error(`Error executing agent function with agent ${agentId}:`, error)
    
    await payload.update({
      collection: 'tasks',
      id: taskId,
      data: {
        status: 'failed',
        metadata: {
          completedAt: new Date().toISOString(),
          error: error.message || 'Unknown error',
        },
      },
    })
    
    throw error
  }
}

export const executeAgentFunctionConfig = {
  slug: 'executeAgentFunction',
  label: 'Execute Agent Function',
  inputSchema: [
    { name: 'agentId', type: 'text', required: true },
    { name: 'prompt', type: 'text', required: true },
    { name: 'context', type: 'json' },
    { name: 'taskId', type: 'text', required: true },
    { name: 'options', type: 'json' },
  ],
  outputSchema: [
    { name: 'status', type: 'text' },
    { name: 'taskId', type: 'text' },
    { name: 'response', type: 'json' },
  ],
  handler: executeAgentFunction,
} as unknown as TaskConfig

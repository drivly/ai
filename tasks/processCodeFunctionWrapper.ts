import { TaskConfig } from 'payload'

/**
 * Process a code function using esbuild
 * 
 * This task is triggered when a function with type "Code" is created or updated
 * It processes the code using esbuild and creates/updates the corresponding module and package
 * 
 * This is a wrapper that doesn't directly import esbuild to avoid Next.js bundling issues
 */
export const processCodeFunction = async ({ input, payload }: any) => {
  const { functionId } = input
  
  if (!functionId) {
    throw new Error('Function ID is required')
  }
  
  try {
    const func = await payload.findByID({
      collection: 'functions',
      id: functionId
    })
    
    if (!func || func.type !== 'Code' || !func.code) {
      throw new Error('Function not found or not a Code type function')
    }
    
    const task = await payload.create({
      collection: 'tasks',
      data: {
        title: `Process Code Function: ${func.name}`,
        description: `Process code from function ${func.name} (${func.id}) using esbuild to create modules and packages.`,
        status: 'todo',
        task: 'processCodeFunction',
        input: {
          functionId: func.id
        }
      }
    })
    
    return {
      function: func.name,
      taskId: task.id,
      success: true,
      message: 'Task created to process function code'
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error processing code function:', errorMessage)
    return {
      error: errorMessage,
      success: false
    }
  }
}

export const processCodeFunctionWrapperTask = {
  retries: 3,
  slug: 'processCodeFunctionWrapper',
  label: 'Process Code Function Wrapper',
  inputSchema: [
    { name: 'functionId', type: 'text', required: true }
  ],
  outputSchema: [
    { name: 'function', type: 'text' },
    { name: 'taskId', type: 'text' },
    { name: 'success', type: 'checkbox' },
    { name: 'error', type: 'text' },
    { name: 'message', type: 'text' }
  ],
  handler: processCodeFunction,
} as unknown as TaskConfig

import { API } from '@/lib/api'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * ESBuild API route
 * 
 * Processes code from functions to create modules and packages
 */
export const GET = API(async (req, ctx) => {
  const payload = await getPayload({ config })
  
  const { docs: functions } = await payload.find({
    collection: 'functions',
    where: {
      type: {
        equals: 'Code'
      }
    }
  })

  const results = []

  for (const func of functions) {
    if (!func.code) continue

    try {
      const task = await payload.create({
        collection: 'tasks',
        data: {
          title: `Process Code Function: ${func.name}`,
          description: `Process code from function ${func.name} (${func.id}) using esbuild to create modules and packages. Task: processCodeFunctionWrapper. FunctionId: ${func.id}`,
          status: 'todo'
        }
      })
      
      results.push({
        function: func.name,
        taskId: task.id,
        success: true,
        message: 'Task created to process function code'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({
        function: func.name,
        error: errorMessage,
        success: false
      })
    }
  }
  
  return {
    processed: results.length,
    results
  }
})

/**
 * Process a specific function by ID
 */
export const POST = API(async (req, ctx) => {
  const { functionId } = ctx.req.json ? await ctx.req.json() : {}
  
  if (!functionId) {
    return {
      error: 'Function ID is required',
      success: false
    }
  }
  
  const payload = await getPayload({ config })
  
  try {
    const func = await payload.findByID({
      collection: 'functions',
      id: functionId
    })
    
    if (!func || func.type !== 'Code' || !func.code) {
      return {
        error: 'Function not found or not a Code type function',
        success: false
      }
    }
    
    const task = await payload.create({
      collection: 'tasks',
      data: {
        title: `Process Code Function: ${func.name}`,
        description: `Process code from function ${func.name} (${func.id}) using esbuild to create modules and packages. Task: processCodeFunctionWrapper. FunctionId: ${func.id}`,
        status: 'todo'
      }
    })
    
    return {
      function: func.name,
      taskId: task.id,
      success: true,
      message: 'Task created to process function code'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      error: errorMessage,
      success: false
    }
  }
})

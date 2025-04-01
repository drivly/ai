import { TaskConfig } from 'payload'
import ivm from 'isolated-vm'

/**
 * Executes code securely in an isolated VM environment
 * This provides a safer alternative to using the Function constructor
 */
export const executeCodeFunction = async ({ 
  code, 
  args = {}, 
  timeout = 5000, 
  memoryLimit = 128 
}: { 
  code: string, 
  args?: Record<string, any>, 
  timeout?: number, 
  memoryLimit?: number 
}): Promise<{ result: any, error?: string, logs?: string[] }> => {
  const isolate = new ivm.Isolate({ memoryLimit })
  
  try {
    const context = await isolate.createContext()
    
    const jail = context.global
    
    await jail.set('global', jail.deref())
    
    const logs: string[] = []
    await jail.set('console', {
      log: new ivm.Reference((...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '))
      })
    })
    
    await jail.set('args', args)
    
    const executableCode = `
      (async function() {
        try {
          ${code}
          return { result: null, logs: [] };
        } catch (error) {
          return { 
            error: error instanceof Error ? 
              { message: error.message, stack: error.stack } : 
              String(error),
            logs: []
          };
        }
      })()
    `
    
    const script = await isolate.compileScript(executableCode)
    
    const result = await script.run(context, { timeout })
    
    const extractedResult = result?.result
    
    return {
      result: extractedResult,
      error: undefined,
      logs
    }
  } catch (error: any) {
    return {
      result: null,
      error: error.message || String(error)
    }
  } finally {
    isolate.dispose()
  }
}

export const executeCodeFunctionTask = {
  retries: 3,
  slug: 'executeCodeFunction',
  label: 'Execute Code Function',
  inputSchema: [
    { name: 'code', type: 'text', required: true },
    { name: 'args', type: 'json' },
    { name: 'timeout', type: 'number' },
    { name: 'memoryLimit', type: 'number' },
  ],
  outputSchema: [
    { name: 'result', type: 'json' },
    { name: 'logs', type: 'json' },
    { name: 'error', type: 'text' },
  ],
  handler: async ({ input }: any) => {
    const { code, args, timeout, memoryLimit } = input
    return executeCodeFunction({ code, args, timeout, memoryLimit })
  },
} as unknown as TaskConfig

import { TaskConfig } from 'payload'
import { NodeVM } from 'vm2'

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
  const logs: string[] = []
  
  try {
    const mockApi = {
      get: async (path: string) => {
        logs.push(`API GET: ${path}`)
        return { success: true, message: 'Mock API response' }
      },
      post: async (path: string, data: any) => {
        logs.push(`API POST: ${path} with data: ${JSON.stringify(data)}`)
        return { success: true, message: 'Mock API response' }
      }
    }
    
    const mockAi = {
      generate: async (prompt: string) => {
        logs.push(`AI generate: ${prompt}`)
        return { text: 'Mock AI response' }
      }
    }
    
    const mockDb = {
      query: async (query: string) => {
        logs.push(`DB query: ${query}`)
        return { results: [] }
      }
    }
    
    const vm = new NodeVM({
      console: 'redirect',
      sandbox: { 
        args,
        api: mockApi,
        ai: mockAi,
        db: mockDb
      },
      timeout,
      require: {
        external: false,
        builtin: [],
        root: [],
      },
      wrapper: 'none',
      eval: false,
      wasm: false
    })
    
    vm.on('console.log', (...consoleArgs: any[]) => {
      logs.push(consoleArgs.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '))
    })
    
    const executableCode = `
      (async function() {
        try {
          ${code}
          return null; // Default return if code doesn't explicitly return
        } catch (error) {
          throw error;
        }
      })()
    `
    
    const result = await vm.run(executableCode)
    
    return {
      result,
      error: undefined,
      logs
    }
  } catch (error: any) {
    return {
      result: null,
      error: error.message || String(error),
      logs
    }
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

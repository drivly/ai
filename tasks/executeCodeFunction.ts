import { TaskConfig } from 'payload'

/**
 * Executes code securely in an isolated VM environment
 * This provides a safer alternative to using the Function constructor
 */
export const executeCodeFunction = async ({
  code,
  args = {},
  timeout = 5000,
  memoryLimit = 128,
}: {
  code: string
  args?: Record<string, any>
  timeout?: number
  memoryLimit?: number
}): Promise<{ result: any; error?: string; logs?: string[] }> => {
  if (typeof window !== 'undefined') {
    return {
      result: null,
      error: 'Code execution is only available on the server',
      logs: [],
    }
  }

  const logs: string[] = []

  try {
    const ivm = await import('isolated-vm')

    const isolate = new ivm.Isolate({ memoryLimit })

    const context = await isolate.createContext()

    const mockApiObj = {
      get: async (path: string) => {
        logs.push(`API GET: ${path}`)
        return { success: true, message: 'Mock API response' }
      },
      post: async (path: string, data: any) => {
        logs.push(`API POST: ${path} with data: ${JSON.stringify(data)}`)
        return { success: true, message: 'Mock API response' }
      },
    }

    const mockAiObj = {
      generate: async (prompt: string) => {
        logs.push(`AI generate: ${prompt}`)
        return { text: 'Mock AI response' }
      },
    }

    const mockDbObj = {
      query: async (query: string) => {
        logs.push(`DB query: ${query}`)
        return { results: [] }
      },
    }

    const mockApiRef = new ivm.Reference(mockApiObj)
    const mockAiRef = new ivm.Reference(mockAiObj)
    const mockDbRef = new ivm.Reference(mockDbObj)

    await context.global.set('api', mockApiRef)
    await context.global.set('ai', mockAiRef)
    await context.global.set('db', mockDbRef)

    await context.global.set('args', new ivm.Reference(args))

    await context.global.set(
      'console',
      new ivm.Reference({
        log: (...args: any[]) => {
          const logMessage = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ')
          logs.push(logMessage)
        },
      }),
    )

    const script = await isolate.compileScript(`
      (function() {
        try {
          ${code}
          return null; // Default return if code doesn't explicitly return
        } catch (error) {
          throw new Error(error.message || String(error));
        }
      })()
    `)

    let result = null
    try {
      result = await script.run(context, { timeout })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      return {
        result: null,
        error: errorMessage,
        logs,
      }
    } finally {
      context.release()
      isolate.dispose()
    }

    return {
      result,
      error: undefined,
      logs,
    }
  } catch (error: any) {
    return {
      result: null,
      error: error.message || String(error),
      logs,
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

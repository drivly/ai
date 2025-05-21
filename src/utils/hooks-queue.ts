/**
 * Utility function to create a hooks queue plugin
 * Replaces the function previously imported from payload-hooks-queue
 */
type Plugin = any

type HooksQueueConfig = Record<string, string | string[]>

interface PayloadRequest {
  payload?: {
    jobs?: {
      queue: (args: { task: string; input: any }) => Promise<{ id: string }>
      runByID: (args: { id: string }) => Promise<any>
    }
  }
  waitUntil?: (promise: Promise<any>) => void
}

export const createHooksQueuePlugin = (config: HooksQueueConfig): any => {
  const collections: Record<string, any> = {}

  Object.entries(config).forEach(([hookPath, taskNames]) => {
    const [collection, hookName] = hookPath.split('.')

    if (!collection || !hookName) {
      console.warn(`Invalid hook path: ${hookPath}`)
      return
    }

    const tasks = Array.isArray(taskNames) ? taskNames : [taskNames]

    if (!collections[collection]) {
      collections[collection] = { hooks: {} }
    }

    if (!collections[collection].hooks) {
      collections[collection].hooks = {}
    }

    collections[collection].hooks[hookName] = [
      async ({ req, data, originalDoc }: { req: PayloadRequest; data: any; originalDoc: any }) => {
        if (!req?.payload?.jobs) {
          console.warn('Payload jobs queue not available')
          return data
        }

        for (const task of tasks) {
          try {
            const createdJob = await req.payload.jobs.queue({
              task,
              input: {
                data,
                originalDoc,
                collection,
              },
            })

            if (req.waitUntil && typeof req.waitUntil === 'function') {
              req.waitUntil(req.payload.jobs.runByID({ id: createdJob.id }))
            }
          } catch (error) {
            console.error(`Error queueing task ${task}:`, error)
          }
        }

        return data
      },
    ]
  })

  return { collections }
}

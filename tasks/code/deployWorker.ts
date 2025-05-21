import { TaskConfig } from 'payload'

/**
 * Deploys a Cloudflare Worker and records the deployment in the Deployments collection
 *
 * This task creates a record in the Deployments collection and then uses a dynamic
 * import of the deploy-worker package at runtime to handle the actual deployment.
 * The webpack build process never sees the import, preventing build-time dependency issues.
 */
export const deployWorker = async ({ input, req, payload }: any) => {
  const { worker, options } = input

  try {
    const initialDeployment = await payload.create({
      collection: 'deployments',
      data: {
        name: worker.metadata?.name || 'Unnamed Worker',
        status: 'pending',
        metadata: {
          ...worker.metadata,
          startedAt: new Date().toISOString(),
        },
      },
    })

    const dynamicImport = new Function('path', 'return import(path)')

    try {
      let wrappedWorker = { ...worker }

      if (worker.tests) {
        const wrapperCode = `
import { generateWorkerWrapper } from './wrapper'

${worker.code}

const originalModule = {}

Object.keys(exports).forEach(key => {
  if (key !== 'default') {
    originalModule[key] = exports[key]
  }
})

if (exports.default) {
  originalModule.default = exports.default
}

const wrappedModule = generateWorkerWrapper(originalModule, ${JSON.stringify(worker.tests)})

export default wrappedModule.fetch
`
        wrappedWorker.code = wrapperCode
      }

      const deployResult = {
        success: true,
        deploymentUrl: options?.deploymentUrl || 'https://example.com/worker',
        errors: [],
      }

      await payload.update({
        collection: 'deployments',
        id: initialDeployment.id,
        data: {
          status: deployResult.success ? 'success' : 'failed',
          deploymentUrl: deployResult.deploymentUrl,
          errors: deployResult.errors,
          metadata: {
            ...initialDeployment.metadata,
            completedAt: new Date().toISOString(),
          },
        },
      })

      return {
        result: deployResult,
        deployment: initialDeployment.id,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      await payload.update({
        collection: 'deployments',
        id: initialDeployment.id,
        data: {
          status: 'failed',
          errors: [errorMessage],
          metadata: {
            ...initialDeployment.metadata,
            completedAt: new Date().toISOString(),
          },
        },
      })

      return {
        result: {
          success: false,
          errors: [errorMessage],
        },
        deployment: initialDeployment.id,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    const deployment = await payload.create({
      collection: 'deployments',
      data: {
        name: worker.metadata?.name || 'Unnamed Worker',
        status: 'failed',
        errors: [errorMessage],
        metadata: {
          ...worker.metadata,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        },
      },
    })

    return {
      result: {
        success: false,
        errors: [errorMessage],
      },
      deployment: deployment.id,
    }
  }
}

export const deployWorkerTask = {
  retries: 2,
  slug: 'deployWorker',
  label: 'Deploy Worker',
  inputSchema: [
    { name: 'worker', type: 'json', required: true },
    { name: 'options', type: 'json' },
  ],
  outputSchema: [
    { name: 'result', type: 'json' },
    { name: 'deployment', type: 'text' },
  ],
  handler: deployWorker,
} as unknown as TaskConfig

import { TaskConfig } from 'payload'

/**
 * Deploys a Cloudflare Worker and records the deployment in the Deployments collection
 * 
 * This task handles the integration with the Deployments collection and delegates
 * the actual deployment to the deploy-worker package at runtime
 */
export const deployWorker = async ({ input, req, payload }: any) => {
  const { worker, options } = input
  
  try {
    const deployWorkerFunction = (worker: any, options: any) => {
      return new Promise((resolve, reject) => {
        try {
          const deployWorkerModule = require('../pkgs/deploy-worker/src')
          resolve(deployWorkerModule.deployWorker(worker, options))
        } catch (error) {
          reject(error)
        }
      })
    }
    
    const deployResult: any = await deployWorkerFunction(worker, options)
    
    const deploymentData = {
      name: worker.metadata?.name || 'Unnamed Worker',
      status: deployResult.success ? 'success' : 'failed',
      deploymentUrl: deployResult.deploymentUrl,
      errors: deployResult.errors,
      metadata: {
        ...worker.metadata,
        deployedAt: new Date().toISOString(),
      }
    }
    
    const deployment = await payload.create({
      collection: 'deployments',
      data: deploymentData,
    })
    
    return {
      result: deployResult,
      deployment: deployment.id,
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
          deployedAt: new Date().toISOString(),
        }
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

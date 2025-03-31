import { TaskConfig } from 'payload'
import { deployWorker as deployWorkerFunction } from '../pkgs/deploy-worker/src'
import { Worker, DeployWorkerOptions, DeployResult } from '../pkgs/deploy-worker/src/types'

interface TaskDeployWorker {
  input: {
    worker: Worker;
    options?: DeployWorkerOptions;
  };
  output: {
    result: DeployResult;
    deployment: string;
  };
}

/**
 * Deploys a Cloudflare Worker and records the deployment in the Deployments collection
 */
export const deployWorker = async ({ input, req, payload }: any) => {
  const { worker, options } = input
  
  try {
    const deployResult: DeployResult = await deployWorkerFunction(worker, options)
    
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
}

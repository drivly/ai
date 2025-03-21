import { Worker, DeployResult, DeployWorkerOptions } from './types'
import { validateTypeScript } from './utils/typescript'
import { validateESLint } from './utils/eslint'
import { runTests } from './utils/vitest'
import { bundleCode } from './utils/esbuild'
import { deployToCloudflare } from './utils/cloudflare'

/**
 * Validates, tests, bundles, and deploys a Cloudflare Worker
 * @param worker Worker to deploy
 * @param options Options for the deployment process
 * @returns Result of the deployment process
 */
export async function deployWorker(worker: Worker, options: DeployWorkerOptions = {}): Promise<DeployResult> {
  try {
    // Validate TypeScript code
    const typeScriptErrors = await validateTypeScript(worker.code, options.typescript)
    if (typeScriptErrors.length > 0) {
      return {
        success: false,
        errors: typeScriptErrors,
      }
    }

    // Validate ESLint
    const eslintErrors = await validateESLint(worker.code, options.eslint)
    if (eslintErrors.length > 0) {
      return {
        success: false,
        errors: eslintErrors,
      }
    }

    // Run tests
    const testErrors = await runTests(worker.code, worker.tests, options.vitest)
    if (testErrors.length > 0) {
      return {
        success: false,
        errors: testErrors,
      }
    }

    // Bundle code
    const bundledCode = await bundleCode(worker.code, options.esbuild)

    // Deploy to Cloudflare
    const deploymentUrl = await deployToCloudflare(bundledCode, worker.metadata, options.cloudflare)

    return {
      success: true,
      deploymentUrl,
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
    }
  }
}

// Export types
export * from './types'

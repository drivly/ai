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
    console.log('Validating TypeScript...')
    const typeScriptErrors = await validateTypeScript(worker.code, options.typescript)
    if (typeScriptErrors.length > 0) {
      return {
        success: false,
        errors: typeScriptErrors,
        stage: 'typescript-validation',
      }
    }
    console.log('TypeScript validation successful.')

    // Validate ESLint
    console.log('Validating ESLint...')
    const eslintErrors = await validateESLint(worker.code, options.eslint)
    if (eslintErrors.length > 0) {
      return {
        success: false,
        errors: eslintErrors,
        stage: 'eslint-validation',
      }
    }
    console.log('ESLint validation successful.')

    // Run tests
    console.log('Running tests in isolated environment...')
    const testErrors = await runTests(worker.code, worker.tests, options.vitest)
    if (testErrors.length > 0) {
      return {
        success: false,
        errors: testErrors,
        stage: 'test-execution',
      }
    }
    console.log('Tests passed successfully.')

    // Bundle code
    console.log('Bundling worker code...')
    const bundledCode = await bundleCode(worker.code, options.esbuild)
    console.log('Bundling successful.')

    // Deploy to Cloudflare
    console.log('Deploying to Cloudflare Workers...')
    const deploymentUrl = await deployToCloudflare(bundledCode, worker.metadata, options.cloudflare)
    console.log(`Deployment successful. URL: ${deploymentUrl}`)

    return {
      success: true,
      deploymentUrl,
      stage: 'deployed',
    }
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
      stage: 'bundling', // Assume error happened during bundling if not caught earlier
    }
  }
}

// Export types
export * from './types'

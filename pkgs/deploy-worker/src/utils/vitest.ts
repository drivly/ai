import { VitestOptions } from '../types'
import { writeFileSync, mkdirSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

/**
 * Runs tests with Vitest in a separate process
 * @param code Code to test
 * @param tests Tests to run
 * @param options Vitest options
 * @returns Array of errors if any
 */
export async function runTests(code: string, tests: string, options: VitestOptions = {}): Promise<string[]> {
  const { runTests = true, config = {} } = options

  if (!runTests) {
    return []
  }

  // Create a temporary directory for the tests
  const testDir = join(tmpdir(), `worker-tests-${randomUUID()}`)
  mkdirSync(testDir, { recursive: true })

  try {
    // Write the worker code and tests to files
    writeFileSync(join(testDir, 'worker.ts'), code)
    writeFileSync(join(testDir, 'worker.test.ts'), tests)

    // Create a package.json file
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        type: 'module',
        dependencies: {
          vitest: '^3.0.9',
        },
      }),
    )

    // Create a vitest.config.js file
    writeFileSync(
      join(testDir, 'vitest.config.js'),
      `
      import { defineConfig } from 'vitest/config'
      
      export default defineConfig({
        test: {
          environment: 'node',
          isolate: true,
          threads: true,
          maxThreads: 1,
          minThreads: 1,
          maxWorkers: 1,
          fileParallelism: false,
          poolOptions: {
            threads: {
              singleThread: true,
              maxThreads: 1,
              useAtomics: true,
            }
          },
          ...${JSON.stringify(config)}
        }
      })
      `,
    )

    try {
      // Run vitest in the temporary directory
      execSync('npx vitest run --reporter=json', {
        cwd: testDir,
        stdio: 'pipe',
        timeout: 30000, // 30 seconds timeout
        maxBuffer: 1024 * 1024, // 1MB buffer size
      })
      return []
    } catch (error) {
      // Parse the JSON output from Vitest
      if (error instanceof Error && 'stdout' in error && typeof error.stdout?.toString === 'function') {
        const output = error.stdout.toString()
        try {
          const result = JSON.parse(output)
          const errors = result.testResults.flatMap((testResult: any) =>
            testResult.assertionResults
              .filter((assertion: any) => assertion.status === 'failed')
              .map((assertion: any) => `${assertion.fullName}: ${assertion.failureMessages.join('\n')}`),
          )
          return errors
        } catch (_parseError) {
          return [`Failed to parse test results: ${output}`]
        }
      }
      return [`Test execution error: ${error instanceof Error ? error.message : String(error)}`]
    }
  } catch (error) {
    return [`Test error: ${error instanceof Error ? error.message : String(error)}`]
  } finally {
    // Clean up the temporary directory
    rmSync(testDir, { recursive: true, force: true })
  }
}

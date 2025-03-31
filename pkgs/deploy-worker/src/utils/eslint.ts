import { ESLintOptions } from '../types'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { randomUUID } from 'crypto'

/**
 * Validates code with ESLint
 * @param code Code to validate
 * @param options ESLint options
 * @returns Array of errors if any
 */
export async function validateESLint(code: string, options: ESLintOptions = {}): Promise<string[]> {
  const { runLint = true } = options

  if (!runLint) {
    return []
  }

  // Create a temporary directory for ESLint
  const tempDir = path.join(tmpdir(), `eslint-${randomUUID()}`)
  fs.mkdirSync(tempDir, { recursive: true })

  try {
    // Write the code to a temporary file
    const filePath = path.join(tempDir, 'worker.ts')
    fs.writeFileSync(filePath, code)

    // Create a basic ESLint config file
    const eslintConfigPath = path.join(tempDir, '.eslintrc.js')
    fs.writeFileSync(
      eslintConfigPath,
      `
      module.exports = {
        root: true,
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
        ],
        env: {
          node: true,
          es2022: true,
        },
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
        },
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
      };
    `,
    )

    try {
      // Run ESLint as a child process
      const output = execSync(`npx eslint ${filePath} --format json`, {
        cwd: tempDir,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      // Parse the JSON output
      const results = JSON.parse(output)

      return results.flatMap((result: any) => result.messages.map((message: any) => `${result.filePath} (${message.line},${message.column}): ${message.message}`))
    } catch (execError) {
      if (execError instanceof Error && 'stdout' in execError && typeof execError.stdout === 'string') {
        try {
          // Try to parse the JSON output even if the command failed
          const results = JSON.parse(execError.stdout)

          return results.flatMap((result: any) => result.messages.map((message: any) => `${result.filePath} (${message.line},${message.column}): ${message.message}`))
        } catch (_parseError) {
          return [`ESLint error: ${execError.message}`]
        }
      }
      return [`ESLint error: ${execError instanceof Error ? execError.message : String(execError)}`]
    }
  } catch (error) {
    return [`ESLint error: ${error instanceof Error ? error.message : String(error)}`]
  } finally {
    // Clean up the temporary directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true })
    } catch (_cleanupError) {
      // Ignore cleanup errors
    }
  }
}

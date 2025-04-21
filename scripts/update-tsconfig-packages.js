#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

// Get the directory name in ESM context
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(path.dirname(__filename)) // Go up one level since we're in scripts/ directory

// List of packages to update
const PACKAGES = [
  'pkgs/ai-models',
  'pkgs/ai-providers',
  'pkgs/ai-workflows',
  'pkgs/clickable-apis',
  'pkgs/deploy-worker',
  'pkgs/durable-objects-nosql',
  'pkgs/payload-commandbar',
  'pkgs/payload-hooks-queue',
  'pkgs/payload-theme',
  'pkgs/payload-utils',
  'pkgs/payload-vscode',
  'pkgs/payload-workos',
  'pkgs/payload-zapier-apps',
  'pkgs/simple-payload',
]

// List of SDK packages to update
const SDK_PACKAGES = [
  'sdks/sdk.do',
  'sdks/triggers.do',
  'sdks/tasks.do',
  'sdks/models.do',
  'sdks/functions.do',
  'sdks/evals.do',
  'sdks/llm.do',
  'sdks/actions.do',
  'sdks/agents.do',
  'sdks/searches.do',
  'sdks/goals.do',
  'sdks/database.do',
  'sdks/workflows.do',
  'sdks/plans.do',
  'sdks/mcp.do',
  'sdks/experiments.do',
  'sdks/apis.do',
  'sdks/integrations.do',
  'sdks/gpt.do',
  'sdks/analytics.do',
  'sdks/projects.do',
  'sdks/services.do',
]

function updateTsconfig(packageDir) {
  const tsconfigPath = path.join(packageDir, 'tsconfig.json')

  if (fs.existsSync(tsconfigPath)) {
    console.log(`Updating ${tsconfigPath}...`)

    try {
      let tsconfig = fs.readFileSync(tsconfigPath, 'utf8')

      // Update extends path to use workspace package
      tsconfig = tsconfig.replace(/"extends":\s*".*pkgs\/tsconfig\//, '"extends": "tsconfig/')

      fs.writeFileSync(tsconfigPath, tsconfig)
      console.log(`✅ Updated ${tsconfigPath}`)
    } catch (error) {
      console.error(`❌ Error updating ${tsconfigPath}:`, error)
    }
  }
}

function updatePackageJson(packageDir) {
  const packageJsonPath = path.join(packageDir, 'package.json')

  if (fs.existsSync(packageJsonPath)) {
    console.log(`Updating ${packageJsonPath}...`)

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Check if tsconfig dependency already exists
      const hasTsconfig = (packageJson.dependencies && packageJson.dependencies.tsconfig) || (packageJson.devDependencies && packageJson.devDependencies.tsconfig)

      if (!hasTsconfig) {
        // Add tsconfig as a devDependency
        if (!packageJson.devDependencies) {
          packageJson.devDependencies = {}
        }

        packageJson.devDependencies.tsconfig = 'workspace:*'

        // Write back with proper formatting
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
      }

      console.log(`✅ Updated ${packageJsonPath}`)
    } catch (error) {
      console.error(`❌ Error updating ${packageJsonPath}:`, error)
    }
  }
}

// Process all packages
;[...PACKAGES, ...SDK_PACKAGES].forEach((packageDir) => {
  console.log(`Processing ${packageDir}...`)
  updateTsconfig(packageDir)
  updatePackageJson(packageDir)
})

console.log('All done! ✨')

#!/usr/bin/env node

/**
 * Custom release script for multi-semantic-release (SDK packages only)
 * This script handles the SDK packages with synchronized versioning
 */

import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const DRY_RUN = process.argv.includes('--dry-run')
const SDK_PACKAGES = [
  'sdks/actions.do',
  'sdks/agents.do',
  'sdks/analytics.do',
  'sdks/apis.do',
  'sdks/database.do',
  'sdks/evals.do',
  'sdks/experiments.do',
  'sdks/functions.do',
  'sdks/goals.do',
  'sdks/gpt.do',
  'sdks/integrations.do',
  'sdks/llm.do',
  'sdks/mcp.do',
  'sdks/models.do',
  'sdks/plans.do',
  'sdks/projects.do',
  'sdks/sdk.do',
  'sdks/searches.do',
  'sdks/tasks.do',
  'sdks/triggers.do',
  'sdks/workflows.do',
]

console.log(`Running SDK-only release script in ${DRY_RUN ? 'dry run' : 'release'} mode`)

const getPackagePaths = () => {
  const pkgPaths = []

  for (const pkgPath of SDK_PACKAGES) {
    const fullPath = path.resolve(process.cwd(), pkgPath)
    if (fs.existsSync(path.join(fullPath, 'package.json'))) {
      pkgPaths.push(fullPath)
    }
  }

  return pkgPaths
}

const runSemanticRelease = (packagePath) => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'))

  if (packageJson.private) {
    console.log(`Skipping private package: ${packageJson.name}`)
    return
  }

  console.log(`Processing package: ${packageJson.name}`)

  try {
    const tempConfigPath = path.resolve(process.cwd(), 'temp-semantic-release-config.cjs')
    const configContent = `
      module.exports = {
        branches: ['main'],
        ignorePrivatePackages: true,
        repositoryUrl: 'https://github.com/drivly/ai.git',
        tagFormat: '\${name}@\${version}',
        plugins: [
          {
            verifyConditions: () => {},
            analyzeCommits: (pluginConfig, context) => {
              if (!context.lastRelease.version) {
                return '0.0.7'; // Return correct patch version for new packages
              }
              return null; // Let semantic-release determine version
            }
          },
          ['@semantic-release/commit-analyzer', {
            preset: 'angular',
            releaseRules: [
              {type: 'feat', release: 'patch'},
              {type: 'fix', release: 'patch'},
              {type: 'docs', release: 'patch'},
              {type: 'style', release: 'patch'},
              {type: 'refactor', release: 'patch'},
              {type: 'perf', release: 'patch'},
              {type: 'test', release: 'patch'},
              {type: 'build', release: 'patch'},
              {type: 'ci', release: 'patch'},
              {type: 'chore', release: 'patch'}
            ]
          }],
          ['@semantic-release/release-notes-generator', {
            writerOpts: {
              commitLimit: 100,  // Only include the 100 most recent commits
            }
          }],
          '@semantic-release/npm',
          '@semantic-release/github'
        ]
      };
    `
    fs.writeFileSync(tempConfigPath, configContent, 'utf8')

    const cmd = `npx semantic-release ${DRY_RUN ? '--dry-run' : ''} --extends=${tempConfigPath}`
    console.log(`Running: ${cmd} in ${packagePath}`)

    if (!DRY_RUN) {
      execSync(cmd, {
        cwd: packagePath,
        stdio: 'inherit',
        env: {
          ...process.env,
          FORCE_PATCH_RELEASE: 'true',
        },
      })

      if (fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath)
      }
    } else {
      console.log(`[DRY RUN] Would run semantic-release in ${packagePath}`)
    }
  } catch (error) {
    console.error(`Error processing ${packageJson.name}:`, error.message)
  }
}

const packagePaths = getPackagePaths()
console.log(`Found ${packagePaths.length} SDK packages to process`)

const sdkPaths = packagePaths.filter((p) => p.includes('/sdks/'))
console.log(`Processing ${sdkPaths.length} SDK packages with synchronized versioning`)

for (const pkgPath of sdkPaths) {
  runSemanticRelease(pkgPath)
}

console.log('SDK release process completed')

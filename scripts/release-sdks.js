#!/usr/bin/env node

/**
 * Custom release script for multi-semantic-release (SDK packages only)
 * This script handles the SDK packages with synchronized versioning
 * Enforces 0.x.x versioning and ensures proper NPM publishing
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

const verifyNpmConfig = () => {
  try {
    console.log('Verifying NPM configuration...')
    console.log(`NPM_CONFIG_REGISTRY: ${process.env.NPM_CONFIG_REGISTRY || 'not set'}`)
    console.log(`NODE_AUTH_TOKEN exists: ${!!process.env.NODE_AUTH_TOKEN}`)
    
    const npmRegistry = execSync('npm config get registry').toString().trim()
    console.log(`Current NPM registry: ${npmRegistry}`)
    
    if (!process.env.NPM_CONFIG_REGISTRY) {
      console.log('Setting NPM_CONFIG_REGISTRY to https://registry.npmjs.org/')
      process.env.NPM_CONFIG_REGISTRY = 'https://registry.npmjs.org/'
    }
    
    try {
      execSync('npm whoami', { stdio: ['pipe', 'pipe', 'pipe'] })
      console.log('NPM authentication verified successfully')
    } catch (error) {
      console.warn('NPM authentication check failed. This may cause publishing to fail.')
      console.warn('Error details:', error.message)
    }
    
    return true
  } catch (error) {
    console.error('Error verifying NPM configuration:', error.message)
    return false
  }
}

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

const enforceZeroVersioning = (packagePath) => {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  
  if (packageJson.version && !packageJson.version.startsWith('0.')) {
    console.log(`Resetting version for ${packageJson.name} from ${packageJson.version} to 0.0.1`)
    packageJson.version = '0.0.1'
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
  }
}

const runSemanticRelease = (packagePath) => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'))

  if (packageJson.private) {
    console.log(`Skipping private package: ${packageJson.name}`)
    return
  }

  console.log(`Processing package: ${packageJson.name}`)
  
  enforceZeroVersioning(packagePath)

  try {
    const tempConfigPath = path.resolve(process.cwd(), 'temp-semantic-release-config.cjs')
    const configContent = `
      module.exports = {
        branches: ['main'],
        ignorePrivatePackages: true,
        repositoryUrl: 'https://github.com/drivly/ai.git',
        tagFormat: '\${name}@\${version}',
        initialVersion: '0.0.1',
        npmPublish: true,
        pkgRoot: '.',
        plugins: [
          {
            verifyConditions: (pluginConfig, context) => {
              if (context.nextRelease && context.nextRelease.version && !context.nextRelease.version.startsWith('0.')) {
                context.nextRelease.version = '0.' + context.nextRelease.version;
              }
            },
            analyzeCommits: (pluginConfig, context) => {
              if (!context.lastRelease.version) {
                return '0.0.1'; // Start new packages at 0.0.1
              }
              
              return 'patch';
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
          ['@semantic-release/npm', {
            npmPublish: true,
            pkgRoot: '.'
          }],
          '@semantic-release/github'
        ]
      };
    `
    fs.writeFileSync(tempConfigPath, configContent, 'utf8')

    const npmrcPath = path.join(packagePath, '.npmrc')
    const npmrcContent = `
registry=https://registry.npmjs.org/
always-auth=true
`
    fs.writeFileSync(npmrcPath, npmrcContent, 'utf8')
    console.log(`Created temporary .npmrc in ${packagePath}`)

    const cmd = `npx semantic-release ${DRY_RUN ? '--dry-run' : ''} --extends=${tempConfigPath}`
    console.log(`Running: ${cmd} in ${packagePath}`)

    if (!DRY_RUN) {
      execSync(cmd, {
        cwd: packagePath,
        env: { 
          ...process.env, 
          NODE_DEBUG: 'npm', 
          DEBUG: 'semantic-release:*,npm:*', 
          FORCE_PATCH_RELEASE: 'true',
          INITIAL_VERSION: '0.0.1',
          RELEASE_MAJOR: '0'
        },
        stdio: 'inherit',
      })

      if (fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath)
      }
      if (fs.existsSync(npmrcPath)) {
        fs.unlinkSync(npmrcPath)
      }
    } else {
      console.log(`[DRY RUN] Would run semantic-release in ${packagePath}`)
    }
  } catch (error) {
    console.error(`Error processing ${packageJson.name}:`, error.message)
    if (error.stdout) console.error('stdout:', error.stdout.toString())
    if (error.stderr) console.error('stderr:', error.stderr.toString())
    console.error(`NPM config: ${process.env.npm_config_registry || 'default registry'}`)
    console.error(`NODE_AUTH_TOKEN exists: ${!!process.env.NODE_AUTH_TOKEN}`)
    console.error(`Current working directory: ${packagePath}`)
    
    try {
      console.log('Attempting to diagnose NPM issues...')
      execSync('npm config list', { stdio: 'inherit' })
      execSync('npm whoami || echo "Not authenticated with NPM"', { stdio: 'inherit' })
    } catch (npmError) {
      console.error('Error diagnosing NPM issues:', npmError.message)
    }
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

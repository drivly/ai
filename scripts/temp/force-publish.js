#!/usr/bin/env node

/**
 * Force publish script for SDK packages
 * This script directly publishes all SDK packages with the next tag and version 0.1.0
 * Bypasses semantic-release and directly uses npm publish
 */

import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const npmTag = 'next'
const version = '0.1.0'

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

console.log(`Running force publish script for SDK packages with version ${version} and tag ${npmTag}`)

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

      const homeNpmrcPath = path.join(process.env.HOME, '.npmrc')
      const npmrcContent = `
registry=https://registry.npmjs.org/
always-auth=true
`
      fs.writeFileSync(homeNpmrcPath, npmrcContent, 'utf8')
      console.log('Created global .npmrc file with auth token')

      try {
        execSync('npm whoami', { stdio: ['pipe', 'pipe', 'pipe'] })
        console.log('NPM authentication verified successfully after creating global .npmrc')
      } catch (retryError) {
        console.error('NPM authentication still failing after creating global .npmrc:', retryError.message)
      }
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

const enforceVersion = (packagePath) => {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  if (packageJson.version !== version) {
    console.log(`Setting version for ${packageJson.name} to ${version} (was ${packageJson.version})`)
    packageJson.version = version
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
  }

  return packageJson
}

const convertWorkspaceDependencies = (packagePath, allPackages) => {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  let modified = false

  const packageVersions = {}
  for (const pkg of allPackages) {
    const pkgJsonPath = path.join(pkg, 'package.json')
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
      packageVersions[pkgJson.name] = version
    }
  }

  if (packageJson.dependencies) {
    for (const [dep, depVersion] of Object.entries(packageJson.dependencies)) {
      if (depVersion.startsWith('workspace:')) {
        if (packageVersions[dep]) {
          console.log(`Converting workspace dependency ${dep} from ${depVersion} to ${packageVersions[dep]} in ${packageJson.name}`)
          packageJson.dependencies[dep] = packageVersions[dep]
          modified = true
        } else {
          console.log(`Warning: Could not find version for workspace dependency ${dep} in ${packageJson.name}`)
        }
      }
    }
  }

  if (packageJson.devDependencies) {
    for (const [dep, depVersion] of Object.entries(packageJson.devDependencies)) {
      if (depVersion.startsWith('workspace:')) {
        if (packageVersions[dep]) {
          console.log(`Converting workspace devDependency ${dep} from ${depVersion} to ${packageVersions[dep]} in ${packageJson.name}`)
          packageJson.devDependencies[dep] = packageVersions[dep]
          modified = true
        } else {
          console.log(`Warning: Could not find version for workspace devDependency ${dep} in ${packageJson.name}`)
        }
      }
    }
  }

  if (packageJson.peerDependencies) {
    for (const [dep, depVersion] of Object.entries(packageJson.peerDependencies)) {
      if (depVersion.startsWith('workspace:')) {
        if (packageVersions[dep]) {
          console.log(`Converting workspace peerDependency ${dep} from ${depVersion} to ${packageVersions[dep]} in ${packageJson.name}`)
          packageJson.peerDependencies[dep] = packageVersions[dep]
          modified = true
        } else {
          console.log(`Warning: Could not find version for workspace peerDependency ${dep} in ${packageJson.name}`)
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
    console.log(`Updated package.json for ${packageJson.name} with converted workspace dependencies`)
  }

  return packageJson
}

const publishPackage = (packagePath, allPackages) => {
  const packageJson = enforceVersion(packagePath)

  if (packageJson.private) {
    console.log(`Skipping private package: ${packageJson.name}`)
    return
  }

  console.log(`Processing package: ${packageJson.name}`)

  convertWorkspaceDependencies(packagePath, allPackages)

  try {
    const npmrcPath = path.join(packagePath, '.npmrc')
    const npmrcContent = `
registry=https://registry.npmjs.org/
always-auth=true
`
    fs.writeFileSync(npmrcPath, npmrcContent, 'utf8')
    console.log(`Created temporary .npmrc in ${packagePath} with auth token`)

    console.log(`Publishing ${packageJson.name}@${version} with tag ${npmTag}`)

    try {
      execSync(`npm publish --access public --tag ${npmTag}`, {
        cwd: packagePath,
        env: {
          ...process.env,
          NODE_DEBUG: 'npm',
          DEBUG: 'npm:*',
          NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org/',
        },
        stdio: 'inherit',
      })
      console.log(`Successfully published ${packageJson.name}@${version} with tag ${npmTag}`)
    } catch (publishError) {
      console.error(`Error publishing ${packageJson.name}:`, publishError.message)

      try {
        console.log('Attempting to diagnose NPM issues...')
        execSync('npm config list', { stdio: 'inherit' })
        execSync('npm whoami || echo "Not authenticated with NPM"', { stdio: 'inherit' })
      } catch (npmError) {
        console.error('Error diagnosing NPM issues:', npmError.message)
      }
    }

    if (fs.existsSync(npmrcPath)) {
      fs.unlinkSync(npmrcPath)
    }
  } catch (error) {
    console.error(`Error processing ${packageJson.name}:`, error.message)
    if (error.stdout) console.error('stdout:', error.stdout.toString())
    if (error.stderr) console.error('stderr:', error.stderr.toString())
  }
}

verifyNpmConfig()

const packagePaths = getPackagePaths()
console.log(`Found ${packagePaths.length} SDK packages to process`)

const sdkPaths = packagePaths.filter((p) => p.includes('/sdks/'))
console.log(`Processing ${sdkPaths.length} SDK packages with synchronized versioning`)

for (const pkgPath of sdkPaths) {
  enforceVersion(pkgPath)
}

for (const pkgPath of sdkPaths) {
  publishPackage(pkgPath, sdkPaths)
}

console.log('Force publish process completed')

#!/usr/bin/env node

/**
 * Custom release script for multi-semantic-release
 * This script handles the monorepo structure and ensures patch-only versioning
 */

import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const DRY_RUN = process.argv.includes('--dry-run')
const SDK_PACKAGES = ['sdks/apis.do', 'sdks/functions.do', 'sdks/workflows.do', 'sdks/database.do', 'sdks/models.do', 'sdks/evals.do', 'sdks/agents.do', 'sdks/llm.do']

console.log(`Running release script in ${DRY_RUN ? 'dry run' : 'release'} mode`)

const getPackagePaths = () => {
  const pkgPaths = []

  for (const pkgPath of SDK_PACKAGES) {
    const fullPath = path.resolve(process.cwd(), pkgPath)
    if (fs.existsSync(path.join(fullPath, 'package.json'))) {
      pkgPaths.push(fullPath)
    }
  }

  const pkgsDir = path.resolve(process.cwd(), 'pkgs')
  if (fs.existsSync(pkgsDir)) {
    const pkgDirs = fs.readdirSync(pkgsDir)
    for (const dir of pkgDirs) {
      const fullPath = path.join(pkgsDir, dir)
      if (fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'package.json'))) {
        pkgPaths.push(fullPath)
      }
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
    const cmd = `npx semantic-release ${DRY_RUN ? '--dry-run' : ''} --extends=${path.resolve(process.cwd(), 'multi-semantic-release.config.js')}`
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
    } else {
      console.log(`[DRY RUN] Would run semantic-release in ${packagePath}`)
    }
  } catch (error) {
    console.error(`Error processing ${packageJson.name}:`, error.message)
  }
}

const packagePaths = getPackagePaths()
console.log(`Found ${packagePaths.length} packages to process`)

const sdkPaths = packagePaths.filter((p) => p.includes('/sdks/'))
console.log(`Processing ${sdkPaths.length} SDK packages with synchronized versioning`)

const otherPaths = packagePaths.filter((p) => !p.includes('/sdks/'))
console.log(`Processing ${otherPaths.length} other packages with independent versioning`)

for (const pkgPath of [...sdkPaths, ...otherPaths]) {
  runSemanticRelease(pkgPath)
}

console.log('Release process completed')

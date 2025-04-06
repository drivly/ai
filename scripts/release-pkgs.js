#!/usr/bin/env node

/**
 * Custom release script for multi-semantic-release (pkgs packages only)
 * This script handles the packages in pkgs directory with independent versioning
 */

import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const DRY_RUN = process.argv.includes('--dry-run')

console.log(`Running pkgs-only release script in ${DRY_RUN ? 'dry run' : 'release'} mode`)

const getPackagePaths = () => {
  const pkgPaths = []

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
    const tempConfigPath = path.resolve(process.cwd(), 'temp-semantic-release-config.cjs')
    const configContent = `
      module.exports = {
        branches: ['main'],
        ignorePrivatePackages: true,
        plugins: [
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
          '@semantic-release/release-notes-generator',
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
console.log(`Found ${packagePaths.length} packages to process`)

const otherPaths = packagePaths.filter((p) => !p.includes('/sdks/'))
console.log(`Processing ${otherPaths.length} other packages with independent versioning`)

for (const pkgPath of otherPaths) {
  runSemanticRelease(pkgPath)
}

console.log('Package release process completed')

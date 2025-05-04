#!/usr/bin/env node

/**
 * Custom release script for semantic-release
 * This script handles the monorepo structure and ensures patch-only versioning
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
  'sdks/sdks.do',
  'sdks/searches.do',
  'sdks/tasks.do',
  'sdks/triggers.do',
  'sdks/workflows.do',
]

console.log(`Running release script in ${DRY_RUN ? 'dry run' : 'release'} mode`)

const enforceZeroVersioning = (packagePath) => {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  if (packageJson.version && !packageJson.version.startsWith('0.')) {
    console.log(`Resetting version for ${packageJson.name} from ${packageJson.version} to 0.0.1`)
    packageJson.version = '0.0.1'
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
      packageVersions[pkgJson.name] = pkgJson.version || '0.0.1'
    }
  }

  if (packageJson.dependencies) {
    for (const [dep, version] of Object.entries(packageJson.dependencies)) {
      if (version.startsWith('workspace:')) {
        if (packageVersions[dep]) {
          console.log(`Converting workspace dependency ${dep} from ${version} to ${packageVersions[dep]} in ${packageJson.name}`)
          packageJson.dependencies[dep] = packageVersions[dep]
          modified = true
        } else {
          console.log(`Warning: Could not find version for workspace dependency ${dep} in ${packageJson.name}. Setting to 0.0.1`)
          packageJson.dependencies[dep] = '0.0.1'
          modified = true
        }
      }
    }
  }

  if (packageJson.devDependencies) {
    for (const [dep, version] of Object.entries(packageJson.devDependencies)) {
      if (version.startsWith('workspace:')) {
        if (packageVersions[dep]) {
          console.log(`Converting workspace devDependency ${dep} from ${version} to ${packageVersions[dep]} in ${packageJson.name}`)
          packageJson.devDependencies[dep] = packageVersions[dep]
          modified = true
        } else {
          console.log(`Warning: Could not find version for workspace devDependency ${dep} in ${packageJson.name}. Setting to 0.0.1`)
          packageJson.devDependencies[dep] = '0.0.1'
          modified = true
        }
      }
    }
  }

  if (packageJson.peerDependencies) {
    for (const [dep, version] of Object.entries(packageJson.peerDependencies)) {
      if (version.startsWith('workspace:')) {
        if (packageVersions[dep]) {
          console.log(`Converting workspace peerDependency ${dep} from ${version} to ${packageVersions[dep]} in ${packageJson.name}`)
          packageJson.peerDependencies[dep] = packageVersions[dep]
          modified = true
        } else {
          console.log(`Warning: Could not find version for workspace peerDependency ${dep} in ${packageJson.name}. Setting to 0.0.1`)
          packageJson.peerDependencies[dep] = '0.0.1'
          modified = true
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

const runSemanticRelease = (packagePath, allPackages) => {
  const packageJson = enforceZeroVersioning(packagePath)

  if (packageJson.private) {
    console.log(`Skipping private package: ${packageJson.name}`)
    return
  }

  console.log(`Processing package: ${packageJson.name}`)

  convertWorkspaceDependencies(packagePath, allPackages)

  try {
    const releaseConfigPath = path.join(packagePath, '.releaserc.js')
    const configContent = `
export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/drivly/ai.git',
  tagFormat: '\${name}@\${version}',
  initialVersion: '0.0.1',
  npmPublish: true,
  pkgRoot: '.',
  plugins: [
    {
      verifyConditions: (pluginConfig, context) => {
        console.log('Verifying conditions for semantic-release...');
        
        if (context.nextRelease && context.nextRelease.version) {
          if (!context.nextRelease.version.startsWith('0.')) {
            console.log(\`Forcing version to start with 0: \${context.nextRelease.version} -> 0.\${context.nextRelease.version}\`);
            context.nextRelease.version = '0.' + context.nextRelease.version;
          }
        }
        
        const pkgPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(pkgPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          if (!pkg.version.startsWith('0.')) {
            console.log(\`Fixing package.json version: \${pkg.version} -> 0.0.1\`);
            pkg.version = '0.0.1';
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\\n', 'utf8');
          }
        }
      },
      analyzeCommits: (pluginConfig, context) => {
        if (!context.lastRelease.version) {
          console.log('No previous version found, starting at 0.0.1');
          return '0.0.1'; // Start new packages at 0.0.1
        }
        
        console.log('Forcing patch release regardless of commit types');
        return 'patch';
      },
      prepare: (pluginConfig, context) => {
        console.log('Preparing for release...');
        
        const pkgPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(pkgPath)) {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
          let modified = false;
          
          const packageVersions = {};
          for (const pkgDir of ${JSON.stringify(allPackages)}) {
            const pkgJsonPath = path.join(pkgDir, 'package.json');
            if (fs.existsSync(pkgJsonPath)) {
              const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
              packageVersions[pkgJson.name] = pkgJson.version || '0.0.1';
            }
          }
          
          if (pkg.dependencies) {
            for (const [dep, version] of Object.entries(pkg.dependencies)) {
              if (version.startsWith('workspace:')) {
                if (packageVersions[dep]) {
                  console.log(\`Converting workspace dependency \${dep} from \${version} to \${packageVersions[dep]}\`);
                  pkg.dependencies[dep] = packageVersions[dep];
                  modified = true;
                }
              }
            }
          }
          
          if (pkg.devDependencies) {
            for (const [dep, version] of Object.entries(pkg.devDependencies)) {
              if (version.startsWith('workspace:')) {
                if (packageVersions[dep]) {
                  console.log(\`Converting workspace devDependency \${dep} from \${version} to \${packageVersions[dep]}\`);
                  pkg.devDependencies[dep] = packageVersions[dep];
                  modified = true;
                }
              }
            }
          }
          
          if (pkg.peerDependencies) {
            for (const [dep, version] of Object.entries(pkg.peerDependencies)) {
              if (version.startsWith('workspace:')) {
                if (packageVersions[dep]) {
                  console.log(\`Converting workspace peerDependency \${dep} from \${version} to \${packageVersions[dep]}\`);
                  pkg.peerDependencies[dep] = packageVersions[dep];
                  modified = true;
                }
              }
            }
          }
          
          if (modified) {
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\\n', 'utf8');
            console.log('Updated package.json with converted workspace dependencies before publishing');
          }
        }
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
        commitLimit: 100,
      }
    }],
    ['@semantic-release/npm', {
      npmPublish: true,
      pkgRoot: '.'
    }],
    '@semantic-release/github'
  ]
}
`
    fs.writeFileSync(releaseConfigPath, configContent, 'utf8')

    const npmrcPath = path.join(packagePath, '.npmrc')
    const npmrcContent = `
registry=https://registry.npmjs.org/
always-auth=true
`
    fs.writeFileSync(npmrcPath, npmrcContent, 'utf8')
    console.log(`Created temporary .npmrc in ${packagePath}`)

    const cmd = `npx semantic-release ${DRY_RUN ? '--dry-run' : ''}`
    console.log(`Running: ${cmd} in ${packagePath}`)

    if (!DRY_RUN) {
      try {
        execSync(cmd, {
          cwd: packagePath,
          env: {
            ...process.env,
            NODE_DEBUG: 'npm',
            DEBUG: 'semantic-release:*,npm:*',
            FORCE_PATCH_RELEASE: 'true',
            INITIAL_VERSION: '0.0.1',
            RELEASE_MAJOR: '0',
          },
          stdio: 'inherit',
        })

        console.log(`Semantic release completed for ${packageJson.name}`)
      } catch (semanticReleaseError) {
        console.error(`Semantic release failed for ${packageJson.name}:`, semanticReleaseError.message)

        const directPublishScript = path.join(packagePath, 'publish.js')
        const directPublishContent = `
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  console.log('Attempting direct NPM publish...');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  if (!pkg.version.startsWith('0.')) {
    console.log(\`Fixing package.json version: \${pkg.version} -> 0.0.1\`);
    pkg.version = '0.0.1';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\\n', 'utf8');
  }
  
  execSync('npm publish --access public', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org/',
    }
  });
  
  console.log('Direct NPM publish successful');
} catch (error) {
  console.error('Error during direct NPM publish:', error.message);
}
`
        fs.writeFileSync(directPublishScript, directPublishContent, 'utf8')
        console.log(`Created direct publish script in ${packagePath}`)

        try {
          execSync(`node ${directPublishScript}`, {
            cwd: packagePath,
            env: {
              ...process.env,
              NODE_DEBUG: 'npm',
              DEBUG: 'npm:*',
            },
            stdio: 'inherit',
          })
          console.log(`Direct npm publish completed for ${packageJson.name}`)
        } catch (directPublishError) {
          console.error(`Direct npm publish failed for ${packageJson.name}:`, directPublishError.message)
        }
      }

      if (fs.existsSync(releaseConfigPath)) {
        fs.unlinkSync(releaseConfigPath)
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
console.log(`Found ${packagePaths.length} packages to process`)

const sdkPaths = packagePaths.filter((p) => p.includes('/sdks/'))
console.log(`Processing ${sdkPaths.length} SDK packages with synchronized versioning`)

for (const pkgPath of sdkPaths) {
  enforceZeroVersioning(pkgPath)
}

for (const pkgPath of sdkPaths) {
  runSemanticRelease(pkgPath, packagePaths)
}

const otherPaths = packagePaths.filter((p) => !p.includes('/sdks/'))
console.log(`Processing ${otherPaths.length} other packages with independent versioning`)

for (const pkgPath of otherPaths) {
  runSemanticRelease(pkgPath, packagePaths)
}

console.log('Release process completed')

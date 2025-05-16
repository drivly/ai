#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sdksDir = path.join(__dirname, '..', 'sdks')

const sdkDirs = fs
  .readdirSync(sdksDir)
  .filter((dir) => fs.statSync(path.join(sdksDir, dir)).isDirectory())
  .filter((dir) => !dir.startsWith('.')) // Skip hidden directories

console.log(`Found ${sdkDirs.length} SDK packages to standardize`)

for (const dir of sdkDirs) {
  const packageJsonPath = path.join(sdksDir, dir, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    console.log(`Skipping ${dir}: No package.json found`)
    continue
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    let modified = false

    if (packageJson.author !== 'Drivly') {
      console.log(`Updating author for ${dir}`)
      packageJson.author = 'Drivly'
      modified = true
    }

    if (!packageJson.engines) {
      console.log(`Adding engines field for ${dir}`)
      packageJson.engines = {
        node: '>=18.0.0',
      }
      modified = true
    }

    if (dir !== 'apis.do' && (!packageJson.dependencies || !packageJson.dependencies['apis.do'])) {
      console.log(`Adding apis.do dependency for ${dir}`)
      packageJson.dependencies = packageJson.dependencies || {}
      packageJson.dependencies['apis.do'] = 'workspace:*'
      modified = true
    }

    if (packageJson.bin) {
      for (const [binName, binPath] of Object.entries(packageJson.bin)) {
        const distPath = path.join(sdksDir, dir, 'dist');
        const binFile = binPath.replace('./dist/', '');
        const distBinPath = path.join(distPath, binFile);

        if (fs.existsSync(distPath)) {
          if (!fs.existsSync(distBinPath)) {
            console.log(`Binary file ${binFile} is missing for ${dir}`);
          } else if (!fs.statSync(distBinPath).mode & 0o111) {
            console.log(`Setting executable permissions for ${binFile} in ${dir}`);
            fs.chmodSync(distBinPath, '755');
          }
        }
      }
    }

    if (modified) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
      console.log(`Updated ${dir}/package.json`)
    } else {
      console.log(`No changes needed for ${dir}`)
    }
  } catch (error) {
    console.error(`Error processing ${dir}: ${error.message}`)
  }
}

console.log('Standardization complete')

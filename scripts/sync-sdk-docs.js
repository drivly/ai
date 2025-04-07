#!/usr/bin/env node

/**
 * Script to copy SDK README.md files to content/sdks/ and update index.mdx
 * This ensures the SDKs folder in the docs is kept updated
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, '..')
const sdksDir = path.join(repoRoot, 'sdks')
const contentSdksDir = path.join(repoRoot, 'content', 'sdks')

const ensureDirectoryExists = async (dir) => {
  try {
    await fs.access(dir)
  } catch (error) {
    await fs.mkdir(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
}

const getSdkInfo = async (sdkDir) => {
  try {
    const packageJsonPath = path.join(sdkDir, 'package.json')
    const packageData = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    const { name, description } = packageData

    const readmePath = path.join(sdkDir, 'README.md')
    const readmeContent = await fs.readFile(readmePath, 'utf8')

    return { name, description, readmeContent }
  } catch (error) {
    console.error(`Error reading data from ${sdkDir}:`, error.message)
    return null
  }
}

const writeSdkMdx = async (name, readmeContent) => {
  const baseName = name.replace('.do', '')
  const outputPath = path.join(contentSdksDir, `${baseName}.mdx`)

  const mdxContent = `---
title: ${name}
---

${readmeContent}`

  await fs.writeFile(outputPath, mdxContent)
  console.log(`Created/updated: ${outputPath}`)

  return baseName
}

const updateIndexMdx = async (sdksInfo) => {
  const indexPath = path.join(contentSdksDir, 'index.mdx')

  let indexContent = `---
title: SDKs
asIndexPage: true
---

# SDKs

> Enterprise-grade SDKs for the .do ecosystem

`

  sdksInfo.forEach(({ name, description, baseName }) => {
    indexContent += `## [${name}](${baseName}.mdx)\n\n${description}\n\n`
  })

  await fs.writeFile(indexPath, indexContent)
  console.log(`Updated: ${indexPath}`)
}

const syncSdkDocs = async () => {
  try {
    console.log('Starting SDK documentation sync')

    await ensureDirectoryExists(contentSdksDir)

    const sdkDirs = await fs.readdir(sdksDir)

    const sdksInfo = []
    for (const dir of sdkDirs) {
      const sdkPath = path.join(sdksDir, dir)

      const stats = await fs.stat(sdkPath)
      if (!stats.isDirectory() || dir.startsWith('.')) {
        continue
      }

      const sdkInfo = await getSdkInfo(sdkPath)
      if (!sdkInfo) continue

      const baseName = await writeSdkMdx(sdkInfo.name, sdkInfo.readmeContent)

      sdksInfo.push({ ...sdkInfo, baseName })
    }

    await updateIndexMdx(sdksInfo)

    console.log('SDK documentation sync completed successfully')
  } catch (error) {
    console.error('Error syncing SDK documentation:', error)
    process.exit(1)
  }
}

syncSdkDocs()

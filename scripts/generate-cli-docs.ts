import fs from 'fs'
import path from 'path'

/**
 * Standalone script to generate CLI documentation for SDK packages
 * This creates MDX files in the /content/docs/clis directory
 */

/**
 * Creates a _meta.ts file for a directory to control the order of items in the sidebar
 */
const createMetaFile = (dir: string, items: string[]) => {
  const metaPath = path.join(dir, '_meta.ts')

  let itemsStr = ''
  for (const item of items) {
    itemsStr += `  '${item}': '',\n`
  }

  const metaContent = `import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
${itemsStr}}

export default meta`

  fs.writeFileSync(metaPath, metaContent)
}

/**
 * Extract CLI commands and help text from a bin.ts file
 */
const extractCliCommands = (binFilePath: string): { commands: string[]; envVars: string[]; helpText: string } => {
  const binContent = fs.readFileSync(binFilePath, 'utf8')

  let helpText = ''
  const helpMatch = binContent.match(/console\.log\(`\n([^`]+)`\)/s)
  if (helpMatch && helpMatch[1]) {
    helpText = helpMatch[1].trim()
  }

  const commands: string[] = []
  const commandMatches = helpText.match(/\s\s(\w+)\s+([^\n]+)/g)
  if (commandMatches) {
    commandMatches.forEach((match) => {
      const trimmed = match.trim()
      if (trimmed && !trimmed.startsWith('--')) {
        commands.push(trimmed.split(/\s+/)[0])
      }
    })
  }

  const envVars: string[] = []
  const envVarMatches = helpText.match(/\s\s(\w+_API_KEY)\s+([^\n]+)/g)
  if (envVarMatches) {
    envVarMatches.forEach((match) => {
      const envVar = match.trim().split(/\s+/)[0]
      if (envVar) {
        envVars.push(envVar)
      }
    })
  }

  return { commands, envVars, helpText }
}

/**
 * Generate documentation for a single CLI package
 */
const generateCliDoc = async (packageDir: string, clisDir: string) => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`Skipping ${packageDir} - No package.json found`)
    return
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const { name, bin, description } = packageJson

  if (!bin) {
    console.log(`Skipping ${name} - No bin entry in package.json`)
    return
  }

  const packageNameBase = name.replace('.do', '')

  const binFile = Object.values(bin)[0]
  if (!binFile) {
    console.log(`Skipping ${name} - No bin file specified`)
    return
  }

  const binFilePath = path.join(packageDir, 'src/bin.ts')
  if (!fs.existsSync(binFilePath)) {
    console.log(`Skipping ${name} - No bin.ts file found at ${binFilePath}`)
    return
  }

  const { commands, envVars, helpText } = extractCliCommands(binFilePath)

  const docContent = `---
title: ${name} CLI
sidebarTitle: ${packageNameBase}
sdk: true
cli: true
---

# ${name} CLI

${description || `Command-line interface for ${name}`}

## Installation

\`\`\`bash
npm install -g ${name}
# or
npx ${name} [command]
\`\`\`

## Usage

\`\`\`bash
${Object.keys(bin)[0]} [command] [options]
\`\`\`

## Commands

${commands.map((cmd) => `### \`${cmd}\`\n\n`).join('')}

## Environment Variables

${envVars.length > 0 ? envVars.map((env) => `- \`${env}\``).join('\n') : 'No environment variables documented.'}

## Help Output

\`\`\`
${helpText}
\`\`\`
`

  const docPath = path.join(clisDir, `${packageNameBase}.mdx`)
  fs.writeFileSync(docPath, docContent)
  console.log(`Generated CLI documentation for ${name}`)
}

/**
 * Generate an index page for the CLIs section
 */
const generateCliIndexPage = (clisDir: string, packageNames: string[]) => {
  const indexContent = `---
title: CLI Reference
sidebarTitle: Overview
asIndexPage: true
---

# CLI Reference

This section contains documentation for command-line interfaces available in our SDK packages.

${packageNames.map((name) => `- [${name.replace('.do', '')}](/${name.replace('.do', '')})`).join('\n')}
`

  const indexPath = path.join(clisDir, 'index.mdx')
  fs.writeFileSync(indexPath, indexContent)
  console.log('Generated CLI index page')
}

/**
 * Main function to generate all CLI documentation
 */
const generateCliDocs = async () => {
  try {
    console.log('Generating CLI documentation for SDK packages...')

    const clisDir = path.resolve(process.cwd(), 'content/docs/clis')
    if (!fs.existsSync(clisDir)) {
      fs.mkdirSync(clisDir, { recursive: true })
    }

    const sdksDir = path.resolve(process.cwd(), 'sdks')
    const packageDirs = fs
      .readdirSync(sdksDir)
      .map((dir) => path.join(sdksDir, dir))
      .filter((dir) => fs.statSync(dir).isDirectory())

    const cliPackages: string[] = []

    for (const packageDir of packageDirs) {
      const packageJsonPath = path.join(packageDir, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        if (packageJson.bin) {
          await generateCliDoc(packageDir, clisDir)
          cliPackages.push(packageJson.name)
        }
      }
    }

    generateCliIndexPage(clisDir, cliPackages)

    const cliFiles = fs
      .readdirSync(clisDir)
      .filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')
      .map((file) => file.replace('.mdx', ''))

    createMetaFile(clisDir, ['index', ...cliFiles])

    console.log('CLI documentation generation complete')
  } catch (error) {
    console.error('Error generating CLI documentation:', error)
    process.exit(1)
  }
}

generateCliDocs()

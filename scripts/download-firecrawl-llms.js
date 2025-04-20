#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const outputPath = path.join(rootDir, 'docs', 'firecrawl.md')

async function downloadFile() {
  try {
    console.log('Downloading Firecrawl LLMs listing...')
    const response = await fetch('https://docs.firecrawl.dev/llms-full.txt')

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
    }

    const content = await response.text()

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    }

    fs.writeFileSync(outputPath, content)

    console.log(`Successfully downloaded and saved to ${outputPath}`)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

downloadFile()

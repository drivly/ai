#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const outputPath = path.join(rootDir, 'docs', 'chromatic.md')

async function downloadChromaticDocs() {
  try {
    console.log('Downloading Chromatic documentation...')

    if (!process.env.FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY environment variable is required')
    }

    const startCrawlResponse = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: 'https://www.chromatic.com/docs/',
        maxDepth: 3, // Limit depth to avoid excessive crawling
        includePaths: ['/docs/*'], // Only crawl documentation pages
        scrapeOptions: {
          formats: ['markdown'],
          onlyMainContent: true,
        },
      }),
    })

    if (!startCrawlResponse.ok) {
      throw new Error(`Failed to start crawl: ${startCrawlResponse.status} ${startCrawlResponse.statusText}`)
    }

    const { id } = await startCrawlResponse.json()
    console.log(`Crawl job started with ID: ${id}`)

    let crawlComplete = false
    let crawlData = null
    let attempts = 0
    const maxAttempts = 60 // Allow up to 5 minutes (60 attempts * 5 seconds)

    while (!crawlComplete && attempts < maxAttempts) {
      attempts++
      console.log(`Checking crawl status (attempt ${attempts})...`)

      const statusResponse = await fetch(`https://api.firecrawl.dev/v1/crawl/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        },
      })

      if (!statusResponse.ok) {
        throw new Error(`Failed to check crawl status: ${statusResponse.status} ${statusResponse.statusText}`)
      }

      const statusData = await statusResponse.json()

      if (statusData.success && statusData.status === 'completed') {
        crawlComplete = true
        crawlData = statusData
        console.log('Crawl completed successfully!')
      } else if (statusData.status === 'failed') {
        throw new Error(`Crawl failed: ${JSON.stringify(statusData.error || 'Unknown error')}`)
      } else {
        console.log(`Crawl in progress (${statusData.status || 'status unknown'})... waiting 5 seconds`)
        await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds before polling again
      }
    }

    if (!crawlComplete) {
      throw new Error(`Crawl did not complete after ${maxAttempts} attempts`)
    }

    if (!crawlData || !crawlData.pages || crawlData.pages.length === 0) {
      throw new Error('No content was crawled')
    }

    let combinedMarkdown = `# Chromatic Documentation\n\nSource: https://www.chromatic.com/docs/\n\n`

    for (const page of crawlData.pages) {
      if (page.markdown) {
        combinedMarkdown += `\n## ${page.url}\n\n${page.markdown}\n\n`
      }
    }

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    }

    fs.writeFileSync(outputPath, combinedMarkdown)

    console.log(`Successfully downloaded and saved to ${outputPath}`)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

downloadChromaticDocs()

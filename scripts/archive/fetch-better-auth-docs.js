#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const outputDir = path.join(rootDir, 'reference', 'better-auth')

const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1'
const BETTER_AUTH_DOCS_URL = 'https://www.better-auth.com/docs'
const MAX_POLLING_TIME = 10 * 60 * 1000 // 10 minutes
const POLLING_INTERVAL = 5000 // 5 seconds
const MAX_RETRIES = 3

async function fetchBetterAuthDocs() {
  try {
    const apiKey = process.env.FIRECRAWL_API_KEY
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set')
    }

    console.log('Starting Better-Auth documentation crawl...')

    const crawlJob = await startCrawlJob(apiKey)
    console.log(`Crawl job started with ID: ${crawlJob.id}`)

    const crawlResults = await pollCrawlJob(apiKey, crawlJob.id)

    await processAndSaveResults(crawlResults)

    console.log('Better-Auth documentation crawl completed successfully')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

async function startCrawlJob(apiKey) {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: BETTER_AUTH_DOCS_URL,
        maxDepth: 3, // Adjust as needed to capture all docs
        scrapeOptions: {
          formats: ['markdown', 'links'],
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to start crawl job: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    throw new Error(`Error starting crawl job: ${error.message}`)
  }
}

async function pollCrawlJob(apiKey, jobId, retryCount = 0) {
  const startTime = Date.now()
  let allResults = []

  while (Date.now() - startTime < MAX_POLLING_TIME) {
    try {
      const response = await fetch(`${FIRECRAWL_API_URL}/crawl/${jobId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to check crawl job status: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === 'completed' || data.status === 'succeeded') {
        allResults = await getAllResults(apiKey, jobId, data)
        return allResults
      } else if (data.status === 'failed') {
        throw new Error(`Crawl job failed: ${data.error || 'Unknown error'}`)
      }

      console.log(`Crawl job in progress... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`)
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL))
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Error checking crawl job status, retrying (${retryCount + 1}/${MAX_RETRIES})...`)
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL))
        return pollCrawlJob(apiKey, jobId, retryCount + 1)
      }
      throw new Error(`Error checking crawl job status: ${error.message}`)
    }
  }

  throw new Error(`Crawl job timed out after ${MAX_POLLING_TIME / 1000} seconds`)
}

async function getAllResults(apiKey, jobId, initialData) {
  let results = initialData.data || []
  let nextUrl = initialData.next

  while (nextUrl) {
    try {
      const response = await fetch(nextUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get next page: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.data && Array.isArray(data.data)) {
        results = results.concat(data.data)
      }

      nextUrl = data.next
    } catch (error) {
      throw new Error(`Error fetching paginated results: ${error.message}`)
    }
  }

  return results
}

async function processAndSaveResults(results) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log(`Processing ${results.length} pages of documentation...`)

  const processedUrls = new Map()

  for (const page of results) {
    try {
      if (!page.markdown || !page.metadata || !page.metadata.sourceURL) {
        console.log(`Skipping page with missing data`)
        continue
      }

      const url = page.metadata.sourceURL

      if (processedUrls.has(url)) {
        continue
      }
      processedUrls.set(url, true)

      const urlPath = new URL(url).pathname
      const relativePath = urlPath.replace(/^\/docs\/?/, '').replace(/\/$/, '')
      const fileName = relativePath ? `${relativePath.replace(/\//g, '-')}.md` : 'index.md'

      const filePath = path.join(outputDir, fileName)

      const fileDir = path.dirname(filePath)
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true })
      }

      const title = page.metadata.title || 'Untitled'
      const description = page.metadata.description || ''

      const content = `---
title: ${title}
description: ${description}
sourceUrl: ${url}
---

${page.markdown}`

      fs.writeFileSync(filePath, content)
      console.log(`Saved ${url} to ${filePath}`)
    } catch (error) {
      console.error(`Error processing page: ${error.message}`)
    }
  }

  console.log(`Saved ${processedUrls.size} markdown files to ${outputDir}`)
}

fetchBetterAuthDocs()

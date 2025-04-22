#!/usr/bin/env tsx
/**
 * Website Crawler - Link Validator
 * 
 * This script uses Crawlee and Playwright to crawl all domains in sites/.domains.csv
 * and check for broken links. It starts at dotdo.ai and crawls every page,
 * including blogs, but excludes docs directories.
 */

import { PlaywrightCrawler, Dataset } from 'crawlee'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

interface BrokenLink {
  sourceUrl: string
  targetUrl: string
  statusCode?: number
  errorMessage?: string
}

async function getDomainsToCheck(): Promise<string[]> {
  const domainsContent = await readFile(path.join(process.cwd(), 'sites', '.domains.csv'), 'utf-8')
  return domainsContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('|')
      return parts.length > 1 ? parts[1] : line
    })
    .filter(domain => domain.length > 0)
    .map(domain => `https://${domain}`)
}

async function runCrawler() {
  const domains = await getDomainsToCheck()
  console.log(`Found ${domains.length} domains to check`)
  
  const brokenLinks: BrokenLink[] = []
  
  const crawler = new PlaywrightCrawler({
    maxConcurrency: 5,
    
    preNavigationHooks: [
      async ({ request }) => {
        const url = request.url
        if (url.includes('/docs/') || url.includes('/documentation/')) {
          await request.abort()
        }
      }
    ],
    
    async requestHandler({ request, page, enqueueLinks }) {
      console.log(`Processing ${request.url}`)
      
      const links = await page.$$eval('a[href]', (anchors) => 
        anchors.map((a) => a.href)
      )
      
      for (const link of links) {
        try {
          const linkDomain = new URL(link).hostname
          if (domains.some(domain => link.startsWith(domain) || linkDomain.endsWith('.do'))) {
            const response = await fetch(link, { method: 'HEAD' })
            if (response.status >= 400) {
              brokenLinks.push({
                sourceUrl: request.url,
                targetUrl: link,
                statusCode: response.status
              })
              console.log(`Found broken link: ${link} (${response.status}) on page ${request.url}`)
            }
          }
        } catch (error) {
          brokenLinks.push({
            sourceUrl: request.url,
            targetUrl: link,
            errorMessage: error.message
          })
          console.log(`Error checking link: ${link} - ${error.message}`)
        }
      }
      
      await enqueueLinks({
        globs: domains.map(domain => `${domain}/**`),
        exclude: [
          '**/docs/**',
          '**/documentation/**',
          '**/*.pdf', 
          '**/*.zip',
          '**/*.png',
          '**/*.jpg',
          '**/*.jpeg'
        ]
      })
    },
    
    failedRequestHandler({ request, error }) {
      console.log(`Request ${request.url} failed: ${error.message}`)
      brokenLinks.push({
        sourceUrl: '',
        targetUrl: request.url,
        errorMessage: error.message
      })
    },
  })
  
  await crawler.run(['https://dotdo.ai', ...domains])
  
  await Dataset.pushData(brokenLinks)
  
  if (brokenLinks.length === 0) {
    console.log('No broken links found!')
  } else {
    console.log(`Found ${brokenLinks.length} broken links:`)
    for (const link of brokenLinks) {
      console.log(`- ${link.targetUrl} (${link.statusCode || 'Error'}) on page ${link.sourceUrl}`)
    }
    process.exit(1)
  }
}

const LIMIT_DOMAINS = process.env.LIMIT_DOMAINS ? parseInt(process.env.LIMIT_DOMAINS, 10) : undefined

runCrawler().catch((error) => {
  console.error('Error running crawler:', error)
  process.exit(1)
})

#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
let sourceFilter = null

for (const arg of args) {
  if (arg.startsWith('--source=')) {
    sourceFilter = arg.split('=')[1]
  }
}

/**
 * Configuration for all data sources
 * Each source has:
 * - name: Identifier for the source
 * - type: Type of adapter to use (direct, firecrawlApi, firecrawlCli)
 * - config: Source-specific configuration
 * - outputPaths: Array of output paths with optional transformations
 */
const sources = [
  {
    name: 'openrouter',
    type: 'direct',
    config: {
      url: 'https://openrouter.ai/docs/llms-full.txt',
    },
    outputPaths: [
      {
        path: path.join(rootDir, 'docs', 'openrouter-llms-full.txt'),
      },
      {
        path: path.join(rootDir, 'docs', 'openrouter-llms.txt'),
        transform: (content) =>
          content
            .split('\n')
            .filter((line) => !line.startsWith('#') && line.trim() !== '')
            .join('\n'),
      },
    ],
  },
  {
    name: 'payload-firecrawl',
    type: 'firecrawlApi',
    config: {
      url: 'https://payloadcms.com/docs',
      includePaths: ['/docs/*'],
      excludePaths: ['/docs/search*'],
      maxDepth: 5,
      limit: 1000,
      waitForSelector: '.docs-content',
      fallbackUrls: [
        'https://payloadcms.com/docs/getting-started/what-is-payload',
        'https://payloadcms.com/docs/getting-started/installation',
        'https://payloadcms.com/docs/getting-started/quick-start',
        'https://payloadcms.com/docs/configuration/overview',
        'https://payloadcms.com/docs/fields/overview',
        'https://payloadcms.com/docs/admin/overview',
        'https://payloadcms.com/docs/rest-api/overview',
        'https://payloadcms.com/docs/graphql/overview',
        'https://payloadcms.com/docs/local-api/overview',
        'https://payloadcms.com/docs/authentication/overview',
        'https://payloadcms.com/docs/access-control/overview',
        'https://payloadcms.com/docs/hooks/overview',
        'https://payloadcms.com/docs/plugins/overview',
      ],
    },
    outputPaths: [
      {
        path: path.join(rootDir, 'docs', 'Payload firecrawl llms.txt'),
        headers: {
          title: 'PayloadCMS Documentation',
          source: 'https://payloadcms.com/docs',
        },
      },
    ],
  },
  {
    name: 'payload-direct',
    type: 'direct',
    config: {
      urls: [
        'https://payloadcms.com/docs/getting-started/what-is-payload',
        'https://payloadcms.com/docs/getting-started/installation',
        'https://payloadcms.com/docs/getting-started/quick-start',
        'https://payloadcms.com/docs/configuration/overview',
        'https://payloadcms.com/docs/fields/overview',
        'https://payloadcms.com/docs/admin/overview',
        'https://payloadcms.com/docs/rest-api/overview',
        'https://payloadcms.com/docs/graphql/overview',
        'https://payloadcms.com/docs/local-api/overview',
        'https://payloadcms.com/docs/authentication/overview',
        'https://payloadcms.com/docs/access-control/overview',
        'https://payloadcms.com/docs/hooks/overview',
        'https://payloadcms.com/docs/plugins/overview',
        'https://payloadcms.com/docs/cloud/overview',
        'https://payloadcms.com/docs/production/deployment',
        'https://payloadcms.com/docs/production/security',
        'https://payloadcms.com/docs/production/caching',
        'https://payloadcms.com/docs/production/monitoring',
        'https://payloadcms.com/docs/production/scaling',
        'https://payloadcms.com/docs/production/backups',
        'https://payloadcms.com/docs/production/logging',
        'https://payloadcms.com/docs/production/error-handling',
        'https://payloadcms.com/docs/production/performance',
        'https://payloadcms.com/docs/production/seo',
        'https://payloadcms.com/docs/production/analytics',
        'https://payloadcms.com/docs/production/accessibility',
        'https://payloadcms.com/docs/production/internationalization',
        'https://payloadcms.com/docs/production/localization',
        'https://payloadcms.com/docs/production/testing',
        'https://payloadcms.com/docs/production/ci-cd',
      ],
      extractContent: true,
      delay: 1000,
    },
    outputPaths: [
      {
        path: path.join(rootDir, 'docs', 'Payload firecrawl llms.txt'),
        headers: {
          title: 'PayloadCMS Documentation',
          source: 'https://payloadcms.com/docs',
        },
      },
    ],
  },

]

const adapters = {
  /**
   * Direct HTTP fetching adapter
   * @param {Object} source - Source configuration
   * @returns {Promise<string>} Fetched content
   */
  direct: async (source) => {
    try {
      console.log(`Fetching content from ${source.name} using direct HTTP...`)

      if (source.config.url) {
        const response = await fetch(source.config.url)

        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.status} ${response.statusText}`)
        }

        const content = await response.text()
        return content
      } else if (source.config.urls) {
        console.log(`Scraping ${source.config.urls.length} pages...`)

        let combinedContent = ''
        if (source.outputPaths[0]?.headers) {
          const { title, source: sourceUrl } = source.outputPaths[0].headers
          combinedContent = `# ${title}\n\nSource: ${sourceUrl}\n\n`
        }

        let successCount = 0

        for (const url of source.config.urls) {
          try {
            console.log(`Scraping ${url}...`)

            const response = await fetch(url)

            if (!response.ok) {
              console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
              continue
            }

            const html = await response.text()

            if (source.config.extractContent) {
              const content = extractMainContent(html)

              if (content) {
                const title = extractTitle(html) || url.split('/').pop()
                combinedContent += `\n## ${title}\n\nURL: ${url}\n\n${content}\n\n`
                successCount++
              } else {
                console.error(`Failed to extract content from ${url}`)
              }
            } else {
              combinedContent += `\n## ${url}\n\n${html}\n\n`
              successCount++
            }

            if (source.config.delay) {
              await new Promise((resolve) => setTimeout(resolve, source.config.delay))
            }
          } catch (error) {
            console.error(`Error scraping ${url}: ${error.message}`)
          }
        }

        console.log(`Successfully scraped ${successCount} pages`)
        return combinedContent
      }

      throw new Error(`Invalid direct source configuration: ${JSON.stringify(source.config)}`)
    } catch (error) {
      throw new Error(`Error fetching ${source.name}: ${error.message}`)
    }
  },

  /**
   * Firecrawl API adapter
   * @param {Object} source - Source configuration
   * @returns {Promise<string>} Fetched content
   */
  firecrawlApi: async (source) => {
    try {
      if (!process.env.FIRECRAWL_API_KEY) {
        throw new Error('FIRECRAWL_API_KEY environment variable is required')
      }

      console.log(`Crawling ${source.name} using Firecrawl API...`)

      const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1'
      const MAX_POLLING_TIME = 15 * 60 * 1000 // 15 minutes
      const POLLING_INTERVAL = 5000 // 5 seconds
      const MAX_RETRIES = 3

      const scrapeResponse = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
          url: source.config.url,
          formats: ['markdown', 'html'],
          onlyMainContent: true,
        }),
      })

      if (!scrapeResponse.ok) {
        throw new Error(`Failed to scrape main docs page: ${scrapeResponse.status} ${scrapeResponse.statusText}`)
      }

      const scrapeData = await scrapeResponse.json()
      console.log(`Initial scrape completed, found content at: ${scrapeData.url}`)

      const response = await fetch(`${FIRECRAWL_API_URL}/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
          url: scrapeData.url || source.config.url,
          includePaths: source.config.includePaths,
          excludePaths: source.config.excludePaths,
          allowBackwardLinks: true,
          maxDepth: source.config.maxDepth,
          limit: source.config.limit,
          scrapeOptions: {
            formats: ['markdown', 'html'],
            onlyMainContent: true,
            waitForSelector: source.config.waitForSelector,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to start crawl job: ${response.status} ${response.statusText}`)
      }

      const crawlJob = await response.json()
      console.log(`Crawl job started with ID: ${crawlJob.id}`)

      const startTime = Date.now()
      let allResults = []

      while (Date.now() - startTime < MAX_POLLING_TIME) {
        try {
          const pollResponse = await fetch(`${FIRECRAWL_API_URL}/crawl/${crawlJob.id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
            },
          })

          if (!pollResponse.ok) {
            throw new Error(`Failed to check crawl job status: ${pollResponse.status} ${pollResponse.statusText}`)
          }

          const data = await pollResponse.json()

          if (data.status === 'completed' || data.status === 'succeeded') {
            allResults = await getAllPaginatedResults(FIRECRAWL_API_URL, process.env.FIRECRAWL_API_KEY, crawlJob.id, data)
            break
          } else if (data.status === 'failed') {
            throw new Error(`Crawl job failed: ${data.error || 'Unknown error'}`)
          }

          console.log(`Crawl job in progress... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`)
          await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL))
        } catch (error) {
          console.error(`Error checking crawl job status: ${error.message}`)
          if (Date.now() - startTime > MAX_POLLING_TIME - MAX_RETRIES * POLLING_INTERVAL) {
            throw error
          }
          await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL))
        }
      }

      if (allResults.length === 0) {
        console.log('No results from crawl, attempting to scrape individual pages directly...')

        if (!source.config.fallbackUrls || source.config.fallbackUrls.length === 0) {
          throw new Error('No crawl results and no fallback URLs provided')
        }

        let combinedContent = ''
        if (source.outputPaths[0]?.headers) {
          const { title, source: sourceUrl } = source.outputPaths[0].headers
          combinedContent = `# ${title}\n\nSource: ${sourceUrl}\n\n`
        }

        for (const pageUrl of source.config.fallbackUrls) {
          try {
            console.log(`Scraping ${pageUrl}...`)
            const scrapeResponse = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
              },
              body: JSON.stringify({
                url: pageUrl,
                formats: ['markdown', 'html'],
                onlyMainContent: true,
                waitForSelector: source.config.waitForSelector,
              }),
            })

            if (!scrapeResponse.ok) {
              console.error(`Failed to scrape ${pageUrl}: ${scrapeResponse.status} ${scrapeResponse.statusText}`)
              continue
            }

            const data = await scrapeResponse.json()

            if (data.markdown) {
              combinedContent += `\n## ${pageUrl}\n\n${data.markdown}\n\n`
            }

            await new Promise((resolve) => setTimeout(resolve, 1000))
          } catch (error) {
            console.error(`Error scraping ${pageUrl}: ${error.message}`)
          }
        }

        return combinedContent
      }

      let combinedContent = ''
      if (source.outputPaths[0]?.headers) {
        const { title, source: sourceUrl } = source.outputPaths[0].headers
        combinedContent = `# ${title}\n\nSource: ${sourceUrl}\n\n`
      }

      for (const page of allResults) {
        if (page.markdown) {
          const url = page.url || 'Unknown URL'
          combinedContent += `\n## ${url}\n\n${page.markdown}\n\n`
        }
      }

      return combinedContent
    } catch (error) {
      throw new Error(`Error fetching ${source.name}: ${error.message}`)
    }
  },

  /**
   * Firecrawl CLI adapter
   * @param {Object} source - Source configuration
   * @returns {Promise<string>} Fetched content
   */
  firecrawlCli: async (source) => {
    try {
      const apiKey = process.env.FIRECRAWL_API_KEY
      if (!apiKey) {
        throw new Error('FIRECRAWL_API_KEY environment variable is not set')
      }

      console.log(`Crawling ${source.name} using Firecrawl CLI...`)

      const { baseUrl, paths, maxUrls, tempDir } = source.config

      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }

      fs.mkdirSync(tempDir, { recursive: true })

      const combinedContent = []

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        const pathDir = `${tempDir}/path_${i}`
        fs.mkdirSync(pathDir, { recursive: true })

        const url = `${baseUrl}${path}`
        console.log(`Crawling ${url}...`)

        try {
          execSync(
            `npx generate-llmstxt --api-key ${apiKey} --url ${url} --max-urls ${maxUrls} --output-dir ${pathDir}`,
            { stdio: 'inherit', timeout: 60000 }, // 60 second timeout
          )
        } catch (error) {
          console.log(`Warning: Error crawling ${url}: ${error.message}`)
        }

        const llmsFullPath = path.join(pathDir, 'llms-full.txt')

        if (fs.existsSync(llmsFullPath)) {
          const content = fs.readFileSync(llmsFullPath, 'utf8')
          combinedContent.push(content)
        }
      }

      fs.rmSync(tempDir, { recursive: true, force: true })

      return combinedContent.join('\n\n')
    } catch (error) {
      throw new Error(`Error fetching ${source.name}: ${error.message}`)
    }
  },
}

/**
 * Extract main content from HTML
 * @param {string} html - HTML content
 * @returns {string|null} Extracted markdown content or null
 */
function extractMainContent(html) {
  try {
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)

    if (mainMatch && mainMatch[1]) {
      const contentMatch = mainMatch[1].match(/<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i)
      let content = contentMatch && contentMatch[1] ? contentMatch[1] : mainMatch[1]

      content = content
        .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
        .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
        .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n')
        .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n')
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
        .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
        .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
        .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
        .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '```\n$1\n```\n\n')
        .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '$1\n')
        .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, '$1\n')
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
        .replace(/<br[^>]*>/gi, '\n')
        .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove extra newlines
        .trim()

      return content
    }
  } catch (error) {
    console.error('Error extracting content:', error.message)
  }

  return null
}

/**
 * Extract title from HTML
 * @param {string} html - HTML content
 * @returns {string|null} Extracted title or null
 */
function extractTitle(html) {
  try {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].replace(' | Payload CMS', '').trim()
    }

    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    if (h1Match && h1Match[1]) {
      return h1Match[1].replace(/<[^>]*>/g, '').trim()
    }
  } catch (error) {
    console.error('Error extracting title:', error.message)
  }

  return null
}

/**
 * Get all paginated results from a Firecrawl crawl job
 * @param {string} apiUrl - Firecrawl API URL
 * @param {string} apiKey - Firecrawl API key
 * @param {string} jobId - Crawl job ID
 * @param {Object} initialData - Initial response data
 * @returns {Promise<Array>} All results
 */
async function getAllPaginatedResults(apiUrl, apiKey, jobId, initialData) {
  let results = initialData.pages || []
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

      if (data.pages && Array.isArray(data.pages)) {
        results = results.concat(data.pages)
      }

      nextUrl = data.next
    } catch (error) {
      throw new Error(`Error fetching paginated results: ${error.message}`)
    }
  }

  return results
}

/**
 * Process Markdown content into separate files
 * @param {string} content - Markdown content
 * @param {string} outputDir - Output directory
 * @param {Object} headers - Headers to add to each file
 * @returns {Promise<void>}
 */
async function processMarkdownToFiles(content, outputDir, headers) {
  try {
    console.log('Processing content to markdown files...')

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const sections = content.split(/(?=^# |^## )/m).filter((section) => section.trim())

    console.log(`Found ${sections.length} sections to process`)

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]

      const titleMatch = section.match(/^#+ (.+?)(?:\n|$)/)
      const title = titleMatch ? titleMatch[1].trim() : `Section ${i + 1}`

      const fileName =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '.md'

      const filePath = path.join(outputDir, fileName)

      const { title: titleKey, description, sourceUrl } = headers

      const markdownContent = `---
title: ${title}
description: ${description}
sourceUrl: ${sourceUrl}
---

${section}`

      fs.writeFileSync(filePath, markdownContent)
      console.log(`Saved section "${title}" to ${filePath}`)
    }

    console.log(`Processed ${sections.length} markdown files to ${outputDir}`)
  } catch (error) {
    console.error('Error processing markdown:', error.message)
    throw error
  }
}

/**
 * Main function to fetch all sources
 */
async function fetchAllSources() {
  const sourcesToProcess = sourceFilter ? sources.filter((source) => source.name === sourceFilter) : sources

  if (sourcesToProcess.length === 0) {
    console.error(`No sources found matching filter: ${sourceFilter}`)
    process.exit(1)
  }

  for (const source of sourcesToProcess) {
    try {
      console.log(`Processing source: ${source.name}`)

      const adapter = adapters[source.type]
      if (!adapter) {
        throw new Error(`Unknown adapter type: ${source.type}`)
      }

      const content = await adapter(source)

      for (const output of source.outputPaths) {
        try {
          if (output.isDirectory) {
            if (!fs.existsSync(output.path)) {
              fs.mkdirSync(output.path, { recursive: true })
            }

            if (output.processMarkdown) {
              await processMarkdownToFiles(content, output.path, output.headers)
            }
          } else {
            const dir = path.dirname(output.path)
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true })
            }

            const transformedContent = output.transform ? output.transform(content) : content

            fs.writeFileSync(output.path, transformedContent)
            console.log(`Saved output to ${output.path}`)
          }
        } catch (error) {
          console.error(`Error saving output for ${source.name} to ${output.path}: ${error.message}`)
        }
      }
    } catch (error) {
      console.error(`Error processing source ${source.name}: ${error.message}`)
    }
  }
}

fetchAllSources()

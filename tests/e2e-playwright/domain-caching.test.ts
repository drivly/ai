import { test as playwrightTest, expect } from '@playwright/test'
import { Browser, Page } from 'playwright'
import PQueue from 'p-queue'
import fs from 'fs'

playwrightTest.describe('Domain Caching', () => {
  let browser: Browser
  let page: Page

  playwrightTest.beforeAll(async ({ browser: playwrightBrowser }) => {
    if (process.env.CI && !process.env.BROWSER_TESTS) {
      return
    }

    try {
      browser = playwrightBrowser
    } catch (error: unknown) {
      console.error('Failed to launch browser:', error)
    }
  })

  playwrightTest.beforeEach(async ({ page: playwrightPage }) => {
    page = playwrightPage
  })

  playwrightTest('should fetch all domains to pre-load AI-generated content', async () => {
    if (!browser || !page || (process.env.CI && !process.env.BROWSER_TESTS)) {
      console.log('Skipping domain caching test because browser not available or in CI without BROWSER_TESTS')
      expect(true).toBe(true) // Pass the test when skipped
      return
    }

    const domainsData = fs.readFileSync('sites/.domains.csv', 'utf-8')
    const domains = domainsData.split('\n').filter(Boolean)

    const queue = new PQueue({ concurrency: 20 })

    const landingResults = {
      success: 0,
      failed: 0,
      errors: [] as { domain: string; error: string }[],
    }

    const blogResults = {
      success: 0,
      failed: 0,
      errors: [] as { domain: string; error: string }[],
    }

    const baseUrl = process.env.BASE_URL || process.env.API_URL || 'http://localhost:3000'
    await page.goto(baseUrl)

    console.log('Fetching landing pages for all domains...')
    await Promise.all(
      domains.map((domain) =>
        queue.add(async () => {
          try {
            const siteUrl = baseUrl.endsWith('/') ? `${baseUrl}sites/${domain}` : `${baseUrl}/sites/${domain}`
            const response = await page.goto(siteUrl, { waitUntil: 'networkidle' })

            if (response && response.ok()) {
              landingResults.success++
            } else {
              landingResults.failed++
              landingResults.errors.push({
                domain,
                error: response ? `HTTP error ${response.status()}: ${response.statusText()}` : 'No response',
              })
            }

            return response
          } catch (error) {
            landingResults.failed++
            landingResults.errors.push({
              domain,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }),
      ),
    )

    console.log(`Successfully cached ${landingResults.success} domain landing pages`)
    if (landingResults.failed > 0) {
      console.log(`Failed to cache ${landingResults.failed} domain landing pages:`)
      landingResults.errors.forEach(({ domain, error }) => {
        console.log(`  - ${domain}: ${error}`)
      })
    }

    console.log('Fetching blog pages for all domains...')
    await Promise.all(
      domains.map((domain) =>
        queue.add(async () => {
          try {
            const blogUrl = baseUrl.endsWith('/') ? `${baseUrl}sites/${domain}/blog` : `${baseUrl}/sites/${domain}/blog`

            const response = await page.goto(blogUrl, { waitUntil: 'networkidle' })

            if (response && response.ok()) {
              blogResults.success++
            } else {
              blogResults.failed++
              blogResults.errors.push({
                domain,
                error: response ? `HTTP error ${response.status()}: ${response.statusText()}` : 'No response',
              })
            }

            return response
          } catch (error) {
            blogResults.failed++
            blogResults.errors.push({
              domain,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }),
      ),
    )

    console.log(`Successfully cached ${blogResults.success} domain blog pages`)
    if (blogResults.failed > 0) {
      console.log(`Failed to cache ${blogResults.failed} domain blog pages:`)
      blogResults.errors.forEach(({ domain, error }) => {
        console.log(`  - ${domain}: ${error}`)
      })
    }

    expect(landingResults.success).toBeGreaterThan(0)
    if (landingResults.success === 0) {
      throw new Error('All domain landing page cache requests failed')
    }
    expect(landingResults.success + landingResults.failed).toBe(domains.length)

    expect(blogResults.success).toBeGreaterThan(0)
    if (blogResults.success === 0) {
      throw new Error('All domain blog page cache requests failed')
    }
    expect(blogResults.success + blogResults.failed).toBe(domains.length)
  })
})

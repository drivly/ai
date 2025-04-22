import { describe, test, expect } from 'vitest'
import PQueue from 'p-queue'
import fs from 'fs'
import { parse } from 'csv-parse/sync'

describe('Domain Caching', () => {
  test('should fetch all domains to pre-load AI-generated content', async () => {
    const domainsData = fs.readFileSync('sites/.domains.csv', 'utf-8')
    const domains = domainsData.split('\n').filter(Boolean)
    
    const queue = new PQueue({ concurrency: 20 })
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as { domain: string; error: string }[],
    }
    
    await Promise.all(
      domains.map((domain) => 
        queue.add(async () => {
          try {
            const response = await fetch(`/sites/${domain}`)
            
            if (response.ok) {
              results.success++
            } else {
              results.failed++
              results.errors.push({ 
                domain, 
                error: `HTTP error ${response.status}: ${response.statusText}` 
              })
            }
            
            return response
          } catch (error) {
            results.failed++
            results.errors.push({ 
              domain, 
              error: error instanceof Error ? error.message : String(error) 
            })
          }
        })
      )
    )
    
    console.log(`Successfully cached ${results.success} domains`)
    if (results.failed > 0) {
      console.log(`Failed to cache ${results.failed} domains:`)
      results.errors.forEach(({ domain, error }) => {
        console.log(`  - ${domain}: ${error}`)
      })
    }
    
    expect(results.success).toBeGreaterThan(0)
    
    if (results.success === 0) {
      throw new Error('All domain cache requests failed')
    }
    
    expect(results.success + results.failed).toBe(domains.length)
  }, 60000) // Increase timeout to 60 seconds for many requests
})

import { describe, it, expect } from 'vitest'

describe('Root API Deployment Test', () => {
  it('should verify root path is accessible in deployment environment', async () => {
    if (process.env.VERCEL) {
      console.log('Running root path deployment test in Vercel environment')

      const deploymentUrl = `https://${process.env.VERCEL_URL}`
      console.log(`Testing deployment URL: ${deploymentUrl}`)

      try {
        const response = await fetch(deploymentUrl)

        expect(response.status).toBe(200)

        const contentType = response.headers.get('content-type')
        expect(contentType).toBeDefined()

        if (contentType?.includes('text/html')) {
          const text = await response.text()
          expect(text.length).toBeGreaterThan(0)
        } else if (contentType?.includes('application/json')) {
          const data = await response.json()
          expect(data).toBeDefined()
        }

        console.log('Root path deployment test passed')
      } catch (error) {
        console.error('Root path deployment test failed:', error)
        expect.fail('Root path is not accessible in deployment environment')
      }
    } else {
      console.log('Skipping root path deployment test - not in Vercel environment')
      expect(true).toBe(true)
    }
  })
})

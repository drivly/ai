import { describe, it, expect } from 'vitest'

describe('Docs API endpoint', () => {
  it('should return a properly structured response', async () => {
    const baseUrl = process.env.API_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    const docsUrl = baseUrl.endsWith('/') ? `${baseUrl}docs` : `${baseUrl}/docs`
    
    console.log(`Testing docs route at: ${docsUrl}`)
    const response = await fetch(docsUrl)
    expect(response.status).not.toBe(500)
    
    if (response.status === 500) {
      console.error('CRITICAL: Docs route returned a 500 error')
      throw new Error('Docs route returned a 500 error')
    }
    
    let responseData
    try {
      responseData = await response.json()
    } catch (error) {
      console.error('Response is not valid JSON:', error)
      throw new Error('Response is not valid JSON')
    }
    
    expect(responseData).toBeDefined()
    
    expect(responseData.api).toBeDefined()
    expect(responseData.api.name).toBeDefined()
    expect(responseData.api.description).toBeDefined()
    
    expect(responseData.user).toBeDefined()
    
    console.log('Docs API test passed successfully')
  })
})

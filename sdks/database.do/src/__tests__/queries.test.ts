import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { setupApiStyles, isPayloadRunning, createTestData, cleanupTestData } from './utils/test-setup'

describe('database.do SDK Query Operations', () => {
  const { db, dbClient } = setupApiStyles()
  
  describe('Query Operations', () => {
    let payloadRunning = false
    const testResources: any[] = []
    
    beforeAll(async () => {
      payloadRunning = await isPayloadRunning()
      if (!payloadRunning) {
        return
      }
      
      const testData = [
        {
          name: `Query Test A-${Date.now()}`,
          data: { category: 'electronics', price: 100, inStock: true },
        },
        {
          name: `Query Test B-${Date.now()}`,
          data: { category: 'electronics', price: 200, inStock: false },
        },
        {
          name: `Query Test C-${Date.now()}`,
          data: { category: 'books', price: 50, inStock: true },
        },
        {
          name: `Query Test D-${Date.now()}`,
          data: { category: 'furniture', price: 500, inStock: true },
        },
        {
          name: `Query Test E-${Date.now()}`,
          data: { category: 'books', price: 30, inStock: false },
        },
      ]
      
      for (const data of testData) {
        const resource = await createTestData('things', data)
        if (resource) {
          testResources.push(resource)
        }
      }
    })
    
    afterAll(async () => {
      if (payloadRunning) {
        for (const resource of testResources) {
          if (resource?.id) {
            await cleanupTestData('things', resource.id)
          }
        }
      }
    })
    
    it('should find things with filtering', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }
      
      const result = await db.things.find({
        where: {
          'data.category': 'electronics',
        },
      })
      
      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThanOrEqual(2)
      expect(result.data.every((doc: any) => doc.data?.category === 'electronics')).toBe(true)
    })
    
    it('should find things with complex filtering', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }
      
      const result = await db.things.find({
        where: {
          'data.category': 'books',
          'data.inStock': true,
        },
      })
      
      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThanOrEqual(1)
      expect(result.data.every((doc: any) => doc.data?.category === 'books' && doc.data?.inStock === true)).toBe(true)
    })
    
    it('should sort things', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }
      
      const result = await db.things.find({
        sort: 'data.price:desc',
      })
      
      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      
      const prices = result.data.map((doc: any) => doc.data?.price)
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i-1] >= prices[i]).toBe(true)
      }
    })
    
    it('should paginate things', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }
      
      const pageSize = 2
      
      const page1 = await db.things.find({
        limit: pageSize,
        page: 1,
      })
      
      const page2 = await db.things.find({
        limit: pageSize,
        page: 2,
      })
      
      expect(page1).toBeDefined()
      expect(page1.data).toBeDefined()
      expect(Array.isArray(page1.data)).toBe(true)
      expect(page1.data.length).toBeLessThanOrEqual(pageSize)
      
      expect(page2).toBeDefined()
      expect(page2.data).toBeDefined()
      expect(Array.isArray(page2.data)).toBe(true)
      
      const page1Ids = page1.data.map((doc: any) => doc.id)
      const page2Ids = page2.data.map((doc: any) => doc.id)
      
      for (const id of page2Ids) {
        expect(page1Ids.includes(id)).toBe(false)
      }
    })
    
    it('should find things with filtering using DatabaseClient', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }
      
      const result = await dbClient.find('things', {
        where: {
          'data.category': 'electronics',
        },
      })
      
      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThanOrEqual(2)
      expect(result.data.every((doc: any) => doc.data?.category === 'electronics')).toBe(true)
    })
    
    it('should search things', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }
      
      const query = 'Test'
      const result = await db.things.search(query, {
        limit: 10,
      })
      
      expect(result).toBeDefined()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })
  })
})

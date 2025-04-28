import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { setupApiStyles, isPayloadRunning, createTestData, cleanupTestData } from './utils/test-setup'

describe('database.do SDK CRUD Operations', () => {
  const { db, dbClient } = setupApiStyles()
  
  describe('Proxy-based API Style (DB function)', () => {
    let payloadRunning = false
    let createdResource: any
    
    beforeAll(async () => {
      payloadRunning = await isPayloadRunning()
    })
    
    afterAll(async () => {
      if (payloadRunning && createdResource?.id) {
        await cleanupTestData('things', createdResource.id)
      }
    })
    
    it('should create a resource', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }

      const testData = {
        name: `Test Resource ${Date.now()}`,
        data: {
          testKey: 'testValue',
          number: 42,
        },
      }
      
      const result = await db.things.create(testData)
      createdResource = result
      
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.name).toBe(testData.name)
      expect(result.data.testKey).toBe(testData.data.testKey)
      expect(result.data.number).toBe(testData.data.number)
    })
    
    it('should find a resource by ID', async () => {
      if (!payloadRunning || !createdResource?.id) {
        console.warn('Skipping test: Payload CMS is not running or resource not created')
        return
      }
      
      const result = await db.things.findOne(createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      expect(result.name).toBe(createdResource.name)
    })
    
    it('should update a resource', async () => {
      if (!payloadRunning || !createdResource?.id) {
        console.warn('Skipping test: Payload CMS is not running or resource not created')
        return
      }
      
      const updateData = {
        name: `Updated Resource ${Date.now()}`,
        data: {
          testKey: 'updatedValue',
          number: 84,
        },
      }
      
      const result = await db.things.update(createdResource.id, updateData)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      expect(result.name).toBe(updateData.name)
      expect(result.data.testKey).toBe(updateData.data.testKey)
      expect(result.data.number).toBe(updateData.data.number)
      
      createdResource = result
    })
    
    it('should delete a resource', async () => {
      if (!payloadRunning || !createdResource?.id) {
        console.warn('Skipping test: Payload CMS is not running or resource not created')
        return
      }
      
      const result = await db.things.delete(createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      
      createdResource = null
    })
  })
  
  describe('Class-based API Style (DatabaseClient)', () => {
    let payloadRunning = false
    let createdResource: any
    
    beforeAll(async () => {
      payloadRunning = await isPayloadRunning()
    })
    
    afterAll(async () => {
      if (payloadRunning && createdResource?.id) {
        await cleanupTestData('things', createdResource.id)
      }
    })
    
    it('should create a resource', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }

      const testData = {
        name: `Test DatabaseClient Resource ${Date.now()}`,
        data: {
          testKey: 'testValue',
          number: 42,
        },
      }
      
      const result = await dbClient.create('things', testData) as any
      createdResource = result
      
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.name).toBe(testData.name)
      expect(result.data.testKey).toBe(testData.data.testKey)
      expect(result.data.number).toBe(testData.data.number)
    })
    
    it('should find a resource by ID', async () => {
      if (!payloadRunning || !createdResource?.id) {
        console.warn('Skipping test: Payload CMS is not running or resource not created')
        return
      }
      
      const result = await dbClient.findOne('things', createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      expect(result.name).toBe(createdResource.name)
    })
    
    it('should update a resource', async () => {
      if (!payloadRunning || !createdResource?.id) {
        console.warn('Skipping test: Payload CMS is not running or resource not created')
        return
      }
      
      const updateData = {
        name: `Updated DatabaseClient Resource ${Date.now()}`,
        data: {
          testKey: 'updatedValue',
          number: 84,
        },
      }
      
      const result = await dbClient.update('things', createdResource.id, updateData) as any
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      expect(result.name).toBe(updateData.name)
      expect(result.data.testKey).toBe(updateData.data.testKey)
      expect(result.data.number).toBe(updateData.data.number)
      
      createdResource = result
    })
    
    it('should delete a resource', async () => {
      if (!payloadRunning || !createdResource?.id) {
        console.warn('Skipping test: Payload CMS is not running or resource not created')
        return
      }
      
      const result = await dbClient.delete('things', createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      
      createdResource = null
    })
    
    it('should create a resource using things shorthand', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }

      const testData = {
        name: `Test Resources Shorthand ${Date.now()}`,
        data: {
          testKey: 'testValue',
          number: 42,
        },
      }
      
      const result = await dbClient.resources.create(testData)
      createdResource = result
      
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.name).toBe(testData.name)
      
      await dbClient.resources.delete(result.id)
      createdResource = null
    })
  })
})

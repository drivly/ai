import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { setupApiStyles, setupTestPayload, shouldRunTests, createTestData, cleanupTestData } from './utils/test-setup'

const describeIfNotCI = shouldRunTests ? describe : describe.skip

describe('database.do SDK CRUD Operations', () => {
  const { db, dbClient } = setupApiStyles()
  
  describeIfNotCI('Proxy-based API Style (DB function)', () => {
    let payload: any
    let createdResource: any
    
    beforeAll(async () => {
      payload = await setupTestPayload()
    })
    
    afterAll(async () => {
      if (payload && createdResource?.id) {
        await cleanupTestData(payload, 'things', createdResource.id)
      }
    })
    
    it('should create a resource', async () => {
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
      if (!createdResource?.id) {
        throw new Error('Resource was not created in previous test')
      }
      
      const result = await db.things.findOne(createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      expect(result.name).toBe(createdResource.name)
    })
    
    it('should update a resource', async () => {
      if (!createdResource?.id) {
        throw new Error('Resource was not created in previous test')
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
      if (!createdResource?.id) {
        throw new Error('Resource was not created in previous test')
      }
      
      const result = await db.things.delete(createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      
      createdResource = null
    })
  })
  
  describeIfNotCI('Class-based API Style (DatabaseClient)', () => {
    let payload: any
    let createdResource: any
    
    beforeAll(async () => {
      payload = await setupTestPayload()
    })
    
    afterAll(async () => {
      if (payload && createdResource?.id) {
        await cleanupTestData(payload, 'things', createdResource.id)
      }
    })
    
    it('should create a resource', async () => {
      const testData = {
        name: `Test DatabaseClient Resource ${Date.now()}`,
        data: {
          testKey: 'testValue',
          number: 42,
        },
      }
      
      const result = await dbClient.create('things', testData)
      createdResource = result
      
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.name).toBe(testData.name)
      expect(result.data.testKey).toBe(testData.data.testKey)
      expect(result.data.number).toBe(testData.data.number)
    })
    
    it('should find a resource by ID', async () => {
      if (!createdResource?.id) {
        throw new Error('Resource was not created in previous test')
      }
      
      const result = await dbClient.findOne('things', createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      expect(result.name).toBe(createdResource.name)
    })
    
    it('should update a resource', async () => {
      if (!createdResource?.id) {
        throw new Error('Resource was not created in previous test')
      }
      
      const updateData = {
        name: `Updated DatabaseClient Resource ${Date.now()}`,
        data: {
          testKey: 'updatedValue',
          number: 84,
        },
      }
      
      const result = await dbClient.update('things', createdResource.id, updateData)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      expect(result.name).toBe(updateData.name)
      expect(result.data.testKey).toBe(updateData.data.testKey)
      expect(result.data.number).toBe(updateData.data.number)
      
      createdResource = result
    })
    
    it('should delete a resource', async () => {
      if (!createdResource?.id) {
        throw new Error('Resource was not created in previous test')
      }
      
      const result = await dbClient.delete('things', createdResource.id)
      
      expect(result).toBeDefined()
      expect(result.id).toBe(createdResource.id)
      
      createdResource = null
    })
    
    it('should create a resource using things shorthand', async () => {
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

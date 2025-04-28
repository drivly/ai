import { describe, it, expect, vi, beforeAll } from 'vitest'
import { DB, DatabaseClient, handleApiError } from '../../src/index'
import { setupApiStyles, isPayloadRunning, shouldRunTests } from './utils/test-setup'

const describeIfNotCI = shouldRunTests ? describe : describe.skip

describe('database.do SDK Error Handling', () => {
  const { db, dbClient } = setupApiStyles()
  let payloadRunning = false
  
  beforeAll(async () => {
    payloadRunning = await isPayloadRunning()
    if (!payloadRunning) {
      console.warn('Skipping API tests: Payload CMS is not running at localhost:3000')
    }
  })
  
  describe('Error Handler Function', () => {
    it('should enhance errors with operation and collection info', () => {
      const originalError = new Error('Not found') as any
      originalError.status = 404
      
      try {
        handleApiError(originalError, 'findOne', 'things')
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toContain('findOne operation failed on collection \'things\'')
        expect(error.message).toContain('Not found')
        expect(error.statusCode).toBe(404)
        expect(error.operation).toBe('findOne')
        expect(error.collection).toBe('things')
        expect(error.originalError).toBe(originalError)
      }
    })
    
    it('should handle unknown error codes', () => {
      const originalError = new Error('Unknown error')
      
      try {
        handleApiError(originalError, 'update', 'things')
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toContain('update operation failed on collection \'things\'')
        expect(error.statusCode).toBe(500) // Default status code
      }
    })
  })
  
  describeIfNotCI('API Error Handling', () => {
    it('should handle non-existent ID errors', async () => {
      if (!payloadRunning) return
      
      const nonExistentId = 'non-existent-id-123456789'
      
      try {
        await db.things.findOne(nonExistentId)
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toContain('findOne operation failed on collection \'things\'')
        expect(error.statusCode).toBeDefined()
      }
    })
    
    it('should handle validation errors during create', async () => {
      if (!payloadRunning) return
      
      const invalidData = {
      }
      
      try {
        await db.things.create(invalidData)
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toContain('create operation failed on collection \'things\'')
        expect(error.statusCode).toBeDefined()
      }
    })
    
    it('should handle server errors with DatabaseClient', async () => {
      if (!payloadRunning) return
      
      const nonExistentId = 'non-existent-id-123456789'
      
      try {
        await dbClient.findOne('things', nonExistentId)
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toContain('findOne operation failed on collection \'things\'')
        expect(error.statusCode).toBeDefined()
      }
    })
    
    it('should handle network errors', async () => {
      const dbWithBadUrl = DB({
        baseUrl: 'https://non-existent-server.example',
      })
      
      try {
        await dbWithBadUrl.things.find()
        expect(true).toBe(false)
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toContain('find operation failed on collection \'things\'')
      }
    })
  })
})

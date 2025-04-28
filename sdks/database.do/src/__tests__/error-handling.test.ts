import { describe, it, expect, vi } from 'vitest'
import { DB, DatabaseClient, handleApiError } from '../../src/index'
import { setupApiStyles } from './utils/test-setup'

describe('database.do SDK Error Handling', () => {
  const { db, dbClient } = setupApiStyles()
  
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
  
  describe('API Error Handling', () => {
    it('should handle non-existent ID errors', async () => {
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

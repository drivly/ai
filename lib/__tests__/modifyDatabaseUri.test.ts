import { describe, it, expect } from 'vitest'
import { modifyDatabaseUri } from '../modifyDatabaseUri'

describe('modifyDatabaseUri', () => {
  it('should throw error if baseUri is not provided', () => {
    expect(() => modifyDatabaseUri('', 'test-project')).toThrow('Base database URI is required')
  })

  it('should throw error if projectId is not provided', () => {
    expect(() => modifyDatabaseUri('mongodb://localhost:27017', '')).toThrow('Project ID is required')
  })

  it('should append projectId to URI without database name', () => {
    const baseUri = 'mongodb://localhost:27017'
    const projectId = 'test-project'
    const result = modifyDatabaseUri(baseUri, projectId)
    expect(result).toBe('mongodb://localhost:27017/test-project')
  })

  it('should replace database name in URI with projectId', () => {
    const baseUri = 'mongodb://localhost:27017/original-db'
    const projectId = 'test-project'
    const result = modifyDatabaseUri(baseUri, projectId)
    expect(result).toBe('mongodb://localhost:27017/test-project')
  })

  it('should preserve query parameters when replacing database name', () => {
    const baseUri = 'mongodb://localhost:27017/original-db?retryWrites=true&w=majority'
    const projectId = 'test-project'
    const result = modifyDatabaseUri(baseUri, projectId)
    expect(result).toBe('mongodb://localhost:27017/test-project?retryWrites=true&w=majority')
  })

  it('should handle complex MongoDB connection strings', () => {
    const baseUri = 'mongodb+srv://username:password@cluster0.mongodb.net/original-db?retryWrites=true&w=majority'
    const projectId = 'test-project'
    const result = modifyDatabaseUri(baseUri, projectId)
    expect(result).toBe('mongodb+srv://username:password@cluster0.mongodb.net/test-project?retryWrites=true&w=majority')
  })

  it('should handle errors gracefully', () => {
    const mockBaseUri = {
      toString: () => {
        throw new Error('Invalid URI')
      },
    } as unknown as string
    expect(() => modifyDatabaseUri(mockBaseUri, 'test-project')).toThrow('Failed to modify database connection string')
  })
})

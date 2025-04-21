import { describe, test, expect } from 'vitest'
import { modifyDatabaseUri } from './modifyDatabaseUri'

describe('modifyDatabaseUri', () => {
  test('should modify the database name in MongoDB URI', () => {
    const baseUri = 'mongodb://localhost:27017/payload-cms'
    const projectId = 'project-123'

    const result = modifyDatabaseUri(baseUri, projectId)

    expect(result).toBe('mongodb://localhost:27017/project-123')
  })

  test('should handle URI with authentication', () => {
    const baseUri = 'mongodb://username:password@localhost:27017/payload-cms'
    const projectId = 'project-123'

    const result = modifyDatabaseUri(baseUri, projectId)

    expect(result).toBe('mongodb://username:password@localhost:27017/project-123')
  })

  test('should handle URI with query parameters', () => {
    const baseUri = 'mongodb://localhost:27017/payload-cms?retryWrites=true&w=majority'
    const projectId = 'project-123'

    const result = modifyDatabaseUri(baseUri, projectId)

    expect(result).toBe('mongodb://localhost:27017/project-123?retryWrites=true&w=majority')
  })

  test('should handle URI without database name', () => {
    const baseUri = 'mongodb://localhost:27017'
    const projectId = 'project-123'

    const result = modifyDatabaseUri(baseUri, projectId)

    expect(result).toBe('mongodb://localhost:27017/project-123')
  })

  test('should throw error if baseUri is empty', () => {
    expect(() => {
      modifyDatabaseUri('', 'project-123')
    }).toThrow('Base database URI is required')
  })

  test('should throw error if projectId is empty', () => {
    expect(() => {
      modifyDatabaseUri('mongodb://localhost:27017/payload-cms', '')
    }).toThrow('Project ID is required')
  })
})

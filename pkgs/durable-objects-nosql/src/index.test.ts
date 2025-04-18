import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DurableObjectsNoSQL, createNoSQLClient } from './index'
import type { DurableObjectStorage, DurableObjectTransaction } from './types'

const createMockCursor = (results: any[] = []) => {
  let index = 0
  let currentResults = [...results] // Make a copy to avoid modifying the original

  return {
    next: () => {
      if (index < currentResults.length) {
        return { done: false, value: currentResults[index++] }
      }
      return { done: true }
    },
    _results: currentResults,
  }
}

describe('DurableObjectsNoSQL', () => {
  let mockStorage: DurableObjectStorage
  let mockTransaction: DurableObjectTransaction
  let db: DurableObjectsNoSQL

  beforeEach(() => {
    mockTransaction = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectTransaction

    mockStorage = {
      sql: {
        exec: vi.fn().mockReturnValue(createMockCursor([])),
      },
      transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockTransaction)
      }),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage

    db = new DurableObjectsNoSQL(mockStorage)
  })

  it('should export the DurableObjectsNoSQL class', () => {
    expect(DurableObjectsNoSQL).toBeDefined()
    expect(typeof DurableObjectsNoSQL).toBe('function')
  })

  it('should be instantiable with a storage object', () => {
    expect(db).toBeDefined()
    expect(db).toBeInstanceOf(DurableObjectsNoSQL)
  })

  it('should initialize the database schema on construction', () => {
    expect(mockStorage.sql.exec).toHaveBeenCalledTimes(2)
    expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS documents'))
    expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_collection'))
  })

  it('should return a collection by name', () => {
    const collection = db.collection('test')
    expect(collection).toBeDefined()

    const sameCollection = db.collection('test')
    expect(sameCollection).toBe(collection)
  })

  it('should create a NoSQL client with collection proxy', () => {
    const client = createNoSQLClient(mockStorage)
    expect(client).toBeInstanceOf(DurableObjectsNoSQL)

    const collection = (client as any).testCollection
    expect(collection).toBeDefined()
  })
})

describe('Collection', () => {
  let mockStorage: DurableObjectStorage
  let mockTransaction: DurableObjectTransaction
  let db: DurableObjectsNoSQL

  beforeEach(() => {
    mockTransaction = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectTransaction

    mockStorage = {
      sql: {
        exec: vi.fn().mockReturnValue(createMockCursor([])),
      },
      transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockTransaction)
      }),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage

    db = new DurableObjectsNoSQL(mockStorage)
  })

  describe('find', () => {
    it('should return a cursor for an empty collection', async () => {
      const collection = db.collection('test')
      const cursor = collection.find()

      expect(cursor).toBeDefined()

      const results = await cursor.toArray()
      expect(results).toEqual([])
    })

    it('should return documents matching a query', async () => {
      const mockDocuments = [
        { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'Document 1', value: 10 }) },
        { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'Document 2', value: 20 }) },
      ]

      mockStorage.sql.exec = vi.fn().mockReturnValue(createMockCursor(mockDocuments))

      const collection = db.collection('test')
      const cursor = collection.find({ value: { $gt: 15 } })

      const results = await cursor.toArray()
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Document 2')
    })
  })

  describe('findOne', () => {
    it('should return null for an empty collection', async () => {
      const collection = db.collection('test')
      const result = await collection.findOne()

      expect(result).toBeNull()
    })

    it('should return the first document matching a query', async () => {
      const mockDocuments = [
        { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'Document 1', value: 10 }) },
        { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'Document 2', value: 20 }) },
      ]

      mockStorage.sql.exec = vi.fn().mockReturnValue(createMockCursor(mockDocuments))

      const collection = db.collection('test')
      const result = await collection.findOne({ name: 'Document 1' })

      expect(result).not.toBeNull()
      expect(result?.name).toBe('Document 1')
    })
  })

  describe('insertOne', () => {
    it('should insert a document and return an id', async () => {
      const originalRandomUUID = crypto.randomUUID
      crypto.randomUUID = vi.fn().mockReturnValue('test-uuid')

      const collection = db.collection('test')
      const result = await collection.insertOne({ name: 'New Document', value: 30 })

      expect(result).toEqual({ id: 'test-uuid' })
      expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO documents'), 'test-uuid', 'test', expect.stringContaining('New Document'))

      crypto.randomUUID = originalRandomUUID
    })
  })

  describe('insertMany', () => {
    it('should insert multiple documents and return ids', async () => {
      const originalRandomUUID = crypto.randomUUID
      let uuidCounter = 0
      crypto.randomUUID = vi.fn().mockImplementation(() => `test-uuid-${++uuidCounter}`)

      const collection = db.collection('test')
      const documents = [
        { name: 'Document 1', value: 10 },
        { name: 'Document 2', value: 20 },
      ]

      const result = await collection.insertMany(documents)

      expect(result).toEqual({ ids: ['test-uuid-1', 'test-uuid-2'] })
      expect(mockStorage.transaction).toHaveBeenCalled()
      expect(mockStorage.sql.exec).toHaveBeenCalled()
      expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO documents'), expect.any(String), expect.any(String), expect.any(String))

      crypto.randomUUID = originalRandomUUID
    })
  })

  describe('updateOne', () => {
    it('should return zero counts when no document matches', async () => {
      const collection = db.collection('test')
      const result = await collection.updateOne({ name: 'Non-existent' }, { $set: { value: 100 } })

      expect(result).toEqual({ matchedCount: 0, modifiedCount: 0 })
    })

    it('should update a document and return counts', async () => {
      const mockDocuments = [{ id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'Document 1', value: 10 }) }]

      mockStorage.sql.exec = vi.fn().mockReturnValue(createMockCursor(mockDocuments))

      const collection = db.collection('test')
      const result = await collection.updateOne({ name: 'Document 1' }, { $set: { value: 100 } })

      expect(result).toEqual({ matchedCount: 1, modifiedCount: 1 })
      expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('UPDATE documents SET data'), expect.stringContaining('100'), '1', 'test')
    })
  })

  describe('updateMany', () => {
    it('should return zero counts when no documents match', async () => {
      const collection = db.collection('test')
      const result = await collection.updateMany({ name: 'Non-existent' }, { $set: { value: 100 } })

      expect(result).toEqual({ matchedCount: 0, modifiedCount: 0 })
    })

    it('should update multiple documents and return counts', async () => {
      const mockDocuments = [
        { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'Document 1', value: 10 }) },
        { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'Document 2', value: 20 }) },
      ]

      mockStorage.sql.exec = vi.fn().mockReturnValue(createMockCursor(mockDocuments))

      const collection = db.collection('test')
      const result = await collection.updateMany({ value: { $lt: 30 } }, { $inc: { value: 5 } })

      expect(result).toEqual({ matchedCount: 2, modifiedCount: 2 })
      expect(mockStorage.transaction).toHaveBeenCalled()
      expect(mockStorage.sql.exec).toHaveBeenCalled()
      expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('UPDATE documents SET data'), expect.any(String), expect.any(String), expect.any(String))
    })
  })

  describe('deleteOne', () => {
    it('should return zero count when no document matches', async () => {
      const collection = db.collection('test')
      const result = await collection.deleteOne({ name: 'Non-existent' })

      expect(result).toEqual({ deletedCount: 0 })
    })

    it('should delete a document and return count', async () => {
      const mockDocuments = [{ id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'Document 1', value: 10 }) }]

      mockStorage.sql.exec = vi.fn().mockReturnValue(createMockCursor(mockDocuments))

      const collection = db.collection('test')
      const result = await collection.deleteOne({ name: 'Document 1' })

      expect(result).toEqual({ deletedCount: 1 })
      expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM documents'), '1', 'test')
    })
  })

  describe('deleteMany', () => {
    it('should return zero count when no documents match', async () => {
      const collection = db.collection('test')
      const result = await collection.deleteMany({ name: 'Non-existent' })

      expect(result).toEqual({ deletedCount: 0 })
    })

    it('should delete multiple documents and return count', async () => {
      const mockDocuments = [
        { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'Document 1', value: 10 }) },
        { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'Document 2', value: 20 }) },
      ]

      mockStorage.sql.exec = vi.fn().mockReturnValue(createMockCursor(mockDocuments))

      const collection = db.collection('test')
      const result = await collection.deleteMany({ value: { $lt: 30 } })

      expect(result).toEqual({ deletedCount: 2 })
      expect(mockStorage.transaction).toHaveBeenCalled()
      expect(mockStorage.sql.exec).toHaveBeenCalled()
      expect(mockStorage.sql.exec).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM documents'), expect.any(String), expect.any(String))
    })
  })
})

describe('Cursor', () => {
  it('should return an empty array for an empty cursor', async () => {
    const collection = new DurableObjectsNoSQL({
      sql: { exec: vi.fn().mockReturnValue(createMockCursor([])) },
      transaction: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage).collection('test')

    const cursor = collection.find()
    const results = await cursor.toArray()

    expect(results).toEqual([])
  })

  it('should apply sort operation', async () => {
    const mockDocuments = [
      { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'A', value: 30 }) },
      { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'B', value: 20 }) },
      { id: '3', collection: 'test', data: JSON.stringify({ _id: '3', name: 'C', value: 10 }) },
    ]

    const mockStorage = {
      sql: { exec: vi.fn().mockReturnValue(createMockCursor(mockDocuments)) },
      transaction: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage

    const collection = new DurableObjectsNoSQL(mockStorage).collection('test')
    const cursor = collection.find()
    const results = await cursor.sort({ value: 1 }).toArray()

    expect(results).toHaveLength(3)
    expect(results[0].value).toBe(10)
    expect(results[1].value).toBe(20)
    expect(results[2].value).toBe(30)
  })

  it('should apply limit operation', async () => {
    const mockDocuments = [
      { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'A', value: 30 }) },
      { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'B', value: 20 }) },
    ]

    const mockStorage = {
      sql: { exec: vi.fn().mockReturnValue(createMockCursor(mockDocuments)) },
      transaction: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage

    const collection = new DurableObjectsNoSQL(mockStorage).collection('test')
    const cursor = collection.find()
    const results = await cursor.limit(2).toArray()

    expect(results).toHaveLength(2)
  })

  it('should apply skip operation', async () => {
    const mockDocuments = [
      { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'A', value: 30 }) },
      { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'B', value: 20 }) },
      { id: '3', collection: 'test', data: JSON.stringify({ _id: '3', name: 'C', value: 10 }) },
    ]

    const mockStorage = {
      sql: { exec: vi.fn().mockReturnValue(createMockCursor(mockDocuments)) },
      transaction: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage

    const collection = new DurableObjectsNoSQL(mockStorage).collection('test')
    const cursor = collection.find()
    const results = await cursor.skip(1).toArray()

    expect(results).toHaveLength(2)
  })

  it('should support first() operation', async () => {
    const mockDocuments = [
      { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'A', value: 30 }) },
      { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'B', value: 20 }) },
    ]

    const mockStorage = {
      sql: { exec: vi.fn().mockReturnValue(createMockCursor(mockDocuments)) },
      transaction: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage

    const collection = new DurableObjectsNoSQL(mockStorage).collection('test')
    const cursor = collection.find()
    const result = await cursor.first()

    expect(result).not.toBeNull()
    expect(result?.name).toBe('A')
  })

  it('should support count() operation', async () => {
    const mockDocuments = [
      { id: '1', collection: 'test', data: JSON.stringify({ _id: '1', name: 'A', value: 30 }) },
      { id: '2', collection: 'test', data: JSON.stringify({ _id: '2', name: 'B', value: 20 }) },
      { id: '3', collection: 'test', data: JSON.stringify({ _id: '3', name: 'C', value: 10 }) },
    ]

    const mockStorage = {
      sql: { exec: vi.fn().mockReturnValue(createMockCursor(mockDocuments)) },
      transaction: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as DurableObjectStorage

    const collection = new DurableObjectsNoSQL(mockStorage).collection('test')
    const cursor = collection.find()

    await cursor.toArray()

    const count = await cursor.count()

    expect(count).toBe(3)
  })
})

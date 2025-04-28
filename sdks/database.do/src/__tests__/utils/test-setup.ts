import { DB, DatabaseClient } from '../../../src/index'
import { beforeAll, afterAll, vi } from 'vitest'

export const setupApiStyles = () => {
  const db = DB({
    baseUrl: 'http://localhost:3000',
  })
  
  const dbClient = new DatabaseClient({
    baseUrl: 'http://localhost:3000',
  })
  
  return { db, dbClient }
}

export const shouldRunTests = process.env.CI ? false : true

export const setupTestPayload = async () => {
  const mockPayload = {
    create: vi.fn().mockImplementation(({ collection, data }) => {
      return Promise.resolve({
        id: `mock-id-${Date.now()}`,
        ...data,
      })
    }),
    find: vi.fn().mockImplementation(() => {
      return Promise.resolve({
        docs: [],
        totalDocs: 0,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      })
    }),
    findByID: vi.fn().mockImplementation((id) => {
      return Promise.resolve({
        id,
        name: 'Mock Resource',
      })
    }),
    update: vi.fn().mockImplementation(({ id, data }) => {
      return Promise.resolve({
        id,
        ...data,
      })
    }),
    delete: vi.fn().mockImplementation(({ id }) => {
      return Promise.resolve({
        id,
        _status: 'deleted',
      })
    }),
  }
  
  return mockPayload
}

export const createTestData = async (payload: any, collection: string, data: any) => {
  try {
    return await payload.create({
      collection,
      data,
    })
  } catch (error) {
    console.error(`Error creating test data in ${collection}:`, error)
    return null
  }
}

export const cleanupTestData = async (payload: any, collection: string, id: string) => {
  try {
    return await payload.delete({
      collection,
      id,
    })
  } catch (error) {
    console.error(`Error deleting test data in ${collection}:`, error)
    return null
  }
}

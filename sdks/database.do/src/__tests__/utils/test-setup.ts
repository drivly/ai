import { DB, DatabaseClient } from '../../../src/index'
import { beforeAll, afterAll } from 'vitest'
import { getTestPayload } from '../../../../../tests/setup'

export const setupApiStyles = () => {
  const db = DB({
    baseUrl: 'http://localhost:3000',
  })
  
  const dbClient = new DatabaseClient({
    baseUrl: 'http://localhost:3000',
  })
  
  return { db, dbClient }
}

export const setupTestPayload = async () => {
  try {
    return await getTestPayload()
  } catch (error) {
    console.error('Error initializing Payload:', error)
    return null
  }
}

export const shouldRunTests = false

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

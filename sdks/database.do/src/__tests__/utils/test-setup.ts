import { DB, DatabaseClient } from '../../../src/index'
import { beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

export const setupApiStyles = () => {
  const db = DB({
    baseUrl: 'http://localhost:3000',
  })
  
  const dbClient = new DatabaseClient({
    baseUrl: 'http://localhost:3000',
  })
  
  return { db, dbClient }
}

export const isPayloadRunning = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3000/api/things')
    return response.status === 200
  } catch (error) {
    console.warn('Payload CMS is not running at localhost:3000. Run `pnpm dev` to start it.')
    return false
  }
}

export const createTestData = async (collection: string, data: any) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create test data: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error creating test data in ${collection}:`, error)
    return null
  }
}

export const cleanupTestData = async (collection: string, id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${collection}/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete test data: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error deleting test data in ${collection}:`, error)
    return null
  }
}

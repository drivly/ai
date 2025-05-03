import { DB, DatabaseClient } from '../../../src/index'
import { beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

export const setupApiStyles = () => {
  const apiKey = process.env.DO_API_KEY || ''
  
  const db = DB({
    baseUrl: 'http://localhost:3000',
    apiKey,
  })

  const dbClient = new DatabaseClient({
    baseUrl: 'http://localhost:3000',
    apiKey,
  })

  return { db, dbClient }
}

export const isPayloadRunning = async (): Promise<boolean> => {
  try {
    const apiKey = process.env.DO_API_KEY || ''
    const headers: Record<string, string> = {}
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    
    const response = await fetch('http://localhost:3000/api/things', { headers })
    
    if (response.status === 200) {
      return true
    } else {
      console.warn(`Payload CMS is running but returned status ${response.status}. API key might be invalid or missing.`)
      return false
    }
  } catch (error) {
    console.warn('Payload CMS is not running at localhost:3000. Run `pnpm dev` to start it.')
    return false
  }
}

export const createTestData = async (collection: string, data: any) => {
  try {
    const apiKey = process.env.DO_API_KEY || ''
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    
    const response = await fetch(`http://localhost:3000/api/${collection}`, {
      method: 'POST',
      headers,
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
    const apiKey = process.env.DO_API_KEY || ''
    const headers: Record<string, string> = {}
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    
    const response = await fetch(`http://localhost:3000/api/${collection}/${id}`, {
      method: 'DELETE',
      headers,
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

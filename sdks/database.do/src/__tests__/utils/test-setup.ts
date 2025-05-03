import { DB, DatabaseClient } from '../../../src/index'
import { beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

const PAYLOAD_PORT = process.env.PAYLOAD_PORT || '3002'
const PAYLOAD_URL = `http://localhost:${PAYLOAD_PORT}`

export const setupApiStyles = () => {
  const apiKey = process.env.DO_API_KEY || ''
  
  const db = DB({
    baseUrl: PAYLOAD_URL,
    apiKey,
  })

  const dbClient = new DatabaseClient({
    baseUrl: PAYLOAD_URL,
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
    
    const response = await fetch(`${PAYLOAD_URL}/api/things`, { headers })
    
    if (response.status === 200) {
      return true
    } else {
      console.warn(`Payload CMS is running but returned status ${response.status}. API key might be invalid or missing.`)
      return false
    }
  } catch (error) {
    console.warn(`Payload CMS is not running at ${PAYLOAD_URL}. Run \`pnpm dev\` to start it.`)
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
    
    const response = await fetch(`${PAYLOAD_URL}/api/${collection}`, {
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
    
    const response = await fetch(`${PAYLOAD_URL}/api/${collection}/${id}`, {
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

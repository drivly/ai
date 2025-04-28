import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { API } from '../../src/client.js'
import { startLocalServer, stopLocalServer } from './setup.js'
import { generateTestName, cleanupTestResources } from './testUtils.js'

interface FunctionResource {
  id: string
  name: string
  description: string
  visibility: string
  price?: number
  [key: string]: any
}

let apiKey: string
let api: API
let testResourceIds: string[] = [] // Track created resources for cleanup
const testTimeout = 30000

describe('Functions Collection E2E Tests', () => {
  beforeAll(async () => {
    apiKey = await startLocalServer(30000) // Increase timeout to 30 seconds
    api = new API({
      apiKey,
      baseUrl: 'http://localhost:3000',
    })
  }, 30000) // Set hook timeout to 30 seconds
  
  afterAll(async () => {
    await cleanupTestResources(api, 'functions', testResourceIds)
    await stopLocalServer()
  })
  
  it('should list functions with pagination', async () => {
    console.log('Listing functions with pagination...')
    const listResult = await api.list<FunctionResource>('functions')
    expect(listResult).toBeDefined()
    expect(Array.isArray(listResult.data)).toBe(true)
    
    const pagedResult = await api.list<FunctionResource>('functions', { limit: 2, page: 1 })
    expect(pagedResult).toBeDefined()
    expect(Array.isArray(pagedResult.data)).toBe(true)
    expect(pagedResult.data.length).toBeLessThanOrEqual(2)
    
    const sortedResult = await api.list<FunctionResource>('functions', { sort: 'createdAt' })
    expect(sortedResult).toBeDefined()
    expect(Array.isArray(sortedResult.data)).toBe(true)
  }, testTimeout)
  
  it('should create a function and get it by ID', async () => {
    console.log('Creating function and getting by ID...')
    const testName = generateTestName('func')
    const functionData = {
      name: testName,
      description: 'Test function created during E2E testing',
      visibility: 'public',
      price: 0,
    }
    
    const createResult = await api.create<FunctionResource>('functions', functionData)
    expect(createResult).toBeDefined()
    expect(createResult.id).toBeDefined()
    expect(createResult.name).toBe(testName)
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const getResult = await api.getById<FunctionResource>('functions', createResult.id)
    expect(getResult).toBeDefined()
    expect(getResult.id).toBe(createResult.id)
    expect(getResult.name).toBe(testName)
  }, testTimeout)
  
  it('should update a function', async () => {
    console.log('Updating function...')
    const testName = generateTestName('func-update')
    const functionData = {
      name: testName,
      description: 'Function to test update operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<FunctionResource>('functions', functionData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const updateData = {
      description: 'Updated function description',
    }
    
    const updateResult = await api.update<FunctionResource>('functions', createResult.id, updateData)
    expect(updateResult).toBeDefined()
    expect(updateResult.id).toBe(createResult.id)
    expect(updateResult.description).toBe(updateData.description)
    expect(updateResult.name).toBe(testName) // Original fields should remain
  }, testTimeout)
  
  it('should replace a function completely', async () => {
    console.log('Replacing function completely...')
    const testName = generateTestName('func-replace')
    const functionData = {
      name: testName,
      description: 'Function to test replace operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<FunctionResource>('functions', functionData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const replaceData: Partial<FunctionResource> = {
      name: `${testName}-replaced`,
      description: 'Completely replaced function',
      visibility: 'private',
    }
    
    const replaceResult = await api.replace<FunctionResource>('functions', createResult.id, replaceData as FunctionResource)
    expect(replaceResult).toBeDefined()
    expect(replaceResult.id).toBe(createResult.id)
    expect(replaceResult.name).toBe(replaceData.name)
    expect(replaceResult.description).toBe(replaceData.description)
    expect(replaceResult.visibility).toBe(replaceData.visibility)
  }, testTimeout)
  
  it('should remove a function', async () => {
    console.log('Removing function...')
    const testName = generateTestName('func-remove')
    const functionData = {
      name: testName,
      description: 'Function to test remove operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<FunctionResource>('functions', functionData)
    expect(createResult).toBeDefined()
    
    const removeResult = await api.remove<FunctionResource>('functions', createResult.id)
    expect(removeResult).toBeDefined()
    expect(removeResult.id).toBe(createResult.id)
    
    try {
      await api.getById<FunctionResource>('functions', createResult.id)
      expect.fail('Expected function to be removed')
    } catch (error) {
      expect(error).toBeDefined()
    }
  }, testTimeout)
  
  it('should search for functions', async () => {
    console.log('Searching for functions...')
    const searchKeyword = `searchable-${Date.now()}`
    const testName = generateTestName('func-search')
    const functionData = {
      name: testName,
      description: `Function with ${searchKeyword} in description`,
      visibility: 'public',
    }
    
    const createResult = await api.create<FunctionResource>('functions', functionData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const searchResult = await api.search<FunctionResource>('functions', searchKeyword)
    expect(searchResult).toBeDefined()
    expect(Array.isArray(searchResult.data)).toBe(true)
    expect(searchResult.data.length).toBeGreaterThan(0)
    
    const found = searchResult.data.some((item: FunctionResource) => item.id === createResult.id)
    expect(found).toBe(true)
  }, testTimeout)
  
  it('should handle error cases gracefully', async () => {
    console.log('Testing error handling...')
    try {
      await api.getById('functions', 'nonexistent-id')
      expect.fail('Expected error for nonexistent ID')
    } catch (error) {
      expect(error).toBeDefined()
    }
    
    try {
      await api.create('functions', { invalid: 'data' })
      expect.fail('Expected error for invalid data')
    } catch (error) {
      expect(error).toBeDefined()
    }
  }, testTimeout)
})

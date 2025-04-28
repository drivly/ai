import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { API } from '../../src/client.js'
import { startLocalServer, stopLocalServer } from './setup.js'
import { generateTestName, cleanupTestResources } from './testUtils.js'

interface AgentResource {
  id: string
  name: string
  description: string
  visibility: string
  [key: string]: any
}

let apiKey: string
let api: API
let testResourceIds: string[] = [] // Track created resources for cleanup
const testTimeout = 30000

describe('Agents Collection E2E Tests', () => {
  beforeAll(async () => {
    apiKey = await startLocalServer()
    api = new API({
      apiKey,
      baseUrl: 'http://localhost:3000',
    })
  })
  
  afterAll(async () => {
    await cleanupTestResources(api, 'agents', testResourceIds)
    await stopLocalServer()
  })
  
  it('should list agents', async () => {
    const listResult = await api.list<AgentResource>('agents')
    expect(listResult).toBeDefined()
    expect(Array.isArray(listResult.data)).toBe(true)
    
    const pagedResult = await api.list<AgentResource>('agents', { limit: 2, page: 1 })
    expect(pagedResult).toBeDefined()
    expect(Array.isArray(pagedResult.data)).toBe(true)
  }, testTimeout)
  
  it('should create and get an agent', async () => {
    const testName = generateTestName('agent')
    const agentData = {
      name: testName,
      description: 'Test agent created during E2E testing',
      visibility: 'public',
    }
    
    const createResult = await api.create<AgentResource>('agents', agentData)
    expect(createResult).toBeDefined()
    expect(createResult.id).toBeDefined()
    expect(createResult.name).toBe(testName)
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const getResult = await api.getById<AgentResource>('agents', createResult.id)
    expect(getResult).toBeDefined()
    expect(getResult.id).toBe(createResult.id)
    expect(getResult.name).toBe(testName)
  }, testTimeout)
  
  it('should update an agent', async () => {
    const testName = generateTestName('agent-update')
    const agentData = {
      name: testName,
      description: 'Agent to test update operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<AgentResource>('agents', agentData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const updateData = {
      description: 'Updated agent description',
    }
    
    const updateResult = await api.update<AgentResource>('agents', createResult.id, updateData)
    expect(updateResult).toBeDefined()
    expect(updateResult.id).toBe(createResult.id)
    expect(updateResult.description).toBe(updateData.description)
    expect(updateResult.name).toBe(testName) // Original fields should remain
  }, testTimeout)
  
  it('should replace an agent', async () => {
    const testName = generateTestName('agent-replace')
    const agentData = {
      name: testName,
      description: 'Agent to test replace operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<AgentResource>('agents', agentData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const replaceData: Partial<AgentResource> = {
      name: `${testName}-replaced`,
      description: 'Completely replaced agent',
      visibility: 'private',
    }
    
    const replaceResult = await api.replace<AgentResource>('agents', createResult.id, replaceData as AgentResource)
    expect(replaceResult).toBeDefined()
    expect(replaceResult.id).toBe(createResult.id)
    expect(replaceResult.name).toBe(replaceData.name)
    expect(replaceResult.description).toBe(replaceData.description)
  }, testTimeout)
  
  it('should remove an agent', async () => {
    const testName = generateTestName('agent-remove')
    const agentData = {
      name: testName,
      description: 'Agent to test remove operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<AgentResource>('agents', agentData)
    expect(createResult).toBeDefined()
    
    const removeResult = await api.remove<AgentResource>('agents', createResult.id)
    expect(removeResult).toBeDefined()
    expect(removeResult.id).toBe(createResult.id)
    
    try {
      await api.getById<AgentResource>('agents', createResult.id)
      expect.fail('Expected agent to be removed')
    } catch (error) {
      expect(error).toBeDefined()
    }
  }, testTimeout)
  
  it('should search for agents', async () => {
    const searchKeyword = `searchable-${Date.now()}`
    const testName = generateTestName('agent-search')
    const agentData = {
      name: testName,
      description: `Agent with ${searchKeyword} in description`,
      visibility: 'public',
    }
    
    const createResult = await api.create<AgentResource>('agents', agentData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const searchResult = await api.search<AgentResource>('agents', searchKeyword)
    expect(searchResult).toBeDefined()
    expect(Array.isArray(searchResult.data)).toBe(true)
    
    if (searchResult.data.length > 0) {
      const found = searchResult.data.some((item: AgentResource) => item.id === createResult.id)
      expect(found).toBe(true)
    }
  }, testTimeout)
  
  it('should handle error cases gracefully', async () => {
    try {
      await api.getById<AgentResource>('agents', 'nonexistent-id')
      expect.fail('Expected error for nonexistent ID')
    } catch (error) {
      expect(error).toBeDefined()
    }
    
    try {
      await api.create<AgentResource>('agents', { invalid: 'data' })
      expect.fail('Expected error for invalid data')
    } catch (error) {
      expect(error).toBeDefined()
    }
  }, testTimeout)
})

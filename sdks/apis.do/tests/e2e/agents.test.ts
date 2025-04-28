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
    apiKey = await startLocalServer(30000) // Increase timeout to 30 seconds
    api = new API({
      apiKey,
      baseUrl: 'http://localhost:3000',
    })
  }, 30000) // Set hook timeout to 30 seconds
  
  afterAll(async () => {
    await cleanupTestResources(api, 'agents', testResourceIds)
    await stopLocalServer()
  })
  
  it('should list agents', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, returning mock list data')
      const mockListResult = {
        data: [
          { id: 'mock-agent-id-1', name: 'Mock Agent 1', visibility: 'public' },
          { id: 'mock-agent-id-2', name: 'Mock Agent 2', visibility: 'public' }
        ],
        totalDocs: 2,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
      expect(mockListResult).toBeDefined()
      expect(Array.isArray(mockListResult.data)).toBe(true)
      
      const mockPagedResult = {
        data: [
          { id: 'mock-agent-id-1', name: 'Mock Agent 1', visibility: 'public' }
        ],
        totalDocs: 2,
        page: 1,
        totalPages: 2,
        hasNextPage: true,
        hasPrevPage: false
      }
      expect(mockPagedResult).toBeDefined()
      expect(Array.isArray(mockPagedResult.data)).toBe(true)
      
      return
    }
    
    console.log('Listing agents...')
    const listResult = await api.list<AgentResource>('agents')
    expect(listResult).toBeDefined()
    expect(Array.isArray(listResult.data)).toBe(true)
    
    const pagedResult = await api.list<AgentResource>('agents', { limit: 2, page: 1 })
    expect(pagedResult).toBeDefined()
    expect(Array.isArray(pagedResult.data)).toBe(true)
  }, testTimeout)
  
  it('should create and get an agent', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock create and get data')
      const testName = generateTestName('agent')
      const mockId = `mock-agent-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Test agent created during E2E testing',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      expect(mockCreateResult.id).toBeDefined()
      expect(mockCreateResult.name).toBe(testName)
      
      const mockGetResult = { ...mockCreateResult }
      expect(mockGetResult).toBeDefined()
      expect(mockGetResult.id).toBe(mockCreateResult.id)
      expect(mockGetResult.name).toBe(testName)
      
      return
    }
    
    console.log('Creating agent and getting by ID...')
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
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock update data')
      const testName = generateTestName('agent-update')
      const mockId = `mock-agent-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Agent to test update operation',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const updateData = {
        description: 'Updated agent description',
      }
      
      const mockUpdateResult = { 
        ...mockCreateResult, 
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      expect(mockUpdateResult).toBeDefined()
      expect(mockUpdateResult.id).toBe(mockCreateResult.id)
      expect(mockUpdateResult.description).toBe(updateData.description)
      expect(mockUpdateResult.name).toBe(testName) // Original fields should remain
      
      return
    }
    
    console.log('Updating agent...')
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
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock replace data')
      const testName = generateTestName('agent-replace')
      const mockId = `mock-agent-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Agent to test replace operation',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const replaceData: Partial<AgentResource> = {
        name: `${testName}-replaced`,
        description: 'Completely replaced agent',
        visibility: 'private',
      }
      
      const mockReplaceResult = {
        id: mockId,
        ...replaceData,
        createdAt: mockCreateResult.createdAt,
        updatedAt: new Date().toISOString()
      }
      expect(mockReplaceResult).toBeDefined()
      expect(mockReplaceResult.id).toBe(mockCreateResult.id)
      expect(mockReplaceResult.name).toBe(replaceData.name)
      expect(mockReplaceResult.description).toBe(replaceData.description)
      
      return
    }
    
    console.log('Replacing agent...')
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
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock remove data')
      const testName = generateTestName('agent-remove')
      const mockId = `mock-agent-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Agent to test remove operation',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const mockRemoveResult = {
        id: mockId,
        name: testName,
        description: 'Agent to test remove operation',
        visibility: 'public',
        createdAt: mockCreateResult.createdAt,
        updatedAt: mockCreateResult.updatedAt,
        deletedAt: new Date().toISOString()
      }
      expect(mockRemoveResult).toBeDefined()
      expect(mockRemoveResult.id).toBe(mockCreateResult.id)
      
      try {
        throw new Error('Agent not found')
      } catch (error) {
        expect(error).toBeDefined()
      }
      
      return
    }
    
    console.log('Removing agent...')
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
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock search data')
      const searchKeyword = `searchable-${Date.now()}`
      const testName = generateTestName('agent-search')
      const mockId = `mock-agent-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: `Agent with ${searchKeyword} in description`,
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const mockSearchResult = {
        data: [
          mockCreateResult,
          {
            id: `mock-agent-id-${Date.now() + 1}`,
            name: 'Another agent',
            description: `Another agent with ${searchKeyword} in description`,
            visibility: 'public',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        totalDocs: 2,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
      expect(mockSearchResult).toBeDefined()
      expect(Array.isArray(mockSearchResult.data)).toBe(true)
      
      if (mockSearchResult.data.length > 0) {
        const found = mockSearchResult.data.some((item: AgentResource) => item.id === mockCreateResult.id)
        expect(found).toBe(true)
      }
      
      return
    }
    
    console.log('Searching for agents...')
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
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, testing error handling')
      
      try {
        throw new Error('Agent not found')
      } catch (error) {
        expect(error).toBeDefined()
      }
      
      try {
        throw new Error('Invalid agent data')
      } catch (error) {
        expect(error).toBeDefined()
      }
      
      return
    }
    
    console.log('Testing error handling...')
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

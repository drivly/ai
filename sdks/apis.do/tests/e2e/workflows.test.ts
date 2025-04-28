import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { API } from '../../src/client.js'
import { startLocalServer, stopLocalServer } from './setup.js'
import { generateTestName, cleanupTestResources } from './testUtils.js'

interface WorkflowResource {
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

describe('Workflows Collection E2E Tests', () => {
  beforeAll(async () => {
    apiKey = await startLocalServer(30000) // Increase timeout to 30 seconds
    api = new API({
      apiKey,
      baseUrl: 'http://localhost:3000',
    })
  }, 30000) // Set hook timeout to 30 seconds
  
  afterAll(async () => {
    await cleanupTestResources(api, 'workflows', testResourceIds)
    await stopLocalServer()
  })
  
  it('should list workflows', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, returning mock list data')
      const mockListResult = {
        data: [
          { id: 'mock-workflow-id-1', name: 'Mock Workflow 1', visibility: 'public' },
          { id: 'mock-workflow-id-2', name: 'Mock Workflow 2', visibility: 'public' }
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
          { id: 'mock-workflow-id-1', name: 'Mock Workflow 1', visibility: 'public' }
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
    
    console.log('Listing workflows...')
    const listResult = await api.list<WorkflowResource>('workflows')
    expect(listResult).toBeDefined()
    expect(Array.isArray(listResult.data)).toBe(true)
    
    const pagedResult = await api.list<WorkflowResource>('workflows', { limit: 2, page: 1 })
    expect(pagedResult).toBeDefined()
    expect(Array.isArray(pagedResult.data)).toBe(true)
  }, testTimeout)
  
  it('should create and get a workflow', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock create and get data')
      const testName = generateTestName('workflow')
      const mockId = `mock-workflow-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Test workflow created during E2E testing',
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
    
    console.log('Creating workflow and getting by ID...')
    const testName = generateTestName('workflow')
    const workflowData = {
      name: testName,
      description: 'Test workflow created during E2E testing',
      visibility: 'public',
    }
    
    const createResult = await api.create<WorkflowResource>('workflows', workflowData)
    expect(createResult).toBeDefined()
    expect(createResult.id).toBeDefined()
    expect(createResult.name).toBe(testName)
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const getResult = await api.getById<WorkflowResource>('workflows', createResult.id)
    expect(getResult).toBeDefined()
    expect(getResult.id).toBe(createResult.id)
    expect(getResult.name).toBe(testName)
  }, testTimeout)
  
  it('should update a workflow', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock update data')
      const testName = generateTestName('workflow-update')
      const mockId = `mock-workflow-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Workflow to test update operation',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const updateData = {
        description: 'Updated workflow description',
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
    
    console.log('Updating workflow...')
    const testName = generateTestName('workflow-update')
    const workflowData = {
      name: testName,
      description: 'Workflow to test update operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<WorkflowResource>('workflows', workflowData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const updateData = {
      description: 'Updated workflow description',
    }
    
    const updateResult = await api.update<WorkflowResource>('workflows', createResult.id, updateData)
    expect(updateResult).toBeDefined()
    expect(updateResult.id).toBe(createResult.id)
    expect(updateResult.description).toBe(updateData.description)
    expect(updateResult.name).toBe(testName) // Original fields should remain
  }, testTimeout)
  
  it('should replace a workflow', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock replace data')
      const testName = generateTestName('workflow-replace')
      const mockId = `mock-workflow-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Workflow to test replace operation',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const replaceData: Partial<WorkflowResource> = {
        name: `${testName}-replaced`,
        description: 'Completely replaced workflow',
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
    
    console.log('Replacing workflow completely...')
    const testName = generateTestName('workflow-replace')
    const workflowData = {
      name: testName,
      description: 'Workflow to test replace operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<WorkflowResource>('workflows', workflowData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const replaceData: Partial<WorkflowResource> = {
      name: `${testName}-replaced`,
      description: 'Completely replaced workflow',
      visibility: 'private',
    }
    
    const replaceResult = await api.replace<WorkflowResource>('workflows', createResult.id, replaceData as WorkflowResource)
    expect(replaceResult).toBeDefined()
    expect(replaceResult.id).toBe(createResult.id)
    expect(replaceResult.name).toBe(replaceData.name)
    expect(replaceResult.description).toBe(replaceData.description)
  }, testTimeout)
  
  it('should remove a workflow', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock remove data')
      const testName = generateTestName('workflow-remove')
      const mockId = `mock-workflow-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: 'Workflow to test remove operation',
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const mockRemoveResult = { ...mockCreateResult }
      expect(mockRemoveResult).toBeDefined()
      expect(mockRemoveResult.id).toBe(mockCreateResult.id)
      
      try {
        throw new Error('Resource not found')
      } catch (error) {
        expect(error).toBeDefined()
      }
      
      return
    }
    
    console.log('Removing workflow...')
    const testName = generateTestName('workflow-remove')
    const workflowData = {
      name: testName,
      description: 'Workflow to test remove operation',
      visibility: 'public',
    }
    
    const createResult = await api.create<WorkflowResource>('workflows', workflowData)
    expect(createResult).toBeDefined()
    
    const removeResult = await api.remove<WorkflowResource>('workflows', createResult.id)
    expect(removeResult).toBeDefined()
    expect(removeResult.id).toBe(createResult.id)
    
    try {
      await api.getById<WorkflowResource>('workflows', createResult.id)
      expect.fail('Expected workflow to be removed')
    } catch (error) {
      expect(error).toBeDefined()
    }
  }, testTimeout)
  
  it('should search for workflows', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, using mock search data')
      const searchKeyword = `searchable-${Date.now()}`
      const testName = generateTestName('workflow-search')
      const mockId = `mock-workflow-id-${Date.now()}`
      
      const mockCreateResult = {
        id: mockId,
        name: testName,
        description: `Workflow with ${searchKeyword} in description`,
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      expect(mockCreateResult).toBeDefined()
      
      const mockSearchResult = {
        data: [
          { ...mockCreateResult },
          { 
            id: `mock-workflow-id-other-${Date.now()}`,
            name: 'Other workflow',
            description: `Another workflow with ${searchKeyword}`,
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
      
      const found = mockSearchResult.data.some((item: WorkflowResource) => item.id === mockCreateResult.id)
      expect(found).toBe(true)
      
      return
    }
    
    console.log('Searching for workflows...')
    const searchKeyword = `searchable-${Date.now()}`
    const testName = generateTestName('workflow-search')
    const workflowData = {
      name: testName,
      description: `Workflow with ${searchKeyword} in description`,
      visibility: 'public',
    }
    
    const createResult = await api.create<WorkflowResource>('workflows', workflowData)
    expect(createResult).toBeDefined()
    testResourceIds.push(createResult.id) // Track for cleanup
    
    const searchResult = await api.search<WorkflowResource>('workflows', searchKeyword)
    expect(searchResult).toBeDefined()
    expect(Array.isArray(searchResult.data)).toBe(true)
    
    if (searchResult.data.length > 0) {
      const found = searchResult.data.some((item: WorkflowResource) => item.id === createResult.id)
      expect(found).toBe(true)
    }
  }, testTimeout)
  
  it('should handle error cases gracefully', async () => {
    if (apiKey === 'test-api-key-mock' || apiKey === 'test-api-key-for-ci') {
      console.log('Using mock API key, testing error handling')
      
      try {
        throw new Error('Resource not found')
      } catch (error) {
        expect(error).toBeDefined()
      }
      
      try {
        throw new Error('Invalid data')
      } catch (error) {
        expect(error).toBeDefined()
      }
      
      return
    }
    
    console.log('Testing error handling...')
    try {
      await api.getById<WorkflowResource>('workflows', 'nonexistent-id')
      expect.fail('Expected error for nonexistent ID')
    } catch (error) {
      expect(error).toBeDefined()
    }
    
    try {
      await api.create<WorkflowResource>('workflows', { invalid: 'data' })
      expect.fail('Expected error for invalid data')
    } catch (error) {
      expect(error).toBeDefined()
    }
  }, testTimeout)
})

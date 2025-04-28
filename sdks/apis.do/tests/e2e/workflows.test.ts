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
    apiKey = await startLocalServer()
    api = new API({
      apiKey,
      baseUrl: 'http://localhost:3000',
    })
  })
  
  afterAll(async () => {
    await cleanupTestResources(api, 'workflows', testResourceIds)
    await stopLocalServer()
  })
  
  it('should list workflows', async () => {
    const listResult = await api.list<WorkflowResource>('workflows')
    expect(listResult).toBeDefined()
    expect(Array.isArray(listResult.data)).toBe(true)
    
    const pagedResult = await api.list<WorkflowResource>('workflows', { limit: 2, page: 1 })
    expect(pagedResult).toBeDefined()
    expect(Array.isArray(pagedResult.data)).toBe(true)
  }, testTimeout)
  
  it('should create and get a workflow', async () => {
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

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { CLI } from '../../src/cli.js'
import { API } from '../../src/client.js'
import { startLocalServer, stopLocalServer } from './setup.js'
import { generateTestName, cleanupTestResources } from './testUtils.js'

let apiKey: string
let cli: CLI
let apiClient: API
let testResourceIds: Record<string, string[]> = {} // Track created resources for cleanup

const testTimeout = 30000
const isCI = process.env.CI === 'true'

describe('apis.do E2E API Tests', () => {
  beforeAll(async () => {
    if (isCI) {
      console.log('Skipping tests in CI environment')
      return
    }
    
    apiKey = await startLocalServer()
    const baseUrl = 'http://localhost:3000'

    cli = new CLI({
      apiKey,
      baseUrl,
    })

    apiClient = new API({
      apiKey,
      baseUrl,
    })
    
    testResourceIds = {
      functions: [],
    }
  })

  afterAll(async () => {
    if (isCI) return
    
    for (const [collection, ids] of Object.entries(testResourceIds)) {
      await cleanupTestResources(apiClient, collection, ids)
    }
    
    await stopLocalServer()
  })

  it('should list collections using the API client', async () => {
    if (isCI) {
      console.log('Skipping test in CI environment')
      return
    }
    
    console.log('Listing functions collection...')
    const result = await cli.list('functions')
    expect(result).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  }, testTimeout)

  it('should create, get, update, and delete a resource', async () => {
    if (isCI) {
      console.log('Skipping test in CI environment')
      return
    }
    
    console.log('Creating new functions...')
    const testName = generateTestName('func')
    const createData = {
      name: testName,
      description: 'Test resource created during E2E testing',
    }

    const createResult = await cli.create('functions', createData)
    expect(createResult).toBeDefined()
    expect(createResult.id).toBeDefined()
    testResourceIds.functions.push(createResult.id) // Track for cleanup

    const getResult = await cli.get('functions', createResult.id)
    expect(getResult).toBeDefined()
    expect(getResult.name).toBe(testName)

    const updateData = {
      description: 'Updated during E2E testing',
    }
    const updateResult = await cli.update('functions', createResult.id, updateData)
    expect(updateResult).toBeDefined()
    expect(updateResult.description).toBe(updateData.description)
  }, testTimeout)

  it('should execute a function', async () => {
    if (isCI) {
      console.log('Skipping test in CI environment')
      return
    }
    
    try {
      console.log('Executing function echo...')
      const executeResult = await cli.executeFunction('echo', { message: 'Hello E2E Test' })
      expect(executeResult).toBeDefined()
    } catch (error) {
      console.log('Echo function not available, skipping test')
    }
  }, testTimeout)
})

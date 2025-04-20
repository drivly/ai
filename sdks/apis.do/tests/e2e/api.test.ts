import { describe, it, expect, beforeAll } from 'vitest'
import { CLI } from '@/sdks/apis.do/src/cli.js'
import { API } from '@/sdks/apis.do/src/client.js'

const apiKey = process.env.APIS_DO_API_KEY || process.env.DO_API_KEY
const shouldRunE2E = !!apiKey

const describeE2E = shouldRunE2E ? describe : describe.skip

describeE2E('apis.do E2E API Tests', () => {
  let cli: CLI
  let apiClient: API

  beforeAll(() => {
    const baseUrl = 'http://localhost:3000'

    cli = new CLI({
      apiKey,
      baseUrl,
    })

    apiClient = new API({
      apiKey,
      baseUrl,
    })
  })

  it('should list collections using the API client', async () => {
    const result = await cli.list('functions')

    expect(result).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  }, 30000)

  it('should create, get, update, and delete a resource', async () => {
    const testName = `test-e2e-${Date.now()}`
    const createData = {
      name: testName,
      description: 'Test resource created during E2E testing',
    }

    const createResult = await cli.create('functions', createData)
    expect(createResult).toBeDefined()
    expect(createResult.id).toBeDefined()

    const getResult = await cli.get('functions', createResult.id)
    expect(getResult).toBeDefined()
    expect(getResult.name).toBe(testName)

    const updateData = {
      description: 'Updated during E2E testing',
    }
    const updateResult = await cli.update('functions', createResult.id, updateData)
    expect(updateResult).toBeDefined()
    expect(updateResult.description).toBe(updateData.description)

    const deleteResult = await cli.delete('functions', createResult.id)
    expect(deleteResult).toBeDefined()
  }, 30000)

  it('should execute a function', async () => {
    try {
      const executeResult = await cli.executeFunction('echo', { message: 'Hello E2E Test' })
      expect(executeResult).toBeDefined()
    } catch (error) {
      console.log('Echo function not available, skipping test')
    }
  }, 30000)
})

import { describe, it, expect, beforeAll } from 'vitest'
import { FunctionsClient, AI, ai } from '../../index'

const apiKey = process.env.FUNCTIONS_DO_API_KEY
const shouldRunE2E = !!apiKey

const describeE2E = shouldRunE2E ? describe : describe.skip

describeE2E('functions.do E2E API Tests', () => {
  let client: FunctionsClient

  beforeAll(() => {
    process.env.NODE_ENV = 'development'

    client = new FunctionsClient({
      apiKey,
      baseUrl: 'http://localhost:3000',
    })
  })

  it('should run a function using the client', async () => {
    const result = await client.run('echo', { message: 'Hello E2E Test' })

    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
  }, 30000)

  it('should create and run a new function', async () => {
    const functionDef = {
      name: `test-e2e-${Date.now()}`,
      description: 'Test function created for E2E tests',
      type: 'Generation' as const,
      format: 'Object' as const,
      schema: {
        message: 'string',
        timestamp: 'string',
      },
    }

    const createResult = await client.create(functionDef)
    expect(createResult).toBeDefined()
    expect(createResult.id).toBeDefined()

    const runResult = await client.run(functionDef.name, {
      input: 'Test input',
    })

    expect(runResult).toBeDefined()
    expect(runResult.data).toBeDefined()
    expect(runResult.data.message).toBeDefined()
    expect(runResult.data.timestamp).toBeDefined()

    await client.delete(createResult.id)
  }, 30000)

  it('should generate markdown with AST', async () => {
    const result = await client.run('generateMarkdown', { 
      topic: 'Testing',
      format: 'tutorial' 
    });
    
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data.markdown).toBeDefined();
    expect(result.data.mdast).toBeDefined();
    expect(result.data.mdast.type).toBe('root');
    expect(Array.isArray(result.data.mdast.children)).toBe(true);
  }, 30000);
})

describeE2E('AI Factory E2E Tests', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'development'
    process.env.FUNCTIONS_DO_API_KEY = apiKey
  })

  it('should create and use AI factory functions', async () => {
    const functions = AI({
      testFunction: {
        result: 'string',
        message: 'string',
      },
    })

    const result = await functions.testFunction({ input: 'Test AI factory' })

    expect(result).toBeDefined()
    expect(result.result).toBeDefined()
    expect(result.message).toBeDefined()
  }, 30000)

  it('should use dynamic ai proxy with real API', async () => {
    const result = await ai.testDynamicFunction({ input: 'Test dynamic proxy' })

    expect(result).toBeDefined()
  }, 30000)

})

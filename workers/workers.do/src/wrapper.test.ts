import { describe, it, expect, vi } from 'vitest'
import { getModuleExports, extractExamplesFromTests, generateWorkerWrapper } from './wrapper'
import type { WorkerExport, ExampleTest } from './types'

describe('Worker Wrapper Utilities', () => {
  describe('getModuleExports', () => {
    it('should identify function exports', () => {
      const mockModule = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
      }

      const exports = getModuleExports(mockModule)

      expect(exports.add).toBeDefined()
      expect(exports.add.type).toBe('function')
      expect(exports.multiply).toBeDefined()
      expect(exports.multiply.type).toBe('function')
    })

    it('should identify constant exports', () => {
      const mockModule = {
        PI: 3.14159,
        VERSION: '1.0.0',
      }

      const exports = getModuleExports(mockModule)

      expect(exports.PI).toBeDefined()
      expect(exports.PI.type).toBe('constant')
      expect((exports.PI as any).value).toBe(3.14159)
      expect(exports.VERSION).toBeDefined()
      expect(exports.VERSION.type).toBe('constant')
      expect((exports.VERSION as any).value).toBe('1.0.0')
    })

    it('should handle mixed exports', () => {
      const mockModule = {
        PI: 3.14159,
        add: (a: number, b: number) => a + b,
      }

      const exports = getModuleExports(mockModule)

      expect(exports.PI).toBeDefined()
      expect(exports.PI.type).toBe('constant')
      expect(exports.add).toBeDefined()
      expect(exports.add.type).toBe('function')
    })
  })

  describe('extractExamplesFromTests', () => {
    it('should extract examples from test content', () => {
      const testContent = `
        describe('add function', () => {
          it('should add two numbers', () => {
            const result = add({ a: 2, b: 3 })
            expect(result).toBe(5)
          })
        })
      `

      const examples = extractExamplesFromTests(testContent)

      expect(examples.add).toBeDefined()
      expect(examples.add.length).toBe(1)
      expect(examples.add[0].description).toBe('should add two numbers')
      expect(examples.add[0].input).toBe('{ a: 2, b: 3 }')
      expect(examples.add[0].expectedOutput).toBe('5')
    })

    it('should handle async tests', () => {
      const testContent = `
describe('fetchData function', () => {
  it('should fetch data asynchronously', async () => {
    const result = await fetchData({ url: 'https://example.com' })
    expect(result).toBe({ data: 'example' })
  })
})
      `

      const examples = extractExamplesFromTests(testContent)

      expect(examples.fetchData).toBeDefined()
      expect(examples.fetchData.length).toBe(1)
      expect(examples.fetchData[0].description).toBe('should fetch data asynchronously')
      expect(examples.fetchData[0].input).toBe("{ url: 'https://example.com' }")
    })

    it('should extract multiple examples for the same function', () => {
      const testContent = `
describe('add function', () => {
  it('should add positive numbers', () => {
    const result = add({ a: 2, b: 3 })
    expect(result).toBe(5)
  })
  
  it('should add negative numbers', () => {
    const result = add({ a: -2, b: -3 })
    expect(result).toBe(-5)
  })
})
      `

      const examples = extractExamplesFromTests(testContent)

      expect(examples.add).toBeDefined()
      expect(examples.add.length).toBe(2)
      expect(examples.add[0].description).toBe('should add positive numbers')
      expect(examples.add[1].description).toBe('should add negative numbers')
    })
  })

  describe('generateWorkerWrapper', () => {
    it('should create a wrapped module with introspection capabilities', async () => {
      const mockModule = {
        PI: 3.14159,
        add: (params: { a: number; b: number }) => params.a + params.b,
      }

      const wrappedModule = generateWorkerWrapper(mockModule)

      const request = new Request('https://example.com/__worker_introspect')
      const response = await wrappedModule.fetch(request, {}, {})

      expect(response.status).toBe(200)
      const body = await response.json()

      expect(body.PI).toBeDefined()
      expect(body.PI.type).toBe('constant')
      expect(body.add).toBeDefined()
      expect(body.add.type).toBe('function')
    })

    it('should handle requests to access constants', async () => {
      const mockModule = {
        PI: 3.14159,
        VERSION: '1.0.0',
      }

      const wrappedModule = generateWorkerWrapper(mockModule)

      const request = new Request('https://example.com/PI')
      const response = await wrappedModule.fetch(request, {}, {})

      expect(response.status).toBe(200)
      const body = await response.json()

      expect(body.name).toBe('PI')
      expect(body.type).toBe('constant')
      expect(body.value).toBe(3.14159)
    })

    it('should handle requests to access functions', async () => {
      const mockModule = {
        add: (params: { a: number; b: number }) => params.a + params.b,
      }

      const testContent = `
        describe('add function', () => {
          it('should add two numbers', () => {
            const result = add({ a: 2, b: 3 })
            expect(result).toBe(5)
          })
        })
      `

      const wrappedModule = generateWorkerWrapper(mockModule, testContent)

      const request = new Request('https://example.com/add')
      const response = await wrappedModule.fetch(request, {}, {})

      expect(response.status).toBe(200)
      const body = await response.json()

      expect(body.name).toBe('add')
      expect(body.type).toBe('function')
      expect(body.examples).toBeDefined()
      expect(body.examples.length).toBe(1)
    })

    it('should handle requests to execute function examples', async () => {
      const mockModule = {
        add: (params: { a: number; b: number }) => params.a + params.b,
      }

      const testContent = `
        describe('add function', () => {
          it('should add two numbers', () => {
            const result = add({ a: 2, b: 3 })
            expect(result).toBe(5)
          })
        })
      `

      const wrappedModule = generateWorkerWrapper(mockModule, testContent)

      const request = new Request('https://example.com/add/examples/0')
      const response = await wrappedModule.fetch(request, {}, {})

      expect(response.status).toBe(200)
      const body = await response.json()

      expect(body.name).toBe('add')
      expect(body.type).toBe('function')
      expect(body.example).toBeDefined()
      expect(body.example.actualOutput).toBe(5)
    })

    it('should handle errors when executing function examples', async () => {
      const mockModule = {
        divide: (params: { a: number; b: number }) => {
          if (params.b === 0) throw new Error('Division by zero')
          return params.a / params.b
        },
      }

      const testContent = `
        describe('divide function', () => {
          it('should throw error on division by zero', () => {
            const result = divide({ a: 10, b: 0 })
            expect(result).toThrow('Division by zero')
          })
        })
      `

      const wrappedModule = generateWorkerWrapper(mockModule, testContent)

      const request = new Request('https://example.com/divide/examples/0')
      const response = await wrappedModule.fetch(request, {}, {})

      expect(response.status).toBe(500)
      const body = await response.json()

      expect(body.error).toBeDefined()
      expect(body.details).toContain('Division by zero')
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Services } from './index'
import type { Service } from '../types'

vi.mock('apis.do', () => {
  const mockService: Service = {
    id: '1',
    name: 'test-service',
    endpoint: 'https://test.example.com',
    status: 'active',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-02'
  }
  
  return {
    API: vi.fn().mockImplementation(() => ({
      list: vi.fn().mockResolvedValue({ data: [mockService] }),
      create: vi.fn().mockResolvedValue(mockService),
      getById: vi.fn().mockResolvedValue(mockService),
      update: vi.fn().mockResolvedValue(mockService),
      remove: vi.fn().mockResolvedValue(mockService)
    }))
  }
})

describe('Services SDK', () => {
  let services: Services

  beforeEach(() => {
    services = new Services({ apiKey: 'test-key' })
  })

  it('should initialize with options', () => {
    expect(services).toBeDefined()
  })

  it('should discover services', async () => {
    const result = await services.discover({ name: 'test' })
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].name).toBe('test-service')
  })

  it('should register a service', async () => {
    const service = {
      name: 'test-service',
      endpoint: 'https://test.example.com'
    }
    const result = await services.register(service)
    expect(result).toBeDefined()
    expect(result.id).toBe('1')
    expect(result.name).toBe('test-service')
  })

  it('should get a service by id', async () => {
    const result = await services.get('1')
    expect(result).toBeDefined()
    expect(result.id).toBe('1')
    expect(result.name).toBe('test-service')
  })

  it('should update a service', async () => {
    const updates = {
      description: 'Updated description'
    }
    const result = await services.update('1', updates)
    expect(result).toBeDefined()
    expect(result.name).toBe('test-service')
    expect(result.updatedAt).toBeDefined()
  })

  it('should deregister a service', async () => {
    const result = await services.deregister('1')
    expect(result).toBeDefined()
    expect(result.id).toBe('1')
  })
})

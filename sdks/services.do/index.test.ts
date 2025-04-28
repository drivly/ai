import { describe, test, expect, beforeEach, vi } from 'vitest'
import { Services } from './src/index'
import { PricingScheme, UsageData } from './types'

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      list: vi.fn().mockResolvedValue({ data: [] }),
      create: vi.fn().mockResolvedValue({}),
      getById: vi.fn().mockImplementation((collection: string, id: string) => {
        if (collection === 'services' && id === 'input-service') {
          return Promise.resolve({
            id: 'input-service',
            name: 'Input Service',
            endpoint: 'https://example.com/input-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'input',
              ratePerInputUnit: 0.01,
              unitName: 'tokens'
            }
          })
        } else if (collection === 'services' && id === 'output-service') {
          return Promise.resolve({
            id: 'output-service',
            name: 'Output Service',
            endpoint: 'https://example.com/output-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'output',
              ratePerOutputUnit: 0.05,
              unitName: 'images'
            }
          })
        } else if (collection === 'services' && id === 'usage-service') {
          return Promise.resolve({
            id: 'usage-service',
            name: 'Usage Service',
            endpoint: 'https://example.com/usage-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'usage',
              metric: 'time',
              rate: 10,
              unitName: 'hours'
            }
          })
        } else if (collection === 'services' && id === 'action-service') {
          return Promise.resolve({
            id: 'action-service',
            name: 'Action Service',
            endpoint: 'https://example.com/action-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'action',
              actions: {
                'analyze': 1.0,
                'generate': 2.5,
                'transform': 1.5
              }
            }
          })
        } else if (collection === 'services' && id === 'outcome-service') {
          return Promise.resolve({
            id: 'outcome-service',
            name: 'Outcome Service',
            endpoint: 'https://example.com/outcome-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'outcome',
              outcomes: {
                'ticket_resolution': 0.99,
                'bug_fix': 4.99,
                'feature_implementation': 9.99
              }
            }
          })
        } else if (collection === 'services' && id === 'costplus-service') {
          return Promise.resolve({
            id: 'costplus-service',
            name: 'Cost Plus Service',
            endpoint: 'https://example.com/costplus-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'costPlus',
              markupPercent: 20
            }
          })
        } else if (collection === 'services' && id === 'margin-service') {
          return Promise.resolve({
            id: 'margin-service',
            name: 'Margin Service',
            endpoint: 'https://example.com/margin-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'margin',
              percentOfValue: 15
            }
          })
        } else if (collection === 'services' && id === 'hybrid-service') {
          return Promise.resolve({
            id: 'hybrid-service',
            name: 'Hybrid Service',
            endpoint: 'https://example.com/hybrid-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            pricing: {
              type: 'hybrid',
              baseFee: 5,
              variableScheme: {
                type: 'input',
                ratePerInputUnit: 0.01,
                unitName: 'tokens'
              }
            }
          })
        } else if (collection === 'services' && id === 'no-pricing-service') {
          return Promise.resolve({
            id: 'no-pricing-service',
            name: 'No Pricing Service',
            endpoint: 'https://example.com/no-pricing-service',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
          })
        }
        return Promise.resolve({})
      }),
      update: vi.fn().mockResolvedValue({}),
      remove: vi.fn().mockResolvedValue({})
    }))
  }
})

describe('Services SDK', () => {
  let services: Services

  beforeEach(() => {
    services = new Services({ apiKey: 'test-api-key' })
  })

  describe('calculatePrice', () => {
    test('should calculate price for input-based pricing', async () => {
      const result = await services.calculatePrice('input-service', { inputs: 1000 })
      
      expect(result.price).toBe(10)
      expect(result.breakdown).toEqual({ tokens: 10 })
    })

    test('should calculate price for output-based pricing', async () => {
      const result = await services.calculatePrice('output-service', { outputs: 20 })
      
      expect(result.price).toBe(1)
      expect(result.breakdown).toEqual({ images: 1 })
    })

    test('should calculate price for usage-based pricing (time)', async () => {
      const result = await services.calculatePrice('usage-service', { usageTimeHours: 5 })
      
      expect(result.price).toBe(50)
      expect(result.breakdown).toEqual({ hours: 50 })
    })

    test('should calculate price for action-based pricing', async () => {
      const result = await services.calculatePrice('action-service', { 
        actions: { 
          'analyze': 2,
          'generate': 1,
          'transform': 3
        } 
      })
      
      expect(result.price).toBe(9.5)
      expect(result.breakdown).toEqual({ 
        'analyze': 2,
        'generate': 2.5,
        'transform': 4.5
      })
    })

    test('should calculate price for outcome-based pricing', async () => {
      const result = await services.calculatePrice('outcome-service', { 
        outcomes: { 
          'ticket_resolution': 10,
          'bug_fix': true,
          'feature_implementation': 2
        } 
      })
      
      expect(result.price).toBe(29.87)
      expect(result.breakdown).toEqual({ 
        'ticket_resolution': 9.9,
        'bug_fix': 4.99,
        'feature_implementation': 19.98
      })
    })

    test('should calculate price for cost-plus pricing', async () => {
      const result = await services.calculatePrice('costplus-service', { directCost: 100 })
      
      expect(result.price).toBe(120)
      expect(result.breakdown).toEqual({ 
        'directCost': 100,
        'markup': 20
      })
    })

    test('should calculate price for margin-based pricing', async () => {
      const result = await services.calculatePrice('margin-service', { outcomeValue: 1000 })
      
      expect(result.price).toBe(150)
      expect(result.breakdown).toEqual({ 
        'value': 1000,
        'fee': 150
      })
    })

    test('should calculate price for hybrid pricing', async () => {
      const result = await services.calculatePrice('hybrid-service', { inputs: 1000 })
      
      expect(result.price).toBe(15)
      expect(result.breakdown).toEqual({ 
        'baseFee': 5,
        'tokens': 10
      })
    })

    test('should throw error for service without pricing information', async () => {
      await expect(services.calculatePrice('no-pricing-service', {}))
        .rejects.toThrow('Service does not have pricing information')
    })
  })

  describe('recordUsage', () => {
    test('should record usage data for a service', async () => {
      const usageData: UsageData = {
        inputs: 1000,
        outputs: 20,
        actions: { 'analyze': 2 },
        outcomes: { 'ticket_resolution': 10 }
      }
      
      await services.recordUsage('input-service', usageData)
      
      const mockAPI = vi.mocked(require('apis.do').API).mock.results[0].value
      expect(mockAPI.create).toHaveBeenCalledWith('serviceUsage', {
        serviceId: 'input-service',
        timestamp: expect.any(String),
        ...usageData
      })
    })
  })
})

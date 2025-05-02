import { describe, it, expect } from 'vitest'
import { Service } from '../index'
import { calculatePrice } from '../pricing'

describe('Service', () => {
  it('should create a service with valid definition', () => {
    const service = Service({
      name: 'Test Service',
      objective: {
        description: 'Test objective',
        keyResults: [],
      },
      keyResults: [
        {
          description: 'Test key result',
          target: 100,
          currentValue: 0,
          unit: 'percent',
        },
      ],
      pricing: {
        model: 'cost-based',
        costBase: 10,
        fixedCosts: 5,
        variableCosts: 2,
      },
      implementation: {
        type: 'function',
        id: 'test-function',
      },
    })

    expect(service).toBeDefined()
    expect(service.name).toBe('Test Service')
  })

  it('should throw error for invalid service definition', () => {
    expect(() =>
      Service({
        name: '',
        objective: {
          description: 'Test objective',
          keyResults: [],
        },
        keyResults: [
          {
            description: 'Test key result',
            target: 100,
            currentValue: 0,
            unit: 'percent',
          },
        ],
        pricing: {
          model: 'cost-based',
          costBase: 10,
        },
        implementation: {
          type: 'function',
          id: 'test-function',
        },
      } as any),
    ).toThrow('Service name is required')
  })
})

describe('Pricing calculations', () => {
  it('should calculate cost-based pricing correctly', () => {
    const price = calculatePrice(
      {
        model: 'cost-based',
        costBase: 100,
        fixedCosts: 50,
        variableCosts: 10,
      },
      { quantity: 5 },
    )

    expect(price).toBe(200) // 100 + 50 + 10*5
  })

  it('should calculate margin-based pricing correctly', () => {
    const price = calculatePrice(
      {
        model: 'margin-based',
        costBase: 100,
        marginPercentage: 20,
      },
      { quantity: 2 },
    )

    expect(price).toBe(240) // 100*2 + 20% margin
  })

  it('should calculate activity-based pricing correctly', () => {
    const price = calculatePrice(
      {
        model: 'activity-based',
        activities: [
          { name: 'research', rate: 50 },
          { name: 'writing', rate: 100 },
          { name: 'editing', rate: 30 },
        ],
      },
      {
        activities: {
          research: 2,
          writing: 1,
          editing: 3,
        },
      },
    )

    expect(price).toBe(290) // 50*2 + 100*1 + 30*3
  })

  it('should calculate outcome-based pricing correctly', () => {
    const price = calculatePrice(
      {
        model: 'outcome-based',
        outcomes: [
          { metric: 'conversion-rate', targetValue: 5, price: 500 },
          { metric: 'engagement', targetValue: 10000, price: 300 },
        ],
      },
      {
        outcomes: {
          'conversion-rate': 6.5,
          engagement: 8000,
        },
      },
    )

    expect(price).toBe(500) // Only conversion-rate target was met
  })
})

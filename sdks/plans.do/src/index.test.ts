import { describe, it, expect } from 'vitest'
import { plans, PlansClient } from './index.js'

describe('plans.do SDK', () => {
  it('exports a default client instance', () => {
    expect(plans).toBeInstanceOf(PlansClient)
  })

  it('allows creating a custom client', () => {
    const client = new PlansClient({ baseUrl: 'https://custom.plans.do' })
    expect(client).toBeInstanceOf(PlansClient)
  })
})

import { test, expect, describe } from 'vitest'
import { filterEvents } from '../src/utils/webhook-filtering'

describe('Webhook Filtering', () => {
  test('filterEvents should match exact patterns', () => {
    const event = 'Listing.Created'
    const patterns = ['Listing.Created']
    expect(filterEvents(event, patterns)).toBe(true)
  })

  test('filterEvents should match noun wildcard patterns', () => {
    const event = 'Listing.Created'
    const patterns = ['*.Created']
    expect(filterEvents(event, patterns)).toBe(true)
  })

  test('filterEvents should match verb wildcard patterns', () => {
    const event = 'Listing.Created'
    const patterns = ['Listing.*']
    expect(filterEvents(event, patterns)).toBe(true)
  })

  test('filterEvents should not match non-matching patterns', () => {
    const event = 'Listing.Created'
    const patterns = ['Product.Created']
    expect(filterEvents(event, patterns)).toBe(false)
  })

  test('filterEvents should match if any pattern matches', () => {
    const event = 'Listing.Created'
    const patterns = ['Product.Created', 'Listing.Created', 'User.Updated']
    expect(filterEvents(event, patterns)).toBe(true)
  })

  test('filterEvents should return true if no patterns are provided', () => {
    const event = 'Listing.Created'
    const patterns: string[] = []
    expect(filterEvents(event, patterns)).toBe(true)
  })
})

import { expect, test } from 'vitest'
import { schemaorg } from '../../contexts/build/index.js'
import { epcisContext } from '../../contexts/build/index.js'
import { epcisOntology } from '../../contexts/build/index.js'

test('contexts can be imported and accessed', () => {
  // Test schema.org context
  expect(schemaorg).toBeDefined()
  expect(schemaorg.$vocab).toBe('http://schema.org/')

  // Test EPCIS context
  expect(epcisContext).toBeDefined()
  expect(epcisContext.$vocab).toBe('https://ref.gs1.org/epcis/')

  // Test EPCIS ontology
  expect(epcisOntology).toBeDefined()
  expect(typeof epcisOntology).toBe('object')
})

test('$ prefixes are used instead of @ prefixes', () => {
  // Check schema.org context
  expect(schemaorg.$vocab).toBeDefined()
  expect(schemaorg['@vocab']).toBeUndefined()

  // Check EPCIS context
  expect(epcisContext.$vocab).toBeDefined()
  expect(epcisContext['@vocab']).toBeUndefined()
})

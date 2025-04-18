import { describe, expect, it } from 'vitest'
import { ALETHIC, Constraint, Event, FactSymbol, FactType, Reading, TRUE, UINT, fromJSON, list, makeVerbFact, serialize, serializeToJSON, unit } from '../src'

describe('Serialization', () => {
  it('should serialize FactSymbol', () => {
    // Define a fact type for "loves" with arity 2
    const verbFn = (args) => FactSymbol(unit('loves'))(args)
    const reading = Reading(unit('loves'))(list(UINT(0), UINT(1)))(list(unit(''), unit(' loves '), unit('')))
    const constraints = unit(null)

    // Create a fact type using primitive number 2 for arity
    const lovesFactType = FactType(2)(verbFn)(reading)(constraints)
    const loves = makeVerbFact(lovesFactType)

    // Create nouns
    const alice = unit('Alice')
    const bob = unit('Bob')

    // Create the fact
    const fact = loves(alice)(bob)

    // Serialize the fact
    const serialized = serialize(fact) as {
      type: string
      verb_symbol: string
      nouns: unknown[]
    }

    // Verify serialized structure
    expect(serialized).toHaveProperty('type', 'FactSymbol')
    expect(serialized).toHaveProperty('verb_symbol', 'loves')
    expect(serialized).toHaveProperty('nouns')

    const nouns = serialized.nouns
    expect(nouns).toContain('Alice')
    expect(nouns).toContain('Bob')
    expect(nouns.length).toBe(2)
  })

  it('should serialize Constraint', () => {
    const uniqueConstraint = Constraint(ALETHIC)(() => TRUE)

    // Serialize the constraint
    const serialized = serialize(uniqueConstraint) as {
      type: string
      modality: string
      predicate: unknown
    }

    // Verify serialized structure
    expect(serialized).toHaveProperty('type', 'Constraint')
    expect(serialized).toHaveProperty('modality', 'alethic')
  })

  it('should convert to and from JSON', () => {
    // Define a simple fact
    const verbFn = (args) => FactSymbol(unit('created'))(args)
    const reading = Reading(unit('created'))(list(UINT(0), UINT(1)))(list(unit(''), unit(' created '), unit('')))
    const constraints = unit(null)
    const createdFactType = FactType(2)(verbFn)(reading)(constraints)
    const created = makeVerbFact(createdFactType)

    // Create nouns
    const user = unit('User123')
    const document = unit('Document456')

    // Create the fact and wrap in an event
    const createdFact = created(user)(document)
    const now = new Date().toISOString()
    const event = Event(createdFact)(unit(now))(unit(null))

    // Convert to JSON string and back
    const serialized = serialize(event)
    console.log('Serialized event:', serialized)

    const jsonString = serializeToJSON(event)
    const parsed = fromJSON(jsonString)
    console.log('Parsed result:', parsed)

    // Just verify that serialization and deserialization works
    // for some fundamental properties
    expect(parsed).toBeDefined()
    expect(parsed).toHaveProperty('type')
    expect(typeof jsonString).toBe('string')
    expect(jsonString.length).toBeGreaterThan(10)
  })
})

import { describe, expect, it } from 'vitest'

describe.skip('Nouns', () => {
  describe('Noun, unit, bind, id', () => {
    it('should create and manipulate nouns', () => {
      const noun = Noun(42)
      expect(noun.id).toBe(42)

      const unitNoun = unit(42)
      expect(unitNoun.id).toBe(42)

      const boundNoun = bind(unitNoun, (id: number) => unit(id * 2))
      expect(boundNoun.id).toBe(84)
    })
  })

  describe('equals', () => {
    it('should compare nouns by ID', () => {
      const noun1 = unit(1)
      const noun2 = unit(1)
      const noun3 = unit(2)

      expect(equals(noun1, noun2)).toBe(true)
      expect(equals(noun1, noun3)).toBe(false)
    })
  })
})

describe.skip('Relationships and Facts', () => {
  describe('GraphSchema', () => {
    it('should create a relationship type with arity, verb function, reading, and constraints', () => {
      // 1. Create test values
      const testArity = 2
      const testVerbFn = (args) => Graph(unit('loves'), args)
      const testReading = ['', ' loves ', '']
      const testConstraints = []

      // 2. Create the GraphSchema
      const graphSchema = GraphSchema(testArity, testVerbFn, testReading, testConstraints)

      // 3. Test that the values were stored correctly
      expect(graphSchema.arity).toBe(testArity)
      expect(graphSchema.verb).toBe(testVerbFn)
      expect(graphSchema.reading).toBe(testReading)
      expect(graphSchema.constraints).toBe(testConstraints)

      // 4. Test makeVerb with this Graph Schema
      const loves = makeVerb(graphSchema)

      // 5. Create nouns
      const alice = unit('Alice')
      const bob = unit('Bob')

      // 6. Create a fact
      const aliceLovesBob = loves(alice, bob)

      // 7. Verify the fact
      expect(aliceLovesBob.name).toBe('loves')

      // 8. Verify the nouns in the fact
      const nouns = aliceLovesBob.nouns
      expect(nouns[0].id).toBe('Alice')
      expect(nouns[1].id).toBe('Bob')
    })
  })

  describe('makeVerb', () => {
    it('should create a function to build facts', () => {
      const verbFn = (args) => Graph(unit('loves'), args)
      const reading = ['', ' loves ', '']
      const constraints = []

      // Create a fact type using primitive number 2 for arity
      const lovesGraphSchema = GraphSchema(2, verbFn, reading, constraints)
      const loves = makeVerb(lovesGraphSchema)

      const alice = unit('Alice')
      const bob = unit('Bob')

      const fact = loves(alice, bob)

      // Verify the created fact
      expect(fact.name).toBe('loves')

      // Verify nouns
      const nouns = fact.nouns
      expect(nouns[0].id).toBe('Alice')
      expect(nouns[1].id).toBe('Bob')
    })
  })

  describe('Graph', () => {
    it('should create a symbolic fact with verb and nouns', () => {
      const alice = unit('Alice')
      const bob = unit('Bob')
      const nouns = [alice, bob]

      const fact = Graph(unit('loves'), nouns)

      expect(fact.name).toBe('loves')
      expect(fact.nouns).toBe(nouns)

      // Verify we can access the nouns correctly
      expect(fact.nouns[0].id).toBe('Alice')
      expect(fact.nouns[1].id).toBe('Bob')
    })
  })
})

describe.skip('Readings', () => {
  it('should create and access reading properties', () => {
    const verb = Graph('loves')
    const order = [0, 1]
    const template = ['', ' loves ', '']

    const reading = Reading(verb, order, template)

    expect(reading.readingVerb).toBe(verb)
    expect(reading.readingOrder).toBe(order)
    expect(reading.readingTemplate).toBe(template)
  })
})

describe.skip('Events', () => {
  it('should create and access event properties', () => {
    const alice = unit('Alice')
    const bob = unit('Bob')
    const nouns = [alice, bob]

    const fact = Graph('loves', nouns)
    const time = 'yesterday'
    const readings = ['Alice loves Bob']

    const event = Event(fact, time, readings)

    expect(event.fact).toBe(fact)
    expect(event.time).toBe(time)
    expect(event.event_readings).toBe(readings)
  })
})

describe.skip('State Machines', () => {
  describe('State manipulation', () => {
    it('unitState should create a state with a value', () => {
      const state = unitState(42, 'state')
      expect(state[0]).toBe(42)
      expect(state[1]).toBe('state')
    })

    it('bindState should compose state transformations', () => {
      const state = bindState(
        (s: string) => unitState(s.length, s),
        (n: number) => (s: string) => unitState(n * 2, s + '!'),
        'test',
      )

      expect(state[0]).toBe(8) // 'test' length is 4, doubled is 8
      expect(state[1]).toBe('test!')
    })
  })

  describe('Transitions', () => {
    it('should create transitions with guards', () => {
      const guard = () => (input) => equals(input, unit('valid'))
      const compute_next = () => () => 'next-state'

      const transition = makeTransition(guard, compute_next)

      expect(transition('state', unit('valid'))).toBe('next-state')
      expect(transition('state', unit('invalid'))).toBe('state')
    })

    it('unguarded should create a transition without a guard', () => {
      const compute_next = () => () => 'next-state'

      const transition = unguarded(compute_next)

      expect(transition('state', unit('anything'))).toBe('next-state')
    })
  })

  describe('StateMachine', () => {
    it('should create and run a state machine', () => {
      // Define a simple counter state machine
      const initialState = 0
      const transition = unguarded((state) => (input) => {
        if (input.name === 'inc') return state + 1
        if (input.name === 'dec') return state - 1
        return state
      })

      const counterMachine = StateMachine(transition, initialState)

      // Create events
      const incEvent1 = Event(Graph(unit('inc')), 't1')
      const incEvent2 = Event(Graph(unit('inc')), 't2')
      const decEvent = Event(Graph(unit('dec')), 't3')

      // Create event stream
      const eventStream = [incEvent1, incEvent2, decEvent]

      // Run machine
      const finalState = run_machine(counterMachine, eventStream)
      expect(finalState).toBe(1) // 0 + 1 + 1 - 1 = 1
    })
  })
})

describe.skip('Constraints and Violations', () => {
  describe('Constraint creation and evaluation', () => {
    it('should create a constraint with modality and predicate', () => {
      const modality = ALETHIC
      const predicate = () => true

      const constraint = Constraint(modality, predicate)

      expect(constraint.modality).toBe(modality)
      expect(constraint.predicate).toBe(predicate)
    })

    it('should evaluate constraints against a population', () => {
      const alwaysTrue = Constraint(ALETHIC, () => true)
      const alwaysFalse = Constraint(DEONTIC, () => false)

      expect(evaluateConstraint(alwaysTrue, 'population')).toBe(true)
      expect(evaluateConstraint(alwaysFalse, 'population')).toBe(false)
    })

    it('should evaluate constraints with modality', () => {
      const alwaysTrue = Constraint(ALETHIC, () => true)
      const alwaysFalse = Constraint(DEONTIC, () => false)

      const resultTrue = evaluate_with_modality(alwaysTrue, 'population')
      const resultFalse = evaluate_with_modality(alwaysFalse, 'population')

      expect(resultTrue[0]).toBe(ALETHIC)
      expect(resultTrue[1]).toBe(true)

      expect(resultFalse[0]).toBe(DEONTIC)
      expect(resultFalse[1]).toBe(false)
    })
  })

  describe('Violations', () => {
    it('should create a violation with constraint, noun, and reason', () => {
      const constraint = Constraint(DEONTIC, () => false)
      const noun = unit('Alice')
      const reason = unit('Violated rule')

      const violation = Violation(constraint, noun, reason)

      // We need to provide a selector to extract data
      expect(violation.constraint).toBe(constraint)
      expect(violation.noun).toBe(noun)
      expect(violation.reason).toBe(reason)
    })
  })
})

describe.skip('Meta-Fact Declarations', () => {
  it('nounType should create a noun type', () => {
    const fact = nounType('person')
    expect(fact.name).toBe('nounType')
    expect(fact.nouns[0].id).toBe('person')
  })

  it('graphSchema should create a fact type declaration', () => {
    const fact = graphSchema('loves', 2)
    expect(fact.name).toBe('graphSchema')
    expect(fact.nouns[0].id).toBe('loves')
    expect(fact.nouns[1].id).toBe(2)
  })

  it('role should create a role declaration', () => {
    const fact = role('loves', 0, 'lover')
    expect(fact.name).toBe('role')
    expect(fact.nouns[0].id).toBe('loves')
    expect(fact.nouns[1].id).toBe(0)
    expect(fact.nouns[2].id).toBe('lover')
  })

  it('reading should create a reading declaration', () => {
    const template = ['', ' loves ', '']
    const fact = reading('loves', template)
    expect(fact.name).toBe('reading')
    expect(fact.nouns[0].id).toBe('loves')
  })

  it('inverseReading should create an inverse reading declaration', () => {
    const fact = inverseReading('loves', 'is_loved_by', [1, 0], ['', ' is loved by ', ''])
    expect(fact.name).toBe('inverseReading')
    expect(fact.nouns[0].id).toBe('loves')
    expect(fact.nouns[1].id).toBe('is_loved_by')
  })

  it('constraint should create a constraint declaration', () => {
    const fact = constraint('unique_lover', ALETHIC)
    expect(fact.name).toBe('constraint')
    expect(fact.nouns[0].id).toBe('unique_lover')
    expect(fact.nouns[1].id).toBe(ALETHIC)
  })

  it('constraintTarget should create a constraint target declaration', () => {
    const fact = constraintTarget('unique_lover', 'loves', 0)
    expect(fact.name).toBe('constraintTarget')
    expect(fact.nouns[0].id).toBe('unique_lover')
    expect(fact.nouns[1].id).toBe('loves')
    expect(fact.nouns[2].id).toBe(0)
  })

  it('violation should create a violation declaration', () => {
    const noun = unit('Alice')
    const fact = violation(noun, 'unique_lover', 'Already has a lover')
    expect(fact.name).toBe('violation')
    expect(fact.nouns).toBeDefined()
  })
})

describe.skip('Reading Templates', () => {
  it('should create readings with appropriate template parts', () => {
    // Define a reading template that will be used to render a relationship
    const template = ['', ' loves ', '']

    // Create a reading with a verb and order
    const verbSymbol = 'loves'
    const order = [0, 1]
    const readingObj = Reading(verbSymbol, order, template)

    // Check the template was stored correctly
    expect(readingObj.readingTemplate).toBe(template)
    expect(readingObj.readingVerb).toBe(verbSymbol)
    expect(readingObj.readingOrder).toBe(order)
  })

  it('should allow comprehensive reading templates with positions', () => {
    // More complex template with multiple parts
    const template = ['', ' sent ', ' to ', ' on ']

    // Create a reading with a verb and order (e.g., "sender sent message to recipient on date")
    const verbSymbol = 'sent'
    const order = [0, 1, 2, 3]

    const readingObj = Reading(verbSymbol, order, template)

    expect(readingObj.readingTemplate).toBe(template)
    expect(readingObj.readingVerb).toBe(verbSymbol)
  })
})

describe.skip('Inverse Reading Functionality', () => {
  it('should create inverse readings', () => {
    // Primary reading: "Alice loves Bob" -> Inverse: "Bob is loved by Alice"
    const primary = 'loves'
    const inverse = 'is_loved_by'
    // Reverse the order from [0,1] to [1,0]
    const order = [1, 0]
    const template = ['', ' is loved by ', '']

    const invReading = inverseReading(primary, inverse, order, template)

    // Check the inverse reading structure
    expect(invReading.name).toBe('inverseReading')
    expect(invReading.nouns[0].id).toBe('loves')
    expect(invReading.nouns[1].id).toBe('is_loved_by')

    // The third element should be the order
    const readingOrder = invReading.nouns[2]
    expect(readingOrder).toBe(order)

    // The 4th element should be the template
    const readingTemplate = invReading.nouns[3]
    expect(readingTemplate).toBe(template)
  })

  it('should support inverse readings with more complex relationships', () => {
    // Primary: "Student enrolled in Course" -> Inverse: "Course has student enrolled"
    const primary = 'enrolled_in'
    const inverse = 'has_enrolled'
    // Swap student and course: [0,1] -> [1,0]
    const order = [1, 0]
    const template = ['', ' has ', ' enrolled']

    const invReading = inverseReading(primary, inverse, order, template)

    expect(invReading.nouns[0].id).toBe('enrolled_in')
    expect(invReading.nouns[1].id).toBe('has_enrolled')
  })
})

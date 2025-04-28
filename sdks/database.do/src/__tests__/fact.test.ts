import { describe, expect, it } from 'vitest'
import { DB } from '..'

const resources = DB().resources

async function res<T extends Record<string, any>>(where: T): Promise<T> {
  const nounList = (
    await resources.find({
      where,
    })
  ).data
  return (nounList.length ? nounList[0] : await resources.create(where)).data as T
}

async function unit(id: any) {
  return res({
    id,
  })
}

async function Graph(type: string, nouns?: any[]) {
  return res({
    type,
    nouns,
  })
}
async function GraphSchema(arity: number, verb: (...args: any[]) => any, reading: string[], constraints: any[]) {
  return res({
    arity,
    verb,
    reading,
    constraints,
  })
}

async function makeVerb(graphSchema: Awaited<ReturnType<typeof GraphSchema>>) {
  return graphSchema.verb
}

async function bind(noun: any, bindFn: (...args: any[]) => any) {
  return bindFn(noun)
}

async function unitState<V, S>(value: V, state: S) {
  return res({
    value,
    state,
  })
}
function bindState<V, S>(valueSelector: (state: { value: V; state: S }) => { value: V; state: S }, stateSelector: (state: { value: V; state: S }) => { value: V; state: S }) {
  return (state: { value: V; state: S }) => {
    const value = valueSelector(state)
    const newState = stateSelector(value)
    return { value: value.value, state: newState.state }
  }
}
async function unguarded(computeNext: any) {
  return makeTransition((_state: any, _input: any) => true, computeNext)
}

async function triggerEvent(fact: any, time: any, readings?: any) {
  return res({
    fact,
    time,
    readings,
  })
}
async function evaluateConstraint(constraint: any, population: any) {
  return constraint.predicate(population)
}
async function evaluateWithModality(constraint: any, population: any) {
  return {
    modality: constraint.modality,
    value: constraint.predicate(population),
  }
}
async function Constraint(modality: any, predicate: any) {
  return res({
    modality,
    predicate,
  })
}
async function Violation(constraint: any, noun: any, reason: any) {
  return res({
    constraint,
    noun,
    reason,
  })
}
async function nounType(name: string) {
  return Graph('nounType', [unit(name)])
}
async function graphSchema(verb: any, arity: number) {
  return Graph('graphSchema', [verb, unit(arity)])
}
async function role(name: any, arity: any, reading: any) {
  return res({
    type: 'role',
    name,
    arity,
    reading,
  })
}
async function inverseReading(primary: any, inverse: any, order: any, template: any) {
  return res({
    type: 'inverseReading',
    primary,
    inverse,
    order,
    template,
  })
}
async function constraint(id: any, modality: any) {
  return Graph('constraint', [unit(id), unit(modality)])
}
async function constraintTarget(id: any, verb: any, roleIndex: number) {
  return Graph('constraintTarget', [unit(id), unit(verb), unit(roleIndex)])
}
async function violation(noun: any, constraintId: any, reason: any) {
  return Graph('violation', [noun, constraintId, reason])
}
async function reading(verb: any, template: any) {
  return Graph('reading', [unit(verb), unit(template)])
}
async function StateMachine(transition: any, initial: any) {
  return res({
    transition,
    initial,
  })
}
async function runMachine(machine: any, eventStream: any) {}
async function makeTransition(guard: any, computeNext: any) {
  return (state: any, input: any) => (guard(state, input) ? computeNext(state, input) : state)
}
async function Reading(verb: any, order: any, template: any) {
  return res({
    verb,
    order,
    template,
  })
}
const ALETHIC = 'alethic'
const DEONTIC = 'deontic'

describe.skip('Nouns', () => {
  describe('Noun, unit, bind, id', () => {
    it('should create and manipulate nouns', async () => {
      const noun = await unit(42)
      expect(noun.id).toBe(42)

      const boundNoun = await bind(noun, async (id: number) => await unit(id * 2))
      expect(boundNoun.id).toBe(84)
    })
  })
})

describe.skip('Relationships and Facts', () => {
  describe('GraphSchema', () => {
    it('should create a relationship type with arity, verb function, reading, and constraints', async () => {
      // 1. Create test values
      const testArity = 2
      const testVerbFn = async (nouns: any[]) => await Graph('loves', nouns)
      const testReading = ['', ' loves ', '']
      const testConstraints: any[] = []

      // 2. Create the GraphSchema
      const graphSchema = await GraphSchema(testArity, testVerbFn, testReading, testConstraints)

      // 3. Test that the values were stored correctly
      expect(graphSchema.arity).toBe(testArity)
      expect(graphSchema.verb).toBe(testVerbFn)
      expect(graphSchema.reading).toBe(testReading)
      expect(graphSchema.constraints).toBe(testConstraints)

      // 4. Test makeVerb with this Graph Schema
      const loves = await makeVerb(graphSchema)

      // 5. Create nouns
      const alice = await unit('Alice')
      const bob = await unit('Bob')

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
    it('should create a function to build facts', async () => {
      const verbFn = async (nouns: any) => await Graph('loves', nouns)
      const reading = ['', ' loves ', '']
      const constraints: any[] = []

      // Create a fact type using primitive number 2 for arity
      const lovesGraphSchema = await GraphSchema(2, verbFn, reading, constraints)
      const loves = await makeVerb(lovesGraphSchema)

      const alice = await unit('Alice')
      const bob = await unit('Bob')

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
    it('should create a symbolic fact with verb and nouns', async () => {
      const alice = await unit('Alice')
      const bob = await unit('Bob')
      const nouns = [alice, bob]

      const fact = await Graph('loves', nouns)

      expect(fact.type).toBe('loves')
      expect(fact.nouns).toBe(nouns)

      // Verify we can access the nouns correctly
      expect(fact.nouns?.[0].id).toBe('Alice')
      expect(fact.nouns?.[1].id).toBe('Bob')
    })
  })
})

describe.skip('Readings', () => {
  it('should create and access reading properties', async () => {
    const verb = await Graph('loves')
    const order = [0, 1]
    const template = ['', ' loves ', '']

    const reading = await Reading(verb, order, template)

    expect(reading.verb).toBe(verb)
    expect(reading.order).toBe(order)
    expect(reading.template).toBe(template)
  })
})

describe.skip('Events', () => {
  it('should create and access event properties', async () => {
    const alice = await unit('Alice')
    const bob = await unit('Bob')
    const nouns = [alice, bob]

    const fact = await Graph('loves', nouns)
    const time = 'yesterday'
    const readings = ['Alice loves Bob']

    const event = await triggerEvent(fact, time, readings)

    expect(event.fact).toBe(fact)
    expect(event.time).toBe(time)
    expect(event.readings).toBe(readings)
  })
})

describe.skip('State Machines', () => {
  describe('State manipulation', () => {
    it('unitState should create a state with a value', async () => {
      const state = await unitState(42, 'state')
      expect(state.value).toBe(42)
      expect(state.state).toBe('state')
    })

    it('bindState should compose state transformations', async () => {
      const state = bindState<number, string>(
        (a: { value: number; state: string }) => ({ value: a.state.length, state: a.state }),
        (a: { value: number; state: string }) => ({ value: a.value * 2, state: a.state + '!' }),
      )({ value: 4, state: 'test' })

      expect(state.value).toBe(8) // 'test' length is 4, doubled is 8
      expect(state.state).toBe('test!')
    })
  })

  describe('Transitions', () => {
    it('should create transitions with guards', async () => {
      const guard = () => async (input: any) => input.id === (await unit('valid')).id
      const computeNext = () => () => 'next-state'

      const transition = await makeTransition(guard, computeNext)

      expect(await transition('state', await unit('valid'))).toBe('next-state')
      expect(await transition('state', await unit('invalid'))).toBe('state')
    })

    it('unguarded should create a transition without a guard', async () => {
      const computeNext = () => () => 'next-state'

      const transition = await unguarded(computeNext)

      expect(transition('state', await unit('anything'))).toBe('next-state')
    })
  })

  describe('StateMachine', () => {
    it('should create and run a state machine', async () => {
      // Define a simple counter state machine
      const initialState = 0
      const transition = await unguarded((state: any) => (input: any) => {
        if (input.name === 'inc') return state + 1
        if (input.name === 'dec') return state - 1
        return state
      })

      const counterMachine = await StateMachine(transition, initialState)

      // Create events
      const incEvent1 = await triggerEvent(await Graph('inc'), 't1')
      const incEvent2 = await triggerEvent(await Graph('inc'), 't2')
      const decEvent = await triggerEvent(await Graph('dec'), 't3')

      // Create event stream
      const eventStream = [incEvent1, incEvent2, decEvent]

      // Run machine
      const finalState = await runMachine(counterMachine, eventStream)
      expect(finalState).toBe(1) // 0 + 1 + 1 - 1 = 1
    })
  })
})

describe.skip('Constraints and Violations', () => {
  describe('Constraint creation and evaluation', () => {
    it('should create a constraint with modality and predicate', async () => {
      const modality = ALETHIC
      const predicate = () => true

      const constraint = await Constraint(modality, predicate)

      expect(constraint.modality).toBe(modality)
      expect(constraint.predicate).toBe(predicate)
    })

    it('should evaluate constraints against a population', async () => {
      const alwaysTrue = await Constraint(ALETHIC, () => true)
      const alwaysFalse = await Constraint(DEONTIC, () => false)

      expect(await evaluateConstraint(alwaysTrue, ['population'])).toBe(true)
      expect(await evaluateConstraint(alwaysFalse, ['population'])).toBe(false)
    })

    it('should evaluate constraints with modality', async () => {
      const alwaysTrue = await Constraint(ALETHIC, () => true)
      const alwaysFalse = await Constraint(DEONTIC, () => false)

      const resultTrue = await evaluateWithModality(alwaysTrue, ['population'])
      const resultFalse = await evaluateWithModality(alwaysFalse, ['population'])

      expect(resultTrue.modality).toBe(ALETHIC)
      expect(resultTrue.value).toBe(true)

      expect(resultFalse.modality).toBe(DEONTIC)
      expect(resultFalse.value).toBe(false)
    })
  })

  describe('Violations', () => {
    it('should create a violation with constraint, noun, and reason', async () => {
      const constraint = await Constraint(DEONTIC, () => false)
      const noun = await unit('Alice')
      const reason = await unit('Violated rule')

      const violation = await Violation(constraint, noun, reason)

      // We need to provide a selector to extract data
      expect(violation.constraint).toBe(constraint)
      expect(violation.noun).toBe(noun)
      expect(violation.reason).toBe(reason)
    })
  })
})

describe.skip('Meta-Fact Declarations', () => {
  it('nounType should create a noun type', async () => {
    const fact = await nounType('person')
    expect(fact.type).toBe('nounType')
    expect(fact.nouns?.[0].id).toBe('person')
  })

  it('graphSchema should create a fact type declaration', async () => {
    const fact = await graphSchema('loves', 2)
    expect(fact.type).toBe('graphSchema')
    expect(fact.nouns?.[0].id).toBe('loves')
    expect(fact.nouns?.[1].id).toBe(2)
  })

  it('role should create a role declaration', async () => {
    const fact = await role('loves', 0, 'lover')
    expect(fact.type).toBe('role')
    expect(fact.name).toBe('loves')
    expect(fact.arity).toBe(0)
    expect(fact.reading).toBe('lover')
  })

  it('reading should create a reading declaration', async () => {
    const template = ['', ' loves ', '']
    const fact = await reading('loves', template)
    expect(fact.type).toBe('reading')
    expect(fact.nouns?.[0].id).toBe('loves')
  })

  it('inverseReading should create an inverse reading declaration', async () => {
    const fact = await inverseReading('loves', 'isLovedBy', [1, 0], ['', ' is loved by ', ''])
    expect(fact.type).toBe('inverseReading')
    expect(fact.primary).toBe('loves')
    expect(fact.inverse).toBe('isLovedBy')
  })

  it('constraint should create a constraint declaration', async () => {
    const fact = await constraint('uniqueLover', ALETHIC)
    expect(fact.type).toBe('constraint')
    expect(fact.nouns?.[0].id).toBe('uniqueLover')
    expect(fact.nouns?.[1].id).toBe(ALETHIC)
  })

  it('constraintTarget should create a constraint target declaration', async () => {
    const fact = await constraintTarget('uniqueLover', 'loves', 0)
    expect(fact.type).toBe('constraintTarget')
    expect(fact.nouns?.[0].id).toBe('uniqueLover')
    expect(fact.nouns?.[1].id).toBe('loves')
    expect(fact.nouns?.[2].id).toBe(0)
  })

  it('violation should create a violation declaration', async () => {
    const noun = await unit('Alice')
    const fact = await violation(noun, 'uniqueLover', 'Already has a lover')
    expect(fact.type).toBe('violation')
    expect(fact.nouns).toBeDefined()
  })
})

describe.skip('Reading Templates', () => {
  it('should create readings with appropriate template parts', async () => {
    // Define a reading template that will be used to render a relationship
    const template = ['', ' loves ', '']

    // Create a reading with a verb and order
    const verb = 'loves'
    const order = [0, 1]
    const readingObj = await Reading(verb, order, template)

    // Check the template was stored correctly
    expect(readingObj.template).toBe(template)
    expect(readingObj.verb).toBe(verb)
    expect(readingObj.order).toBe(order)
  })

  it('should allow comprehensive reading templates with positions', async () => {
    // More complex template with multiple parts
    const template = ['', ' sent ', ' to ', ' on ']

    // Create a reading with a verb and order (e.g., "sender sent message to recipient on date")
    const verb = 'sent'
    const order = [0, 1, 2, 3]

    const readingObj = await Reading(verb, order, template)

    expect(readingObj.template).toBe(template)
    expect(readingObj.verb).toBe(verb)
  })
})

describe.skip('Inverse Reading Functionality', () => {
  it('should create inverse readings', async () => {
    // Primary reading: "Alice loves Bob" -> Inverse: "Bob is loved by Alice"
    const primary = 'loves'
    const inverse = 'isLovedBy'
    // Reverse the order from [0,1] to [1,0]
    const order = [1, 0]
    const template = ['', ' is loved by ', '']

    const invReading = await inverseReading(primary, inverse, order, template)

    // Check the inverse reading structure
    expect(invReading.type).toBe('inverseReading')
    expect(invReading.primary).toBe('loves')
    expect(invReading.inverse).toBe('isLovedBy')

    // The third element should be the order
    const readingOrder = invReading.order
    expect(readingOrder).toBe(order)

    // The 4th element should be the template
    const readingTemplate = invReading.template
    expect(readingTemplate).toBe(template)
  })

  it('should support inverse readings with more complex relationships', async () => {
    // Primary: "Student enrolled in Course" -> Inverse: "Course has student enrolled"
    const primary = 'enrolledIn'
    const inverse = 'hasEnrolled'
    // Swap student and course: [0,1] -> [1,0]
    const order = [1, 0]
    const template = ['', ' has ', ' enrolled']

    const invReading = await inverseReading(primary, inverse, order, template)

    expect(invReading.primary).toBe('enrolledIn')
    expect(invReading.inverse).toBe('hasEnrolled')
  })
})

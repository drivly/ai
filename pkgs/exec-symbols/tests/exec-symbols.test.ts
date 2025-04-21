import { describe, expect, it } from 'vitest'
import {
  ADD,
  ALETHIC,
  AND,
  CSDP,
  Constraint,
  DEONTIC,
  EQ,
  EXP,
  Event,
  FALSE,
  FactSymbol,
  FactType,
  GE,
  GT,
  IF,
  ISEMPTY,
  Identity,
  LE,
  LT,
  MULT,
  NOT,
  Noun,
  OR,
  Reading,
  SUCC,
  StateMachine,
  TRUE,
  UINT,
  Violation,
  ZERO,
  append,
  bind,
  bind_state,
  cons,
  constraint,
  constraintTarget,
  equals,
  evaluate_constraint,
  evaluate_with_modality,
  factType,
  fold,
  fst,
  get_arity,
  get_constraints,
  get_event_readings,
  get_fact,
  get_id,
  get_modality,
  get_nouns,
  get_predicate,
  get_reading,
  get_reading_order,
  get_reading_template,
  get_reading_verb,
  get_time,
  get_verb,
  get_verb_symbol,
  inverseReading,
  makeVerbFact,
  make_transition,
  map,
  nil,
  nounType,
  nth,
  pair,
  reading,
  reorder,
  role,
  run_machine,
  snd,
  unguarded,
  unit,
  unit_state,
  violation,
} from '../src'

const zero = ZERO
const one = SUCC(zero)
const two = SUCC(one)
const three = SUCC(two)
const four = SUCC(three)
const five = SUCC(four)
const six = SUCC(five)
const eight = SUCC(SUCC(six))
const nine = SUCC(eight)

describe('Lambda Calculus Primitives', () => {
  describe('IDENTITY', () => {
    it('should return the input value', () => {
      expect(Identity(5)).toBe(5)
      expect(Identity('test')).toBe('test')
      const obj = { a: 1 }
      expect(Identity(obj)).toBe(obj)
    })
  })

  describe('TRUE and FALSE', () => {
    it('TRUE should return the first argument', () => {
      expect(TRUE('first')('second')).toBe('first')
    })

    it('FALSE should return the second argument', () => {
      expect(FALSE('first')('second')).toBe('second')
    })
  })

  describe('IF', () => {
    it('should return the first argument when condition is TRUE', () => {
      expect(IF(TRUE)('then')('else')).toBe('then')
    })

    it('should return the second argument when condition is FALSE', () => {
      expect(IF(FALSE)('then')('else')).toBe('else')
    })
  })

  describe('AND, OR, NOT', () => {
    it('AND should combine two predicates correctly', () => {
      // AND returns TRUE (first arg) only when both inputs are TRUE
      const result1 = AND(TRUE)(TRUE)
      expect(result1('yes')('no')).toBe('yes')

      const result2 = AND(TRUE)(FALSE)
      expect(result2('yes')('no')).toBe('no')

      const result3 = AND(FALSE)(TRUE)
      expect(result3('yes')('no')).toBe('no')

      const result4 = AND(FALSE)(FALSE)
      expect(result4('yes')('no')).toBe('no')
    })

    it('OR should combine two predicates correctly', () => {
      // OR returns TRUE (first arg) if either input is TRUE
      const result1 = OR(TRUE)(TRUE)
      expect(result1('yes')('no')).toBe('yes')

      const result2 = OR(TRUE)(FALSE)
      expect(result2('yes')('no')).toBe('yes')

      const result3 = OR(FALSE)(TRUE)
      expect(result3('yes')('no')).toBe('yes')

      const result4 = OR(FALSE)(FALSE)
      expect(result4('yes')('no')).toBe('no')
    })

    it('NOT should negate predicates correctly', () => {
      const result1 = NOT(TRUE)
      expect(result1('yes')('no')).toBe('no')

      const result2 = NOT(FALSE)
      expect(result2('yes')('no')).toBe('yes')
    })
  })

  describe('Church Lists and Pairs', () => {
    it('pair should create a pair that can be accessed with a function', () => {
      const p = pair(1)(2)
      expect(p((a) => (b) => a)).toBe(1)
      expect(p((a) => (b) => b)).toBe(2)
    })

    it('fst should extract the first element of a pair', () => {
      const p = pair(1)(2)
      expect(fst(p)).toBe(1)
    })

    it('snd should extract the second element of a pair', () => {
      const p = pair(1)(2)
      expect(snd(p)).toBe(2)
    })

    it('nil should represent an empty list', () => {
      // Create an empty list instance
      const emptyList = nil

      // Verify empty list
      expect(ISEMPTY(emptyList)('yes')('no')).toEqual('yes')
    })

    it('cons should add an element to the start of a list', () => {
      // Create a list with one element
      const oneElementList = cons(zero)(nil)

      // Create a list with multiple elements using list instead of cons
      const multiElementList = cons(zero)(cons(one)(cons(two)(nil)))

      // Verify one element list
      expect(fst(oneElementList)).toEqual(zero)

      // Verify multi-element list - the order matches how we constructed it
      expect(fst(multiElementList)).toEqual(zero)
      expect(fst(snd(multiElementList))).toEqual(one)

      // Test cons adds to the front by creating a new list
      const newList = cons(eight)(multiElementList)

      // Original list should be unchanged
      expect(fst(multiElementList)).toEqual(zero)
      expect(fst(snd(multiElementList))).toEqual(one)
      expect(fst(snd(snd(multiElementList)))).toEqual(two)

      // New list should have the new element at the front
      expect(fst(newList)).toEqual(eight)
      expect(fst(snd(newList))).toEqual(zero)
      expect(fst(snd(snd(newList)))).toEqual(one)
    })

    it('fold should apply a function to each element of a list', () => {
      const l = cons(zero)(cons(one)(cons(two)(nil)))
      const sum = fold(ADD)(zero)(l)
      expect(EQ(sum)(three)('yes')('no')).toBe('yes')
    })

    it('map should transform each element of a list', () => {
      const l = cons(zero)(cons(one)(cons(two)(nil)))

      // Test a simpler transformation: increment by one
      const incremented = map((x) => SUCC(x))(l)

      // Now test that: zero+1=one, one+1=two, two+1=three
      expect(EQ(fst(incremented))(one)('yes')('no')).toEqual('yes')
      expect(EQ(fst(snd(incremented)))(two)('yes')('no')).toEqual('yes')
      expect(EQ(fst(snd(snd(incremented))))(three)('yes')('no')).toEqual('yes')
    })

    it('append should join two lists', () => {
      const list1 = cons(zero)(cons(one)(nil))
      const list2 = cons(two)(cons(three)(nil))
      const joined = append(list1)(list2)
      expect(fst(joined)).toEqual(zero)
      expect(fst(snd(joined))).toEqual(one)
      expect(fst(snd(snd(joined)))).toEqual(two)
      expect(fst(snd(snd(snd(joined))))).toEqual(three)
    })
  })

  describe('Church Numerals', () => {
    it('ZERO should represent the number 0', () => {
      // In Church encoding, a numeral n is a function that applies another function f, n times to a value x
      // So ZERO should apply a function 0 times, meaning it returns the original value

      // Test with a simple increment function
      const increment = (x: number) => x + 1
      const result = ZERO(increment)(5)

      // Since ZERO applies the function 0 times, we should get back the original value (5)
      expect(result).toBe(5)

      // We can also test that it equals a function that returns the identity function
      expect(EQ(ZERO)(() => Identity)('yes')('no')).toBe('yes')
    })

    it('UINT should convert JavaScript numbers to Church numerals', () => {
      // Test with negative number - should return ZERO
      const negativeResult = UINT(-5)
      expect(EQ(negativeResult)(ZERO)('yes')('no')).toBe('yes')

      // Test with zero - should return ZERO
      const zeroResult = UINT(0)
      expect(EQ(zeroResult)(ZERO)('yes')('no')).toBe('yes')

      // Test with positive numbers - should return the correct Church numeral
      const oneResult = UINT(1)
      expect(EQ(oneResult)(one)('yes')('no')).toBe('yes')

      const threeResult = UINT(4)
      expect(EQ(threeResult)(four)('yes')('no')).toBe('yes')

      const fiveResult = UINT(5)
      expect(EQ(fiveResult)(five)('yes')('no')).toBe('yes')

      // Test with larger number
      const nineResult = UINT(9)
      expect(EQ(nineResult)(nine)('yes')('no')).toBe('yes')
    })

    it('SUCC should increment a Church numeral', () => {
      expect(EQ(one)(SUCC(zero))('yes')('no')).toBe('yes')
      expect(EQ(two)(SUCC(one))('yes')('no')).toBe('yes')
      expect(EQ(three)(SUCC(two))('yes')('no')).toBe('yes')
      expect(EQ(eight)(SUCC(SUCC(SUCC(five))))('yes')('no')).toBe('yes')
    })

    it('ADD should add two Church numerals', () => {
      expect(EQ(ADD(zero)(zero))(zero)('yes')('no')).toBe('yes')
      expect(EQ(ADD(zero)(one))(one)('yes')('no')).toBe('yes')
      expect(EQ(ADD(one)(one))(two)('yes')('no')).toBe('yes')
      expect(EQ(ADD(two)(two))(four)('yes')('no')).toBe('yes')
      expect(EQ(ADD(two)(three))(five)('yes')('no')).toBe('yes')
    })

    it('MULT should multiply two Church numerals', () => {
      expect(EQ(MULT(zero)(zero))(zero)('yes')('no')).toBe('yes')
      expect(EQ(MULT(zero)(one))(zero)('yes')('no')).toBe('yes')
      expect(EQ(MULT(one)(one))(one)('yes')('no')).toBe('yes')
      expect(EQ(MULT(two)(two))(four)('yes')('no')).toBe('yes')
      expect(EQ(MULT(two)(three))(six)('yes')('no')).toBe('yes')
    })

    it('EXP should raise one Church numeral to the power of another', () => {
      expect(EQ(EXP(zero)(zero))(one)('yes')('no')).toBe('yes')
      expect(EQ(EXP(zero)(one))(zero)('yes')('no')).toBe('yes')
      expect(EQ(EXP(one)(one))(one)('yes')('no')).toBe('yes')
      expect(EQ(EXP(two)(two))(four)('yes')('no')).toBe('yes')
      expect(EQ(EXP(two)(three))(eight)('yes')('no')).toBe('yes')
      expect(EQ(EXP(three)(two))(nine)('yes')('no')).toBe('yes')
    })

    it('Comparison operators (EQ, LT, GT, LE, GE) should work correctly', () => {
      // Test EQ (equality)
      // Equal values
      expect(EQ(zero)(zero)('equal')('not equal')).toBe('equal')
      expect(EQ(one)(one)('equal')('not equal')).toBe('equal')
      expect(EQ(two)(two)('equal')('not equal')).toBe('equal')
      expect(EQ(three)(three)('equal')('not equal')).toBe('equal')

      // Non-equal values
      expect(EQ(zero)(one)('equal')('not equal')).toBe('not equal')
      expect(EQ(one)(two)('equal')('not equal')).toBe('not equal')
      expect(EQ(two)(three)('equal')('not equal')).toBe('not equal')
      expect(EQ(three)(zero)('equal')('not equal')).toBe('not equal')

      // Test LT (less than)
      // True cases
      expect(LT(zero)(one)('less')('not less')).toBe('less')
      expect(LT(one)(two)('less')('not less')).toBe('less')
      expect(LT(two)(three)('less')('not less')).toBe('less')

      // False cases (including equal values)
      expect(LT(one)(zero)('less')('not less')).toBe('not less')
      expect(LT(two)(one)('less')('not less')).toBe('not less')
      expect(LT(three)(two)('less')('not less')).toBe('not less')
      expect(LT(zero)(zero)('less')('not less')).toBe('not less')
      expect(LT(one)(one)('less')('not less')).toBe('not less')

      // Test GT (greater than)
      // True cases
      expect(GT(one)(zero)('greater')('not greater')).toBe('greater')
      expect(GT(two)(one)('greater')('not greater')).toBe('greater')
      expect(GT(three)(two)('greater')('not greater')).toBe('greater')

      // False cases (including equal values)
      expect(GT(zero)(one)('greater')('not greater')).toBe('not greater')
      expect(GT(one)(two)('greater')('not greater')).toBe('not greater')
      expect(GT(two)(three)('greater')('not greater')).toBe('not greater')
      expect(GT(zero)(zero)('greater')('not greater')).toBe('not greater')
      expect(GT(two)(two)('greater')('not greater')).toBe('not greater')

      // Test LE (less than or equal)
      // True cases for less
      expect(LE(zero)(one)('less or equal')('not less or equal')).toBe('less or equal')
      expect(LE(one)(two)('less or equal')('not less or equal')).toBe('less or equal')
      expect(LE(two)(three)('less or equal')('not less or equal')).toBe('less or equal')

      // True cases for equal
      expect(LE(zero)(zero)('less or equal')('not less or equal')).toBe('less or equal')
      expect(LE(one)(one)('less or equal')('not less or equal')).toBe('less or equal')
      expect(LE(two)(two)('less or equal')('not less or equal')).toBe('less or equal')

      // False cases
      expect(LE(one)(zero)('less or equal')('not less or equal')).toBe('not less or equal')
      expect(LE(two)(one)('less or equal')('not less or equal')).toBe('not less or equal')
      expect(LE(three)(two)('less or equal')('not less or equal')).toBe('not less or equal')

      // Test GE (greater than or equal)
      // True cases for greater
      expect(GE(one)(zero)('greater or equal')('not greater or equal')).toBe('greater or equal')
      expect(GE(two)(one)('greater or equal')('not greater or equal')).toBe('greater or equal')
      expect(GE(three)(two)('greater or equal')('not greater or equal')).toBe('greater or equal')

      // True cases for equal
      expect(GE(zero)(zero)('greater or equal')('not greater or equal')).toBe('greater or equal')
      expect(GE(one)(one)('greater or equal')('not greater or equal')).toBe('greater or equal')
      expect(GE(three)(three)('greater or equal')('not greater or equal')).toBe('greater or equal')

      // False cases
      expect(GE(zero)(one)('greater or equal')('not greater or equal')).toBe('not greater or equal')
      expect(GE(one)(two)('greater or equal')('not greater or equal')).toBe('not greater or equal')
      expect(GE(two)(three)('greater or equal')('not greater or equal')).toBe('not greater or equal')
    })
  })
})

describe('Nouns', () => {
  describe('Noun, unit, bind, get_id', () => {
    it('should create and manipulate nouns', () => {
      const noun = Noun(42)
      expect(get_id(noun)).toBe(42)

      const unitNoun = unit(42)
      expect(get_id(unitNoun)).toBe(42)

      const boundNoun = bind(unitNoun)((id: number) => unit(id * 2))
      expect(get_id(boundNoun)).toBe(84)
    })
  })

  describe('equals', () => {
    it('should compare nouns by ID', () => {
      const noun1 = unit(1)
      const noun2 = unit(1)
      const noun3 = unit(2)

      expect(equals(noun1)(noun2)('yes')('no')).toBe('yes')
      expect(equals(noun1)(noun3)('yes')('no')).toBe('no')
    })
  })

  describe('Utility functions', () => {
    it('nth should return the nth element of a list', () => {
      const l = cons(zero)(cons(one)(cons(two)(nil)))
      expect(EQ(nth(zero)(l))(zero)('yes')('no')).toBe('yes')
      expect(EQ(nth(one)(l))(one)('yes')('no')).toBe('yes')
      expect(EQ(nth(two)(l))(two)('yes')('no')).toBe('yes')
    })
  })
})

describe('Relationships and Facts', () => {
  describe('FactType', () => {
    it('should create a relationship type with arity, verb function, reading, and constraints', () => {
      // 1. Create test values
      const testArity = 2
      const testVerbFn = (args) => FactSymbol(unit('loves'))(args)
      const testReading = ['', ' loves ', '']
      const testConstraints = nil

      // 2. Create the FactType
      const factType = FactType(testArity)(testVerbFn)(testReading)(testConstraints)

      // 3. Test that the values were stored correctly
      expect(get_arity(factType)).toBe(testArity)
      expect(get_verb(factType)).toBe(testVerbFn)
      expect(get_reading(factType)).toBe(testReading)
      expect(get_constraints(factType)).toBe(testConstraints)

      // 4. Test makeVerbFact with this FactType
      const loves = makeVerbFact(factType)

      // 5. Create nouns
      const alice = unit('Alice')
      const bob = unit('Bob')

      // 6. Create a fact using the curried function
      const aliceLovesBob = loves(alice)(bob)

      // 7. Verify the fact
      expect(get_verb_symbol(aliceLovesBob)).toBe('loves')

      // 8. Verify the nouns in the fact
      const nouns = get_nouns(aliceLovesBob)
      expect(get_id(nth(zero)(nouns))).toBe('Alice')
      expect(get_id(nth(one)(nouns))).toBe('Bob')
    })
  })

  describe('makeVerbFact', () => {
    it('should create a curried function to build facts', () => {
      const verbFn = (args) => FactSymbol(unit('loves'))(args)
      const reading = ['', ' loves ', '']
      const constraints = nil

      // Create a fact type using primitive number 2 for arity
      const lovesFactType = FactType(2)(verbFn)(reading)(constraints)
      const loves = makeVerbFact(lovesFactType)

      const alice = unit('Alice')
      const bob = unit('Bob')

      const fact = loves(alice)(bob)

      // Verify the created fact
      expect(get_verb_symbol(fact)).toBe('loves')

      // Verify nouns
      const nouns = get_nouns(fact)
      expect(get_id(nth(zero)(nouns))).toBe('Alice')
      expect(get_id(nth(one)(nouns))).toBe('Bob')
    })
  })

  describe('FactSymbol', () => {
    it('should create a symbolic fact with verb and nouns', () => {
      const alice = unit('Alice')
      const bob = unit('Bob')
      const nouns = cons(alice)(cons(bob)(nil))

      const fact = FactSymbol(unit('loves'))(nouns)

      expect(get_verb_symbol(fact)).toBe('loves')
      expect(get_nouns(fact)).toBe(nouns)

      // Verify we can access the nouns correctly
      expect(get_id(nth(zero)(get_nouns(fact)))).toBe('Alice')
      expect(get_id(nth(one)(get_nouns(fact)))).toBe('Bob')
    })
  })
})

describe('Readings', () => {
  it('should create and access reading properties', () => {
    const verb = FactSymbol('loves')
    const order = cons(zero)(cons(one)(nil))
    const template = ['', ' loves ', '']

    const reading = Reading(verb)(order)(template)

    expect(get_reading_verb(reading)).toBe(verb)
    expect(get_reading_order(reading)).toBe(order)
    expect(get_reading_template(reading)).toBe(template)
  })
})

describe('Events', () => {
  it('should create and access event properties', () => {
    const alice = unit('Alice')
    const bob = unit('Bob')
    const nouns = cons(alice)(cons(bob)(nil))

    const fact = FactSymbol('loves')(nouns)
    const time = 'yesterday'
    const readings = cons('Alice loves Bob')(nil)

    const event = Event(fact)(time)(readings)

    expect(get_fact(event)).toBe(fact)
    expect(get_time(event)).toBe(time)
    expect(get_event_readings(event)).toBe(readings)
  })
})

describe('State Machines', () => {
  describe('State manipulation', () => {
    it('unit_state should create a state with a value', () => {
      const state = unit_state(42)('state')
      expect(fst(state)).toBe(42)
      expect(snd(state)).toBe('state')
    })

    it('bind_state should compose state transformations', () => {
      const state = bind_state((s: string) => unit_state(s.length)(s))((n: number) => (s: string) => unit_state(n * 2)(s + '!'))('test')

      expect(fst(state)).toBe(8) // 'test' length is 4, doubled is 8
      expect(snd(state)).toBe('test!')
    })
  })

  describe('Transitions', () => {
    it('should create transitions with guards', () => {
      const guard = () => (input) => equals(input)(unit('valid'))
      const compute_next = () => () => 'next-state'

      const transition = make_transition(guard)(compute_next)

      expect(transition('state')(unit('valid'))).toBe('next-state')
      expect(transition('state')(unit('invalid'))).toBe('state')
    })

    it('unguarded should create a transition without a guard', () => {
      const compute_next = () => () => 'next-state'

      const transition = unguarded(compute_next)

      expect(transition('state')(unit('anything'))).toBe('next-state')
    })
  })

  describe('StateMachine', () => {
    it('should create and run a state machine', () => {
      // Define a simple counter state machine
      const initialState = 0
      const transition = unguarded((state) => (input) => {
        if (get_verb_symbol(input) === 'inc') return state + 1
        if (get_verb_symbol(input) === 'dec') return state - 1
        return state
      })

      const counterMachine = StateMachine(transition)(initialState)

      // Create events
      const incEvent1 = Event(FactSymbol(unit('inc'))(nil))('t1')(nil)
      const incEvent2 = Event(FactSymbol(unit('inc'))(nil))('t2')(nil)
      const decEvent = Event(FactSymbol(unit('dec'))(nil))('t3')(nil)

      // Create event stream
      const eventStream = cons(incEvent1)(cons(incEvent2)(cons(decEvent)(nil)))

      // Run machine
      const finalState = run_machine(counterMachine)(eventStream)
      expect(finalState).toBe(1) // 0 + 1 + 1 - 1 = 1
    })
  })
})

describe('Constraints and Violations', () => {
  describe('Constraint creation and evaluation', () => {
    it('should create a constraint with modality and predicate', () => {
      const modality = ALETHIC
      const predicate = () => true

      const constraint = Constraint(modality)(predicate)

      expect(get_modality(constraint)).toBe(modality)
      expect(get_predicate(constraint)).toBe(predicate)
    })

    it('should evaluate constraints against a population', () => {
      const alwaysTrue = Constraint(ALETHIC)(() => true)
      const alwaysFalse = Constraint(DEONTIC)(() => false)

      expect(evaluate_constraint(alwaysTrue)('population')).toBe(true)
      expect(evaluate_constraint(alwaysFalse)('population')).toBe(false)
    })

    it('should evaluate constraints with modality', () => {
      const alwaysTrue = Constraint(ALETHIC)(() => true)
      const alwaysFalse = Constraint(DEONTIC)(() => false)

      const resultTrue = evaluate_with_modality(alwaysTrue)('population')
      const resultFalse = evaluate_with_modality(alwaysFalse)('population')

      expect(fst(resultTrue)).toBe(ALETHIC)
      expect(snd(resultTrue)).toBe(true)

      expect(fst(resultFalse)).toBe(DEONTIC)
      expect(snd(resultFalse)).toBe(false)
    })
  })

  describe('Violations', () => {
    it('should create a violation with constraint, noun, and reason', () => {
      const constraint = Constraint(DEONTIC)(() => false)
      const noun = unit('Alice')
      const reason = unit('Violated rule')

      const violation = Violation(constraint)(noun)(reason)

      // We need to provide a selector to extract data
      expect(violation((c) => (_e) => (_r) => c)).toBe(constraint)
      expect(violation((_c) => (e) => (_r) => e)).toBe(noun)
      expect(violation((_c) => (_e) => (r) => r)).toBe(reason)
    })
  })
})

describe('Meta-Fact Declarations', () => {
  it('nounType should create a noun type', () => {
    const fact = nounType('person')
    expect(get_verb_symbol(fact)).toBe('nounType')
    expect(get_id(fst(get_nouns(fact)))).toBe('person')
  })

  it('factType should create a fact type declaration', () => {
    const fact = factType('loves', 2)
    expect(get_verb_symbol(fact)).toBe('factType')
    expect(get_id(fst(get_nouns(fact)))).toBe('loves')
    expect(get_id(nth(one)(get_nouns(fact)))).toBe(2)
  })

  it('role should create a role declaration', () => {
    const fact = role('loves', 0, 'lover')
    expect(get_verb_symbol(fact)).toBe('role')
    expect(get_id(fst(get_nouns(fact)))).toBe('loves')
    expect(get_id(nth(one)(get_nouns(fact)))).toBe(0)
    expect(get_id(nth(two)(get_nouns(fact)))).toBe('lover')
  })

  it('reading should create a reading declaration', () => {
    const template = ['', ' loves ', '']
    const fact = reading('loves', template)
    expect(get_verb_symbol(fact)).toBe('reading')
    expect(get_id(fst(get_nouns(fact)))).toBe('loves')
  })

  it('inverseReading should create an inverse reading declaration', () => {
    const fact = inverseReading('loves', 'is_loved_by', cons(1)(cons(0)(nil)), ['', ' is loved by ', ''])
    expect(get_verb_symbol(fact)).toBe('inverseReading')
    expect(get_id(fst(get_nouns(fact)))).toBe('loves')
    expect(get_id(nth(one)(get_nouns(fact)))).toBe('is_loved_by')
  })

  it('constraint should create a constraint declaration', () => {
    const fact = constraint('unique_lover', ALETHIC)
    expect(get_verb_symbol(fact)).toBe('constraint')
    expect(get_id(fst(get_nouns(fact)))).toBe('unique_lover')
    expect(get_id(nth(one)(get_nouns(fact)))).toBe(ALETHIC)
  })

  it('constraintTarget should create a constraint target declaration', () => {
    const fact = constraintTarget('unique_lover', 'loves', 0)
    expect(get_verb_symbol(fact)).toBe('constraintTarget')
    expect(get_id(fst(get_nouns(fact)))).toBe('unique_lover')
    expect(get_id(nth(one)(get_nouns(fact)))).toBe('loves')
    expect(get_id(nth(two)(get_nouns(fact)))).toBe(0)
  })

  it('violation should create a violation declaration', () => {
    const noun = unit('Alice')
    const fact = violation(noun, 'unique_lover', 'Already has a lover')
    expect(get_verb_symbol(fact)).toBe('violation')
    expect(get_nouns(fact)).toBeDefined()
  })
})

describe('Constants', () => {
  describe('Modalities', () => {
    it('should define modality constants', () => {
      expect(ALETHIC).toBe('alethic')
      expect(DEONTIC).toBe('deontic')
    })
  })

  describe('Reserved Symbols', () => {
    it('should have the reserved symbols defined', () => {
      expect(typeof CSDP).toBe('symbol')
    })
  })
})

describe('Utility Functions', () => {
  describe('reorder', () => {
    it('should reorder nouns according to the order list', () => {
      // Create a list of nouns
      const alice = unit('Alice')
      const bob = unit('Bob')
      const charlie = unit('Charlie')
      const nouns = cons(alice)(cons(bob)(cons(charlie)(nil)))

      // Create an order list to rearrange: [2, 0, 1] (charlie, alice, bob)
      const order = cons(two)(cons(zero)(cons(one)(nil)))

      // Apply reorder
      const reordered = reorder(nouns)(order)

      // Check that the order is now [charlie, alice, bob]
      expect(get_id(nth(zero)(reordered))).toBe('Charlie')
      expect(get_id(nth(one)(reordered))).toBe('Alice')
      expect(get_id(nth(two)(reordered))).toBe('Bob')
    })
  })
})

describe('Reading Templates', () => {
  it('should create readings with appropriate template parts', () => {
    // Define a reading template that will be used to render a relationship
    const template = ['', ' loves ', '']

    // Create a reading with a verb and order
    const verbSymbol = 'loves'
    const order = cons(zero)(cons(one)(nil))
    const readingObj = Reading(verbSymbol)(order)(template)

    // Check the template was stored correctly
    expect(get_reading_template(readingObj)).toBe(template)
    expect(get_reading_verb(readingObj)).toBe(verbSymbol)
    expect(get_reading_order(readingObj)).toBe(order)
  })

  it('should allow comprehensive reading templates with positions', () => {
    // More complex template with multiple parts
    const template = ['', ' sent ', ' to ', ' on ']

    // Create a reading with a verb and order (e.g., "sender sent message to recipient on date")
    const verbSymbol = 'sent'
    const order = cons(zero)(cons(one)(cons(two)(cons(three)(nil))))

    const readingObj = Reading(verbSymbol)(order)(template)

    expect(get_reading_template(readingObj)).toBe(template)
    expect(get_reading_verb(readingObj)).toBe(verbSymbol)
  })
})

describe('Inverse Reading Functionality', () => {
  it('should create inverse readings', () => {
    // Primary reading: "Alice loves Bob" -> Inverse: "Bob is loved by Alice"
    const primary = 'loves'
    const inverse = 'is_loved_by'
    // Reverse the order from [0,1] to [1,0]
    const order = cons(one)(cons(zero)(nil))
    const template = ['', ' is loved by ', '']

    const invReading = inverseReading(primary, inverse, order, template)

    // Check the inverse reading structure
    expect(get_verb_symbol(invReading)).toBe('inverseReading')
    expect(get_id(nth(zero)(get_nouns(invReading)))).toBe('loves')
    expect(get_id(nth(one)(get_nouns(invReading)))).toBe('is_loved_by')

    // The third element should be the order
    const readingOrder = nth(two)(get_nouns(invReading))
    expect(readingOrder).toBe(order)

    // The fourth element should be the template
    const readingTemplate = nth(three)(get_nouns(invReading))
    expect(readingTemplate).toBe(template)
  })

  it('should support inverse readings with more complex relationships', () => {
    // Primary: "Student enrolled in Course" -> Inverse: "Course has student enrolled"
    const primary = 'enrolled_in'
    const inverse = 'has_enrolled'
    // Swap student and course: [0,1] -> [1,0]
    const order = cons(one)(cons(zero)(nil))
    const template = ['', ' has ', ' enrolled']

    const invReading = inverseReading(primary, inverse, order, template)

    expect(get_id(fst(get_nouns(invReading)))).toBe('enrolled_in')
    expect(get_id(nth(one)(get_nouns(invReading)))).toBe('has_enrolled')
  })
})

# exec-symbols

[![Tests](https://github.com/graphdl/exec-symbols/actions/workflows/tests.yml/badge.svg)](https://github.com/graphdl/exec-symbols/actions/workflows/tests.yml)

A **purely functional TypeScript library** for modeling facts, nouns, constraints, and state machines in JavaScript. Functional programming techniques are used for the backends at WhatsApp and X and spam filtering on Facebook, and enables parallelizable, deferred-by-default execution.

This library enables _knowledge graphs, object bindings, state machines, and inversion of control_ all as functional closures. It can be used for rule engines, domain-specific language projects, and more.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [Church Booleans](#church-booleans)
  - [Church Numerals](#church-numerals)
  - [Church Lists and Pairs](#church-lists-and-pairs)
  - [Nouns and Binding](#nouns-and-binding)
  - [Relationships and Facts](#relationships-and-facts)
  - [Readings](#readings)
  - [Events](#events)
  - [State Machines](#state-machines)
  - [Constraints and Violations](#constraints-and-violations)
- [Examples](#examples)
- [License](#license)
- [Testing](#testing)

---

## Features

- **Church Booleans** (`TRUE`, `FALSE`, `AND`, `OR`, `NOT`) and combinators (`IF`)
- **Church Numerals** (`ZERO`, `SUCC`, `ADD`, `MULT`, `EXP`, `EQ`, `LT`, `GT`, `LE`, `GE`)
- **Church-encoded Pairs and Lists** (`pair`, `fst`, `snd`, `nil`, `ISEMPTY`, `cons`, `fold`, `map`, `append`)
- **Nouns** with a monadic interface (`Noun`, `unit`, `bind`, `get_id`)
- **Relationship Types** (`FactType`) supporting arity, verb function, reading, and constraints
- **Curried Verb Facts** to dynamically build relationships by supplying arguments (`makeVerbFact`)
- **Symbolic Facts** (`FactSymbol`) and accessors (`get_verb_symbol`, `get_nouns`)
- **Readings** (`Reading`) with templates, verb accessors, and inverse readings
- **Events** for time-based fact processing
- **State Machines** with transitions, guard functions, and event-driven updates
- **Constraints** (alethic vs. deontic), with predicates that evaluate over a "population"
- **Violations** to track when constraints are broken
- **DSL for domain meta-facts** (e.g., roles, fact types, constraint references, etc.)

---

## Installation

If you plan to use it in a Node.js project:

```bash
npm install exec-symbols
```

Then, in your code:

```js
const {
  IDENTITY,
  TRUE,
  FALSE,
  IF,
  AND,
  OR,
  NOT,
  ZERO,
  SUCC,
  ADD,
  MULT,
  EXP,
  EQ,
  LT,
  GT,
  LE,
  GE,
  pair,
  fst,
  snd,
  nil,
  ISEMPTY,
  cons,
  map,
  fold,
  append,
  Noun,
  unit,
  bind,
  get_id,
  equals,
  nth,
  reorder,
  FactType,
  get_arity,
  get_verb,
  get_reading,
  get_constraints,
  makeVerbFact,
  FactSymbol,
  get_verb_symbol,
  get_nouns,
  Reading,
  get_reading_verb,
  get_reading_order,
  get_reading_template,
  Event,
  get_fact,
  get_time,
  get_event_readings,
  unit_state,
  bind_state,
  make_transition,
  unguarded,
  StateMachine,
  run_machine,
  run_noun,
  Constraint,
  get_modality,
  get_predicate,
  evaluate_constraint,
  evaluate_with_modality,
  Violation,
  nounType,
  factType,
  role,
  reading,
  inverseReading,
  constraint,
  constraintTarget,
  violation,
  ALETHIC,
  DEONTIC,
  RMAP,
  CSDP,
} = require('exec-symbols')
```

---

## Quick Start

1. Create a FactType (relationship type) with a specified arity (the number of noun arguments).
2. Use `makeVerbFact` to build a curried function that expects that many nouns.
3. Represent facts using `FactSymbol` (if you just need a symbolic representation).
4. Model constraints as needed, and evaluate them against a collection of facts (the "population").
5. Use `Event` and `StateMachine` to process a stream of events that update your system state.

---

## Core Concepts

### Church Booleans

```js
const TRUE = (t) => (f) => t
const FALSE = (t) => (f) => f
const IF = (b) => (t) => (e) => b(t)(e)

// AND, OR, NOT
const AND = (p) => (q) => p(q)(FALSE)
const OR = (p) => (q) => p(TRUE)(q)
const NOT = (p) => p(FALSE)(TRUE)
```

- These are _Church-encoded_ booleans. They are functions that, given two branches, choose one to evaluate.

### Church Numerals

```js
const ZERO = (a) => (b) => b
const SUCC = (n) => (a) => (b) => a(n(a)(b))
const ADD = (m) => (n) => (a) => (b) => m(SUCC)(n)(a)(b)
const MULT = (m) => (n) => (a) => (b) => m(n(a))(b)
const EXP = (m) => (n) => (a) => (b) => n(m)(a)(b)
const EQ = (m) => (n) => AND(LE(m)(n))(LE(n)(m))
const LT = (m) => (n) => NOT(GE(m)(n))
const GT = (m) => (n) => NOT(LE(m)(n))
const LE = (m) => (n) => ISZERO(SUB(m)(n))
const GE = (m) => (n) => ISZERO(SUB(n)(m))
```

- Church numerals represent natural numbers as functions
- A Church numeral `n` applies a function `f` exactly `n` times to a value
- The library includes arithmetic operations (`ADD`, `MULT`, `EXP`) and comparisons (`EQ`, `LT`, `GT`, `LE`, `GE`)

### Church Lists and Pairs

```js
// Pairs
const pair = a => b => f => f(a)(b)
const fst  = p => p((a, _) => a)
const snd  = p => p((_, b) => b)

// Lists
const nil  = c => n => n
const ISEMPTY = (L) => L((head) => (tail) => FALSE)
const cons = h => t => c => n => c(h)(t(c)(n))
const fold = f => acc => l => l(f)(acc)
const map  = f => l => ...
const append = l1 => l2 => ...
```

- A _pair_ is stored as a function that takes a function `f` and applies `f(a)(b)`.
- A _list_ is stored as a function that takes a function for the "cons" case (`c`) and a function for the "nil" case (`n`).
- `ISEMPTY` checks if a list is empty.

### Nouns and Binding

```js
const Noun = (id) => (s) => s(id)
const unit = (id) => Noun(id)
const bind = (e) => (f) => e((id) => f(id))
const get_id = (e) => e((id) => id)
```

- An `Noun` is also a function (the same Church-style approach).
- `unit` creates an noun from an identifier.
- `bind` gives a way to compose noun transformations (similar to a monad).

### Relationships and Facts

#### Relationship Types

```js
const FactType = (arity) => (verbFn) => (reading) => (constraints) => (s) => s(arity)(verbFn)(reading)(constraints)
```

- A `FactType` captures:
  1. Arity (number of nouns in the relationship),
  2. A verb function,
  3. A reading (a textual representation or something similar),
  4. Constraints (additional rules).

`makeVerbFact`:

```js
const makeVerbFact = (FactType) => {
  const arity = get_arity(FactType)
  const verb = get_verb(FactType)

  const curry = (args, n) => (n === 0 ? verb(args) : (arg) => curry(append(args)(cons(arg)(nil)), n - 1))

  return curry(nil, arity)
}
```

- Takes a `FactType` and returns a curried function that expects exactly `arity` number of nouns. Once all nouns are provided, it executes the underlying verb function.

#### Symbolic Facts

```js
const FactSymbol = (verb) => (nouns) => (s) => s(verb)(nouns)
```

- A quick way to represent a fact as `(verb, [nouns])` in a Church-encoded closure.

### Readings

```js
const Reading = (verb, order, template) => (s) => s(verb, order, template)
const get_reading_verb = (r) => r((v, o, t) => v)
const get_reading_order = (r) => r((v, o, t) => o)
const get_reading_template = (r) => r((v, o, t) => t)
```

- A `Reading` represents how to textually represent a fact
- `verb` is the verb symbol
- `order` is the order of nouns in the reading
- `template` is an array of strings that are concatenated with noun IDs

### Events

```js
const Event = (fact) => (time) => (readings) => (s) => s(fact, time, readings)
const get_fact = (e) => e((f, t, r) => f)
const get_time = (e) => e((f, t, r) => t)
const get_event_readings = (e) => e((f, t, r) => r)
```

- An `Event` pairs a fact with a time and optional readings, again using a function-based approach.

### State Machines

```js
// State Monad
const unit_state = (a) => (s) => pair(a)(s)
const bind_state = (m) => (f) => (s) => {
  /* typical state-monad logic */
}

// Transition
const make_transition = (guard) => (compute_next) => (state) => (input) => IF(guard(state)(input))(compute_next(state)(input))(state)

// Unguarded transition
const unguarded = make_transition((_s) => (_i) => TRUE)

// StateMachine
const StateMachine = (transition) => (initial) => (s) => s(transition)(initial)

// Running a machine
const run_machine = (machine) => (stream) => machine((transition, initial) => fold((event) => (state) => transition(state)(get_fact(event)))(initial)(stream))
```

- The code includes guarded transitions (using Church booleans) and a state monad for carrying and updating state.
- `StateMachine` encapsulates a transition function and an initial state.
- `run_machine` processes a _stream_ of events (Church-encoded list) against the transition function.

### Constraints and Violations

```js
const Constraint = (modality) => (predicate) => (s) => s(modality)(predicate)
const Violation = (constraint) => (noun) => (reason) => (s) => s(constraint)(noun)(reason)
```

- Constraints contain:

  - Modality (e.g., `ALETHIC` or `DEONTIC`).
  - A predicate function to evaluate over a "population."

- A `Violation` is a record of which noun violated which constraint, and why.

## Examples

### Simple Boolean Usage

```js
const isTrue = IF(TRUE)('yes')('no') // 'yes'
const isFalse = IF(FALSE)('yes')('no') // 'no'
```

### Executing a Fact

```js
// Define a selector that creates a readable string
const readableSelector = (verb, nouns) => {
  const nounValues = map(get_id)(nouns);

  // Get reading for this verb (simplified lookup)
  const readingInfo = /* lookup reading for verb */;
  const template = get_reading_template(readingInfo);
  const order = get_reading_order(readingInfo);

  // Reorder nouns according to reading order
  const orderedNouns = reorder(nounValues, order);

  // Apply template for any arity
  return fold(
    (value, index) => (str) => str.replace(`{${index}}`, value),
    template,
    orderedNouns
  );
}

// Example usage:
const aliceKnowsBob = FactSymbol('knows')(list(unit('Alice'), unit('Bob')));
const readableString = aliceKnowsBob(readableSelector);
// readableString would be something like "Alice knows Bob"
```

### Building a Relationship and a Fact

```js
// Define a relationship type: "loves", arity = 2
const lovesFactType = FactType(2)((args) => {
  // A simple verb function that returns a FactSymbol
  return FactSymbol('loves')(args)
})(
  ['', ' loves ', ''], // reading
)(
  nil, // no additional constraints
)

// Make a verb fact for "loves"
const loves = makeVerbFact(lovesFactType)

// Provide two nouns
const alice = unit('Alice')
const bob = unit('Bob')

// Curried usage
const fact = loves(alice)(bob) // => FactSymbol('loves')(cons(alice)(cons(bob)(nil)))

// Inspect
console.log(get_verb_symbol(fact)) // 'loves'
console.log(get_id(nth(0)(get_nouns(fact)))) // 'Alice'
console.log(get_id(nth(1)(get_nouns(fact)))) // 'Bob'
```

### Basic State Machine Example

```js
// Define a simple guard and next state
const guard = (state) => (input) =>
  // For demonstration, only proceed if input matches "go"
  equals(input)(unit('go'))

const compute_next = (state) => (input) =>
  // Return a new state, e.g., "running"
  pair(unit('running'))(snd(state))

// Make a transition
const transition = make_transition(guard)(compute_next)

// Initial machine
const myMachine = StateMachine(transition)(pair(unit('idle'))(nil))

// Stream of events
const eventStream = cons(Event(unit('go'))(0)(nil))(cons(Event(unit('stop'))(1)(nil))(nil))

// Run
const finalState = run_machine(myMachine)(eventStream)
console.log(get_id(fst(finalState))) // "running" if it processed "go"
```

### Using Readings

```js
// Define a reading
const lovesReading = Reading('loves', cons(ZERO)(cons(SUCC(ZERO))(nil)), ['', ' loves ', ''])

// Create an inverse reading (B is loved by A instead of A loves B)
const lovedByReading = inverseReading('loves', 'is_loved_by', cons(SUCC(ZERO))(cons(ZERO)(nil)), ['', ' is loved by ', ''])

// Use in event with readings
const event = Event(loves(alice)(bob))('now')(cons(lovesReading)(cons(lovedByReading)(nil)))
```

### Lightweight Symbolic Forum Model Example

Demonstrates:

- Executable verbs
- FactTypes and Readings
- Inverse readings (manually declared)
- Event emission with all readings
- Deontic constraint requiring inverse reading
- Minimal fact population with post/reply/moderation

```js
// ───────────── Nouns ─────────────
const alice = unit('alice')
const bob = unit('bob')
const thread1 = unit('thread-1')
const postA = unit('post-A')
const postB = unit('post-B')

// ───────────── FactType: posts ─────────────
const postsVerb = (args) => {
  const [user, post, thread] = [nth(0)(args), nth(1)(args), nth(2)(args)]
  return FactSymbol('posts')(args)
}

const postsType = FactType(3)(postsVerb)(['', ' posted ', ' in ', ''])(nil)

// Reading: forward
reading('posts', ['', ' posted ', ' in ', ''])

// Inverse reading - thread contains posts
inverseReading('posts', 'contains', cons(2)(cons(1)(cons(0)(nil))), ['', ' contains post ', ' by ', ''])

// ───────────── FactType: replies ─────────────
const repliesVerb = (args) => {
  const [user, replyPost, originalPost] = [nth(0)(args), nth(1)(args), nth(2)(args)]
  return FactSymbol('replies')(args)
}

const repliesType = FactType(3)(repliesVerb)(['', ' replied with ', ' to ', ''])(nil)

reading('replies', ['', ' replied with ', ' to ', ''])

// Inverse reading for replies - has reply from
inverseReading('replies', 'hasReplyFrom', cons(2)(cons(1)(cons(0)(nil))), ['', ' has reply ', ' from ', ''])

// ───────────── FactType: moderates ─────────────
const moderatesVerb = (args) => {
  const [moderator, post] = [nth(0)(args), nth(1)(args)]
  return FactSymbol('moderates')(args)
}

const moderatesType = FactType(2)(moderatesVerb)(['', ' moderated ', ''])(nil)

reading('moderates', ['', ' moderated ', ''])

// ───────────── Deontic Constraint: inverse required for posts ─────────────
const inverseRequiredForPosts = Constraint(DEONTIC)((pop) => {
  const found = any(pop, (f) => get_verb_symbol(f) === 'inverseReading' && get_id(nth(0)(get_nouns(f))) === 'posts')
  return found ? TRUE : FALSE
})

constraint('inverse_required_for_posts', DEONTIC)
constraintTarget('inverse_required_for_posts', 'posts', 0)

// ───────────── Fact Instances ─────────────
// Alice posts postA in thread1
const postFact = makeVerbFact(postsType)(alice)(postA)(thread1)

// Bob replies to postA with postB
const replyFact = makeVerbFact(repliesType)(bob)(postB)(postA)

// Alice moderates Bob's post
const modFact = makeVerbFact(moderatesType)(alice)(postB)

// ───────────── Events ─────────────
// Inverse reading list provided to Event
const inverseReadingsForPosts = cons(Reading('contains', cons(2)(cons(1)(cons(0)(nil))), ['', ' contains post ', ' by ', '']))(nil)

const event1 = Event(postFact)(unit('t1'))(inverseReadingsForPosts)
const event2 = Event(replyFact)(unit('t2'))(nil)
const event3 = Event(modFact)(unit('t3'))(nil)

// ───────────── Constraint Evaluation ─────────────
const pop = cons(inverseReading('posts', 'contains', cons(2)(cons(1)(cons(0)(nil))), ['', ' contains post ', ' by ', '']))(nil)

const evalResult = evaluate_with_modality(inverseRequiredForPosts)(pop)
// Expected: pair(DEONTIC)(TRUE)
```

---

## License

This library is provided as-is for learning, experimentation, and reference. Feel free to adapt it for your own purposes.
[MIT License](https://opensource.org/licenses/MIT)

## Testing

This project uses Vitest for testing. To run the tests:

```bash
pnpm test
```

Or with Bun directly:

```bash
bun test
```

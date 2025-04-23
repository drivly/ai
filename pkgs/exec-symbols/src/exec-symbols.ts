// #region Lambda Calculus Primitives and Utilities
type Truth = <T>(a: T) => (_b: T) => T
type Numeral = <T>(a: (...args: [T]) => T) => (b: T) => T
const NULL = <T>(b: T) => b
const Identity = <T>(n: T) => n
const TRUE: Truth =
  <T>(a: T) =>
  (_b: T) =>
    a
const FALSE: Truth =
  <T>(_a: T) =>
  (b: T) =>
    b
const IF =
  <T>(condition: Truth) =>
  (trueCase: T) =>
  (falseCase: T) =>
    condition(trueCase)(falseCase)
const AND: (p: Truth) => (q: Truth) => Truth = (p) => (q) => p(q)(FALSE)
const OR: (p: Truth) => (q: Truth) => Truth = (p) => (q) => p(TRUE)(q)
const NOT: (p: Truth) => Truth = (p) => p(FALSE)(TRUE)
type Pair<A, B> = <T>(f: (a: A) => (b: B) => T) => T
const pair =
  <A>(a: A) =>
  <B>(b: B): Pair<A, B> =>
  <T>(f: (a: A) => (b: B) => T): T =>
    f(a)(b)
const fst = <A, B>(p: Pair<A, B>): A => p((a: A) => (_: B) => a)
const snd = <A, B>(p) => p((_: A) => (b: B) => b)
const nil =
  <C>(_c: C) =>
  <A>(a: A) =>
  <B>(_b: B) =>
    a
const ISEMPTY = (L) =>
  L(
    <H>(_head: H) =>
      <T>(_tail: T) =>
      <A>(_a: A) =>
      (b: A) =>
        b,
  )
const cons =
  <H>(head: H) =>
  <T>(tail: T) =>
  <O>(selector: (head: H) => (tail: T) => O) =>
    selector(head)(tail)
const list = (...args: unknown[]) => args.reduceRight((acc, item) => cons(item)(acc), nil)
const U =
  <L>(le: L) =>
  <X>(x: X) =>
    le(<Y>(y: Y) => x(x)(y))
const Θ = <T, V>(le: (a: (m: T) => V) => (m: T) => V) => U(le)(U(le))
type List<T> = <R>(selector: <A>(isEmpty: R) => <B>(cons: (head: T) => (tail: List<T>) => R) => R) => R
const fold = Θ(
  <T, R>(recFold: (f: (head: T) => (acc: R) => R) => (acc: R) => (list: List<T>) => R) =>
    (f: (head: T) => (acc: R) => R) =>
    (acc: R) =>
    (list: List<T>) =>
      IF(ISEMPTY(list))(acc)(list((head: T) => (tail: List<T>) => f(head)(recFold(f)(acc)(tail)))),
)
const map =
  <F>(f: F) =>
  <L>(list: L) =>
    fold(
      <X>(x: X) =>
        <A>(acc: A) =>
          cons(f(x))(acc),
    )(nil)(list)
const append =
  <A>(l1: A) =>
  <B>(l2: B) =>
    fold(cons)(l2)(l1)
const nth =
  (n: Numeral) =>
  <L>(list: L) =>
    Θ(
      <R>(recNth: R) =>
        <N>(targetN: N) =>
        <L>(currentList: List<L>) =>
        (currentIndex: Numeral) =>
          IF(ISEMPTY(currentList))(nil)(
            IF(EQ(currentIndex)(targetN))(currentList((h) => () => h))(
              currentList(
                <H>(_h: H) =>
                  <T>(t: T) =>
                    recNth(targetN)(t)(SUCC(currentIndex)),
              ),
            ),
          ),
    )(n)(list)(ZERO)
const reorder =
  <N>(nouns: N) =>
  <O>(order: O) =>
    map((i: Numeral) => nth(i)(nouns))(order) as N
// a function that calls a function zero times
const ZERO: Numeral =
  <T>(_a: (...args: [T]) => T) =>
  (b: T) =>
    b
// increases the number of times a numeral's function is called
const SUCC: (n: Numeral) => Numeral = (n) => (a) => (b) => a(n(a)(b))
const UINT: (n: number) => Numeral = (n: number) => (n < 0 ? ZERO : Θ<number, Numeral>((rec) => (m) => (m === 0 ? ZERO : SUCC(rec(m - 1))))(n))
const ADD: (m: Numeral) => (n: Numeral) => Numeral = (m) => (n) => (a) => (b) => m(SUCC)(n)(a)(b)
const MULT: (m: Numeral) => (n: Numeral) => Numeral = (m) => (n) => (a) => (b) => m(n(a))(b)
const EXP: (m: Numeral) => (n: Numeral) => Numeral = (m: Numeral) => (n: Numeral) => (a) => (b) => n(m)(a)(b)
const PRED: (n: Numeral) => Numeral = (n) => (f) => (x) => n((g) => (h) => h(g(f)))((u) => x)((u) => u)
const SUB: (m: Numeral) => (n: Numeral) => Numeral = (m: Numeral) => (n: Numeral) => n(PRED)(m)
const ISZERO: (n: Numeral) => Truth = (n) => n((_x) => FALSE)(TRUE) as Truth
const EQ = (m: Numeral) => (n: Numeral) => AND(LE(m)(n))(LE(n)(m))
const LE = (m: Numeral) => (n: Numeral) => ISZERO(SUB(m)(n))
const GE = (m: Numeral) => (n: Numeral) => ISZERO(SUB(n)(m))
const LT = (m: Numeral) => (n: Numeral) => NOT(GE(m)(n))
const GT = (m: Numeral) => (n: Numeral) => NOT(LE(m)(n))
// #endregion
// #region Executable Facts
const Noun =
  <T = unknown, O = T>(id: T) =>
  (s: (id: T) => O) =>
    s(id)
const unit = <T = unknown>(id: T) => Noun(id)
const bind =
  <A>(e: A) =>
  <B>(f: B) =>
    e(<T>(id: T) => f(id))
const get_id = (e) => e((id) => id)
const equals = (a) => (b) => (get_id(a) === get_id(b) ? TRUE : FALSE)
type ReadingType<V, O, T> = <S>(selector: (verb: V) => (order: O) => (template: T) => S) => S
const Reading =
  <V, O, T>(verb: V) =>
  (order: O) =>
  (template: T): ReadingType<V, O, T> =>
  <S>(selector: (verb: V) => (order: O) => (template: T) => S): S =>
    selector(verb)(order)(template)
const get_reading_verb = <V, O, T>(r: ReadingType<V, O, T>): V => r((v: V) => (_o: O) => (_t: T) => v)
const get_reading_order = <V, O, T>(r: ReadingType<V, O, T>): O => r((_v: V) => (o: O) => (_t: T) => o)
const get_reading_template = <V, O, T>(r: ReadingType<V, O, T>): T => r((_v: V) => (_o: O) => (t: T) => t)
type FactTypeFn<A, V, R, C> = <T>(selector: (a: A) => (v: V) => (r: R) => (c: C) => T) => T
const FactType =
  <A>(arity: A) =>
  <V>(verbFn: V) =>
  <R>(reading: R) =>
  <C>(constraints: C) =>
  <O>(s: (arity: A) => (verbFn: V) => (reading: R) => (constraints: C) => O) =>
    s(arity)(verbFn)(reading)(constraints)
const get_arity = <A, V, R, C>(factType: FactTypeFn<A, V, R, C>) => factType((a: A) => (_v: V) => (_r: R) => (_c: C) => a)
const get_verb = <A, V, R, C>(factType: FactTypeFn<A, V, R, C>) => factType((_a: A) => (v: V) => (_r: R) => (_c: C) => v)
const get_reading = <A, V, R, C>(factType: FactTypeFn<A, V, R, C>) => factType((_a: A) => (_v: V) => (r: R) => (_c: C) => r)
const get_constraints = <A, V, R, C>(factType: FactTypeFn<A, V, R, C>) => factType((_a: A) => (_v: V) => (_r: R) => (c: C) => c)
const makeVerbFact = <A, V, R, C>(FactType: FactTypeFn<A, V, R, C>) =>
  Θ((curry) => (args) => (n: number) => (n === 0 ? get_verb(FactType)(args) : <A>(arg: A) => curry(append(args)(cons(arg)(nil)))(n - 1)))(nil)(get_arity(FactType))
const FactSymbol =
  <V>(verb: V) =>
  <N>(nouns: N) =>
  <S>(s: (verb: V) => (nouns: N) => S) =>
    s(verb)(nouns)
const get_verb_symbol = (f) =>
  f(
    <V>(v: V) =>
      <N>(_n: N) =>
        v((a: unknown) => a),
  )
const get_nouns = (f) =>
  f(
    <V>(_v: V) =>
      <N>(n: N) =>
        n,
  )
type EventType<F, T, R> = <O>(selector: (fact: F) => (time: T) => (readings: R) => O) => O
const Event =
  <F>(fact: F) =>
  <T>(time: T) =>
  <R>(readings: R): EventType<F, T, R> =>
  <O>(selector: (fact: F) => (time: T) => (readings: R) => O): O =>
    selector(fact)(time)(readings)
const get_fact = <F, T, R>(e: EventType<F, T, R>): F => e((f: F) => (_t: T) => (_r: R) => f)
const get_time = <F, T, R>(e: EventType<F, T, R>): T => e((_f: F) => (t: T) => (_r: R) => t)
const get_event_readings = <F, T, R>(e: EventType<F, T, R>): R => e((_f: F) => (_t: T) => (r: R) => r)
// #endregion
// #region State Machine
const unit_state =
  <K>(a: K) =>
  <V>(s: V) =>
    pair(a)(s)
const bind_state =
  <A, B, S>(m: (state: S) => Pair<A, S>) =>
  (f: (value: A) => (state: S) => Pair<B, S>) =>
  (s: S): Pair<B, S> =>
    ((result) => f(fst(result))(snd(result)))(m(s))
const make_transition =
  <G>(guard: G) =>
  <C>(compute_next: C) =>
  <S>(state: S) =>
  <I>(input: I) =>
    IF(guard(state)(input))(compute_next(state)(input))(state)
const unguarded = make_transition(
  <S>(_s: S) =>
    <I>(_i: I) =>
      TRUE,
)
const StateMachine =
  <T>(transition: T) =>
  <I>(initial: I) =>
  <S>(s: (transition: T) => (initial: I) => S) =>
    s(transition)(initial)
const run_machine =
  <M>(machine: M) =>
  <S>(stream: S) =>
    machine(
      <T>(transition: T) =>
        <I>(initial: I) =>
          fold(
            <E>(event: E) =>
              <W>(state: W) =>
                transition(state)(get_fact(event)),
          )(initial)(stream),
    )
// #endregion
// #region Constraints & Violations
const ALETHIC = 'alethic'
const DEONTIC = 'deontic'
type Modality = typeof ALETHIC | typeof DEONTIC
type ConstraintType<P> = <O>(selector: (modality: Modality) => (predicate: P) => O) => O
const Constraint =
  (modality: Modality) =>
  <P>(predicate: P): ConstraintType<P> =>
  <O>(selector: (modality: Modality) => (predicate: P) => O): O =>
    selector(modality)(predicate)
const get_modality = <P>(c: ConstraintType<P>): Modality => c((m: Modality) => (_p: P) => m)
const get_predicate = <P>(c: ConstraintType<P>): P => c((_m: Modality) => (p: P) => p)
const evaluate_constraint =
  <C>(constraint: ConstraintType<C>) =>
  <P>(pop: P) =>
    get_predicate(constraint)(pop)
const evaluate_with_modality =
  <C>(constraint: ConstraintType<C>) =>
  <P>(pop: P) =>
    pair(get_modality(constraint))(evaluate_constraint(constraint)(pop))
const Violation =
  <C>(constraint: C) =>
  <N>(noun: N) =>
  <R>(reason: R) =>
  <S>(s: (constraint: C) => (noun: N) => (reason: R) => S) =>
    s(constraint)(noun)(reason)
// #endregion
// #region System metamodel
type FactSymbolType = <S>(s: (verb: unknown) => (nouns: unknown) => S) => S
const nounType = (name: string): FactSymbolType => FactSymbol(unit('nounType'))(list(unit(name)))
const factType = <V>(verb: V, arity: number): FactSymbolType => FactSymbol(unit('factType'))(list(unit(verb), unit(arity)))
const role = <V>(verb: V, index: number, name: string): FactSymbolType => FactSymbol(unit('role'))(list(unit(verb), unit(index), unit(name)))
const reading = <V>(verb: V, parts: string[]): FactSymbolType => FactSymbol(unit('reading'))(list(unit(verb), ...parts.map((p) => unit(p))))
const inverseReading = <P, I, O, T = string[]>(primary: P, inverse: I, order: O, template: T) =>
  FactSymbol(unit('inverseReading'))(list(unit(primary), unit(inverse), order, template))
const constraint = <T>(id: T, modality: Modality) => FactSymbol(unit('constraint'))(list(unit(id), unit(modality)))
const constraintTarget = <C, V>(constraintId: C, verb: V, roleIndex: number) => FactSymbol(unit('constraintTarget'))(list(unit(constraintId), unit(verb), unit(roleIndex)))
const violation = <N, C, R>(noun: N, constraintId: C, reason: R) => FactSymbol(unit('violation'))(list(unit(noun), unit(constraintId), unit(reason)))
// #endregion
// #region Reserved Symbols
// TODO: CSDP
// The conceptual schema design procedure is an AI-assisted process to create an application schema that runs on top of this framework.
// The AI gathers information from the user and uses it to create the schema.
// 1. Transform familiar information examples into elementary facts, and apply quality checks
// 2. Create the fact types, and apply a population check
// 3. Check for entity types that should be combined, and note any arithmetic derivations
// 4. Add uniqueness constraints, and check arity of fact types
// 5. Add mandatory role constraints, and check for logical derivations
// 6. Add value, set comparison and subtyping constraints
// 7. Add other constraints and perform final checks
const CSDP = Symbol('CSDP')
// #endregion
export {
  /**
   * The addition function.
   * Returns the sum of the two parameters.
   * @param m - The first value.
   * @param n - The second value.
   * @returns The value.
   */
  ADD,
  ALETHIC,
  /**
   * The and function.
   * Returns true if both parameters are true.
   * @param p - The first value.
   * @param q - The second value.
   * @returns The value.
   */
  AND,
  append,
  bind,
  bind_state,
  cons,
  Constraint,
  constraint,
  constraintTarget,
  CSDP,
  DEONTIC,
  /**
   * The equality function.
   * Returns true if the two parameters are equal.
   * @param a - The first value.
   * @param b - The second value.
   * @returns The value.
   */
  EQ,
  /**
   * The equals function.
   * Returns true if two references are to the same object.
   * @param a - The first value.
   * @param b - The second value.
   * @returns The value.
   */
  equals,
  evaluate_constraint,
  evaluate_with_modality,
  Event,
  /**
   * The exponentiation function.
   * Returns the first parameter raised to the power of the second parameter.
   * @param m - The base.
   * @param n - The exponent.
   * @returns The value.
   */
  EXP,
  FactSymbol,
  FactType,
  factType,
  /**
   * The false function.
   * Returns the second parameter. (equivalent ZERO)
   * @param trueCase - The value to return if the condition is true.
   * @param falseCase - The value to return if the condition is false.
   * @returns The value.
   */
  FALSE,
  fold,
  /**
   * Returns the first value of the pair.
   * @param p - The pair.
   * @returns The value.
   */
  fst,
  /**
   * The greater than or equal to function.
   * Returns true if the first parameter is greater than or equal to the second parameter.
   * @param m - The first value.
   * @param n - The second value.
   * @returns The value.
   */
  GE,
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
  /**
   * The greater than function.
   * Returns true if the first parameter is greater than the second parameter.
   * @param m - The first value.
   * @param n - The second value.
   * @returns The value.
   */
  GT,
  /**
   * The identity function.
   * @param n - The value to return.
   * @returns The value.
   */
  Identity,
  /**
   * The if function.
   * Returns the first parameter if the condition is true, otherwise the second parameter.
   * @param condition - The condition to check.
   * @param trueCase - The value to return if the condition is true.
   * @param falseCase - The value to return if the condition is false.
   * @returns The value.
   */
  IF,
  inverseReading,
  ISEMPTY,
  /**
   * The less than or equal to function.
   * Returns true if the first parameter is less than or equal to the second parameter.
   * @param m - The first value.
   * @param n - The second value.
   * @returns The value.
   */
  LE,
  list,
  /**
   * The less than function.
   * Returns true if the first parameter is less than the second parameter.
   * @param m - The first value.
   * @param n - The second value.
   * @returns The value.
   */
  LT,
  make_transition,
  makeVerbFact,
  map,
  /**
   * The multiplication function.
   * Returns the product of the two parameters.
   * @param m - The first value.
   * @param n - The second value.
   * @returns The value.
   */
  MULT,
  nil,
  /**
   * The not function.
   * Negates the parameter.
   * @param p - The value to negate.
   * @returns The value.
   */
  NOT,
  Noun,
  nounType,
  /**
   * The nth function.
   * Returns the nth element of the list.
   * @param n - The index of the element to return.
   * @param list - The list to search.
   */
  nth,
  NULL,
  /**
   * The or function.
   * Returns true if either parameter is true.
   * @param p - The first value.
   * @param q - The second value.
   * @returns The value.
   */
  OR,
  /**
   * The pair function.
   * Returns a pair of the two parameters.
   * @param a - The first value.
   * @param b - The second value.
   * @returns The value.
   */
  pair,
  PRED,
  Reading,
  reading,
  reorder,
  role,
  run_machine,
  /**
   * Returns the second value of the pair.
   * @param p - The pair.
   * @returns The value.
   */
  snd,
  StateMachine,
  /**
   * The successor function.
   * Returns the successor of the parameter.
   * @param n - The value of which to get the successor.
   * @returns The value.
   */
  SUCC,
  /**
   * The true function.
   * Returns the first parameter.
   * @param trueCase - The value to return if the condition is true.
   * @param falseCase - The value to return if the condition is false.
   * @returns The value.
   */
  TRUE,
  UINT,
  unguarded,
  unit,
  unit_state,
  Violation,
  violation,
  /**
   * The zero function.
   * Returns the identity function as a constant. (equivalent to FALSE)
   * @param a - The function to apply to the pair.
   * @returns The value.
   */
  ZERO,
  type Modality,
  type Numeral,
  type Truth,
}

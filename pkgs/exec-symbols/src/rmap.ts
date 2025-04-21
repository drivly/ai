import { ADD, ALETHIC, EQ, FactSymbol, fold, get_arity, get_id, get_modality, get_nouns, get_verb_symbol, type Modality, nth, type Numeral, UINT } from './exec-symbols'

// Define the proper types based on the Church encoding pattern
type FactSymbolType = ReturnType<typeof FactSymbol>
type ConstraintType<P = unknown> = (selector: (modality: Modality) => (predicate: P) => unknown) => unknown

interface Table {
  name: string
  columns: { name: string; type: string }[]
  rows?: unknown[]
  key?: string
  functionalRoles?: FactSymbolType[]
}

/**
 * RMAP: Relational mapping pipeline for transforming atomic facts into a relational schema
 * Following the procedure outlined in the comments
 */
export const createRMapPipeline = () => {
  // Step 0.1: Transform exclusive unaries based on world semantics
  const transformUnaries = (facts: FactSymbolType[]) => {
    const isUnary = (fact: FactSymbolType) => {
      // TODO: Get the fact type from the fact
      // const factType = fact
      // return get_arity(factType) === 1
      return false
    }

    const unaries = facts.filter(isUnary)
    const rest = facts.filter((fact: FactSymbolType) => !isUnary(fact))

    // Process unaries based on open/closed semantics
    const transformedUnaries = unaries.map((fact: FactSymbolType) => {
      const verb = get_verb_symbol(fact)
      // Apply open/closed world semantics transformation
      return { original: fact, transformed: fact, semantics: 'open-world' }
    })

    return { unaries: transformedUnaries, remaining: rest }
  }

  // Step 0.2: Erase reference predicates, treat composite IDs as black boxes
  const eraseReferences = (facts: FactSymbolType[], schema: Record<string, unknown>) => {
    const referencePredicates = ['identifies', 'references', 'refers_to']

    const isReference = (fact: FactSymbolType) => {
      // Extract the verb string from the verb symbol
      const verbSymbol = get_verb_symbol(fact)
      const verb = typeof verbSymbol === 'string' ? verbSymbol : get_id(verbSymbol)
      return referencePredicates.includes(verb)
    }

    const blackBoxes = facts.filter(isReference).map((fact: FactSymbolType) => {
      const object = get_id(nth(UINT(0))(get_nouns(fact)))
      return object
    })

    return {
      blackBoxes,
      factsWithoutReferences: facts.filter((fact: FactSymbolType) => !isReference(fact)),
    }
  }

  // Step 1: Map fact types with compound uniqueness constraints to separate tables
  const mapCompoundConstraints = (facts: FactSymbolType[], constraints: ConstraintType[]) => {
    const constraintsByVerb: Record<string, { hasCompoundConstraint: boolean }> = {}

    // Group constraints by verb
    constraints.forEach((constraint) => {
      const modality = get_modality(constraint)
      if (modality === ALETHIC) {
        // Extract verb and apply to map
        // In a real implementation, we'd have a way to know which constraints are uniqueness constraints
      }
    })

    // Create tables for facts with compound uniqueness constraints
    const tables: Record<string, Table> = {}
    const remainingFacts = [...facts]

    facts.forEach((fact: FactSymbolType) => {
      const verbSymbol = get_verb_symbol(fact)
      const verb = typeof verbSymbol === 'string' ? verbSymbol : get_id(verbSymbol)

      if (constraintsByVerb[verb]?.hasCompoundConstraint) {
        // Create separate table
        if (!tables[verb]) {
          tables[verb] = { name: verb, columns: [], rows: [] }
        }

        // Add columns based on roles and readings
        // Add row from fact

        // Remove from remaining facts
        const idx = remainingFacts.indexOf(fact)
        if (idx >= 0) remainingFacts.splice(idx, 1)
      }
    })

    return {
      tables,
      remainingFacts,
    }
  }

  // Step 2.1: Group functional roles by object type
  const groupFunctionalRoles = (facts: FactSymbolType[], schema: Record<string, unknown>) => {
    const objectTypes = new Set<string>()
    const groupedFacts: Record<string, FactSymbolType[]> = {}

    // Find all object types
    facts.forEach((fact: FactSymbolType) => {
      const nouns = get_nouns(fact)
      fold((noun: unknown) => () => {
        const id = get_id(noun)
        objectTypes.add(id)
      })(null)(nouns)
    })

    // Group facts by object type for functional roles
    Array.from(objectTypes).forEach((objectType: string) => {
      const relatedFacts = facts.filter((fact: FactSymbolType) => {
        const nouns = get_nouns(fact)
        let hasObjectType = false
        fold((noun: unknown) => () => {
          if (get_id(noun) === objectType) {
            hasObjectType = true
          }
        })(null)(nouns)
        return hasObjectType
      })

      // Check if these are functional roles
      // (In a real implementation we'd check constraints)

      groupedFacts[objectType] = relatedFacts
    })

    return {
      objectTables: Object.entries(groupedFacts).map(([objectType, facts]) => ({
        name: objectType,
        key: objectType + '_id',
        functionalRoles: facts,
        columns: [{ name: 'id', type: 'string' }], // Add columns to make it compatible with Table
      })),
    }
  }

  // Step 3: Map independent object types to separate tables
  const mapIndependentObjects = (facts: FactSymbolType[], schema: Record<string, unknown>, existingTables: Table[]) => {
    // Find object types with no functional roles
    const objectsWithRoles = new Set(existingTables.map((t) => t.name))
    const independentObjects = new Set<string>()

    facts.forEach((fact: FactSymbolType) => {
      const nouns = get_nouns(fact)
      fold((noun: unknown) => () => {
        const id = get_id(noun)
        if (!objectsWithRoles.has(id)) {
          independentObjects.add(id)
        }
      })(null)(nouns)
    })

    return {
      independentTables: Array.from(independentObjects).map((objType: string) => ({
        name: objType,
        key: objType + '_id',
        columns: [
          { name: 'id', type: 'string' },
          { name: 'created_at', type: 'date' },
        ],
      })),
    }
  }

  // Step 4: Unpack black box columns
  const unpackBlackBoxes = (tables: Table[], blackBoxes: string[]) => {
    return {
      tables: tables.map((table: Table) => {
        // Check if any columns are black boxes
        const unpackedColumns = table.columns.flatMap((col) => {
          if (blackBoxes.includes(col.name)) {
            // Unpack into component attributes
            return [
              { name: col.name + '_id', type: 'string' },
              // Add other component attributes
            ]
          }
          return col
        })

        return {
          ...table,
          columns: unpackedColumns,
        }
      }),
    }
  }

  // Step 5: Handle subtype constraints
  const handleSubtypeConstraints = (tables: Table[], constraints: ConstraintType[], subtypes: Record<string, string[]> = {}) => {
    // 5.1 Map functional roles to qualified optional columns
    // 5.2 Map nonfunctional roles to qualified subset constraints
    // 5.3 Map nonfunctional roles of independent objects

    return {
      finalTables: tables.map((table: Table) => {
        // Process subtype constraints
        return table
      }),
    }
  }

  // The full pipeline
  return (facts: FactSymbolType[], constraints: ConstraintType[], subtypes: Record<string, string[]> = {}) => {
    // Process steps in sequence, passing results forward
    const { unaries, remaining } = transformUnaries(facts)
    const { blackBoxes, factsWithoutReferences } = eraseReferences(remaining, {})
    const { tables: factTables, remainingFacts } = mapCompoundConstraints(factsWithoutReferences, constraints)
    const { objectTables } = groupFunctionalRoles(remainingFacts, {})
    const { independentTables } = mapIndependentObjects(remainingFacts, {}, [...Object.values(factTables), ...(objectTables as Table[])])

    // Combine all tables
    const allTables = [...Object.values(factTables), ...(objectTables as Table[]), ...independentTables]

    const { tables: unpackedTables } = unpackBlackBoxes(allTables, blackBoxes)
    const { finalTables } = handleSubtypeConstraints(unpackedTables, constraints, subtypes)

    // Return the final schema
    return {
      schema: {
        tables: finalTables,
        relationships: [], // Derive relationships from constraints
        indices: [], // Derive indices from uniqueness constraints
      },
      // Also return the transformed facts for audit/reference
      transformedFacts: [...unaries.map((u) => u.transformed), ...factsWithoutReferences],
    }
  }
}

/**
 * Create a new relational map from a collection of facts, constraints, and subtypes
 * The relational map function transforms the atomic facts into a relational schema.
 * This is useful for listing properties of an entity or otherwise defining a schema.
 * 0.1 Transform exclusive unaries; map unaries according to their open/closed world semantics.
 * 0.2 Temporarily erase all reference (preferred identification) predicates and treat compositely-identified object types as "black boxes".
 * 0.3 Indicate any absorbtion-overrides (separation or partition) for subtypes.
 * 0.4 Identify any derived fact types that must be stored.
 * 0.5 Indicate mapping choices for symmetric 1:1 cases.
 * 0.6 Consider replacing any disjunctive reference schemes by using an artificial or concatenated identifier or mandatory defaults.
 * 0.7 Indicate mapping choice where required for any objectified associations that have no spanning uniqueness constraint.
 * 1.  Map each fact type with a compound uniqueness constraint to a separate table
 * 2.1 Fact types with functional roles attached to the same object type grouped into the same table, keyed on the object type's identifier
 * 2.2 Map 1:1 cases to a single table, generally favoring fewer nulls
 * 3.  Map each independent object type with no functional roles to a separate table
 * 4.  Unpack each "black box column" into its component attributes
 * 5.1 Map subtype constraints on functional roles to qualified optional columns
 * 5.2 Map subtype constraints on nonfunctional roles to qualified subset constraints
 * 5.3 Map nonfunctional roles of independent object types to column sequences that reference the independent table
 */
export const RMAP = (facts: FactSymbolType[], constraints: ConstraintType[], subtypes: Record<string, string[]> = {}) => {
  const pipeline = createRMapPipeline()
  return pipeline(facts, constraints, subtypes)
}

/**
 * Convert an RMAP result to a clean JSON representation
 * This handles Church-encoded data structures and converts them to plain objects
 */
export const toJSON = (rmapResult: ReturnType<typeof RMAP>) => {
  // Helper to decode Church-encoded values
  const decodeValue = (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return value
    }

    // Handle Church-encoded functions
    if (typeof value === 'function') {
      // Extract ID from noun
      if (typeof get_id === 'function') {
        try {
          return get_id(value)
        } catch {
          // Not a noun, continue
        }
      }

      // For FactSymbol, extract verb and nouns
      if (typeof get_verb_symbol === 'function' && typeof get_nouns === 'function') {
        try {
          const verb = get_verb_symbol(value)
          const nouns = get_nouns(value)

          // Convert nouns array
          const decodedNouns: unknown[] = []
          fold((noun: unknown) => () => {
            decodedNouns.push(decodeValue(noun))
            return null
          })(null)(nouns)

          return {
            verb: typeof verb === 'string' ? verb : decodeValue(verb),
            nouns: decodedNouns,
          }
        } catch {
          // Not a fact symbol, continue
        }
      }

      // Fallback for unknown function types
      return '[Function]'
    }

    // Handle arrays and objects recursively
    if (Array.isArray(value)) {
      return value.map(decodeValue)
    }

    if (typeof value === 'object' && value !== null) {
      const result: Record<string, unknown> = {}
      Object.keys(value as Record<string, unknown>).forEach((key) => {
        result[key] = decodeValue((value as Record<string, unknown>)[key])
      })
      return result
    }

    // Return primitives as is
    return value
  }

  // Process the tables
  const tables = rmapResult.schema.tables.map((table) => ({
    name: table.name,
    key: table.key || null,
    columns: table.columns.map((col) => ({
      name: col.name,
      type: col.type,
    })),
    rows: decodeValue(table.rows || []),
  }))

  // Process relationships
  const relationships = (rmapResult.schema.relationships || []).map((rel) => decodeValue(rel))

  // Process indices
  const indices = (rmapResult.schema.indices || []).map((idx) => decodeValue(idx))

  return {
    schema: {
      tables,
      relationships,
      indices,
    },
    transformedFacts: rmapResult.transformedFacts.map((fact) => decodeValue(fact)),
  }
}

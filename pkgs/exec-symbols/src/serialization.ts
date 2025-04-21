import { fold, get_fact, get_id, get_modality, get_nouns, get_time, get_verb_symbol } from './exec-symbols'

/**
 * Automatically detect and extract properties from Church-encoded objects
 * This approach dynamically discovers accessor patterns without hardcoding them
 */

// Track objects during serialization to prevent infinite recursion
const objectsInProgress = new WeakSet()

// /**
//  * Try to access properties of a Church-encoded object by introspecting its structure
//  * and automatically attempting different accessor patterns
//  */
// const extractProperties = (value: unknown): Record<string, unknown> => {
//   if (typeof value !== 'function') return {}

//   const properties: Record<string, unknown> = {}

//   // Using a more structured approach with accessor functions
//   // Define accessor functions to try with their corresponding property names
//   // Use a more general type for the accessor functions to avoid type errors
//   type AccessorFunction = (value: unknown) => unknown
//   const accessors: { name: string; fn: AccessorFunction }[] = [
//     { name: 'verb_symbol', fn: get_verb_symbol as AccessorFunction },
//     { name: 'nouns', fn: get_nouns as AccessorFunction },
//     { name: 'modality', fn: get_modality as AccessorFunction },
//     { name: 'predicate', fn: get_predicate as AccessorFunction },
//     { name: 'arity', fn: get_arity as AccessorFunction },
//     { name: 'verb', fn: get_verb as AccessorFunction },
//     { name: 'reading', fn: get_reading as AccessorFunction },
//     { name: 'constraints', fn: get_constraints as AccessorFunction },
//     { name: 'fact', fn: get_fact as AccessorFunction },
//     { name: 'time', fn: get_time as AccessorFunction },
//     { name: 'event_readings', fn: get_event_readings as AccessorFunction },
//     { name: 'reading_verb', fn: get_reading_verb as AccessorFunction },
//     { name: 'reading_order', fn: get_reading_order as AccessorFunction },
//     { name: 'reading_template', fn: get_reading_template as AccessorFunction },
//   ]

//   // Try each accessor function
//   for (const { name, fn } of accessors) {
//     try {
//       if (typeof fn === 'function') {
//         // We can safely call the function since we've typed it correctly now
//         const result = fn(value)
//         if (result !== undefined) {
//           properties[name] = result
//         }
//       }
//     } catch {
//       // If accessor fails, continue to next one
//     }
//   }

//   // Also try direct value extraction for simple cases
//   try {
//     if (typeof get_id === 'function') {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const idResult = (get_id as any)(value)
//       if (idResult !== undefined) {
//         properties.id = idResult
//       }
//     }
//   } catch {
//     // If id extraction fails, try simpler approach
//     try {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const simpleResult = (value as any)((id: unknown) => id)
//       if (simpleResult !== undefined && simpleResult !== value) {
//         properties.id = simpleResult
//       }
//     } catch {
//       // Ignore errors for failed patterns
//     }
//   }

//   return properties
// }

// /**
//  * Try to determine the type of a Church-encoded object based on its
//  * properties. This is used for adding a type hint to the serialized output.
//  */
// const inferType = (props: Record<string, unknown>): string => {
//   // Determine the most likely type based on property pattern
//   if (props.fact !== undefined && props.time !== undefined) return 'Event'
//   if (props.verb_symbol !== undefined && props.nouns !== undefined) return 'FactSymbol'
//   if (props.modality !== undefined && props.predicate !== undefined) return 'Constraint'
//   if (props.arity !== undefined && (props.verb !== undefined || props.reading !== undefined)) return 'FactType'
//   if (props.reading_verb !== undefined && props.reading_order !== undefined) return 'Reading'
//   if (Object.keys(props).length === 1 && props.id !== undefined) return 'Noun'

//   // Default if no specific pattern is recognized
//   return 'ChurchObject'
// }

/**
 * Convert Church-encoded objects to plain JavaScript objects for JSON serialization.
 * This dynamically detects properties on Church-encoded objects without hardcoding schemas.
 */
export const serialize = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return value
  }

  // Primitive values can be returned as-is
  if (typeof value !== 'object' && typeof value !== 'function') {
    return value
  }

  // Check for circular references
  if (objectsInProgress.has(value)) {
    return '[Circular]'
  }

  objectsInProgress.add(value)

  try {
    // Handle Church-encoded functions
    if (typeof value === 'function') {
      // First check if it's a Noun (simplest case)
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id = get_id(value as any)
        if (id !== undefined && typeof id !== 'function') {
          return id
        }
      } catch {
        // Not a Noun
      }

      // Check if it's a FactSymbol
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const verbSymbol = get_verb_symbol(value as any)
        if (verbSymbol !== undefined) {
          // Now try to get the nouns
          let nouns: unknown[] = []
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nounsObj = get_nouns(value as any)
            if (nounsObj) {
              const tempNouns: unknown[] = []
              try {
                fold((noun: unknown) => () => {
                  if (noun !== undefined) {
                    // Extract the ID if it's a function
                    if (typeof noun === 'function') {
                      try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const nounId = get_id(noun as any)
                        tempNouns.push(nounId)
                      } catch {
                        tempNouns.push('[Function]')
                      }
                    } else {
                      tempNouns.push(noun)
                    }
                  }
                  return null
                })(null)(nounsObj)

                if (tempNouns.length > 0) {
                  // Reverse the nouns array to match the original order
                  nouns = tempNouns.reverse()
                }
              } catch {
                // Fold failed
              }
            }
          } catch {
            // Nouns extraction failed
          }

          // Verify it looks like a FactSymbol
          if (nouns.length > 0) {
            return {
              type: 'FactSymbol',
              verb_symbol:
                typeof verbSymbol === 'function'
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    get_id(verbSymbol as any) || '[Function]'
                  : verbSymbol,
              nouns,
            }
          }
        }
      } catch {
        // Not a FactSymbol
      }

      // Check if it's a Constraint
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modality = get_modality(value as any)
        if (modality !== undefined && modality !== null) {
          return {
            type: 'Constraint',
            modality: typeof modality === 'function' ? 'alethic' : modality,
          }
        }
      } catch {
        // Not a Constraint
      }

      // Check if it's an Event
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fact = get_fact(value as any)
        if (fact !== undefined) {
          let timeValue
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const time = get_time(value as any)
            if (typeof time === 'function') {
              try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                timeValue = get_id(time as any)
              } catch {
                timeValue = '[Function]'
              }
            } else {
              timeValue = time
            }
          } catch {
            timeValue = null
          }

          return {
            type: 'Event',
            fact: serialize(fact),
            time: timeValue,
          }
        }
      } catch {
        // Not an Event
      }

      // Fallback for unrecognized functions
      return '[Function]'
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => serialize(item))
    }

    // Handle objects
    if (typeof value === 'object' && value !== null) {
      const result: Record<string, unknown> = {}
      Object.keys(value as Record<string, unknown>).forEach((key) => {
        result[key] = serialize((value as Record<string, unknown>)[key])
      })
      return result
    }

    return value
  } finally {
    objectsInProgress.delete(value)
  }
}

/**
 * Convert any object to a JSON string, handling Church-encoded values
 */
export const toJSON = <T>(value: T): string => {
  return JSON.stringify(serialize(value))
}

/**
 * Alias for toJSON to maintain compatibility with tests
 */
export const serializeToJSON = toJSON

/**
 * Parse JSON string back to a plain object (Church encoding is lost)
 */
export const fromJSON = <T>(json: string): T => {
  return JSON.parse(json) as T
}

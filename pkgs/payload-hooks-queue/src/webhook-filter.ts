/**
 * Webhook filtering utility for Payload CMS
 */

type FilterPattern = {
  noun: string
  verb: string
}

/**
 * Parse a filter pattern string in the format of Noun.Verb
 * Supports wildcards like Listing.* or *.Created
 */
export const parseFilterPattern = (pattern: string): FilterPattern | null => {
  const match = pattern.match(/^([^.]+)\.([^.]+)$/)

  if (!match) {
    return null
  }

  const [_, noun, verb] = match
  return { noun, verb }
}

/**
 * Check if a Noun.Verb string matches a filter pattern
 * Support wildcards like Listing.* or *.Created
 */
export const matchesPattern = (event: string, pattern: string): boolean => {
  const eventParts = parseFilterPattern(event)
  const patternParts = parseFilterPattern(pattern)

  if (!eventParts || !patternParts) {
    return false
  }

  if (patternParts.noun !== '*' && patternParts.noun !== eventParts.noun) {
    return false
  }

  if (patternParts.verb !== '*' && patternParts.verb !== eventParts.verb) {
    return false
  }

  return true
}

/**
 * Filter events based on an array of filter patterns
 */
export const filterEvents = (event: string, patterns: string[]): boolean => {
  if (!patterns || patterns.length === 0) {
    return true // If no patterns are specified, allow all events
  }

  return patterns.some((pattern) => matchesPattern(event, pattern))
}

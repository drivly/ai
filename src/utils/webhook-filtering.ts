/**
 * Utility function to filter webhook events based on patterns
 * Replaces the function previously imported from payload-hooks-queue
 */
export const filterEvents = (event: string, patterns: string[]): boolean => {
  if (!patterns || patterns.length === 0) {
    return true
  }

  return patterns.some(pattern => {
    if (pattern === event) {
      return true
    }

    const [eventNoun, eventVerb] = event.split('.')
    const [patternNoun, patternVerb] = pattern.split('.')

    if (patternNoun === '*' && patternVerb === eventVerb) {
      return true
    }

    if (patternNoun === eventNoun && patternVerb === '*') {
      return true
    }

    return false
  })
}

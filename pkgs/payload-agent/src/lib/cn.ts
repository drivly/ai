/**
 * Utility function to conditionally join class names together
 */
export function cn(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  return classes
    .flatMap(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
      }
      return cls
    })
    .filter(Boolean)
    .join(' ')
}

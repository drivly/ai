// Custom groupBy implementation
// Cannot bump to ES2024 because it breaks imports so we need to use a polyfill
export function groupByKey<T, K extends keyof any>(array: T[], getKey: (item: T) => K) {
  return array.reduce(
    (result, item) => {
      const key = getKey(item)
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(item)
      return result
    },
    {} as Record<K, T[]>,
  )
}

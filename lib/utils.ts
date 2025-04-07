export function objectKeys<TObj extends object>(obj: TObj) {
  return Object.keys(obj) as (keyof TObj)[]
}

export function objectEntries<TObj extends object>(obj: TObj) {
  return Object.entries(obj) as [keyof TObj, TObj[keyof TObj]][]
}

export function titleCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? ' ' + c.toUpperCase() : ' '))
    .replace(/^(.)/, match => match.toUpperCase())
    .trim()
}

export function objectKeys<TObj extends object>(obj: TObj) {
  return Object.keys(obj) as (keyof TObj)[]
}

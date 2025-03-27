export const assertUnreachable = (x: never): never => {
  throw new Error('Unreachable code')
}

import { createSearchParamsCache, parseAsString, parseAsStringLiteral } from 'nuqs/server'
import { OUTPUT_FORMATS } from './lib/constants'
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const searchParamsCache = createSearchParamsCache({
  model: parseAsString.withDefault(''),
  tool: parseAsString.withDefault(''),
  output: parseAsStringLiteral(OUTPUT_FORMATS.map((format) => format.value)).withDefault('Markdown'),
})

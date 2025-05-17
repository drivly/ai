import { createLoader, parseAsInteger, parseAsFloat, parseAsString, parseAsStringLiteral } from 'nuqs/server'
import { OUTPUT_FORMATS } from './lib/constants'
import { getAIModels } from './lib/utils'
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const gptdoSearchParams = {
  model: parseAsStringLiteral(getAIModels().map((model) => model.value)).withDefault(''),
  tool: parseAsString.withDefault(''),
  output: parseAsStringLiteral(OUTPUT_FORMATS.map((format) => format.value)).withDefault('Markdown'),
  q: parseAsString.withDefault(''),
  system: parseAsString.withDefault(''),
  temp: parseAsFloat.withDefault(0.7),
  seed: parseAsInteger.withDefault(0),
}

export const gptdoSearchParamsLoader = createLoader(gptdoSearchParams)

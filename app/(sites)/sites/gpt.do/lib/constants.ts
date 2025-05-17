export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds
export const GPTDO_BRAIN_COOKIE = 'gptdo-brain'
export const GPTDO_TOOLBELT_COOKIE = 'gptdo-toolbelt'
export const GPTDO_OUTPUT_COOKIE = 'gptdo-output'

export const GPTDO_COOKIE_MAP = {
  model: GPTDO_BRAIN_COOKIE,
  tool: GPTDO_TOOLBELT_COOKIE,
  output: GPTDO_OUTPUT_COOKIE,
}

export const DEFAULT_CHAT_MODEL = { label: 'OpenAI: GPT-4.1', value: 'openai/gpt-4.1' }

// const outputFormats = ['Object', 'ObjectArray', 'Text', 'TextArray', 'Markdown', 'Code'] as const
// { value: 'List', label: 'List', description: 'List of items' },
// { value: 'JSON', label: 'JSON', description: 'Structured data in JSON format' },
// { value: 'JSON-Schema', label: 'JSON Schema', description: 'JSON Schema for validation' },
// { value: 'YAML', label: 'YAML', description: 'YAML formatted text' },

export const OUTPUT_FORMATS = [
  { value: 'Markdown', label: 'Markdown', description: 'Markdown formatted text' },
  { value: 'Code', label: 'Code', description: 'Code block' },
  { value: 'JavaScript', label: 'JavaScript', description: 'JavaScript code' },
  { value: 'TypeScript', label: 'TypeScript', description: 'TypeScript code' },
  { value: 'Python', label: 'Python', description: 'Python code' },
] as const

export type OutputFormatKey = (typeof OUTPUT_FORMATS)[number]['value'] | (string & {})
export type CodeOutputFormatKey = Extract<OutputFormatKey, 'JavaScript' | 'TypeScript' | 'Python'>

export type OutputFormatMap = {
  [K in OutputFormatKey]: K extends CodeOutputFormatKey ? `Code:${K}` : K
}

export const OUTPUT_FORMAT_MAP: OutputFormatMap = Object.fromEntries(
  OUTPUT_FORMATS.map(({ value }) => [value, ['JavaScript', 'TypeScript', 'Python'].includes(value) ? `Code:${value}` : value]),
) as OutputFormatMap

export function formatOutput(outputFormat: OutputFormatKey) {
  return OUTPUT_FORMAT_MAP[outputFormat]
}

export function parseOutputFormat(mapped: OutputFormatMap[keyof OutputFormatMap]): OutputFormatKey | undefined {
  // Find the first key in the map whose value matches the input
  return (Object.keys(OUTPUT_FORMAT_MAP) as OutputFormatKey[]).find((key) => OUTPUT_FORMAT_MAP[key] === mapped)
}

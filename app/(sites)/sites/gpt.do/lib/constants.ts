export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds
export const GPTDO_BRAIN_COOKIE = 'gptdo-brain'
export const GPTDO_TOOLBELT_COOKIE = 'gptdo-toolbelt'
export const GPTDO_OUTPUT_COOKIE = 'gptdo-output'

export const GPTDO_COOKIE_MAP = {
  model: GPTDO_BRAIN_COOKIE,
  tool: GPTDO_TOOLBELT_COOKIE,
  output: GPTDO_OUTPUT_COOKIE,
}

export const CUSTOM_OUTPUT_COOKIE = 'custom-output'

export const OUTPUT_FORMATS = [
  { value: 'markdown', label: 'Markdown', description: 'Markdown formatted text' },
  { value: 'list', label: 'List', description: 'List of items' },
  { value: 'json', label: 'JSON', description: 'Structured data in JSON format' },
  { value: 'html', label: 'HTML', description: 'Web-ready HTML content' },
  { value: 'json-schema', label: 'JSON Schema', description: 'JSON Schema for validation' },
  { value: 'yaml', label: 'YAML', description: 'YAML formatted text' },
  { value: 'code', label: 'Code', description: 'Code block' },
  { value: 'javascript', label: 'JavaScript', description: 'JavaScript code' },
  { value: 'typescript', label: 'TypeScript', description: 'TypeScript code' },
  { value: 'python', label: 'Python', description: 'Python code' },
]

export const DEFAULT_CHAT_MODEL = { label: 'OpenAI: GPT-4o-mini', value: 'openai/gpt-4o-mini' }

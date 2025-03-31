import { getDomain } from './domains.config'

export const apis: Record<string, string> = {
  functions: 'Reliable Structured Output',
  workflows: '',
  database: '',
  agents: '',
  nouns: '',
  verbs: '',
  things: '',
  triggers: '',
  searches: '',
  actions: '',
  llm: '',
  evals: '',
  analytics: '',
  experiments: '',
  integrations: '',
  models: ' ',
}

export const related: Record<string, string[]> = {
  functions: ['nouns', 'verbs', 'things'],
  workflows: ['triggers', 'searches', 'actions'],
  database: ['evals', 'analytics', 'experiments'],
  agents: ['integrations', 'models'],
  llm: ['evals', 'analytics', 'experiments'],
}

export const symbols: Record<string, string> = {
  入: 'functions',
  巛: 'workflows',
  彡: 'database',
  人: 'agents',
  // 回: '',
  // 亘: ''
  // 目: '',
  // 田: '',
  // 卌: '',
  // 口: '',
}

export const domainDescriptions = Object.fromEntries(
  Object.entries(apis).map(([key, value]) => {
    const domain = getDomain(key) || `${key}.do`
    return [domain, value || '']
  })
)

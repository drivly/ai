import { getDomain } from './domains.config'

export const apis: Record<string, string> = {
  functions: 'Typesafe Results without Complexity',
  workflows: 'Reliably Execute Business Processes',
  database: 'AI Native Data Access (Search + CRUD)',
  agents: 'Deploy & Manage Autonomous Digital Workers',
  nouns: 'People, Places, Things, and Ideas',
  verbs: 'The Actions Performed to and by Nouns',
  things: 'Data Resources with Properties',
  triggers: 'Initiate workflows based on events',
  searches: 'Query and retrieve data',
  actions: 'Perform tasks within workflows',
  llm: 'Intelligent AI Gateway',
  evals: 'Evaluate Functions, Workflows, and Agents',
  analytics: 'Economically Validate Workflows',
  experiments: 'Test and Iterate AI Components',
  integrations: 'Connect External APIs and Systems',
  models: 'AI Model Selection and Management',
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

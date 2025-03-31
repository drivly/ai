// import config from 'payload.config'
// import { getPayload } from 'payload'
import { createAPI, modifyQueryString as clickableModifyQueryString, ApiContext } from 'clickable-apis'
import { NextRequest } from 'next/server'
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

const domainDescriptions = Object.fromEntries(
  Object.entries(apis).map(([key, value]) => [`${key}.do`, value || ''])
)

export const API = createAPI(undefined, { domainDescriptions })

export const modifyQueryString = clickableModifyQueryString

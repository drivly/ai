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

export const API = <T = any>(handler: (req: NextRequest, ctx: ApiContext) => Promise<T> | T) => createAPI()(handler)

export const modifyQueryString = clickableModifyQueryString

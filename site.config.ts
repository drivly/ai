import { objectKeys } from './lib/objectKeys'

export const aliases = {
  'databases.do': 'database.do',
  'llms.do': 'llm.do',
} as const

export const websites = {
  'functions.do': '',
  'workflows.do': 'workflows',
  'agents.do': 'agents',
  'llm.do': 'llm',
  'dotdo.co': '.do | Economically Valuable Work',
} as const

export type Website = keyof typeof websites | (typeof aliases)[keyof typeof aliases] | keyof typeof aliases

export const websiteKeys = [...objectKeys(websites), ...objectKeys(aliases), ...Object.values(aliases)]

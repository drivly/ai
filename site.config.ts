import { objectKeys } from './lib/utils'
import { domainsConfig } from './config/domains.config'

export const websites = {
  'functions.do': '',
  'workflows.do': 'workflows',
  'agents.do': 'agents',
  'llm.do': 'llm',
  'dotdo.co': '.do | Economically Valuable Work',
} as const

export type Website = keyof typeof websites | (typeof domainsConfig.aliases)[keyof typeof domainsConfig.aliases] | keyof typeof domainsConfig.aliases

export const websiteKeys = [...objectKeys(websites), ...objectKeys(domainsConfig.aliases), ...Object.values(domainsConfig.aliases)]

/**
 * Generated collection utilities for apis.do SDK
 * DO NOT MODIFY THIS FILE DIRECTLY
 * Run `pnpm generate:types` to regenerate
 */

export const COLLECTIONS = [
  'functions',
  'workflows',
  'agents',
  'services',
  'queues',
  'tasks',
  'goals',
  'plans',
  'waitlist',
  'nouns',
  'things',
  'verbs',
  'databases',
  'resources',
  'chatResources',
  'relationships',
  'integrationCategories',
  'integrations',
  'connectAccounts',
  'connections',
  'integrationTriggers',
  'integrationActions',
  'triggers',
  'searches',
  'actions',
  'experiments',
  'experimentMetrics',
  'models',
  'providers',
  'labs',
  'prompts',
  'settings',
  'types',
  'modules',
  'packages',
  'deployments',
  'benchmarks',
  'evals',
  'evalRuns',
  'evalResults',
  'datasets',
  'events',
  'errors',
  'generations',
  'generationBatches',
  'traces',
  'kpis',
  'organizations',
  'billingPlans',
  'subscriptions',
  'usage',
  'config',
  'projects',
  'domains',
  'users',
  'roles',
  'tags',
  'webhooks',
  'apikeys',
  'oauthClients',
  'oauthCodes',
  'oauthTokens',
] as const

export type Collection = (typeof COLLECTIONS)[number]

/**
 * Checks if a string is a valid collection name
 */
export function isCollection(name: string): name is Collection {
  return COLLECTIONS.includes(name as Collection)
}

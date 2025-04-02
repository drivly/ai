/**
 * Domain configuration for edge runtime
 *
 * This file manages:
 * 1. Collections to domains mappings
 * 2. Domains to collections mappings
 * 3. AI gateways (*.com.ai, *.dotdo.dev, *.do.sg)
 * 4. Domain aliases (databases.do -> database.do, okrs.do -> goals.do)
 *
 * IMPORTANT: This file must be edge-runtime compatible.
 * - Do not import node modules
 * - Do not import from /lib/api
 * - All imports must be edge-runtime compatible
 */
import { apis } from './api.config'


const hierarchy = {
  ai: {
    workflows: 'Workflows.do Reliably Execute Business Processes',
    functions: 'Functions.do Typesafe Results without Complexity',
    agents: 'Agents.do Deploy & Manage Autonomous Digital Workers'
  },
  data: {
    databases: 'Database.do AI Native Data Access (Search + CRUD)',
    nouns: 'Nouns.do Entities in your business',
    verbs: 'Verbs.do Represent potential actions'
  },
  events: {
    triggers: 'Triggers.do Initiate workflows based on events',
    searches: 'Searches.do Query and retrieve data',
    actions: 'Actions.do Perform tasks within workflows'
  },
  core: {
    llm: 'LLM.do Intelligent AI Gateway',
    evals: 'Evals.do Evaluate Functions, Workflows, and Agents',
    analytics: 'Analytics.do Economically Validate Workflows',
    experiments: 'Experiments.do Economically Validate Workflows',
    database: 'Database.do AI Native Data Access (Search + CRUD)',
    integrations: 'Integrations.do Connect External APIs and Systems'
  }
}




export interface DomainConfig {
  /** Collections that belong to this domain */
  collections?: string[]
  /** Parent domain if this is a subdomain */
  parent?: string
  /** Alias to another domain (e.g., databases.do -> database.do) */
  alias?: string
  /** Whether this is an AI gateway domain */
  isAIGateway?: boolean
  /** Custom glow color for the domain */
  glowColor?: string
}

export interface CollectionConfig {
  /** Domains that this collection belongs to */
  domains?: string[]
  /** Default domain for this collection */
  defaultDomain?: string
}

export interface DomainsConfig {
  /** Domain to configuration mapping */
  domains: Record<string, DomainConfig>
  /** Collection to configuration mapping */
  collections: Record<string, CollectionConfig>
  /** AI gateway domains (e.g., *.com.ai, *.dotdo.dev, *.do.sg) */
  aiGateways: string[]
  /** Domain aliases (e.g., databases.do -> database.do) */
  aliases: Record<string, string>

  
}

const defaultDomainForCollection = (collection: string) => `${collection}.do`

const primaryCollectionSlugs = [
  'functions',
  'workflows',
  'database',
  'agents',
  'nouns',
  'verbs',
  'resources',
  'triggers',
  'searches',
  'actions',
  'llm',
  'evals',
  'analytics',
  'experiments',
  'integrations',
  'models',
]

const generateCollectionsConfig = (): Record<string, CollectionConfig> => {
  const config: Record<string, CollectionConfig> = {}

  primaryCollectionSlugs.forEach((slug: string) => {
    const defaultDomain = defaultDomainForCollection(slug)
    config[slug] = {
      domains: [defaultDomain],
      defaultDomain,
    }
  })

  return config
}

const generateDomainsConfig = (): Record<string, DomainConfig> => {
  const config: Record<string, DomainConfig> = {}

  primaryCollectionSlugs.forEach((slug: string) => {
    const domain = defaultDomainForCollection(slug)
    config[domain] = {
      collections: [slug],
    }
  })

  // Add specific glow colors for some domains
  config['functions.do'] = {
    collections: ['functions'],
    glowColor: '#fe8bbb', // Pink
  }

  config['database.do'] = {
    collections: ['database'],
    glowColor: '#4a7eff', // Blue
  }

  config['workflows.do'] = {
    collections: ['workflows'],
    glowColor: '#ff7e4a', // Orange
  }

  config['agents.do'] = {
    collections: ['agents'],
    glowColor: '#9e7aff', // Purple
  }

  config['llm.do'] = {
    collections: ['llm'],
    glowColor: '#05b2a6', // Default teal color
  }

  config['databases.do'] = {
    alias: 'database.do',
  }

  config['okrs.do'] = {
    alias: 'goals.do',
  }

  config['llms.do'] = {
    alias: 'llm.do',
  }

  return config
}

/**
 * Default domains configuration
 */
export const domainsConfig: DomainsConfig = {
  domains: generateDomainsConfig(),
  collections: generateCollectionsConfig(),
  aiGateways: ['*.com.ai', '*.dotdo.dev', '*.do.sg', '*.dev.driv.ly'],
  aliases: {
    'databases.do': 'database.do',
    'okrs.do': 'goals.do',
    'llms.do': 'llm.do',
  },
}

/**
 * Get the namespace for a domain
 *
 * Rules:
 * 1. For paths with API endpoints (e.g., docs.example.com/api), ns is the full domain
 * 2. For domain-only paths (e.g., docs.example.com), ns is the parent domain
 *
 * @param domain The domain to get the namespace for
 * @returns The namespace for the domain
 */
export function getNamespace(domain: string): string {
  if (domainsConfig.aliases[domain]) {
    domain = domainsConfig.aliases[domain]
  }

  const domainConfig = domainsConfig.domains[domain]

  if (domainConfig?.parent) {
    return domainConfig.parent
  }

  return domain
}

/**
 * Get the collections for a domain
 *
 * @param domain The domain to get collections for
 * @returns Array of collection names for the domain
 */
export function getCollections(domain: string): string[] {
  if (domainsConfig.aliases[domain]) {
    domain = domainsConfig.aliases[domain]
  }

  const domainConfig = domainsConfig.domains[domain]

  return domainConfig?.collections || []
}

/**
 * Get the domain for a collection
 *
 * @param collection The collection to get the domain for
 * @returns The default domain for the collection
 */
export function getDomain(collection: string): string | undefined {
  const collectionConfig = domainsConfig.collections[collection]

  return collectionConfig?.defaultDomain
}

/**
 * Check if a domain is an AI gateway
 *
 * @param domain The domain to check
 * @returns True if the domain is an AI gateway
 */
export function isAIGateway(domain: string): boolean {
  if (domainsConfig.domains[domain]?.isAIGateway) {
    return true
  }

  return domainsConfig.aiGateways.some((pattern) => {
    if (pattern.startsWith('*.')) {
      const suffix = pattern.substring(1)
      return domain.endsWith(suffix) && domain.length > suffix.length
    }
    return domain === pattern
  })
}

/**
 * Get the glow color for a domain
 *
 * @param domain The domain to get the glow color for
 * @returns The glow color for the domain, or the default color if not set
 */
export function getGlowColor(domain: string): string {
  const DEFAULT_GLOW_COLOR = '#05b2a6'

  if (domainsConfig.aliases[domain]) {
    domain = domainsConfig.aliases[domain]
  }

  const domainConfig = domainsConfig.domains[domain]

  return domainConfig?.glowColor || DEFAULT_GLOW_COLOR
}

export const domains = [
  'action.do',
  'actions.do',
  'agents.do',
  'agi.do',
  'amy.do',
  'analytics.do',
  'apis.do',
  'ari.do',
  'barcode.do',
  'bdr.do',
  'benchmarks.do',
  'blogs.do',
  'bots.do',
  'browse.do',
  'browser.do',
  'browsers.do',
  'careers.do',
  'cfo.do',
  'clickhouse.do',
  'cmo.do',
  'colo.do',
  'coo.do',
  'cpo.do',
  'cro.do',
  'cto.do',
  'ctx.do',
  'dara.do',
  'dash.do',
  'dashboard.do',
  'database.do',
  'databases.do',
  'dealers.do',
  'emails.do',
  'embeddings.do',
  'esbuild.do',
  'evals.do',
  'events.do',
  'experiments.do',
  'extract.do',
  'function.do',
  'functions.do',
  'gcp.do',
  'gpt.do',
  'graph.do',
  'humans.do',
  'integrations.do',
  'issues.do',
  'ivy.do',
  'kpis.do',
  'lena.do',
  'lexi.do',
  'lists.do',
  'llm.do',
  'llms.do',
  'lodash.do',
  'mcp.do',
  'mdx.do',
  'models.do',
  'nat.do',
  'nats.do',
  'nouns.do',
  'oauth.do',
  'objects.do',
  'okrs.do',
  'payload.do',
  'pdm.do',
  'perf.do',
  'photos.do',
  'pkg.do',
  'programmers.do',
  'prxy.do',
  'qrcode.do',
  'queue.do',
  'repo.do',
  'requests.do',
  'research.do',
  'responses.do',
  'scraper.do',
  'sdk.do',
  'sdr.do',
  'searches.do',
  'services.do',
  'sites.do',
  'speak.do',
  'state.do',
  'studio.do',
  'svc.do',
  'swe.do',
  'tasks.do',
  'tom.do',
  'trace.do',
  'traces.do',
  'trigger.do',
  'triggers.do',
  'vectors.do',
  'vehicle.do',
  'vera.do',
  'verbs.do',
  'waitlist.do',
  'webhook.do',
  'webhooks.do',
  'worker.do',
  'workers.do',
  'workflows.do',
]

/**
 * Brand domains that should redirect to the /sites path
 */
export const brandDomains = ['db.mw', 'dotdo.ai', 'do.mw']

/**
 * Domains that have SDK implementations in the sdks directory
 */
export const sdks = [
  'agents.do',
  'apis.do',
  'database.do',
  'evals.do',
  'experiments.do',
  'functions.do',
  'gpt.do',
  'integrations.do',
  'llm.do',
  'mcp.do',
  'models.do',
  'sdks.do',
  'tasks.do',
  'workflows.do',
]

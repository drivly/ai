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

export const hierarchy = {
  AI: {
    Workflows: 'Reliably Execute Business Processes',
    Functions: 'Typesafe Results without Complexity',
    Agents: 'Deploy & Manage Autonomous Digital Workers',
  },
  Data: {
    Databases: 'AI Native Data Access (Search + CRUD)',
    Nouns: 'Entities in your business',
    Verbs: 'Represent potential actions',
  },
  Events: {
    Triggers: 'Initiate workflows based on events',
    Searches: 'Query and retrieve data',
    Actions: 'Perform tasks within workflows',
  },
  Core: {
    LLM: 'Intelligent AI Gateway',
    Evals: 'Evaluate Functions, Workflows, and Agents',
    Analytics: 'Economically Validate Workflows',
    Experiments: 'Economically Validate Workflows',
    Database: 'AI Native Data Access (Search + CRUD)',
    Integrations: 'Connect External APIs and Systems',
  },
  Agents: {
    Amy: 'Personal AI Assistant',
    Ari: 'AI Research Interface',
    Nat: 'Network Analysis Tool',
    Dara: 'Data Analysis and Reporting',
    Tom: 'Task Order Management',
    Ivy: 'Intelligent Virtual Assistant',
    Lena: 'Language Enhancement and Analysis',
    Lexi: 'Lexical Analysis and Processing',
  },
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
  /** Description of the domain's purpose */
  description?: string
}

export interface DomainInfo {
  /** Domain name without .do suffix */
  name: string
  /** Description of the domain's purpose */
  description: string
  /** Parent domain if this is a subdomain (without .do suffix) */
  parent?: string
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

export const primaryCollectionSlugs = [
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

  config['functions.do'] = {
    collections: ['functions'],
    glowColor: '#b30510', // RED-b30510 Pink-fe8bbb
    description: 'Typesafe Results without Complexity',
  }

  config['database.do'] = {
    collections: ['database'],
    glowColor: '#0510b3', // Blue-0510b3  4a7eff
    description: 'AI Native Data Access (Search + CRUD)',
  }

  config['workflows.do'] = {
    collections: ['workflows'],
    glowColor: '#05b2a6', // Green-05b2a6
    description: 'Reliably Execute Business Processes',
  }

  config['agents.do'] = {
    collections: ['agents'],
    glowColor: '#9e7aff', // Purple
    description: 'Deploy & Manage Autonomous Digital Workers',
  }

  config['llm.do'] = {
    collections: ['llm'],
    glowColor: '#05b2a6', // Green-05b2a6
    description: 'Intelligent AI Gateway',
  }

  config['nouns.do'] = {
    collections: ['nouns'],
    description: 'People, Places, Things, and Ideas',
  }

  config['verbs.do'] = {
    collections: ['verbs'],
    description: 'The Actions Performed to and by Nouns',
  }

  config['resources.do'] = {
    collections: ['resources'],
    description: 'Structured Data Objects',
  }

  config['triggers.do'] = {
    collections: ['triggers'],
    description: 'Initiate workflows based on events',
  }

  config['searches.do'] = {
    collections: ['searches'],
    description: 'Query and retrieve data',
  }

  config['actions.do'] = {
    collections: ['actions'],
    description: 'Perform tasks within workflows',
  }

  config['evals.do'] = {
    collections: ['evals'],
    description: 'Evaluate Functions, Workflows, and Agents',
  }

  config['analytics.do'] = {
    collections: ['analytics'],
    description: 'Economically Validate Workflows',
  }

  config['experiments.do'] = {
    collections: ['experiments'],
    description: 'Test and Iterate AI Components',
  }

  config['integrations.do'] = {
    collections: ['integrations'],
    description: 'Connect External APIs and Systems',
  }

  config['models.do'] = {
    collections: ['models'],
    description: 'AI Model Selection and Management',
  }

  config['apis.do'] = {
    description: 'API Gateway for All Services',
  }

  config['studio.do'] = {
    description: 'Custom-Branded Payload CMS instances',
  }

  config['databases.do'] = {
    alias: 'database.do',
  }

  config['okrs.do'] = {
    alias: 'goals.do',
    description: 'Objectives and Key Results',
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
  aiGateways: ['*.com.ai', '*.dotdo.dev', '*.dev.driv.ly'],
  aliases: {
    'databases.do': 'database.do',
    'okrs.do': 'goals.do',
    'llms.do': 'llm.do',
    'db.mw': 'database.do',
    'api.mw': 'apis.do',
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

const glowColors = ['#b3a705', '#b30510', '#05b2a6', '#0510b3', '#9e7aff']
/**
 * Get the glow color for a domain
 *
 * @param domain The domain to get the glow color for
 * @returns The glow color for the domain, or a random color if not set
 */
export function getGlowColor(domain: string): string {
  if (domainsConfig.aliases[domain]) {
    domain = domainsConfig.aliases[domain]
  }

  const domainConfig = domainsConfig.domains[domain]

  if (domainConfig?.glowColor) {
    return domainConfig.glowColor
  }

  // Use a random color from the glowColors array
  const randomIndex = Math.floor(Math.random() * glowColors.length)
  return glowColors[randomIndex]
}

/**
 * Get the description for a domain
 *
 * @param domain The domain to get the description for
 * @returns The description for the domain, or undefined if not set
 */
export function getDomainDescription(domain: string): string | undefined {
  if (domainsConfig.aliases[domain]) {
    domain = domainsConfig.aliases[domain]
  }

  const baseDomain = domain.endsWith('.do') ? domain.replace('.do', '') : domain

  const capitalizedDomain = baseDomain.charAt(0).toUpperCase() + baseDomain.slice(1)

  return domainDescriptions[capitalizedDomain] || domainsConfig.domains[domain]?.description
}

/**
 * Domain categories for site organization
 */
export const domainCategories: Record<string, string[]> = {
  AI: ['workflows', 'functions', 'agents'],
  Business: ['goals', 'okrs', 'kpis', 'plans', 'projects', 'tasks'],
  Data: ['nouns', 'verbs', 'resources', 'database', 'vectors', 'graph', 'objects', 'searches', 'analytics'],
  Collections: ['functions', 'nouns', 'verbs', 'things', 'resources', 'webhooks'],
  Core: ['workflows', 'agents', 'database', 'llm'],
  Events: ['triggers', 'events', 'actions'],
  Infrastructure: ['apis', 'services', 'workers', 'integrations'],
  Tools: ['sdk', 'pkg', 'repo', 'scraper', 'extract'],
  Web: ['sites', 'browse', 'browser', 'browsers'],
  Management: ['tasks', 'issues', 'okrs', 'kpis', 'lists'],
  Executives: ['cto', 'cpo', 'cfo', 'cmo', 'coo', 'cro'],
  Sales: ['bdr', 'sdr', 'dealers'],
  Agents: ['amy', 'ari', 'nat', 'dara', 'tom', 'ivy', 'lena', 'lexi'],
  Monitoring: ['traces', 'trace', 'perf', 'dashboard'],
  Utilities: ['barcode', 'qrcode', 'speak', 'emails', 'photos'],
}

/**
 * Parent domains for singular domains (without .do suffix)
 * e.g., function -> functions
 */
export const parentDomains: Record<string, string> = {
  function: 'functions',
  trigger: 'triggers',
  search: 'searches',
  action: 'actions',
  worker: 'workers',
  webhook: 'webhooks',
  trace: 'traces',
  service: 'services',
  request: 'requests',
  response: 'responses',
  task: 'tasks',
  event: 'events',
  object: 'objects',
  vector: 'vectors',
}

/**
 * Calculate child domains from parent domains
 *
 * @returns Record of parent domains to their child domains
 */
export function calculateChildDomains(): Record<string, string[]> {
  const childDomains: Record<string, string[]> = {}

  Object.entries(parentDomains).forEach(([child, parent]) => {
    if (!childDomains[parent]) {
      childDomains[parent] = []
    }
    childDomains[parent].push(child)
  })

  return childDomains
}

/**
 * Child domains calculated from parent domains
 */
export const childDomains = calculateChildDomains()

/**
 * Domain descriptions with properly capitalized keys and without .do suffix
 */
export const domainDescriptions: Record<string, string> = {
  Functions: 'Typesafe Results without Complexity',
  Workflows: 'Reliably Execute Business Processes',
  Database: 'AI Native Data Access (Search + CRUD)',
  Agents: 'Deploy & Manage Autonomous Digital Workers',
  Nouns: 'People, Places, Things, and Ideas',
  Verbs: 'The Actions Performed to and by Nouns',
  Things: 'Data Resources with Properties',
  Triggers: 'Initiate workflows based on events',
  Searches: 'Query and retrieve data',
  Actions: 'Perform tasks within workflows',
  LLM: 'Intelligent AI Gateway',
  Evals: 'Evaluate Functions, Workflows, and Agents',
  Analytics: 'Economically Validate Workflows',
  Experiments: 'Test and Iterate AI Components',
  Integrations: 'Connect External APIs and Systems',
  Models: 'AI Model Selection and Management',
  APIs: 'API Gateway for All Services',
  Resources: 'Structured Data Objects',

  AGI: 'Artificial General Intelligence Research',
  Amy: 'Personal AI Assistant',
  Ari: 'AI Research Interface',
  Nat: 'Network Analysis Tool',
  Dara: 'Data Analysis and Reporting',
  Tom: 'Task Order Management',
  Ivy: 'Intelligent Virtual Assistant',
  Lena: 'Language Enhancement and Analysis',
  Lexi: 'Lexical Analysis and Processing',

  Barcode: 'Barcode Generation and Scanning',
  BDR: 'Business Development Resources',
  Benchmarks: 'Performance Testing and Comparison',
  Blogs: 'Content Management and Publishing',
  Bots: 'Automated Task Execution',
  Browse: 'Web Browsing and Navigation',
  Browser: 'Web Content Rendering',
  Browsers: 'Cross-Browser Testing',
  Careers: 'Job Listings and Career Development',
  CFO: 'Financial Planning and Analysis',
  Clickhouse: 'High-Performance Analytics Database',
  CMO: 'Marketing Strategy and Execution',
  Colo: 'Colocation and Infrastructure',
  COO: 'Operations Management',
  CPO: 'Product Strategy and Roadmap',
  CRO: 'Revenue Optimization',
  CTO: 'Technology Strategy and Leadership',
  CTX: 'Context Management for AI',
  Dash: 'Interactive Data Visualization',
  Dashboard: 'Business Intelligence and Metrics',
  Dealers: 'Partner and Reseller Management',
  Emails: 'Email Composition and Delivery',
  Embeddings: 'Vector Representation of Data',
  ESBuild: 'JavaScript Bundling and Optimization',
  Events: 'Event Management and Processing',
  Extract: 'Data Extraction and Transformation',
  Function: 'Single Function Execution',
  GCP: 'Google Cloud Platform Integration',
  GPT: 'Generative Pre-trained Transformer',
  Graph: 'Graph Database and Visualization',
  Humans: 'Human-in-the-Loop Processes',
  Issues: 'Issue Tracking and Resolution',
  KPIs: 'Key Performance Indicators',
  Lists: 'List Management and Organization',
  Lodash: 'Utility Library for JavaScript',
  MCP: 'Master Control Program',
  MDX: 'Markdown with JSX Support',
  OAuth: 'Authentication and Authorization',
  Objects: 'Object Storage and Management',
  OKRs: 'Objectives and Key Results',
  Payload: 'Headless CMS and API',
  PDM: 'Product Data Management',
  Perf: 'Performance Monitoring and Optimization',
  Photos: 'Image Storage and Processing',
  PKG: 'Package Management',
  Programmers: 'Developer Resources and Tools',
  Prxy: 'Proxy Server and Routing',
  QRCode: 'QR Code Generation and Scanning',
  Queue: 'Message Queue Management',
  Repo: 'Repository Management',
  Requests: 'HTTP Request Handling',
  Research: 'Research and Development',
  Responses: 'API Response Formatting',
  Scraper: 'Web Scraping and Data Extraction',
  SDK: 'Software Development Kit',
  SDR: 'Sales Development Resources',
  Services: 'Service Discovery and Registry',
  Sites: 'Website Management',
  Speak: 'Text-to-Speech Conversion',
  State: 'State Management for Applications',
  Studio: 'Creative Development Environment',
  SVC: 'Service Management',
  SWE: 'Software Engineering Resources',
  Tasks: 'Task Management and Scheduling',
  Trace: 'Distributed Tracing',
  Traces: 'Execution Path Monitoring',
  Trigger: 'Event-Based Execution',
  Vectors: 'Vector Database and Operations',
  Vehicle: 'Vehicle Data and Management',
  Vera: 'Verification and Authentication',
  Waitlist: 'Waitlist Management',
  Webhook: 'Webhook Registration and Delivery',
  Webhooks: 'Event Subscription Management',
  Worker: 'Background Task Processing',
  Workers: 'Distributed Task Execution',

  DotDo: '.do | Economically Valuable Work',
}

/**
 * Related domains (without .do suffix)
 */
export const relatedDomains: Record<string, string[]> = {
  functions: ['nouns', 'verbs', 'things', 'function', 'resources'],
  workflows: ['triggers', 'searches', 'actions', 'tasks', 'events'],
  database: ['evals', 'analytics', 'experiments', 'vectors', 'graph', 'objects'],
  agents: ['integrations', 'models', 'humans', 'bots', 'workers'],
  llm: ['evals', 'analytics', 'experiments', 'gpt', 'embeddings'],
  nouns: ['things', 'objects', 'humans'],
  verbs: ['actions', 'tasks', 'triggers'],
  things: ['nouns', 'objects', 'data'],
  resources: ['nouns', 'objects', 'data'],
  triggers: ['events', 'webhooks', 'actions'],
  searches: ['vectors', 'embeddings', 'graph'],
  actions: ['tasks', 'workflows', 'functions'],
  evals: ['benchmarks', 'experiments', 'analytics'],
  analytics: ['dashboard', 'kpis', 'experiments'],
  experiments: ['evals', 'analytics', 'research'],
  integrations: ['apis', 'services', 'webhooks'],
  models: ['llm', 'gpt', 'embeddings'],
}

/**
 * Domain symbols (without .do suffix)
 */
export const domainSymbols: Record<string, string> = {
  入: 'functions',
  巛: 'workflows',
  彡: 'database',
  人: 'agents',
  回: 'nouns',
  亘: 'verbs',
  目: 'things',
  田: 'triggers',
  卌: 'searches',
  口: 'actions',
}

export const domains = [
  'do.com.ai',
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
export const brandDomains = ['dotdo.ai', 'dotdo.co', 'do.industries']

/**
 * Site domains that should redirect to their specific /sites/{domain} path
 */
export const siteDomains = ['business-as-code.dev', 'careers.do']

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
  'studio.do',
  'tasks.do',
  'workflows.do',
]

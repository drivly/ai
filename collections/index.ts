import { Domains } from './admin/Domains'
import { Projects } from './admin/Projects'
import { Users } from './admin/Users'
import { APIKeys } from './admin/APIKeys'
import { Waitlist } from './admin/Waitlist'
import { OAuthClients } from './auth/OAuthClients'
import { OAuthCodes } from './auth/OAuthCodes'
import { OAuthTokens } from './auth/OAuthTokens'
import { Integrations } from './integrations/Integrations'
import { Tags } from './admin/Tag'
import { Roles } from './admin/Roles'
import { Databases } from './data/Databases'
import { Functions } from './ai/Functions'
import { Modules } from './code/Modules'
import { Packages } from './code/Packages'
import { Deployments } from './code/Deployments'
import { Workflows } from './ai/Workflows'
import { Agents } from './ai/Agents'
import { Datasets } from './evals/Datasets'
import { Models } from './experiments/Models'
import { Providers } from './experiments/Providers'
import { Labs } from './experiments/Labs'
import { Nouns } from './data/Nouns'
import { Things } from './data/Things'
import { Verbs } from './data/Verbs'
import { Triggers } from './events/Triggers'
import { Relationships } from './events/Relationships'
import { Types } from './code/Types'
import { Webhooks } from './admin/Webhooks'
import { Evals } from './evals/Evals'
import { EvalsRuns } from './evals/EvalsRuns'
import { EvalsResults } from './evals/EvalsResults'
import { Events } from './observability/Events'
import { Errors } from './observability/Errors'
import { Benchmarks } from './evals/Benchmarks'
import { Experiments } from './experiments/Experiments'
import { ExperimentMetrics } from './experiments/ExperimentMetrics'
import { Prompts } from './experiments/Prompts'
import { Settings } from './experiments/Settings'
import { Resources } from './data/Resources'
import { ChatResources } from './data/chat/Resources'
import { Traces } from './observability/Traces'
import { Generations } from './observability/Generations'
import { GenerationBatches } from './observability/GenerationBatches'
import { Searches } from './events/Searches'
import { IntegrationTriggers } from './integrations/IntegrationTriggers'
import { IntegrationActions } from './integrations/IntegrationActions'
import { IntegrationCategories } from './integrations/IntegrationCategories'
import { Connections } from './integrations/Connections'
import { Queues } from './business/Queues'
import { Tasks } from './business/Tasks'
import { Goals } from './business/Goals'
import { Plans } from './business/Plans'
import { KPIs } from './business/KPIs'
import Config from './sync/Config'
import { Organizations, BillingPlans, Subscriptions, Usage, ConnectAccounts } from './billing'
import { Services } from './infrastructure/Services'

export const collections = [
  // Register AI collections first
  Functions,
  Workflows,
  Agents,

  // Work-related collections
  Queues,
  Tasks,
  Goals,
  Plans,

  // Admin collections
  Waitlist,

  // Data & definitions
  Nouns,
  Things,
  Verbs,
  Databases,
  Resources,
  ChatResources,
  Relationships,

  // Integration collections
  IntegrationCategories,
  Integrations,
  ConnectAccounts,
  Connections,
  IntegrationTriggers,
  IntegrationActions,

  // Event collections
  Triggers,
  Searches,

  Experiments,
  ExperimentMetrics,
  Models,
  Providers,
  Labs,
  Prompts,
  Settings,

  Types,
  Modules,
  Packages,
  Deployments,

  Benchmarks,
  Evals,
  EvalsRuns,
  EvalsResults,
  Datasets,

  Events,
  Errors,
  Generations,
  GenerationBatches,
  Traces,
  KPIs,

  // Billing collections
  Organizations,
  BillingPlans,
  Subscriptions,
  Usage,

  Config,

  Projects,
  Domains,
  Users,
  Roles,
  Tags,
  Webhooks,
  APIKeys,

  // Infrastructure collections
  Services,

  OAuthClients,
  OAuthCodes,
  OAuthTokens,
]

export const collectionSlugs = collections.map((collection) => collection.slug)

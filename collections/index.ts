import { Domains } from './projects/Domains'
import { Projects } from './projects/Projects'
import { Users } from './admin/Users'
import { APIKeys } from './admin/APIKeys'
import { Waitlist } from './projects/Waitlist'
import { OAuthClients } from './auth/OAuthClients'
import { OAuthCodes } from './auth/OAuthCodes'
import { OAuthTokens } from './auth/OAuthTokens'
import { Integrations } from './integrations/Integrations'
import { Tags } from './admin/Tag'
import { Roles } from './admin/Roles'
import { Databases } from './projects/Databases'
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
import { Verbs } from './data/Verbs'
import { Triggers } from './events/Triggers'
import { Relationships } from './data/Relationships'
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
import { ChatResources } from './observability/Chats'
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
import { Config } from './admin/Config'
import { Services } from './billing/Services'
import { ConnectAccounts } from './billing/ConnectAccounts'
import { Organizations } from './billing/Organizations'
import { BillingPlans } from './billing/BillingPlans'
import { Subscriptions } from './billing/Subscriptions'
import { Usage } from './billing/Usage'
import { Actions } from './events/Actions'
import { Files } from './experiments/Files'

export const collections = [
  // Register AI collections first
  Functions,
  Workflows,
  Agents,
  Services,

  // Work-related collections
  Queues,
  Tasks,
  Goals,
  Plans,

  // Admin collections
  Waitlist,

  // Data & definitions
  Nouns,
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
  Actions,

  Experiments,
  ExperimentMetrics,
  Models,
  Providers,
  Labs,
  Prompts,
  Settings,
  Files,

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

  OAuthClients,
  OAuthCodes,
  OAuthTokens,
]

export const collectionSlugs = collections.map((collection) => collection.slug)

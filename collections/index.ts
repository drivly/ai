import { Projects } from './admin/Projects'
import { Users } from './admin/Users'
import { APIKeys } from './admin/APIKeys'
import { Integrations } from './admin/Integrations'
import { Tags } from './admin/Tag'
import { Roles } from './admin/Roles'
import { Functions } from './ai/Functions'
import { Modules } from './code/Modules'
import { Packages } from './code/Packages'
import { Deployments } from './code/Deployments'
import { Workflows } from './ai/Workflows'
import { Agents } from './ai/Agents'
import { Datasets } from './evals/Datasets'
import { Models } from './experiments/Models'
import { Nouns } from './data/Nouns'
import { Verbs } from './data/Verbs'
import { Triggers } from './events/Triggers'
import { Actions } from './events/Actions'
import { Types } from './code/Types'
import { Webhooks } from './admin/Webhooks'
import { Evals } from './evals/Evals'
import { EvalsRuns } from './evals/EvalsRuns'
import { EvalsResults } from './evals/EvalsResults'
import { Events } from './observability/Events'
import { Errors } from './observability/Errors'
import { Benchmarks } from './evals/Benchmarks'
import { Experiments } from './experiments/Experiments'
import { Prompts } from './experiments/Prompts'
import { Settings } from './experiments/Settings'
import { Things } from './data/Things'
import { Traces } from './observability/Traces'
import { Generations } from './observability/Generations'
import { Searches } from './events/Searches'
import { IntegrationTriggers } from './admin/IntegrationTriggers'
import { IntegrationActions } from './admin/IntegrationActions'
import { IntegrationCategories } from './admin/IntegrationCategories'
import { Connections } from './admin/Connections'
import { Queues } from './jobs/Queues'
import { Tasks } from './jobs/Tasks'

export const collections = [
  Functions,
  Workflows,
  Agents,

  Nouns,
  Verbs,
  Things,

  Integrations,
  IntegrationCategories,
  IntegrationTriggers,
  IntegrationActions,
  Connections,

  Triggers,
  Searches,
  Actions,

  Experiments,
  Models,
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
  Traces,

  Queues,
  Tasks,

  Projects,
  Users,
  Roles,
  Tags,
  Webhooks,
  APIKeys,
]

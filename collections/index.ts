import { Projects } from './admin/Projects'
import { Users } from './admin/Users'
import { APIKeys } from './admin/APIKeys'
import { Tags } from './admin/Tag'
import { Webhooks } from './admin/Webhooks'
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
import { Integrations } from './integrations/Integrations'
import { IntegrationTriggers } from './integrations/Triggers'
import { IntegrationActions } from './integrations/Actions'
import { IntegrationCategories } from './integrations/Categories'
import { Connections } from './integrations/Connections'

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
  Projects,
  Users,
  Tags,
  Webhooks,
  APIKeys,
]

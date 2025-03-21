import { Tenants } from './admin/Tenants'
import { Users } from './admin/Users'
import { Apps } from './admin/Apps'
import { Integrations } from './admin/Integrations'
import { Functions } from './ai/Functions'
import { Modules } from './code/Modules'
import { Packages } from './code/Packages'
import { Deployments } from './code/Deployments'
import { Workflows } from './ai/Workflows'
import { Agents } from './ai/Agents'
import { Datasets } from './evals/Datasets'
import { Models } from './evals/Models'
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
import { Experiments } from './evals/Experiments'
import { Prompts } from './evals/Prompts'
import { Things } from './data/Things'
import { Generations } from './observability/Generations'
import { Searches } from './events/Searches'

export const collections = [
  Functions,
  Workflows,
  Agents,
  Nouns,
  Verbs,
  Things,
  Triggers,
  Searches,
  Actions,
  Types,
  Modules,
  Packages,
  Deployments,
  // Benchmarks,
  Evals,
  Generations,
  Experiments,
  Datasets,
  Models,
  Prompts,
  EvalsRuns,
  EvalsResults,
  Events,
  Errors,
  Tenants,
  Users,
  Apps,
  Integrations,
  Webhooks,
]

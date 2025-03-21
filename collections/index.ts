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
import { Triggers } from './data/Triggers'
import { Actions } from './data/Actions'
import { Schemas } from './data/Schemas'
import { Webhooks } from './admin/Webhooks'
import { Evals } from './evals/Evals'
import { EvalsRuns } from './evals/EvalsRuns'
import { EvalsResults } from './evals/EvalsResults'
import { Events } from './observability/Events'
import { Errors } from './observability/Errors'
import { Benchmarks } from './evals/Benchmarks'
import { Experiments } from './evals/Experiments'
import { Prompts } from './evals/Prompts'
import { Resources } from './data/Resources'

export const collections = [
  Functions,
  Workflows,
  Agents,
  Modules,
  Packages,
  Deployments,
  Nouns,
  Verbs,
  Resources,
  // Triggers,
  // Actions,
  Schemas,
  // Benchmarks,
  Evals,
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

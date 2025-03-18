import { Tenants } from './admin/Tenants'
import { Users } from './admin/Users'
import { Functions } from './ai/Functions'
import { Code } from './code/Code'
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

export const collections = [
  Functions,
  Workflows,
  Agents,
  Code,
  Deployments,
  Nouns,
  Verbs,
  Triggers,
  Actions,
  Schemas,
  Evals,
  Datasets,
  Models,
  EvalsRuns,
  EvalsResults,
  Events,
  Errors,
  Tenants,
  Users,
  Webhooks,
]

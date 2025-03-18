import { Tenants } from './admin/Tenants'
import { Users } from './admin/Users'
import { Functions } from './functions/Functions'
import { Workflows } from './workflows/Workflows'
import { Datasets } from './data/Datasets'
import { Webhooks } from './admin/Webhooks'
import { Evals } from './evals/Evals'
import { EvalsRuns } from './evals/EvalsRuns'
import { EvalsResults } from './evals/EvalsResults'
import { Events } from './observability/Events'

export const collections = [Functions, Users, Tenants, Workflows, Datasets, Webhooks, Evals, EvalsRuns, EvalsResults, Events]

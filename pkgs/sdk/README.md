# apis.do

Developer-friendly & type-safe Typescript SDK specifically catered to leverage *apis.do* API.

<div align="left">
    <a href="https://www.speakeasy.com/?utm_source=apis-do&utm_campaign=typescript"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
</div>


<br /><br />
> [!IMPORTANT]
> This SDK is not yet ready for production use. To complete setup please follow the steps outlined in your [workspace](https://app.speakeasy.com/org/do/apis). Delete this section before > publishing to a package manager.

<!-- Start Summary [summary] -->
## Summary

Drivly AI API: API for the Drivly AI Primitives Platform
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [apis.do](#apisdo)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)
* [Development](#development)
  * [Maturity](#maturity)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

> [!TIP]
> To finish publishing your SDK to npm and others you must [run your first generation action](https://www.speakeasy.com/docs/github-setup#step-by-step-guide).


The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add <UNSET>
```

### PNPM

```bash
pnpm add <UNSET>
```

### Bun

```bash
bun add <UNSET>
```

### Yarn

```bash
yarn add <UNSET> zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.


### Model Context Protocol (MCP) Server

This SDK is also an installable MCP server where the various SDK methods are
exposed as tools that can be invoked by AI applications.

> Node.js v20 or greater is required to run the MCP server from npm.

<details>
<summary>Claude installation steps</summary>

Add the following server definition to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "Api": {
      "command": "npx",
      "args": [
        "-y", "--package", "apis.do",
        "--",
        "mcp", "start"
      ]
    }
  }
}
```

</details>

<details>
<summary>Cursor installation steps</summary>

Create a `.cursor/mcp.json` file in your project root with the following content:

```json
{
  "mcpServers": {
    "Api": {
      "command": "npx",
      "args": [
        "-y", "--package", "apis.do",
        "--",
        "mcp", "start"
      ]
    }
  }
}
```

</details>

You can also run MCP servers as a standalone binary with no additional dependencies. You must pull these binaries from available Github releases:

```bash
curl -L -o mcp-server \
    https://github.com/{org}/{repo}/releases/download/{tag}/mcp-server-bun-darwin-arm64 && \
chmod +x mcp-server
```

If the repo is a private repo you must add your Github PAT to download a release `-H "Authorization: Bearer {GITHUB_PAT}"`.


```json
{
  "mcpServers": {
    "Todos": {
      "command": "./DOWNLOAD/PATH/mcp-server",
      "args": [
        "start"
      ]
    }
  }
}
```

For a full list of server arguments, run:

```sh
npx -y --package apis.do -- mcp start --help
```
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { Api } from "apis.do";

const api = new Api();

async function run() {
  const result = await api.functions.getApiFunctions();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [actions](docs/sdks/actions/README.md)

* [getApiActions](docs/sdks/actions/README.md#getapiactions) - List all Actions
* [getApiActionsId](docs/sdks/actions/README.md#getapiactionsid) - Get a specific Action
* [deleteApiActionsId](docs/sdks/actions/README.md#deleteapiactionsid) - Delete a Action
* [getApiIntegrationActions](docs/sdks/actions/README.md#getapiintegrationactions) - List all Actions
* [getApiIntegrationActionsId](docs/sdks/actions/README.md#getapiintegrationactionsid) - Get a specific Action
* [deleteApiIntegrationActionsId](docs/sdks/actions/README.md#deleteapiintegrationactionsid) - Delete a Action

### [agents](docs/sdks/agents/README.md)

* [getApiAgents](docs/sdks/agents/README.md#getapiagents) - List all Agents
* [getApiAgentsId](docs/sdks/agents/README.md#getapiagentsid) - Get a specific Agent
* [deleteApiAgentsId](docs/sdks/agents/README.md#deleteapiagentsid) - Delete a Agent


### [apiKeys](docs/sdks/apikeys/README.md)

* [getApiApikeys](docs/sdks/apikeys/README.md#getapiapikeys) - List all API Keys
* [getApiApikeysId](docs/sdks/apikeys/README.md#getapiapikeysid) - Get a specific API Key
* [deleteApiApikeysId](docs/sdks/apikeys/README.md#deleteapiapikeysid) - Delete a API Key

### [benchmarks](docs/sdks/benchmarks/README.md)

* [getApiBenchmarks](docs/sdks/benchmarks/README.md#getapibenchmarks) - List all Benchmarks
* [getApiBenchmarksId](docs/sdks/benchmarks/README.md#getapibenchmarksid) - Get a specific Benchmark
* [deleteApiBenchmarksId](docs/sdks/benchmarks/README.md#deleteapibenchmarksid) - Delete a Benchmark

### [categories](docs/sdks/categories/README.md)

* [getApiIntegrationCategories](docs/sdks/categories/README.md#getapiintegrationcategories) - List all Categories
* [getApiIntegrationCategoriesId](docs/sdks/categories/README.md#getapiintegrationcategoriesid) - Get a specific Category
* [deleteApiIntegrationCategoriesId](docs/sdks/categories/README.md#deleteapiintegrationcategoriesid) - Delete a Category

### [connections](docs/sdks/connections/README.md)

* [getApiConnections](docs/sdks/connections/README.md#getapiconnections) - List all Connections
* [getApiConnectionsId](docs/sdks/connections/README.md#getapiconnectionsid) - Get a specific Connection
* [deleteApiConnectionsId](docs/sdks/connections/README.md#deleteapiconnectionsid) - Delete a Connection

### [databases](docs/sdks/databases/README.md)

* [getApiDatabases](docs/sdks/databases/README.md#getapidatabases) - List all Databases
* [getApiDatabasesId](docs/sdks/databases/README.md#getapidatabasesid) - Get a specific Database
* [deleteApiDatabasesId](docs/sdks/databases/README.md#deleteapidatabasesid) - Delete a Database

### [datasets](docs/sdks/datasets/README.md)

* [getApiDatasets](docs/sdks/datasets/README.md#getapidatasets) - List all Datasets
* [getApiDatasetsId](docs/sdks/datasets/README.md#getapidatasetsid) - Get a specific Dataset
* [deleteApiDatasetsId](docs/sdks/datasets/README.md#deleteapidatasetsid) - Delete a Dataset

### [deployments](docs/sdks/deployments/README.md)

* [getApiDeployments](docs/sdks/deployments/README.md#getapideployments) - List all Deployments
* [getApiDeploymentsId](docs/sdks/deployments/README.md#getapideploymentsid) - Get a specific Deployment
* [deleteApiDeploymentsId](docs/sdks/deployments/README.md#deleteapideploymentsid) - Delete a Deployment

### [domains](docs/sdks/domains/README.md)

* [getApiDomains](docs/sdks/domains/README.md#getapidomains) - List all Domains
* [getApiDomainsId](docs/sdks/domains/README.md#getapidomainsid) - Get a specific Domain
* [deleteApiDomainsId](docs/sdks/domains/README.md#deleteapidomainsid) - Delete a Domain

### [errors](docs/sdks/errors/README.md)

* [getApiErrors](docs/sdks/errors/README.md#getapierrors) - List all Errors
* [getApiErrorsId](docs/sdks/errors/README.md#getapierrorsid) - Get a specific Error
* [deleteApiErrorsId](docs/sdks/errors/README.md#deleteapierrorsid) - Delete a Error

### [evalResults](docs/sdks/evalresults/README.md)

* [getApiEvalResults](docs/sdks/evalresults/README.md#getapievalresults) - List all Eval Results
* [getApiEvalResultsId](docs/sdks/evalresults/README.md#getapievalresultsid) - Get a specific Eval Result
* [deleteApiEvalResultsId](docs/sdks/evalresults/README.md#deleteapievalresultsid) - Delete a Eval Result

### [evalRuns](docs/sdks/evalruns/README.md)

* [getApiEvalRuns](docs/sdks/evalruns/README.md#getapievalruns) - List all Eval Runs
* [getApiEvalRunsId](docs/sdks/evalruns/README.md#getapievalrunsid) - Get a specific Eval Run
* [deleteApiEvalRunsId](docs/sdks/evalruns/README.md#deleteapievalrunsid) - Delete a Eval Run

### [evals](docs/sdks/evals/README.md)

* [getApiEvals](docs/sdks/evals/README.md#getapievals) - List all Evals
* [getApiEvalsId](docs/sdks/evals/README.md#getapievalsid) - Get a specific Eval
* [deleteApiEvalsId](docs/sdks/evals/README.md#deleteapievalsid) - Delete a Eval

### [events](docs/sdks/events/README.md)

* [getApiEvents](docs/sdks/events/README.md#getapievents) - List all Events
* [getApiEventsId](docs/sdks/events/README.md#getapieventsid) - Get a specific Event
* [deleteApiEventsId](docs/sdks/events/README.md#deleteapieventsid) - Delete a Event

### [experimentMetrics](docs/sdks/experimentmetrics/README.md)

* [getApiExperimentMetrics](docs/sdks/experimentmetrics/README.md#getapiexperimentmetrics) - List all Experiment Metrics
* [getApiExperimentMetricsId](docs/sdks/experimentmetrics/README.md#getapiexperimentmetricsid) - Get a specific Experiment Metric
* [deleteApiExperimentMetricsId](docs/sdks/experimentmetrics/README.md#deleteapiexperimentmetricsid) - Delete a Experiment Metric

### [experiments](docs/sdks/experiments/README.md)

* [getApiExperiments](docs/sdks/experiments/README.md#getapiexperiments) - List all Experiments
* [getApiExperimentsId](docs/sdks/experiments/README.md#getapiexperimentsid) - Get a specific Experiment
* [deleteApiExperimentsId](docs/sdks/experiments/README.md#deleteapiexperimentsid) - Delete a Experiment

### [functions](docs/sdks/functions/README.md)

* [getApiFunctions](docs/sdks/functions/README.md#getapifunctions) - List all Functions
* [getApiFunctionsId](docs/sdks/functions/README.md#getapifunctionsid) - Get a specific Function
* [deleteApiFunctionsId](docs/sdks/functions/README.md#deleteapifunctionsid) - Delete a Function

### [generationBatches](docs/sdks/generationbatches/README.md)

* [getApiGenerationBatches](docs/sdks/generationbatches/README.md#getapigenerationbatches) - List all Generation Batches
* [getApiGenerationBatchesId](docs/sdks/generationbatches/README.md#getapigenerationbatchesid) - Get a specific Generation Batch
* [deleteApiGenerationBatchesId](docs/sdks/generationbatches/README.md#deleteapigenerationbatchesid) - Delete a Generation Batch

### [generations](docs/sdks/generations/README.md)

* [getApiGenerations](docs/sdks/generations/README.md#getapigenerations) - List all Generations
* [getApiGenerationsId](docs/sdks/generations/README.md#getapigenerationsid) - Get a specific Generation
* [deleteApiGenerationsId](docs/sdks/generations/README.md#deleteapigenerationsid) - Delete a Generation

### [goals](docs/sdks/goals/README.md)

* [getApiGoals](docs/sdks/goals/README.md#getapigoals) - List all Goals
* [getApiGoalsId](docs/sdks/goals/README.md#getapigoalsid) - Get a specific Goal
* [deleteApiGoalsId](docs/sdks/goals/README.md#deleteapigoalsid) - Delete a Goal

### [integrations](docs/sdks/integrations/README.md)

* [getApiIntegrations](docs/sdks/integrations/README.md#getapiintegrations) - List all Integrations
* [getApiIntegrationsId](docs/sdks/integrations/README.md#getapiintegrationsid) - Get a specific Integration
* [deleteApiIntegrationsId](docs/sdks/integrations/README.md#deleteapiintegrationsid) - Delete a Integration

### [kpIs](docs/sdks/kpis/README.md)

* [getApiKpis](docs/sdks/kpis/README.md#getapikpis) - List all KPIs
* [getApiKpisId](docs/sdks/kpis/README.md#getapikpisid) - Get a specific KPI
* [deleteApiKpisId](docs/sdks/kpis/README.md#deleteapikpisid) - Delete a KPI

### [labs](docs/sdks/labs/README.md)

* [getApiLabs](docs/sdks/labs/README.md#getapilabs) - List all Labs
* [getApiLabsId](docs/sdks/labs/README.md#getapilabsid) - Get a specific Lab
* [deleteApiLabsId](docs/sdks/labs/README.md#deleteapilabsid) - Delete a Lab

### [models](docs/sdks/models/README.md)

* [getApiModels](docs/sdks/models/README.md#getapimodels) - List all Models
* [getApiModelsId](docs/sdks/models/README.md#getapimodelsid) - Get a specific Model
* [deleteApiModelsId](docs/sdks/models/README.md#deleteapimodelsid) - Delete a Model

### [modules](docs/sdks/modules/README.md)

* [getApiModules](docs/sdks/modules/README.md#getapimodules) - List all Modules
* [getApiModulesId](docs/sdks/modules/README.md#getapimodulesid) - Get a specific Module
* [deleteApiModulesId](docs/sdks/modules/README.md#deleteapimodulesid) - Delete a Module

### [nouns](docs/sdks/nouns/README.md)

* [getApiNouns](docs/sdks/nouns/README.md#getapinouns) - List all Nouns
* [getApiNounsId](docs/sdks/nouns/README.md#getapinounsid) - Get a specific Noun
* [deleteApiNounsId](docs/sdks/nouns/README.md#deleteapinounsid) - Delete a Noun

### [oauthClients](docs/sdks/oauthclients/README.md)

* [getApiOauthClients](docs/sdks/oauthclients/README.md#getapioauthclients) - List all Oauth Clients
* [getApiOauthClientsId](docs/sdks/oauthclients/README.md#getapioauthclientsid) - Get a specific Oauth Client
* [deleteApiOauthClientsId](docs/sdks/oauthclients/README.md#deleteapioauthclientsid) - Delete a Oauth Client

### [oauthCodes](docs/sdks/oauthcodes/README.md)

* [getApiOauthCodes](docs/sdks/oauthcodes/README.md#getapioauthcodes) - List all Oauth Codes
* [getApiOauthCodesId](docs/sdks/oauthcodes/README.md#getapioauthcodesid) - Get a specific Oauth Code
* [deleteApiOauthCodesId](docs/sdks/oauthcodes/README.md#deleteapioauthcodesid) - Delete a Oauth Code

### [oauthTokens](docs/sdks/oauthtokens/README.md)

* [getApiOauthTokens](docs/sdks/oauthtokens/README.md#getapioauthtokens) - List all Oauth Tokens
* [getApiOauthTokensId](docs/sdks/oauthtokens/README.md#getapioauthtokensid) - Get a specific Oauth Token
* [deleteApiOauthTokensId](docs/sdks/oauthtokens/README.md#deleteapioauthtokensid) - Delete a Oauth Token

### [packages](docs/sdks/packages/README.md)

* [getApiPackages](docs/sdks/packages/README.md#getapipackages) - List all Packages
* [getApiPackagesId](docs/sdks/packages/README.md#getapipackagesid) - Get a specific Package
* [deleteApiPackagesId](docs/sdks/packages/README.md#deleteapipackagesid) - Delete a Package

### [projects](docs/sdks/projects/README.md)

* [getApiProjects](docs/sdks/projects/README.md#getapiprojects) - List all Projects
* [getApiProjectsId](docs/sdks/projects/README.md#getapiprojectsid) - Get a specific Project
* [deleteApiProjectsId](docs/sdks/projects/README.md#deleteapiprojectsid) - Delete a Project

### [prompts](docs/sdks/prompts/README.md)

* [getApiPrompts](docs/sdks/prompts/README.md#getapiprompts) - List all Prompts
* [getApiPromptsId](docs/sdks/prompts/README.md#getapipromptsid) - Get a specific Prompt
* [deleteApiPromptsId](docs/sdks/prompts/README.md#deleteapipromptsid) - Delete a Prompt

### [providers](docs/sdks/providers/README.md)

* [getApiProviders](docs/sdks/providers/README.md#getapiproviders) - List all Providers
* [getApiProvidersId](docs/sdks/providers/README.md#getapiprovidersid) - Get a specific Provider
* [deleteApiProvidersId](docs/sdks/providers/README.md#deleteapiprovidersid) - Delete a Provider

### [queues](docs/sdks/queues/README.md)

* [getApiQueues](docs/sdks/queues/README.md#getapiqueues) - List all Queues
* [getApiQueuesId](docs/sdks/queues/README.md#getapiqueuesid) - Get a specific Queue
* [deleteApiQueuesId](docs/sdks/queues/README.md#deleteapiqueuesid) - Delete a Queue

### [resources](docs/sdks/resources/README.md)

* [getApiResources](docs/sdks/resources/README.md#getapiresources) - List all Resources
* [getApiResourcesId](docs/sdks/resources/README.md#getapiresourcesid) - Get a specific Resource
* [deleteApiResourcesId](docs/sdks/resources/README.md#deleteapiresourcesid) - Delete a Resource

### [roles](docs/sdks/roles/README.md)

* [getApiRoles](docs/sdks/roles/README.md#getapiroles) - List all Roles
* [getApiRolesId](docs/sdks/roles/README.md#getapirolesid) - Get a specific Role
* [deleteApiRolesId](docs/sdks/roles/README.md#deleteapirolesid) - Delete a Role

### [searches](docs/sdks/searches/README.md)

* [getApiSearches](docs/sdks/searches/README.md#getapisearches) - List all Searches
* [getApiSearchesId](docs/sdks/searches/README.md#getapisearchesid) - Get a specific Search
* [deleteApiSearchesId](docs/sdks/searches/README.md#deleteapisearchesid) - Delete a Search

### [settings](docs/sdks/settings/README.md)

* [getApiSettings](docs/sdks/settings/README.md#getapisettings) - List all Settings
* [getApiSettingsId](docs/sdks/settings/README.md#getapisettingsid) - Get a specific Setting
* [deleteApiSettingsId](docs/sdks/settings/README.md#deleteapisettingsid) - Delete a Setting

### [tags](docs/sdks/tags/README.md)

* [getApiTags](docs/sdks/tags/README.md#getapitags) - List all Tags
* [getApiTagsId](docs/sdks/tags/README.md#getapitagsid) - Get a specific Tag
* [deleteApiTagsId](docs/sdks/tags/README.md#deleteapitagsid) - Delete a Tag

### [tasks](docs/sdks/tasks/README.md)

* [getApiTasks](docs/sdks/tasks/README.md#getapitasks) - List all Tasks
* [getApiTasksId](docs/sdks/tasks/README.md#getapitasksid) - Get a specific Task
* [deleteApiTasksId](docs/sdks/tasks/README.md#deleteapitasksid) - Delete a Task

### [things](docs/sdks/things/README.md)

* [getApiThings](docs/sdks/things/README.md#getapithings) - List all Things
* [getApiThingsId](docs/sdks/things/README.md#getapithingsid) - Get a specific Thing
* [deleteApiThingsId](docs/sdks/things/README.md#deleteapithingsid) - Delete a Thing

### [traces](docs/sdks/traces/README.md)

* [getApiTraces](docs/sdks/traces/README.md#getapitraces) - List all Traces
* [getApiTracesId](docs/sdks/traces/README.md#getapitracesid) - Get a specific Trace
* [deleteApiTracesId](docs/sdks/traces/README.md#deleteapitracesid) - Delete a Trace

### [triggers](docs/sdks/triggers/README.md)

* [getApiIntegrationTriggers](docs/sdks/triggers/README.md#getapiintegrationtriggers) - List all Triggers
* [getApiIntegrationTriggersId](docs/sdks/triggers/README.md#getapiintegrationtriggersid) - Get a specific Trigger
* [deleteApiIntegrationTriggersId](docs/sdks/triggers/README.md#deleteapiintegrationtriggersid) - Delete a Trigger
* [getApiTriggers](docs/sdks/triggers/README.md#getapitriggers) - List all Triggers
* [getApiTriggersId](docs/sdks/triggers/README.md#getapitriggersid) - Get a specific Trigger
* [deleteApiTriggersId](docs/sdks/triggers/README.md#deleteapitriggersid) - Delete a Trigger

### [types](docs/sdks/types/README.md)

* [getApiTypes](docs/sdks/types/README.md#getapitypes) - List all Types
* [getApiTypesId](docs/sdks/types/README.md#getapitypesid) - Get a specific Type
* [deleteApiTypesId](docs/sdks/types/README.md#deleteapitypesid) - Delete a Type

### [users](docs/sdks/users/README.md)

* [getApiUsers](docs/sdks/users/README.md#getapiusers) - List all Users
* [getApiUsersId](docs/sdks/users/README.md#getapiusersid) - Get a specific User
* [deleteApiUsersId](docs/sdks/users/README.md#deleteapiusersid) - Delete a User

### [verbs](docs/sdks/verbs/README.md)

* [getApiVerbs](docs/sdks/verbs/README.md#getapiverbs) - List all Verbs
* [getApiVerbsId](docs/sdks/verbs/README.md#getapiverbsid) - Get a specific Verb
* [deleteApiVerbsId](docs/sdks/verbs/README.md#deleteapiverbsid) - Delete a Verb

### [webhooks](docs/sdks/webhooks/README.md)

* [getApiWebhooks](docs/sdks/webhooks/README.md#getapiwebhooks) - List all Webhooks
* [getApiWebhooksId](docs/sdks/webhooks/README.md#getapiwebhooksid) - Get a specific Webhook
* [deleteApiWebhooksId](docs/sdks/webhooks/README.md#deleteapiwebhooksid) - Delete a Webhook

### [workflows](docs/sdks/workflows/README.md)

* [getApiWorkflows](docs/sdks/workflows/README.md#getapiworkflows) - List all Workflows
* [getApiWorkflowsId](docs/sdks/workflows/README.md#getapiworkflowsid) - Get a specific Workflow
* [deleteApiWorkflowsId](docs/sdks/workflows/README.md#deleteapiworkflowsid) - Delete a Workflow

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`actionsDeleteApiActionsId`](docs/sdks/actions/README.md#deleteapiactionsid) - Delete a Action
- [`actionsDeleteApiIntegrationActionsId`](docs/sdks/actions/README.md#deleteapiintegrationactionsid) - Delete a Action
- [`actionsGetApiActions`](docs/sdks/actions/README.md#getapiactions) - List all Actions
- [`actionsGetApiActionsId`](docs/sdks/actions/README.md#getapiactionsid) - Get a specific Action
- [`actionsGetApiIntegrationActions`](docs/sdks/actions/README.md#getapiintegrationactions) - List all Actions
- [`actionsGetApiIntegrationActionsId`](docs/sdks/actions/README.md#getapiintegrationactionsid) - Get a specific Action
- [`agentsDeleteApiAgentsId`](docs/sdks/agents/README.md#deleteapiagentsid) - Delete a Agent
- [`agentsGetApiAgents`](docs/sdks/agents/README.md#getapiagents) - List all Agents
- [`agentsGetApiAgentsId`](docs/sdks/agents/README.md#getapiagentsid) - Get a specific Agent
- [`apiKeysDeleteAPIApikeysId`](docs/sdks/apikeys/README.md#deleteapiapikeysid) - Delete a API Key
- [`apiKeysGetAPIApikeys`](docs/sdks/apikeys/README.md#getapiapikeys) - List all API Keys
- [`apiKeysGetAPIApikeysId`](docs/sdks/apikeys/README.md#getapiapikeysid) - Get a specific API Key
- [`benchmarksDeleteApiBenchmarksId`](docs/sdks/benchmarks/README.md#deleteapibenchmarksid) - Delete a Benchmark
- [`benchmarksGetApiBenchmarks`](docs/sdks/benchmarks/README.md#getapibenchmarks) - List all Benchmarks
- [`benchmarksGetApiBenchmarksId`](docs/sdks/benchmarks/README.md#getapibenchmarksid) - Get a specific Benchmark
- [`categoriesDeleteApiIntegrationCategoriesId`](docs/sdks/categories/README.md#deleteapiintegrationcategoriesid) - Delete a Category
- [`categoriesGetApiIntegrationCategories`](docs/sdks/categories/README.md#getapiintegrationcategories) - List all Categories
- [`categoriesGetApiIntegrationCategoriesId`](docs/sdks/categories/README.md#getapiintegrationcategoriesid) - Get a specific Category
- [`connectionsDeleteApiConnectionsId`](docs/sdks/connections/README.md#deleteapiconnectionsid) - Delete a Connection
- [`connectionsGetApiConnections`](docs/sdks/connections/README.md#getapiconnections) - List all Connections
- [`connectionsGetApiConnectionsId`](docs/sdks/connections/README.md#getapiconnectionsid) - Get a specific Connection
- [`databasesDeleteApiDatabasesId`](docs/sdks/databases/README.md#deleteapidatabasesid) - Delete a Database
- [`databasesGetApiDatabases`](docs/sdks/databases/README.md#getapidatabases) - List all Databases
- [`databasesGetApiDatabasesId`](docs/sdks/databases/README.md#getapidatabasesid) - Get a specific Database
- [`datasetsDeleteApiDatasetsId`](docs/sdks/datasets/README.md#deleteapidatasetsid) - Delete a Dataset
- [`datasetsGetApiDatasets`](docs/sdks/datasets/README.md#getapidatasets) - List all Datasets
- [`datasetsGetApiDatasetsId`](docs/sdks/datasets/README.md#getapidatasetsid) - Get a specific Dataset
- [`deploymentsDeleteApiDeploymentsId`](docs/sdks/deployments/README.md#deleteapideploymentsid) - Delete a Deployment
- [`deploymentsGetApiDeployments`](docs/sdks/deployments/README.md#getapideployments) - List all Deployments
- [`deploymentsGetApiDeploymentsId`](docs/sdks/deployments/README.md#getapideploymentsid) - Get a specific Deployment
- [`domainsDeleteApiDomainsId`](docs/sdks/domains/README.md#deleteapidomainsid) - Delete a Domain
- [`domainsGetApiDomains`](docs/sdks/domains/README.md#getapidomains) - List all Domains
- [`domainsGetApiDomainsId`](docs/sdks/domains/README.md#getapidomainsid) - Get a specific Domain
- [`errorsDeleteApiErrorsId`](docs/sdks/errors/README.md#deleteapierrorsid) - Delete a Error
- [`errorsGetApiErrors`](docs/sdks/errors/README.md#getapierrors) - List all Errors
- [`errorsGetApiErrorsId`](docs/sdks/errors/README.md#getapierrorsid) - Get a specific Error
- [`evalResultsDeleteApiEvalResultsId`](docs/sdks/evalresults/README.md#deleteapievalresultsid) - Delete a Eval Result
- [`evalResultsGetApiEvalResults`](docs/sdks/evalresults/README.md#getapievalresults) - List all Eval Results
- [`evalResultsGetApiEvalResultsId`](docs/sdks/evalresults/README.md#getapievalresultsid) - Get a specific Eval Result
- [`evalRunsDeleteApiEvalRunsId`](docs/sdks/evalruns/README.md#deleteapievalrunsid) - Delete a Eval Run
- [`evalRunsGetApiEvalRuns`](docs/sdks/evalruns/README.md#getapievalruns) - List all Eval Runs
- [`evalRunsGetApiEvalRunsId`](docs/sdks/evalruns/README.md#getapievalrunsid) - Get a specific Eval Run
- [`evalsDeleteApiEvalsId`](docs/sdks/evals/README.md#deleteapievalsid) - Delete a Eval
- [`evalsGetApiEvals`](docs/sdks/evals/README.md#getapievals) - List all Evals
- [`evalsGetApiEvalsId`](docs/sdks/evals/README.md#getapievalsid) - Get a specific Eval
- [`eventsDeleteApiEventsId`](docs/sdks/events/README.md#deleteapieventsid) - Delete a Event
- [`eventsGetApiEvents`](docs/sdks/events/README.md#getapievents) - List all Events
- [`eventsGetApiEventsId`](docs/sdks/events/README.md#getapieventsid) - Get a specific Event
- [`experimentMetricsDeleteApiExperimentMetricsId`](docs/sdks/experimentmetrics/README.md#deleteapiexperimentmetricsid) - Delete a Experiment Metric
- [`experimentMetricsGetApiExperimentMetrics`](docs/sdks/experimentmetrics/README.md#getapiexperimentmetrics) - List all Experiment Metrics
- [`experimentMetricsGetApiExperimentMetricsId`](docs/sdks/experimentmetrics/README.md#getapiexperimentmetricsid) - Get a specific Experiment Metric
- [`experimentsDeleteApiExperimentsId`](docs/sdks/experiments/README.md#deleteapiexperimentsid) - Delete a Experiment
- [`experimentsGetApiExperiments`](docs/sdks/experiments/README.md#getapiexperiments) - List all Experiments
- [`experimentsGetApiExperimentsId`](docs/sdks/experiments/README.md#getapiexperimentsid) - Get a specific Experiment
- [`functionsDeleteApiFunctionsId`](docs/sdks/functions/README.md#deleteapifunctionsid) - Delete a Function
- [`functionsGetApiFunctions`](docs/sdks/functions/README.md#getapifunctions) - List all Functions
- [`functionsGetApiFunctionsId`](docs/sdks/functions/README.md#getapifunctionsid) - Get a specific Function
- [`generationBatchesDeleteApiGenerationBatchesId`](docs/sdks/generationbatches/README.md#deleteapigenerationbatchesid) - Delete a Generation Batch
- [`generationBatchesGetApiGenerationBatches`](docs/sdks/generationbatches/README.md#getapigenerationbatches) - List all Generation Batches
- [`generationBatchesGetApiGenerationBatchesId`](docs/sdks/generationbatches/README.md#getapigenerationbatchesid) - Get a specific Generation Batch
- [`generationsDeleteApiGenerationsId`](docs/sdks/generations/README.md#deleteapigenerationsid) - Delete a Generation
- [`generationsGetApiGenerations`](docs/sdks/generations/README.md#getapigenerations) - List all Generations
- [`generationsGetApiGenerationsId`](docs/sdks/generations/README.md#getapigenerationsid) - Get a specific Generation
- [`goalsDeleteApiGoalsId`](docs/sdks/goals/README.md#deleteapigoalsid) - Delete a Goal
- [`goalsGetApiGoals`](docs/sdks/goals/README.md#getapigoals) - List all Goals
- [`goalsGetApiGoalsId`](docs/sdks/goals/README.md#getapigoalsid) - Get a specific Goal
- [`integrationsDeleteApiIntegrationsId`](docs/sdks/integrations/README.md#deleteapiintegrationsid) - Delete a Integration
- [`integrationsGetApiIntegrations`](docs/sdks/integrations/README.md#getapiintegrations) - List all Integrations
- [`integrationsGetApiIntegrationsId`](docs/sdks/integrations/README.md#getapiintegrationsid) - Get a specific Integration
- [`kpIsDeleteApiKpisId`](docs/sdks/kpis/README.md#deleteapikpisid) - Delete a KPI
- [`kpIsGetApiKpis`](docs/sdks/kpis/README.md#getapikpis) - List all KPIs
- [`kpIsGetApiKpisId`](docs/sdks/kpis/README.md#getapikpisid) - Get a specific KPI
- [`labsDeleteApiLabsId`](docs/sdks/labs/README.md#deleteapilabsid) - Delete a Lab
- [`labsGetApiLabs`](docs/sdks/labs/README.md#getapilabs) - List all Labs
- [`labsGetApiLabsId`](docs/sdks/labs/README.md#getapilabsid) - Get a specific Lab
- [`modelsDeleteApiModelsId`](docs/sdks/models/README.md#deleteapimodelsid) - Delete a Model
- [`modelsGetApiModels`](docs/sdks/models/README.md#getapimodels) - List all Models
- [`modelsGetApiModelsId`](docs/sdks/models/README.md#getapimodelsid) - Get a specific Model
- [`modulesDeleteApiModulesId`](docs/sdks/modules/README.md#deleteapimodulesid) - Delete a Module
- [`modulesGetApiModules`](docs/sdks/modules/README.md#getapimodules) - List all Modules
- [`modulesGetApiModulesId`](docs/sdks/modules/README.md#getapimodulesid) - Get a specific Module
- [`nounsDeleteApiNounsId`](docs/sdks/nouns/README.md#deleteapinounsid) - Delete a Noun
- [`nounsGetApiNouns`](docs/sdks/nouns/README.md#getapinouns) - List all Nouns
- [`nounsGetApiNounsId`](docs/sdks/nouns/README.md#getapinounsid) - Get a specific Noun
- [`oauthClientsDeleteApiOauthClientsId`](docs/sdks/oauthclients/README.md#deleteapioauthclientsid) - Delete a Oauth Client
- [`oauthClientsGetApiOauthClients`](docs/sdks/oauthclients/README.md#getapioauthclients) - List all Oauth Clients
- [`oauthClientsGetApiOauthClientsId`](docs/sdks/oauthclients/README.md#getapioauthclientsid) - Get a specific Oauth Client
- [`oauthCodesDeleteApiOauthCodesId`](docs/sdks/oauthcodes/README.md#deleteapioauthcodesid) - Delete a Oauth Code
- [`oauthCodesGetApiOauthCodes`](docs/sdks/oauthcodes/README.md#getapioauthcodes) - List all Oauth Codes
- [`oauthCodesGetApiOauthCodesId`](docs/sdks/oauthcodes/README.md#getapioauthcodesid) - Get a specific Oauth Code
- [`oauthTokensDeleteApiOauthTokensId`](docs/sdks/oauthtokens/README.md#deleteapioauthtokensid) - Delete a Oauth Token
- [`oauthTokensGetApiOauthTokens`](docs/sdks/oauthtokens/README.md#getapioauthtokens) - List all Oauth Tokens
- [`oauthTokensGetApiOauthTokensId`](docs/sdks/oauthtokens/README.md#getapioauthtokensid) - Get a specific Oauth Token
- [`packagesDeleteApiPackagesId`](docs/sdks/packages/README.md#deleteapipackagesid) - Delete a Package
- [`packagesGetApiPackages`](docs/sdks/packages/README.md#getapipackages) - List all Packages
- [`packagesGetApiPackagesId`](docs/sdks/packages/README.md#getapipackagesid) - Get a specific Package
- [`projectsDeleteApiProjectsId`](docs/sdks/projects/README.md#deleteapiprojectsid) - Delete a Project
- [`projectsGetApiProjects`](docs/sdks/projects/README.md#getapiprojects) - List all Projects
- [`projectsGetApiProjectsId`](docs/sdks/projects/README.md#getapiprojectsid) - Get a specific Project
- [`promptsDeleteApiPromptsId`](docs/sdks/prompts/README.md#deleteapipromptsid) - Delete a Prompt
- [`promptsGetApiPrompts`](docs/sdks/prompts/README.md#getapiprompts) - List all Prompts
- [`promptsGetApiPromptsId`](docs/sdks/prompts/README.md#getapipromptsid) - Get a specific Prompt
- [`providersDeleteApiProvidersId`](docs/sdks/providers/README.md#deleteapiprovidersid) - Delete a Provider
- [`providersGetApiProviders`](docs/sdks/providers/README.md#getapiproviders) - List all Providers
- [`providersGetApiProvidersId`](docs/sdks/providers/README.md#getapiprovidersid) - Get a specific Provider
- [`queuesDeleteApiQueuesId`](docs/sdks/queues/README.md#deleteapiqueuesid) - Delete a Queue
- [`queuesGetApiQueues`](docs/sdks/queues/README.md#getapiqueues) - List all Queues
- [`queuesGetApiQueuesId`](docs/sdks/queues/README.md#getapiqueuesid) - Get a specific Queue
- [`resourcesDeleteApiResourcesId`](docs/sdks/resources/README.md#deleteapiresourcesid) - Delete a Resource
- [`resourcesGetApiResources`](docs/sdks/resources/README.md#getapiresources) - List all Resources
- [`resourcesGetApiResourcesId`](docs/sdks/resources/README.md#getapiresourcesid) - Get a specific Resource
- [`rolesDeleteApiRolesId`](docs/sdks/roles/README.md#deleteapirolesid) - Delete a Role
- [`rolesGetApiRoles`](docs/sdks/roles/README.md#getapiroles) - List all Roles
- [`rolesGetApiRolesId`](docs/sdks/roles/README.md#getapirolesid) - Get a specific Role
- [`searchesDeleteApiSearchesId`](docs/sdks/searches/README.md#deleteapisearchesid) - Delete a Search
- [`searchesGetApiSearches`](docs/sdks/searches/README.md#getapisearches) - List all Searches
- [`searchesGetApiSearchesId`](docs/sdks/searches/README.md#getapisearchesid) - Get a specific Search
- [`settingsDeleteApiSettingsId`](docs/sdks/settings/README.md#deleteapisettingsid) - Delete a Setting
- [`settingsGetApiSettings`](docs/sdks/settings/README.md#getapisettings) - List all Settings
- [`settingsGetApiSettingsId`](docs/sdks/settings/README.md#getapisettingsid) - Get a specific Setting
- [`tagsDeleteApiTagsId`](docs/sdks/tags/README.md#deleteapitagsid) - Delete a Tag
- [`tagsGetApiTags`](docs/sdks/tags/README.md#getapitags) - List all Tags
- [`tagsGetApiTagsId`](docs/sdks/tags/README.md#getapitagsid) - Get a specific Tag
- [`tasksDeleteApiTasksId`](docs/sdks/tasks/README.md#deleteapitasksid) - Delete a Task
- [`tasksGetApiTasks`](docs/sdks/tasks/README.md#getapitasks) - List all Tasks
- [`tasksGetApiTasksId`](docs/sdks/tasks/README.md#getapitasksid) - Get a specific Task
- [`thingsDeleteApiThingsId`](docs/sdks/things/README.md#deleteapithingsid) - Delete a Thing
- [`thingsGetApiThings`](docs/sdks/things/README.md#getapithings) - List all Things
- [`thingsGetApiThingsId`](docs/sdks/things/README.md#getapithingsid) - Get a specific Thing
- [`tracesDeleteApiTracesId`](docs/sdks/traces/README.md#deleteapitracesid) - Delete a Trace
- [`tracesGetApiTraces`](docs/sdks/traces/README.md#getapitraces) - List all Traces
- [`tracesGetApiTracesId`](docs/sdks/traces/README.md#getapitracesid) - Get a specific Trace
- [`triggersDeleteApiIntegrationTriggersId`](docs/sdks/triggers/README.md#deleteapiintegrationtriggersid) - Delete a Trigger
- [`triggersDeleteApiTriggersId`](docs/sdks/triggers/README.md#deleteapitriggersid) - Delete a Trigger
- [`triggersGetApiIntegrationTriggers`](docs/sdks/triggers/README.md#getapiintegrationtriggers) - List all Triggers
- [`triggersGetApiIntegrationTriggersId`](docs/sdks/triggers/README.md#getapiintegrationtriggersid) - Get a specific Trigger
- [`triggersGetApiTriggers`](docs/sdks/triggers/README.md#getapitriggers) - List all Triggers
- [`triggersGetApiTriggersId`](docs/sdks/triggers/README.md#getapitriggersid) - Get a specific Trigger
- [`typesDeleteApiTypesId`](docs/sdks/types/README.md#deleteapitypesid) - Delete a Type
- [`typesGetApiTypes`](docs/sdks/types/README.md#getapitypes) - List all Types
- [`typesGetApiTypesId`](docs/sdks/types/README.md#getapitypesid) - Get a specific Type
- [`usersDeleteApiUsersId`](docs/sdks/users/README.md#deleteapiusersid) - Delete a User
- [`usersGetApiUsers`](docs/sdks/users/README.md#getapiusers) - List all Users
- [`usersGetApiUsersId`](docs/sdks/users/README.md#getapiusersid) - Get a specific User
- [`verbsDeleteApiVerbsId`](docs/sdks/verbs/README.md#deleteapiverbsid) - Delete a Verb
- [`verbsGetApiVerbs`](docs/sdks/verbs/README.md#getapiverbs) - List all Verbs
- [`verbsGetApiVerbsId`](docs/sdks/verbs/README.md#getapiverbsid) - Get a specific Verb
- [`webhooksDeleteApiWebhooksId`](docs/sdks/webhooks/README.md#deleteapiwebhooksid) - Delete a Webhook
- [`webhooksGetApiWebhooks`](docs/sdks/webhooks/README.md#getapiwebhooks) - List all Webhooks
- [`webhooksGetApiWebhooksId`](docs/sdks/webhooks/README.md#getapiwebhooksid) - Get a specific Webhook
- [`workflowsDeleteApiWorkflowsId`](docs/sdks/workflows/README.md#deleteapiworkflowsid) - Delete a Workflow
- [`workflowsGetApiWorkflows`](docs/sdks/workflows/README.md#getapiworkflows) - List all Workflows
- [`workflowsGetApiWorkflowsId`](docs/sdks/workflows/README.md#getapiworkflowsid) - Get a specific Workflow

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { Api } from "apis.do";

const api = new Api();

async function run() {
  const result = await api.functions.getApiFunctions({
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  // Handle the result
  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { Api } from "apis.do";

const api = new Api({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
});

async function run() {
  const result = await api.functions.getApiFunctions();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

If the request fails due to, for example 4XX or 5XX status codes, it will throw a `APIError`.

| Error Type      | Status Code | Content Type |
| --------------- | ----------- | ------------ |
| errors.APIError | 4XX, 5XX    | \*/\*        |

```typescript
import { Api } from "apis.do";
import { SDKValidationError } from "apis.do/models/errors";

const api = new Api();

async function run() {
  let result;
  try {
    result = await api.functions.getApiFunctions();

    // Handle the result
    console.log(result);
  } catch (err) {
    switch (true) {
      // The server response does not match the expected SDK schema
      case (err instanceof SDKValidationError):
        {
          // Pretty-print will provide a human-readable multi-line error message
          console.error(err.pretty());
          // Raw value may also be inspected
          console.error(err.rawValue);
          return;
        }
        apierror.js;
      // Server returned an error status code or an unknown content type
      case (err instanceof APIError): {
        console.error(err.statusCode);
        console.error(err.rawResponse.body);
        return;
      }
      default: {
        // Other errors such as network errors, see HTTPClientErrors for more details
        throw err;
      }
    }
  }
}

run();

```

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The `SDKValidationError` that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted multi-line string since validation errors can list many issues and the plain error string may be difficult read when debugging.

In some rare cases, the SDK can fail to get a response from the server or even make the request due to unexpected circumstances such as network conditions. These types of errors are captured in the `models/errors/httpclienterrors.ts` module:

| HTTP Client Error                                    | Description                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| RequestAbortedError                                  | HTTP request was aborted by the client               |
| RequestTimeoutError                                  | HTTP request timed out due to an AbortSignal signal  |
| ConnectionError                                      | HTTP client was unable to make a request to a server |
| InvalidRequestError                                  | Any input used to create a request is invalid        |
| UnexpectedClientError                                | Unrecognised or unexpected error                     |
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { Api } from "apis.do";

const api = new Api({
  serverURL: "https://apis.do",
});

async function run() {
  const result = await api.functions.getApiFunctions();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { Api } from "apis.do";
import { HTTPClient } from "apis.do/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new Api({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { Api } from "apis.do";

const sdk = new Api({ debugLogger: console });
```

You can also enable a default debug logger by setting an environment variable `API_DEBUG` to true.
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release. 

### SDK Created by [Speakeasy](https://www.speakeasy.com/?utm_source=apis-do&utm_campaign=typescript)

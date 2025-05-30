# [.do](https://dotdo.ai) Roadmap

## Functions

- `ai-functions` Generate Objects without a Schema
- `ai-functions` Generate Objects with Schema via `ai` and `AI`
- `ai-functions` Generate Text via Tagged Templates
- `ai-functions` Generate `string[]` via `list` Tagged Template
- `ai-functions` Generate arrays of any type via `list` Tagged Template
- `ai-functions` Support `list` async iterator
- `ai-functions` uses `ai` SDK and `ai-providers` as default
- `functions.do` SDK Generate Objects without a Schema
- `functions.do` SDK Generate Objects with a Type-safe Schema
- `functions.do` SDK Generate Text via Tagged Templates
- `functions.do` SDK Generate Typescript Code w/ AST
- `functions.do` SDK Generate Markdown w/ AST
- `functions.do` SDK define & execute Code functions
- `functions.do` SDK define & execute Human functions as a `Task`
- `functions.do` SDK define & execute Agent functions as a `Task`
- `functions.do` API should determine proper function type, subject/object Nouns, Verb, and Examples

## LLM

- `language-models` parse Language Model Requirements string into object
- `language-models` generate Language Model Requirements string from object
- `models.do` API return all matching Language Models given a string or object
- `models.do` API return single matching Language Model given a `seed`
- `llm.do` API provide OpenAI Chat Completion API-compatible universal model/provider proxy
- `ai-providers` provide universal `ai` SDK provider / router with `llm.do` as default
- `llm.do` SDK exports `model` as `ai` SDK provider
- `llm.do` SDK exports `tools` for use in `ai` SDK
- `llm.do` SDK exports simplified `generateObject` and `generateText` functions
- `llm.do` SDK exports simplified `streamObject` and `streamText` functions

## APIs

- `apis.do` SDK List/Search + CRUD for all collections
- `apis.do` SDK supports all integration actions
- `apis.do` API Clickable Developer Experience

## Workflows

- `ai-workflows` export `on` and `every` for event-based workflows
- `workflows.do` SDK implement `on` and `every` for event-based workflows

## Evals

- `evals.do` Measure AI Performance

## Experiments

- `experiments.do` Compare Models

## Benchmarks

- ✅ `benchmarks.do` Measure OCR Performance of Vision Models

## Database

- `databases.do` SDK Generate Databases

## Integrations

- `integrations.do` API create `connection` for a user & integration

## Agents

- `agents.do` SDK Define `Agent`

## Services

- `services.do` SDK Define `Service`

## Tasks

- `tasks.do` SDK define `human` and `agent` types of `Task`

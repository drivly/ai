# AI Primitives Backlog

This document organizes all open issues in the drivly/ai repository into a hierarchical structure, providing a comprehensive view of the current development backlog.

## Table of Contents

- [API Experience](#api-experience)
  - [APIs.do](#apisdo)
- [Core Primitives](#core-primitives)
  - [Agents.do](#agentsdo)
  - [Functions.do](#functionsdo)
  - [Workflows.do](#workflowsdo)
- [Documentation & Website](#documentation-and-website)
  - [Docs](#docs)
  - [Website](#website)
- [Event System](#event-system)
  - [Actions.do](#actionsdo)
  - [Triggers.do](#triggersdo)
- [Foundation Components](#foundation-components)
  - [Database.do](#databasedo)
  - [LLM.do](#llmdo)
- [Uncategorized](#uncategorized)
  - [Other](#other)

## API Experience

### APIs.do

- [#28](https://github.com/drivly/ai/issues/28): Create `clickable-apis` convenience API wrapper
- [#37](https://github.com/drivly/ai/issues/37): Evaluate Better Auth vs AuthJS
- [#102](https://github.com/drivly/ai/issues/102): `clickable-apis` integrate link generation logic
- [#103](https://github.com/drivly/ai/issues/103): `apis` ensure all relative links work locally and on preview hostnames
- [#107](https://github.com/drivly/ai/issues/107): `api` define `user` header object shape
- [#108](https://github.com/drivly/ai/issues/108): `api` figure out root/home API shape
- [#141](https://github.com/drivly/ai/issues/141): `apis.do` Create OAuth Server
- [#204](https://github.com/drivly/ai/issues/204): `apis` add `?domains` flag and link to toggle domains in links
- [#217](https://github.com/drivly/ai/issues/217): `simple-payload` extract simple `db` interface from `clickable-apis`
- [#219](https://github.com/drivly/ai/issues/219): `clickable-apis` implement `api` header object
- [#220](https://github.com/drivly/ai/issues/220): `clickable-apis` implement `user` footer object

## Core Primitives

### Agents.do

- [#9](https://github.com/drivly/ai/issues/9): Create OpenHands Micro Agent [openhands]
- [#49](https://github.com/drivly/ai/issues/49): Auto-redirect to github oauth via APIs.do for browsers
- [#162](https://github.com/drivly/ai/issues/162): Optimize AI Agent Contribution Activity
- [#163](https://github.com/drivly/ai/issues/163): Define PR naming and commit message rules
- [#180](https://github.com/drivly/ai/issues/180): `agents` deep research from GitHub issues [research]
- [#221](https://github.com/drivly/ai/issues/221): Agents.do MVP [epic]
- [#255](https://github.com/drivly/ai/issues/255): `agents.do` prevent duplicate agents being created

### Functions.do

- [#5](https://github.com/drivly/ai/issues/5): Functions.do MVP
- [#35](https://github.com/drivly/ai/issues/35): Create `ai` magic function Proxy wrapper
- [#36](https://github.com/drivly/ai/issues/36): Work through the relationships between Functions, Schemas, Modules, Packages, and Deployments
- [#55](https://github.com/drivly/ai/issues/55): `ai-functions` package
- [#56](https://github.com/drivly/ai/issues/56): `ai-functions` support `no-schema` with Proxy
- [#57](https://github.com/drivly/ai/issues/57): `ai-functions` support simple schema with descriptions
- [#58](https://github.com/drivly/ai/issues/58): `ai-functions` support model/config/prompt overrides
- [#59](https://github.com/drivly/ai/issues/59): `ai-functions` support `AI` function to declare schema before usage
- [#60](https://github.com/drivly/ai/issues/60): `ai-functions` support `ai` tagged template literal function
- [#61](https://github.com/drivly/ai/issues/61): `ai-functions` support `list` function to parse markdown ordered lists
- [#62](https://github.com/drivly/ai/issues/62): `ai-functions` support `markdown` function to return markdown and AST
- [#63](https://github.com/drivly/ai/issues/63): `ai-functions` support `code` function to return type, tests, and code
- [#64](https://github.com/drivly/ai/issues/64): `ai-functions` support async iterators and streaming
- [#65](https://github.com/drivly/ai/issues/65): `ai-functions` support `ai.config.ts` config definitions
- [#66](https://github.com/drivly/ai/issues/66): `ai-functions` integrate p-queue to limit concurrency
- [#100](https://github.com/drivly/ai/issues/100): Domain Routing [epic]
- [#122](https://github.com/drivly/ai/issues/122): `functions.do` support saved schemas
- [#123](https://github.com/drivly/ai/issues/123): `functions.do` support saved prompts
- [#124](https://github.com/drivly/ai/issues/124): `functions.do` properly handle cached responses/actions
- [#125](https://github.com/drivly/ai/issues/125): `functions.do` figure out proper Task/Workflow handling
- [#126](https://github.com/drivly/ai/issues/126): `functions.do` revisit executeFunction design for upserts
- [#127](https://github.com/drivly/ai/issues/127): `functions.do` fix the executeFunctions typing
- [#130](https://github.com/drivly/ai/issues/130): `functions.do` handle markdown
- [#131](https://github.com/drivly/ai/issues/131): `functions.do` handle code
- [#134](https://github.com/drivly/ai/issues/134): `functions.do` fix actions upsert [openhands]
- [#135](https://github.com/drivly/ai/issues/135): `functions.do` set type on args (thing as subject)
- [#136](https://github.com/drivly/ai/issues/136): `functions.do` link to generation for full request/response
- [#194](https://github.com/drivly/ai/issues/194): `functions.do` add `self` to the top of `links` [openhands]
- [#203](https://github.com/drivly/ai/issues/203): `docs` ensure domain routing logic
- [#222](https://github.com/drivly/ai/issues/222): `apis` ensure `https://functions.do/api` is equal to `/functions`
- [#225](https://github.com/drivly/ai/issues/225): `sdk` generate types and sync config with backend API [epic]

### Workflows.do

- [#6](https://github.com/drivly/ai/issues/6): Workflows.do MVP
- [#38](https://github.com/drivly/ai/issues/38): Payload Kanban View

## Documentation & Website

### Docs

- [#54](https://github.com/drivly/ai/issues/54): Add Cline rules memory bank
- [#81](https://github.com/drivly/ai/issues/81): Initial Website
- [#82](https://github.com/drivly/ai/issues/82): Initial Docs
- [#84](https://github.com/drivly/ai/issues/84): Update Docs Layout
- [#110](https://github.com/drivly/ai/issues/110): `docs` JSON viewer plugins/config
- [#142](https://github.com/drivly/ai/issues/142): `docs` create initial structure for docs [openhands]
- [#187](https://github.com/drivly/ai/issues/187): `docs` search box is generating an error

### Website

- [#90](https://github.com/drivly/ai/issues/90): Add robots.txt support for each domain

## Event System

### Actions.do

- [#16](https://github.com/drivly/ai/issues/16): Support intelligent modification of request based on capabilities (i.e. structured_outputs, tools, etc)
- [#113](https://github.com/drivly/ai/issues/113): `actions.do` expose possible actions
- [#114](https://github.com/drivly/ai/issues/114): `actions.do` configure action collection
- [#115](https://github.com/drivly/ai/issues/115): `actions.do` ingest integration actions
- [#116](https://github.com/drivly/ai/issues/116): `actions.do` expose clickable API of actions

### Triggers.do

- [#117](https://github.com/drivly/ai/issues/117): `triggers.do` expose possible triggers
- [#118](https://github.com/drivly/ai/issues/118): `triggers.do` configure action collection
- [#119](https://github.com/drivly/ai/issues/119): `triggers.do` ingest integration triggers
- [#120](https://github.com/drivly/ai/issues/120): `triggers.do` expose clickable API of triggers
- [#171](https://github.com/drivly/ai/issues/171): `integrations` test Composio triggers
- [#207](https://github.com/drivly/ai/issues/207): `llm.do` integrated tool use

## Foundation Components

### Database.do

- [#146](https://github.com/drivly/ai/issues/146): `payload-vscode` extension to view/edit Payload collections
- [#165](https://github.com/drivly/ai/issues/165): `openhands` create `.openhands/setup.sh`
- [#218](https://github.com/drivly/ai/issues/218): `clickable-apis` extract `db` and `payload` deps

### LLM.do

- [#4](https://github.com/drivly/ai/issues/4): LLM.do MVP
- [#15](https://github.com/drivly/ai/issues/15): Create llm.do landing page
- [#17](https://github.com/drivly/ai/issues/17): Create llm.do documentation
- [#45](https://github.com/drivly/ai/issues/45): Integrate `getModel` into llm.do for proxied chat completions
- [#67](https://github.com/drivly/ai/issues/67): `ai-providers` package
- [#69](https://github.com/drivly/ai/issues/69): `ai-providers` use OpenAI provider as fallback for all other models via llm.do / openrouter
- [#95](https://github.com/drivly/ai/issues/95): Add support for llms.txt on each domain
- [#198](https://github.com/drivly/ai/issues/198): `llm.do` clickable experience with GET

## Uncategorized

### Other

- [#3](https://github.com/drivly/ai/issues/3): Roadmap
- [#7](https://github.com/drivly/ai/issues/7): Create CONTRIBUTING.md [openhands]
- [#12](https://github.com/drivly/ai/issues/12): Proxy `/responses` endpoint to OpenAI
- [#18](https://github.com/drivly/ai/issues/18): Create initial AI SDK-based Router
- [#19](https://github.com/drivly/ai/issues/19): Add Stripe Integration for usage-based billing
- [#20](https://github.com/drivly/ai/issues/20): Add API key support for direct billing
- [#21](https://github.com/drivly/ai/issues/21): Admin Application
- [#22](https://github.com/drivly/ai/issues/22): Finish initial version of `payload-agent`
- [#23](https://github.com/drivly/ai/issues/23): Create initial version of `payload-commandbar`
- [#24](https://github.com/drivly/ai/issues/24): Create initial version of `payload-theme`
- [#25](https://github.com/drivly/ai/issues/25): Integrate `payload-agent` into `/dash`
- [#26](https://github.com/drivly/ai/issues/26): Setup Turbo Repo
- [#29](https://github.com/drivly/ai/issues/29): Flesh out Data models & Payload Collections
- [#30](https://github.com/drivly/ai/issues/30): Define Nouns, Verbs, Resources
- [#34](https://github.com/drivly/ai/issues/34): Create JSON5/YAML switcher in JSON Field Component
- [#39](https://github.com/drivly/ai/issues/39): Create Payload Grid/Card view
- [#40](https://github.com/drivly/ai/issues/40): Resize Payload View to allow always-visible Agent
- [#42](https://github.com/drivly/ai/issues/42): Payload option to auto-add relationship
- [#43](https://github.com/drivly/ai/issues/43): `payload` add Logo & Icon to config
- [#47](https://github.com/drivly/ai/issues/47): Create Payload URL Field
- [#48](https://github.com/drivly/ai/issues/48): Configure Payload Relationship Cells to be clickable in list view
- [#50](https://github.com/drivly/ai/issues/50): Update `clickable-links` with `user` object
- [#53](https://github.com/drivly/ai/issues/53): Add support for OpenGraph images
- [#68](https://github.com/drivly/ai/issues/68): `ai-providers` route appropriate models to OpenAI, Anthropic, and Google providers
- [#70](https://github.com/drivly/ai/issues/70): `ai-providers` support meta-models by capabilities & priorities via `ai-models`
- [#80](https://github.com/drivly/ai/issues/80): Clickable API
- [#83](https://github.com/drivly/ai/issues/83): LandingPage Component
- [#85](https://github.com/drivly/ai/issues/85): BlogLayout Component
- [#86](https://github.com/drivly/ai/issues/86): BlogPost Component
- [#87](https://github.com/drivly/ai/issues/87): Integrate Analytics
- [#88](https://github.com/drivly/ai/issues/88): Implement Icons/Favicons
- [#89](https://github.com/drivly/ai/issues/89): Optimize SEO Metadata
- [#91](https://github.com/drivly/ai/issues/91): Add dynamic OpenGraph (even for API endpoints)
- [#92](https://github.com/drivly/ai/issues/92): Integrate PostHog for analytics & session recording
- [#93](https://github.com/drivly/ai/issues/93): Integrate Sentry for server and client crash reporting
- [#94](https://github.com/drivly/ai/issues/94): Integrate Google Analytics
- [#96](https://github.com/drivly/ai/issues/96): Add sitemap.xml for each domain
- [#97](https://github.com/drivly/ai/issues/97): Create /privacy page
- [#98](https://github.com/drivly/ai/issues/98): Create /terms page
- [#99](https://github.com/drivly/ai/issues/99): Create /pricing page
- [#104](https://github.com/drivly/ai/issues/104): `payload-ui` monaco code complete
- [#106](https://github.com/drivly/ai/issues/106): `api` define api header object shape
- [#109](https://github.com/drivly/ai/issues/109): `api` figure out pattern for value prop
- [#111](https://github.com/drivly/ai/issues/111): `issues.do` create Github app
- [#112](https://github.com/drivly/ai/issues/112): `api` work through hierarchy definition
- [#166](https://github.com/drivly/ai/issues/166): `tests` resolve typescript errors [openhands]
- [#179](https://github.com/drivly/ai/issues/179): `ai-models` come up with new package name
- [#223](https://github.com/drivly/ai/issues/223): `payload` update events collection with props, relationships, and joins
- [#224](https://github.com/drivly/ai/issues/224): `payload` update collections/README with collections overview [openhands]
- [#226](https://github.com/drivly/ai/issues/226): Create GitHub App with `.ai` folder repo, issue, etc access
- [#227](https://github.com/drivly/ai/issues/227): `sdk` create base typegen CLI for all .do SDKs
- [#228](https://github.com/drivly/ai/issues/228): `sdk` create sync logic to track/sync local `.ai/*` file changes
- [#261](https://github.com/drivly/ai/issues/261): Summarize all open issues and update ROADMAP [openhands, devin]


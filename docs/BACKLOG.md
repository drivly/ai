# AI Primitives Platform Backlog

This document organizes all open issues in the drivly/ai repository into a hierarchical structure, aligning with the platform's architecture and roadmap.

## Core Primitives

### Functions.do - Inputs to Structured Outputs

- [#365](https://github.com/drivly/ai/issues/365) - `functions.do` develop clickable API
- [#364](https://github.com/drivly/ai/issues/364) - `functions.do` develop API implementation
- [#363](https://github.com/drivly/ai/issues/363) - `functions.do` develop SDK implementation
- [#362](https://github.com/drivly/ai/issues/362) - `functions.do` develop e2e tests for SDK & API
- [#361](https://github.com/drivly/ai/issues/361) - `functions.do` develop unit tests for SDK
- [#360](https://github.com/drivly/ai/issues/360) - `functions.do` define types.ts for SDK
- [#358](https://github.com/drivly/ai/issues/358) - `functions.do` write README for SDK w/ usage examples
- [#357](https://github.com/drivly/ai/issues/357) - `functions.do` define initial API for SDK
- [#341](https://github.com/drivly/ai/issues/341) - `functions.do` SDK
- [#331](https://github.com/drivly/ai/issues/331) - functions.do/api returns error
- [#289](https://github.com/drivly/ai/issues/289) - `payload` update Functions collection
- [#222](https://github.com/drivly/ai/issues/222) - `apis` ensure `https://functions.do/api` is equal to `/functions`
- [#194](https://github.com/drivly/ai/issues/194) - `functions.do` add `self` to the top of `links`
- [#191](https://github.com/drivly/ai/issues/191) - `functions.do` implement `generateCode` using `generateText`
- [#190](https://github.com/drivly/ai/issues/190) - `functions.do` implement `generateMarkdown` using `generateText`
- [#188](https://github.com/drivly/ai/issues/188) - `functions.do` implement `generateText` like `generateObject`
- [#183](https://github.com/drivly/ai/issues/183) - `functions.do` refactor `executeFunction` extracting `generateObject`
- [#139](https://github.com/drivly/ai/issues/139) - `functions.do` return links to adjust temperature
- [#138](https://github.com/drivly/ai/issues/138) - `functions.do` return links to other models
- [#137](https://github.com/drivly/ai/issues/137) - `functions.do` return links to next/prev seed
- [#136](https://github.com/drivly/ai/issues/136) - `functions.do` link to generation for full request/response
- [#135](https://github.com/drivly/ai/issues/135) - `functions.do` set type on args (thing as subject)
- [#134](https://github.com/drivly/ai/issues/134) - `functions.do` fix actions upsert
- [#132](https://github.com/drivly/ai/issues/132) - `functions.do` handle list from markdown ordered list
- [#131](https://github.com/drivly/ai/issues/131) - `functions.do` handle code
- [#130](https://github.com/drivly/ai/issues/130) - `functions.do` handle markdown
- [#129](https://github.com/drivly/ai/issues/129) - `functions.do` handle `json_schema`
- [#128](https://github.com/drivly/ai/issues/128) - `functions.do` handle `no-schema`
- [#127](https://github.com/drivly/ai/issues/127) - `functions.do` fix the executeFunctions typing
- [#126](https://github.com/drivly/ai/issues/126) - `functions.do` revisit executeFunction design for upserts
- [#125](https://github.com/drivly/ai/issues/125) - `functions.do` figure out proper Task/Workflow handling
- [#124](https://github.com/drivly/ai/issues/124) - `functions.do` properly handle cached responses/actions
- [#123](https://github.com/drivly/ai/issues/123) - `functions.do` support saved prompts
- [#122](https://github.com/drivly/ai/issues/122) - `functions.do` support saved schemas
- [#121](https://github.com/drivly/ai/issues/121) - `functions.do` expose initial function
- [#66](https://github.com/drivly/ai/issues/66) - `ai-functions` integrate p-queue to limit concurrency
- [#65](https://github.com/drivly/ai/issues/65) - `ai-functions` support `ai.config.ts` config definitions
- [#64](https://github.com/drivly/ai/issues/64) - `ai-functions` support async iterators and streaming
- [#63](https://github.com/drivly/ai/issues/63) - `ai-functions` support `code` function to return type, tests, and code
- [#62](https://github.com/drivly/ai/issues/62) - `ai-functions` support `markdown` function to return markdown and AST
- [#61](https://github.com/drivly/ai/issues/61) - `ai-functions` support `list` function to parse markdown ordered lists
- [#60](https://github.com/drivly/ai/issues/60) - `ai-functions` support `ai` tagged template literal function
- [#59](https://github.com/drivly/ai/issues/59) - `ai-functions` support `AI` function to declare schema before usage
- [#58](https://github.com/drivly/ai/issues/58) - `ai-functions` support model/config/prompt overrides
- [#57](https://github.com/drivly/ai/issues/57) - `ai-functions` support simple schema with descriptions
- [#56](https://github.com/drivly/ai/issues/56) - `ai-functions` support `no-schema` with Proxy
- [#55](https://github.com/drivly/ai/issues/55) - `ai-functions` package
- [#36](https://github.com/drivly/ai/issues/36) - Work through the relationships between Functions, Schemas, Modules, Packages, and Deployments
- [#35](https://github.com/drivly/ai/issues/35) - Create `ai` magic function Proxy wrapper
- [#5](https://github.com/drivly/ai/issues/5) - Functions.do MVP

### Workflows.do - Business-as-Code

- [#356](https://github.com/drivly/ai/issues/356) - `workflows.do` implement package.json
- [#355](https://github.com/drivly/ai/issues/355) - `workflows.do` develop clickable API
- [#354](https://github.com/drivly/ai/issues/354) - `workflows.do` develop API implementation
- [#353](https://github.com/drivly/ai/issues/353) - `workflows.do` develop SDK implementation
- [#352](https://github.com/drivly/ai/issues/352) - `workflows.do` develop e2e tests for SDK & API
- [#351](https://github.com/drivly/ai/issues/351) - `workflows.do` develop unit tests for SDK
- [#350](https://github.com/drivly/ai/issues/350) - `workflows.do` define types.ts for SDK
- [#349](https://github.com/drivly/ai/issues/349) - `workflows.do` write README for SDK w/ usage examples
- [#348](https://github.com/drivly/ai/issues/348) - `workflows.do` define initial API for SDK
- [#340](https://github.com/drivly/ai/issues/340) - `workflows.do` SDK
- [#312](https://github.com/drivly/ai/issues/312) - `workflows` define type of the callback
- [#239](https://github.com/drivly/ai/issues/239) - `docs` flesh out sdk/workflows.do/README.md
- [#229](https://github.com/drivly/ai/issues/229) - move event create from GitHub webhook event handler into handleGithubEvent workflow
- [#6](https://github.com/drivly/ai/issues/6) - Workflows.do MVP

### Agents.do - Autonomous Digital Workers

- [#374](https://github.com/drivly/ai/issues/374) - `agents.do` develop clickable API
- [#373](https://github.com/drivly/ai/issues/373) - `agents.do` develop API implementation
- [#372](https://github.com/drivly/ai/issues/372) - `agents.do` develop SDK implementation
- [#371](https://github.com/drivly/ai/issues/371) - `agents.do` develop e2e tests for SDK & API
- [#370](https://github.com/drivly/ai/issues/370) - `agents.do` develop unit tests for SDK
- [#369](https://github.com/drivly/ai/issues/369) - `agents.do` define types.ts for SDK
- [#368](https://github.com/drivly/ai/issues/368) - `agents.do` implement package.json
- [#367](https://github.com/drivly/ai/issues/367) - `agents.do` write README for SDK w/ usage examples
- [#366](https://github.com/drivly/ai/issues/366) - `agents.do` define initial API for SDK
- [#342](https://github.com/drivly/ai/issues/342) - `agents.do` SDK
- [#255](https://github.com/drivly/ai/issues/255) - `agents.do` prevent duplicate agents being created
- [#246](https://github.com/drivly/ai/issues/246) - `docs` flesh out sdk/agents.do/README.md
- [#242](https://github.com/drivly/ai/issues/242) - `payload-agent` fix build & import
- [#231](https://github.com/drivly/ai/issues/231) - `agents.do` create Devin session on GitHub label event
- [#206](https://github.com/drivly/ai/issues/206) - `agents` Devin session from issue tag
- [#180](https://github.com/drivly/ai/issues/180) - `agents` deep research from GitHub issues
- [#162](https://github.com/drivly/ai/issues/162) - Optimize AI Agent Contribution Activity
- [#76](https://github.com/drivly/ai/issues/76) - Update .openhands/microagents and .windsurfrules
- [#40](https://github.com/drivly/ai/issues/40) - Resize Payload View to allow always-visible Agent
- [#25](https://github.com/drivly/ai/issues/25) - Integrate `payload-agent` into `/dash`
- [#22](https://github.com/drivly/ai/issues/22) - Finish initial version of `payload-agent`
- [#9](https://github.com/drivly/ai/issues/9) - Create OpenHands Micro Agent

## Event System

### Triggers.do - Start Business Processes

- [#173](https://github.com/drivly/ai/issues/173) - `triggers` create /api/triggers endpoint
- [#171](https://github.com/drivly/ai/issues/171) - `integrations` test Composio triggers
- [#120](https://github.com/drivly/ai/issues/120) - `triggers.do` expose clickable API of triggers
- [#119](https://github.com/drivly/ai/issues/119) - `triggers.do` ingest integration triggers
- [#118](https://github.com/drivly/ai/issues/118) - `triggers.do` configure action collection
- [#117](https://github.com/drivly/ai/issues/117) - `triggers.do` expose possible triggers

### Searches.do - Provide Context & Understanding

- [#187](https://github.com/drivly/ai/issues/187) - `docs` search box is generating an error

### Actions.do - Impact the External World

- [#324](https://github.com/drivly/ai/issues/324) - `tests` create new GitHub Action to run `pnpm build`
- [#310](https://github.com/drivly/ai/issues/310) - `test` update node versions and GitHub actions to node 22
- [#304](https://github.com/drivly/ai/issues/304) - `tests` setup github action to run pnpm test
- [#272](https://github.com/drivly/ai/issues/272) - Computer Use Abstraction (OpenAI & Anthropic)
- [#174](https://github.com/drivly/ai/issues/174) - `actions` create /api/actions endpoint
- [#116](https://github.com/drivly/ai/issues/116) - `actions.do` expose clickable API of actions
- [#115](https://github.com/drivly/ai/issues/115) - `actions.do` ingest integration actions
- [#114](https://github.com/drivly/ai/issues/114) - `actions.do` configure action collection
- [#113](https://github.com/drivly/ai/issues/113) - `actions.do` expose possible actions

## Foundation Components

### LLM.do - Intelligent AI Gateway

- [#464](https://github.com/drivly/ai/issues/464) - `llm.do` SDK
- [#207](https://github.com/drivly/ai/issues/207) - `llm.do` integrated tool use
- [#198](https://github.com/drivly/ai/issues/198) - `llm.do` clickable experience with GET
- [#95](https://github.com/drivly/ai/issues/95) - Add support for llms.txt on each domain
- [#69](https://github.com/drivly/ai/issues/69) - `ai-providers` use OpenAI provider as fallback for all other models via llm.do / openrouter
- [#45](https://github.com/drivly/ai/issues/45) - Integrate `getModel` into llm.do for proxied chat completions
- [#17](https://github.com/drivly/ai/issues/17) - Create llm.do documentation
- [#15](https://github.com/drivly/ai/issues/15) - Create llm.do landing page
- [#4](https://github.com/drivly/ai/issues/4) - LLM.do MVP

### Database.do - AI-enriched Data

- [#383](https://github.com/drivly/ai/issues/383) - `database.do` develop clickable API
- [#382](https://github.com/drivly/ai/issues/382) - `database.do` develop API implementation
- [#381](https://github.com/drivly/ai/issues/381) - `database.do` develop SDK implementation
- [#380](https://github.com/drivly/ai/issues/380) - `database.do` develop e2e tests for SDK & API
- [#379](https://github.com/drivly/ai/issues/379) - `database.do` develop unit tests for SDK
- [#378](https://github.com/drivly/ai/issues/378) - `database.do` define types.ts for SDK
- [#377](https://github.com/drivly/ai/issues/377) - `database.do` implement package.json
- [#376](https://github.com/drivly/ai/issues/376) - `database.do` write README for SDK w/ usage examples
- [#375](https://github.com/drivly/ai/issues/375) - `database.do` define initial API for SDK
- [#343](https://github.com/drivly/ai/issues/343) - `database.do` SDK
- [#248](https://github.com/drivly/ai/issues/248) - `docs` flesh out sdk/database.do/README.md
- [#153](https://github.com/drivly/ai/issues/153) - Create seed script to setup database

### Evals.do - Measure & Improve

- [#653](https://github.com/drivly/ai/issues/653) - `evals.do` auto-generate schemas from `no_schema` output
- [#402](https://github.com/drivly/ai/issues/402) - `evals.do` develop clickable API
- [#401](https://github.com/drivly/ai/issues/401) - `evals.do` develop API implementation
- [#400](https://github.com/drivly/ai/issues/400) - `evals.do` develop SDK implementation
- [#399](https://github.com/drivly/ai/issues/399) - `evals.do` develop e2e tests for SDK & API
- [#398](https://github.com/drivly/ai/issues/398) - `evals.do` develop unit tests for SDK
- [#397](https://github.com/drivly/ai/issues/397) - `evals.do` define types.ts for SDK
- [#396](https://github.com/drivly/ai/issues/396) - `evals.do` implement package.json
- [#395](https://github.com/drivly/ai/issues/395) - `evals.do` write README for SDK w/ usage examples
- [#394](https://github.com/drivly/ai/issues/394) - `evals.do` define initial API for SDK
- [#345](https://github.com/drivly/ai/issues/345) - `evals.do` SDK
- [#37](https://github.com/drivly/ai/issues/37) - Evaluate Better Auth vs AuthJS

### Integrations.do - Connect Your Apps

- [#420](https://github.com/drivly/ai/issues/420) - `integrations.do` develop clickable API
- [#419](https://github.com/drivly/ai/issues/419) - `integrations.do` develop API implementation
- [#418](https://github.com/drivly/ai/issues/418) - `integrations.do` develop SDK implementation
- [#417](https://github.com/drivly/ai/issues/417) - `integrations.do` develop e2e tests for SDK & API
- [#416](https://github.com/drivly/ai/issues/416) - `integrations.do` develop unit tests for SDK
- [#415](https://github.com/drivly/ai/issues/415) - `integrations.do` define types.ts for SDK
- [#414](https://github.com/drivly/ai/issues/414) - `integrations.do` implement package.json
- [#413](https://github.com/drivly/ai/issues/413) - `integrations.do` write README for SDK w/ usage examples
- [#412](https://github.com/drivly/ai/issues/412) - `integrations.do` define initial API for SDK
- [#347](https://github.com/drivly/ai/issues/347) - `integrations.do` SDK
- [#252](https://github.com/drivly/ai/issues/252) - `payload` refactor Integration collections
- [#177](https://github.com/drivly/ai/issues/177) - `integrations` verify web hook secret
- [#169](https://github.com/drivly/ai/issues/169) - `integrations` set up Composio integration
- [#19](https://github.com/drivly/ai/issues/19) - Add Stripe Integration for usage-based billing

## API Experience

### APIs.do - Clickable Developer Experiences

- [#646](https://github.com/drivly/ai/issues/646) - [BUG] APIs.do description incomplete
- [#534](https://github.com/drivly/ai/issues/534) - `apis.do` create CLI
- [#455](https://github.com/drivly/ai/issues/455) - Create `api` and `db` lib
- [#450](https://github.com/drivly/ai/issues/450) - `bug` in api.config and clickable-apis
- [#438](https://github.com/drivly/ai/issues/438) - `api` support `cf-worker` for auth
- [#429](https://github.com/drivly/ai/issues/429) - `tasks.do` develop clickable API
- [#428](https://github.com/drivly/ai/issues/428) - `tasks.do` develop API implementation
- [#426](https://github.com/drivly/ai/issues/426) - `tasks.do` develop e2e tests for SDK & API
- [#421](https://github.com/drivly/ai/issues/421) - `tasks.do` define initial API for SDK
- [#411](https://github.com/drivly/ai/issues/411) - `models.do` develop clickable API
- [#410](https://github.com/drivly/ai/issues/410) - `models.do` develop API implementation
- [#408](https://github.com/drivly/ai/issues/408) - `models.do` develop e2e tests for SDK & API
- [#403](https://github.com/drivly/ai/issues/403) - `models.do` define initial API for SDK
- [#393](https://github.com/drivly/ai/issues/393) - `apis.do` develop clickable API
- [#392](https://github.com/drivly/ai/issues/392) - `apis.do` develop API implementation
- [#391](https://github.com/drivly/ai/issues/391) - `apis.do` develop SDK implementation
- [#390](https://github.com/drivly/ai/issues/390) - `apis.do` develop e2e tests for SDK & API
- [#389](https://github.com/drivly/ai/issues/389) - `apis.do` develop unit tests for SDK
- [#388](https://github.com/drivly/ai/issues/388) - `apis.do` define types.ts for SDK
- [#387](https://github.com/drivly/ai/issues/387) - `apis.do` implement package.json
- [#386](https://github.com/drivly/ai/issues/386) - `apis.do` write README for SDK w/ usage examples
- [#385](https://github.com/drivly/ai/issues/385) - `apis.do` define initial API for SDK
- [#344](https://github.com/drivly/ai/issues/344) - `apis.do` SDK
- [#334](https://github.com/drivly/ai/issues/334) - Fix payload instance in api.config
- [#329](https://github.com/drivly/ai/issues/329) - `clickable-apis` simplify exported API
- [#322](https://github.com/drivly/ai/issues/322) - `clickable-apis` refactor to support payload dependency injection
- [#309](https://github.com/drivly/ai/issues/309) - `test` explore automate clickable api links
- [#297](https://github.com/drivly/ai/issues/297) - `api` all APIs are returning errors
- [#259](https://github.com/drivly/ai/issues/259) - Create initial implementation of each SDK that uses APIs.do
- [#247](https://github.com/drivly/ai/issues/247) - `docs` flesh out sdk/apis.do/README.md
- [#220](https://github.com/drivly/ai/issues/220) - `clickable-apis` implement `user` footer object
- [#219](https://github.com/drivly/ai/issues/219) - `clickable-apis` implement `api` header object
- [#218](https://github.com/drivly/ai/issues/218) - `clickable-apis` extract `db` and `payload` deps
- [#217](https://github.com/drivly/ai/issues/217) - `simple-payload` extract simple `db` interface from `clickable-apis`
- [#204](https://github.com/drivly/ai/issues/204) - `apis` add `?domains` flag and link to toggle domains in links
- [#197](https://github.com/drivly/ai/issues/197) - `api` update middleware to properly handle shortcut .do domains
- [#181](https://github.com/drivly/ai/issues/181) - `apis.do` create SDK package to publish
- [#141](https://github.com/drivly/ai/issues/141) - `apis.do` Create OAuth Server
- [#140](https://github.com/drivly/ai/issues/140) - Create Zapier App(s)
- [#112](https://github.com/drivly/ai/issues/112) - `api` work through hierarchy definition
- [#109](https://github.com/drivly/ai/issues/109) - `api` figure out pattern for value prop
- [#108](https://github.com/drivly/ai/issues/108) - `api` figure out root/home API shape
- [#107](https://github.com/drivly/ai/issues/107) - `api` define `user` header object shape
- [#106](https://github.com/drivly/ai/issues/106) - `api` define api header object shape
- [#103](https://github.com/drivly/ai/issues/103) - `apis` ensure all relative links work locally and on preview hostnames
- [#102](https://github.com/drivly/ai/issues/102) - `clickable-apis` integrate link generation logic
- [#91](https://github.com/drivly/ai/issues/91) - Add dynamic OpenGraph (even for API endpoints)
- [#80](https://github.com/drivly/ai/issues/80) - Clickable API
- [#49](https://github.com/drivly/ai/issues/49) - Auto-redirect to github oauth via APIs.do for browsers
- [#28](https://github.com/drivly/ai/issues/28) - Create `clickable-apis` convenience API wrapper
- [#20](https://github.com/drivly/ai/issues/20) - Add API key support for direct billing

## SDK Development

- [#427](https://github.com/drivly/ai/issues/427) - `tasks.do` develop SDK implementation
- [#425](https://github.com/drivly/ai/issues/425) - `tasks.do` develop unit tests for SDK
- [#424](https://github.com/drivly/ai/issues/424) - `tasks.do` define types.ts for SDK
- [#422](https://github.com/drivly/ai/issues/422) - `tasks.do` write README for SDK w/ usage examples
- [#409](https://github.com/drivly/ai/issues/409) - `models.do` develop SDK implementation
- [#407](https://github.com/drivly/ai/issues/407) - `models.do` develop unit tests for SDK
- [#406](https://github.com/drivly/ai/issues/406) - `models.do` define types.ts for SDK
- [#404](https://github.com/drivly/ai/issues/404) - `models.do` write README for SDK w/ usage examples
- [#384](https://github.com/drivly/ai/issues/384) - `tasks.do` SDK
- [#346](https://github.com/drivly/ai/issues/346) - `models.do` SDK
- [#339](https://github.com/drivly/ai/issues/339) - SDKs
- [#294](https://github.com/drivly/ai/issues/294) - Test Image output on Responses via OpenAI SDK
- [#293](https://github.com/drivly/ai/issues/293) - Test PDF input on Responses via OpenAI SDK
- [#292](https://github.com/drivly/ai/issues/292) - Test simple Responses usage w/ OpenAI SDK
- [#267](https://github.com/drivly/ai/issues/267) - Create `models.do` package in `sdks` directory
- [#257](https://github.com/drivly/ai/issues/257) - Create package.json for each subfolder in the `sdks` folder that don't exist
- [#228](https://github.com/drivly/ai/issues/228) - `sdk` create sync logic to track/sync local `.ai/*` file changes
- [#227](https://github.com/drivly/ai/issues/227) - `sdk` create base typegen CLI for all .do SDKs
- [#18](https://github.com/drivly/ai/issues/18) - Create initial AI SDK-based Router

## Documentation & Website

### Docs

- [#515](https://github.com/drivly/ai/issues/515) - `docs` fix left nav bar
- [#286](https://github.com/drivly/ai/issues/286) - `docs` create dynamic logo by domain name
- [#282](https://github.com/drivly/ai/issues/282) - `docs` update docs
- [#237](https://github.com/drivly/ai/issues/237) - `docs` update ARCHITECTURE.md
- [#234](https://github.com/drivly/ai/issues/234) - `docs` update ROADMAP.md
- [#203](https://github.com/drivly/ai/issues/203) - `docs` ensure domain routing logic
- [#168](https://github.com/drivly/ai/issues/168) - `docs` setup velite to bundle `content/**/*.mdx` files
- [#142](https://github.com/drivly/ai/issues/142) - `docs` create initial structure for docs
- [#110](https://github.com/drivly/ai/issues/110) - `docs` JSON viewer plugins/config
- [#84](https://github.com/drivly/ai/issues/84) - Update Docs Layout
- [#82](https://github.com/drivly/ai/issues/82) - Initial Docs

### Website

- [#101](https://github.com/drivly/ai/issues/101) - `website` middleware with routing logic
- [#81](https://github.com/drivly/ai/issues/81) - Initial Website
- [#73](https://github.com/drivly/ai/issues/73) - `website` add support for Vercel Analytics

## Miscellaneous

- [#225](https://github.com/drivly/ai/issues/225) - `sdk` generate types and sync config with backend API (Epic)
- [#221](https://github.com/drivly/ai/issues/221) - Agents.do MVP (Epic)
- [#100](https://github.com/drivly/ai/issues/100) - Domain Routing (Epic)
- [#654](https://github.com/drivly/ai/issues/654) - [BUG] Detail view no longer scrolls vertically
- [#580](https://github.com/drivly/ai/issues/580) - Set Up Discord Community
- [#579](https://github.com/drivly/ai/issues/579) - Create Blog Art work (All Core .do's)
- [#525](https://github.com/drivly/ai/issues/525) - `payload` need to run a job in a queue and get a result
- [#524](https://github.com/drivly/ai/issues/524) - ERROR: Cannot read properties of undefined (reading 'discriminatorKey')
- [#523](https://github.com/drivly/ai/issues/523) - `payload` multi-tenant plugin causes errors when enabled
- [#522](https://github.com/drivly/ai/issues/522) - `payload` kanban view errors when switching to list view
- [#521](https://github.com/drivly/ai/issues/521) - `payload` camelCase slugs result in mongo table names of all lower case
- [#520](https://github.com/drivly/ai/issues/520) - `payload` Polymorphic relationship field, at the top of sidebar, menu goes up and cut off
- [#519](https://github.com/drivly/ai/issues/519) - `payload` issues
- [#508](https://github.com/drivly/ai/issues/508) - Shim through the Google & Anthropic endpoints on AI Gateway
- [#484](https://github.com/drivly/ai/issues/484) - `payload` add `payload-kanban-board` to Tasks collection
- [#447](https://github.com/drivly/ai/issues/447) - `payload` create Queues, Tasks, and Roles collections
- [#445](https://github.com/drivly/ai/issues/445) - `tests` Vercel Preview Deployment
- [#440](https://github.com/drivly/ai/issues/440) - Import v0 landing page design
- [#423](https://github.com/drivly/ai/issues/423) - `tasks.do` implement package.json
- [#405](https://github.com/drivly/ai/issues/405) - `models.do` implement package.json
- [#327](https://github.com/drivly/ai/issues/327) - Flesh out the .github folder
- [#320](https://github.com/drivly/ai/issues/320) - `payload` resolve build errors
- [#302](https://github.com/drivly/ai/issues/302) - Work on failing tests
- [#300](https://github.com/drivly/ai/issues/300) - `tests` add tests to run on Vercel deployment to prevent regressions
- [#295](https://github.com/drivly/ai/issues/295) - Update \_meta files in content
- [#288](https://github.com/drivly/ai/issues/288) - Do a POC of Payload Admin Bar
- [x] [#279](https://github.com/drivly/ai/issues/279) - Implement Changesets and automatic semver
- [#278](https://github.com/drivly/ai/issues/278) - Implement FireCrawl as a tool to inject scraped URL as Markdown
- [#277](https://github.com/drivly/ai/issues/277) - Add user metadata to header for AI gateway
- [#276](https://github.com/drivly/ai/issues/276) - Support for webhook callback option
- [#275](https://github.com/drivly/ai/issues/275) - Add links to view detailed traces from AI Gateway
- [#274](https://github.com/drivly/ai/issues/274) - Headless DO-controlled containers via Cloudflare
- [#273](https://github.com/drivly/ai/issues/273) - Headless Browser via Computer User (using BrowserBase)
- [#270](https://github.com/drivly/ai/issues/270) - Create script to generate/update BACKLOG.md from Github issues
- [#261](https://github.com/drivly/ai/issues/261) - Summarize all open issues and update ROADMAP
- [#226](https://github.com/drivly/ai/issues/226) - Create GitHub App with `.ai` folder repo, issue, etc access
- [#224](https://github.com/drivly/ai/issues/224) - `payload` update collections/README with collections overview
- [#223](https://github.com/drivly/ai/issues/223) - `payload` update events collection with props, relationships, and joins
- [#214](https://github.com/drivly/ai/issues/214) - `tests` fix vitest tests inside the `ai-models` package
- [#205](https://github.com/drivly/ai/issues/205) - `payload` crash from multi-tenant plugin
- [#179](https://github.com/drivly/ai/issues/179) - `ai-models` come up with new package name
- [#166](https://github.com/drivly/ai/issues/166) - `tests` resolve typescript errors
- [#165](https://github.com/drivly/ai/issues/165) - `openhands` create `.openhands/setup.sh`
- [#163](https://github.com/drivly/ai/issues/163) - Define PR naming and commit message rules
- [#148](https://github.com/drivly/ai/issues/148) - `tests` create initial Vitest structure
- [#146](https://github.com/drivly/ai/issues/146) - `payload-vscode` extension to view/edit Payload collections
- [#143](https://github.com/drivly/ai/issues/143) - Update AI context rules
- [#133](https://github.com/drivly/ai/issues/133) - `payload` add email provider
- [#111](https://github.com/drivly/ai/issues/111) - `issues.do` create Github app
- [#105](https://github.com/drivly/ai/issues/105) - Add Vercel Speed Insights
- [#104](https://github.com/drivly/ai/issues/104) - `payload-ui` monaco code complete
- [#99](https://github.com/drivly/ai/issues/99) - Create /pricing page
- [#98](https://github.com/drivly/ai/issues/98) - Create /terms page
- [#97](https://github.com/drivly/ai/issues/97) - Create /privacy page
- [#96](https://github.com/drivly/ai/issues/96) - Add sitemap.xml for each domain
- [#94](https://github.com/drivly/ai/issues/94) - Integrate Google Analytics
- [#93](https://github.com/drivly/ai/issues/93) - Integrate Sentry for server and client crash reporting
- [#92](https://github.com/drivly/ai/issues/92) - Integrate PostHog for analytics & session recording
- [#90](https://github.com/drivly/ai/issues/90) - Add robots.txt support for each domain
- [#89](https://github.com/drivly/ai/issues/89) - Optimize SEO Metadata
- [#88](https://github.com/drivly/ai/issues/88) - Implement Icons/Favicons
- [#87](https://github.com/drivly/ai/issues/87) - Integrate Analytics
- [#86](https://github.com/drivly/ai/issues/86) - BlogPost Component
- [#85](https://github.com/drivly/ai/issues/85) - BlogLayout Component
- [#83](https://github.com/drivly/ai/issues/83) - LandingPage Component
- [#70](https://github.com/drivly/ai/issues/70) - `ai-providers` support meta-models by capabilities & priorities via `ai-models`
- [#68](https://github.com/drivly/ai/issues/68) - `ai-providers` route appropriate models to OpenAI, Anthropic, and Google providers
- [#67](https://github.com/drivly/ai/issues/67) - `ai-providers` package
- [#54](https://github.com/drivly/ai/issues/54) - Add Cline rules memory bank
- [#53](https://github.com/drivly/ai/issues/53) - Add support for OpenGraph images
- [#50](https://github.com/drivly/ai/issues/50) - Update `clickable-links` with `user` object
- [#48](https://github.com/drivly/ai/issues/48) - Configure Payload Relationship Cells to be clickable in list view
- [#47](https://github.com/drivly/ai/issues/47) - Create Payload URL Field
- [#44](https://github.com/drivly/ai/issues/44) - Expose `getModel` on models.do
- [#43](https://github.com/drivly/ai/issues/43) - `payload` add Logo & Icon to config
- [#42](https://github.com/drivly/ai/issues/42) - Payload option to auto-add relationship
- [#39](https://github.com/drivly/ai/issues/39) - Create Payload Grid/Card view
- [#38](https://github.com/drivly/ai/issues/38) - Payload Kanban View
- [#34](https://github.com/drivly/ai/issues/34) - Create JSON5/YAML switcher in JSON Field Component
- [#33](https://github.com/drivly/ai/issues/33) - Create `ai-models`
- [#30](https://github.com/drivly/ai/issues/30) - Define Nouns, Verbs, Resources
- [#29](https://github.com/drivly/ai/issues/29) - Flesh out Data models & Payload Collections
- [#27](https://github.com/drivly/ai/issues/27) - Create simplified `db` access layer
- [#26](https://github.com/drivly/ai/issues/26) - Setup Turbo Repo
- [#24](https://github.com/drivly/ai/issues/24) - Create initial version of `payload-theme`
- [#23](https://github.com/drivly/ai/issues/23) - Create initial version of `payload-commandbar`
- [#21](https://github.com/drivly/ai/issues/21) - Admin Application
- [#16](https://github.com/drivly/ai/issues/16) - Support intelligent modification of request based on capabilities (i.e. structured_outputs, tools, etc)
- [#14](https://github.com/drivly/ai/issues/14) - Draft RFC for model naming/routing syntax
- [#12](https://github.com/drivly/ai/issues/12) - Proxy `/responses` endpoint to OpenAI
- [#11](https://github.com/drivly/ai/issues/11) - Proxy `/chat/completions` endpoint to OpenRouter via Cloudflare AI Gateway
- [#7](https://github.com/drivly/ai/issues/7) - Create CONTRIBUTING.md
- [#3](https://github.com/drivly/ai/issues/3) - Roadmap

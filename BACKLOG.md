# AI Primitives Platform Backlog

This document organizes all open issues in the drivly/ai repository into a hierarchical structure, aligning with the platform's architecture and roadmap.

## Core Primitives

### Functions.do - Inputs to Structured Outputs

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

- [#239](https://github.com/drivly/ai/issues/239) - `docs` flesh out sdk/workflows.do/README.md
- [#229](https://github.com/drivly/ai/issues/229) - move event create from GitHub webhook event handler into handleGithubEvent workflow
- [#6](https://github.com/drivly/ai/issues/6) - Workflows.do MVP

### Agents.do - Autonomous Digital Workers

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

- [#174](https://github.com/drivly/ai/issues/174) - `actions` create /api/actions endpoint
- [#116](https://github.com/drivly/ai/issues/116) - `actions.do` expose clickable API of actions
- [#115](https://github.com/drivly/ai/issues/115) - `actions.do` ingest integration actions
- [#114](https://github.com/drivly/ai/issues/114) - `actions.do` configure action collection
- [#113](https://github.com/drivly/ai/issues/113) - `actions.do` expose possible actions

## Foundation Components

### LLM.do - Intelligent AI Gateway

- [#207](https://github.com/drivly/ai/issues/207) - `llm.do` integrated tool use
- [#198](https://github.com/drivly/ai/issues/198) - `llm.do` clickable experience with GET
- [#95](https://github.com/drivly/ai/issues/95) - Add support for llms.txt on each domain
- [#69](https://github.com/drivly/ai/issues/69) - `ai-providers` use OpenAI provider as fallback for all other models via llm.do / openrouter
- [#45](https://github.com/drivly/ai/issues/45) - Integrate `getModel` into llm.do for proxied chat completions
- [#17](https://github.com/drivly/ai/issues/17) - Create llm.do documentation
- [#15](https://github.com/drivly/ai/issues/15) - Create llm.do landing page
- [#4](https://github.com/drivly/ai/issues/4) - LLM.do MVP

### Database.do - AI-enriched Data

- [#248](https://github.com/drivly/ai/issues/248) - `docs` flesh out sdk/database.do/README.md
- [#153](https://github.com/drivly/ai/issues/153) - Create seed script to setup database

### Evals.do - Measure & Improve

- [#37](https://github.com/drivly/ai/issues/37) - Evaluate Better Auth vs AuthJS

### Integrations.do - Connect Your Apps

- [#252](https://github.com/drivly/ai/issues/252) - `payload` refactor Integration collections
- [#177](https://github.com/drivly/ai/issues/177) - `integrations` verify web hook secret
- [#169](https://github.com/drivly/ai/issues/169) - `integrations` set up Composio integration
- [#19](https://github.com/drivly/ai/issues/19) - Add Stripe Integration for usage-based billing

## API Experience

### APIs.do - Clickable Developer Experiences

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

- [#267](https://github.com/drivly/ai/issues/267) - Create `models.do` package in `sdks` directory
- [#257](https://github.com/drivly/ai/issues/257) - Create package.json for each subfolder in the `sdks` folder that don't exist
- [#228](https://github.com/drivly/ai/issues/228) - `sdk` create sync logic to track/sync local `.ai/*` file changes
- [#227](https://github.com/drivly/ai/issues/227) - `sdk` create base typegen CLI for all .do SDKs
- [#18](https://github.com/drivly/ai/issues/18) - Create initial AI SDK-based Router

## Documentation & Website

### Docs

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

# AI Primitives Platform Backlog

This document organizes all open issues in the drivly/ai repository into a hierarchical structure, aligning with the platform's architecture and roadmap.

## Core Primitives

### Functions.do - Inputs to Structured Outputs
- [#194](https://github.com/drivly/ai/issues/194) - Add `self` to the top of `links`
- [#136](https://github.com/drivly/ai/issues/136) - Link to generation for full request/response
- [#135](https://github.com/drivly/ai/issues/135) - Set type on args (thing as subject)
- [#134](https://github.com/drivly/ai/issues/134) - Fix actions upsert
- [#131](https://github.com/drivly/ai/issues/131) - Handle code
- [#130](https://github.com/drivly/ai/issues/130) - Handle markdown
- [#127](https://github.com/drivly/ai/issues/127) - Fix the executeFunctions typing
- [#126](https://github.com/drivly/ai/issues/126) - Revisit executeFunction design for upserts
- [#125](https://github.com/drivly/ai/issues/125) - Figure out proper Task/Workflow handling
- [#124](https://github.com/drivly/ai/issues/124) - Properly handle cached responses/actions
- [#123](https://github.com/drivly/ai/issues/123) - Support saved prompts
- [#122](https://github.com/drivly/ai/issues/122) - Support saved schemas

### Workflows.do - Business-as-Code
- [#125](https://github.com/drivly/ai/issues/125) - Figure out proper Task/Workflow handling (shared with Functions.do)
- [#126](https://github.com/drivly/ai/issues/126) - Revisit executeFunction design for upserts (shared with Functions.do)
- **AI Functions Package Integration:**
  - [#66](https://github.com/drivly/ai/issues/66) - Integrate p-queue to limit concurrency
  - [#65](https://github.com/drivly/ai/issues/65) - Support `ai.config.ts` config definitions
  - [#64](https://github.com/drivly/ai/issues/64) - Support async iterators and streaming
  - [#63](https://github.com/drivly/ai/issues/63) - Support `code` function to return type, tests, and code
  - [#62](https://github.com/drivly/ai/issues/62) - Support `markdown` function to return markdown and AST
  - [#61](https://github.com/drivly/ai/issues/61) - Support `list` function to parse markdown ordered lists
  - [#60](https://github.com/drivly/ai/issues/60) - Support `ai` tagged template literal function
  - [#59](https://github.com/drivly/ai/issues/59) - Support `AI` function to declare schema before usage
  - [#58](https://github.com/drivly/ai/issues/58) - Support model/config/prompt overrides
  - [#57](https://github.com/drivly/ai/issues/57) - Support simple schema with descriptions
  - [#56](https://github.com/drivly/ai/issues/56) - Support `no-schema` with Proxy
  - [#55](https://github.com/drivly/ai/issues/55) - `ai-functions` package

### Agents.do - Autonomous Digital Workers
- [#221](https://github.com/drivly/ai/issues/221) - Agents.do MVP (Epic)
- [#255](https://github.com/drivly/ai/issues/255) - Prevent duplicate agents being created
- [#180](https://github.com/drivly/ai/issues/180) - Deep research from GitHub issues (Research)

## Event System

### Triggers.do - Start Business Processes
- [#120](https://github.com/drivly/ai/issues/120) - Expose clickable API of triggers
- [#119](https://github.com/drivly/ai/issues/119) - Ingest integration triggers
- [#118](https://github.com/drivly/ai/issues/118) - Configure action collection
- [#117](https://github.com/drivly/ai/issues/117) - Expose possible triggers
- [#171](https://github.com/drivly/ai/issues/171) - Test Composio triggers

### Searches.do - Provide Context & Understanding
- *No specific issues assigned*

### Actions.do - Impact the External World
- [#223](https://github.com/drivly/ai/issues/223) - Update events collection with props, relationships, and joins
- [#116](https://github.com/drivly/ai/issues/116) - Expose clickable API of actions
- [#115](https://github.com/drivly/ai/issues/115) - Ingest integration actions
- [#114](https://github.com/drivly/ai/issues/114) - Configure action collection
- [#113](https://github.com/drivly/ai/issues/113) - Expose possible actions

## Foundation Components

### LLM.do - Intelligent AI Gateway
- [#207](https://github.com/drivly/ai/issues/207) - Integrated tool use
- [#198](https://github.com/drivly/ai/issues/198) - Clickable experience with GET
- [#179](https://github.com/drivly/ai/issues/179) - Come up with new package name for `ai-models`
- **AI Providers Package:**
  - [#70](https://github.com/drivly/ai/issues/70) - Support meta-models by capabilities & priorities via `ai-models`
  - [#69](https://github.com/drivly/ai/issues/69) - Use OpenAI provider as fallback for all other models via llm.do / openrouter
  - [#68](https://github.com/drivly/ai/issues/68) - Route appropriate models to OpenAI, Anthropic, and Google providers
  - [#67](https://github.com/drivly/ai/issues/67) - `ai-providers` package

### Database.do - AI-enriched Data
- [#217](https://github.com/drivly/ai/issues/217) - Extract simple `db` interface from `clickable-apis`
- [#133](https://github.com/drivly/ai/issues/133) - Add email provider

### Evals.do - Measure & Improve
- *No specific issues assigned*

### Integrations.do - Connect Your Apps
- [#226](https://github.com/drivly/ai/issues/226) - Create GitHub App with `.ai` folder repo, issue, etc access
- [#171](https://github.com/drivly/ai/issues/171) - Test Composio triggers (shared with Triggers.do)
- [#111](https://github.com/drivly/ai/issues/111) - Create Github app for issues

## API Experience

### APIs.do - Clickable Developer Experiences
- [#222](https://github.com/drivly/ai/issues/222) - Ensure `https://functions.do/api` is equal to `/functions`
- [#220](https://github.com/drivly/ai/issues/220) - Implement `user` footer object
- [#219](https://github.com/drivly/ai/issues/219) - Implement `api` header object
- [#218](https://github.com/drivly/ai/issues/218) - Extract `db` and `payload` deps
- [#204](https://github.com/drivly/ai/issues/204) - Add `?domains` flag and link to toggle domains in links
- [#203](https://github.com/drivly/ai/issues/203) - Ensure domain routing logic
- [#141](https://github.com/drivly/ai/issues/141) - Create OAuth Server
- [#112](https://github.com/drivly/ai/issues/112) - Work through hierarchy definition
- [#109](https://github.com/drivly/ai/issues/109) - Figure out pattern for value prop
- [#108](https://github.com/drivly/ai/issues/108) - Figure out root/home API shape
- [#107](https://github.com/drivly/ai/issues/107) - Define `user` header object shape
- [#106](https://github.com/drivly/ai/issues/106) - Define api header object shape
- [#103](https://github.com/drivly/ai/issues/103) - Ensure all relative links work locally and on preview hostnames
- [#102](https://github.com/drivly/ai/issues/102) - Integrate link generation logic
- [#80](https://github.com/drivly/ai/issues/80) - Clickable API

## SDK Development
- [#225](https://github.com/drivly/ai/issues/225) - Generate types and sync config with backend API (Epic)
- [#228](https://github.com/drivly/ai/issues/228) - Create sync logic to track/sync local `.ai/*` file changes
- [#227](https://github.com/drivly/ai/issues/227) - Create base typegen CLI for all .do SDKs

## Documentation & Website

### Docs
- [#203](https://github.com/drivly/ai/issues/203) - Ensure domain routing logic (shared with APIs.do)
- [#187](https://github.com/drivly/ai/issues/187) - Search box is generating an error
- [#142](https://github.com/drivly/ai/issues/142) - Create initial structure for docs
- [#110](https://github.com/drivly/ai/issues/110) - JSON viewer plugins/config
- [#84](https://github.com/drivly/ai/issues/84) - Update Docs Layout
- [#82](https://github.com/drivly/ai/issues/82) - Initial Docs

### Website
- [#104](https://github.com/drivly/ai/issues/104) - Monaco code complete for payload-ui
- [#99](https://github.com/drivly/ai/issues/99) - Create /pricing page
- [#98](https://github.com/drivly/ai/issues/98) - Create /terms page
- [#97](https://github.com/drivly/ai/issues/97) - Create /privacy page
- [#96](https://github.com/drivly/ai/issues/96) - Add sitemap.xml for each domain
- [#95](https://github.com/drivly/ai/issues/95) - Add support for llms.txt on each domain
- [#94](https://github.com/drivly/ai/issues/94) - Integrate Google Analytics
- [#93](https://github.com/drivly/ai/issues/93) - Integrate Sentry for server and client crash reporting
- [#92](https://github.com/drivly/ai/issues/92) - Integrate PostHog for analytics & session recording
- [#91](https://github.com/drivly/ai/issues/91) - Add dynamic OpenGraph (even for API endpoints)
- [#90](https://github.com/drivly/ai/issues/90) - Add robots.txt support for each domain
- [#89](https://github.com/drivly/ai/issues/89) - Optimize SEO Metadata
- [#88](https://github.com/drivly/ai/issues/88) - Implement Icons/Favicons
- [#87](https://github.com/drivly/ai/issues/87) - Integrate Analytics
- [#86](https://github.com/drivly/ai/issues/86) - BlogPost Component
- [#85](https://github.com/drivly/ai/issues/85) - BlogLayout Component
- [#83](https://github.com/drivly/ai/issues/83) - LandingPage Component
- [#81](https://github.com/drivly/ai/issues/81) - Initial Website
- [#53](https://github.com/drivly/ai/issues/53) - Add support for OpenGraph images

## Infrastructure

### Domain Routing
- [#100](https://github.com/drivly/ai/issues/100) - Domain Routing (Epic)
- [#103](https://github.com/drivly/ai/issues/103) - Ensure all relative links work locally and on preview hostnames (shared with APIs.do)
- [#102](https://github.com/drivly/ai/issues/102) - Integrate clickable-apis link generation logic (shared with APIs.do)

### Analytics & Monitoring
- [#95](https://github.com/drivly/ai/issues/95) - Add support for llms.txt on each domain (shared with Website)
- [#94](https://github.com/drivly/ai/issues/94) - Integrate Google Analytics (shared with Website)
- [#93](https://github.com/drivly/ai/issues/93) - Integrate Sentry for server and client crash reporting (shared with Website)
- [#92](https://github.com/drivly/ai/issues/92) - Integrate PostHog for analytics & session recording (shared with Website)
- [#87](https://github.com/drivly/ai/issues/87) - Integrate Analytics (shared with Website)

## Miscellaneous
- [#224](https://github.com/drivly/ai/issues/224) - Update collections/README with collections overview
- [#166](https://github.com/drivly/ai/issues/166) - Resolve typescript errors in tests
- [#165](https://github.com/drivly/ai/issues/165) - Create `.openhands/setup.sh`
- [#163](https://github.com/drivly/ai/issues/163) - Define PR naming and commit message rules
- [#162](https://github.com/drivly/ai/issues/162) - Optimize AI Agent Contribution Activity
- [#146](https://github.com/drivly/ai/issues/146) - Create payload-vscode extension to view/edit Payload collections
- [#54](https://github.com/drivly/ai/issues/54) - Add Cline rules memory bank
- [#50](https://github.com/drivly/ai/issues/50) - Update `clickable-links` with `user` object
- [#49](https://github.com/drivly/ai/issues/49) - Auto-redirect to github oauth via APIs.do for browsers

## Milestones

### Soft Launch (Due: April 7, 2025)
*Milestone items to be assigned based on priority*

### Public Launch (Due: May 5, 2025)
*Milestone items to be assigned based on priority*

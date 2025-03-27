# AI Primitives Roadmap

This roadmap outlines the planned features and development priorities for the AI Primitives platform, which provides composable building blocks for building enterprise-grade AI applications.

> **Note:** This roadmap is aligned with the [BACKLOG.md](./BACKLOG.md) file, which contains a comprehensive list of all open issues organized by category.

## Core Primitives

### Functions.do - Inputs to Structured Outputs
- [ ] Functions.do MVP (Issue #5)
- [ ] Support structured outputs via various methods
- [ ] Support saved schemas (Issue #122)
- [ ] Support saved prompts (Issue #123)
- [ ] Handle cached responses/actions (Issue #124)
- [ ] Fix typing for executeFunctions (Issue #127)
- [ ] Handle markdown content (Issue #130)
- [ ] Handle code content (Issue #131)
- [ ] Fix actions upsert (Issue #134)
- [ ] Set type on args (thing as subject) (Issue #135)
- [ ] Link to generation for full request/response (Issue #136)
- [ ] Add `self` to the top of `links` (Issue #194)
- [ ] Create `ai` magic function Proxy wrapper (Issue #35)
- [ ] AI functions package integration (Issues #55-66)

### Workflows.do - Business-as-Code
- [ ] Workflows.do MVP (Issue #6)
- [ ] Figure out proper Task/Workflow handling (Issue #125)
- [ ] Revisit executeFunction design for upserts (Issue #126)
- [ ] Payload Kanban View (Issue #38)

### Agents.do - Autonomous Digital Workers
- [ ] Agents.do MVP (Epic Issue #221)
- [ ] Deep research from GitHub issues (Issue #180)
- [ ] Create OpenHands Micro Agent (Issue #9)
- [ ] Prevent duplicate agents being created (Issue #255)
- [ ] Optimize AI Agent Contribution Activity (Issue #162)

## Event System

### Triggers.do - Start Business Processes
- [ ] Configure action collection (Issue #118)
- [ ] Expose possible triggers (Issue #117)
- [ ] Ingest integration triggers (Issue #119)
- [ ] Expose clickable API of triggers (Issue #120)
- [ ] Test Composio triggers (Issue #171)

### Searches.do - Provide Context & Understanding
- [ ] Define search capabilities and integration points

### Actions.do - Impact the External World
- [ ] Configure action collection (Issue #114)
- [ ] Expose possible actions (Issue #113)
- [ ] Ingest integration actions (Issue #115)
- [ ] Expose clickable API of actions (Issue #116)
- [ ] Update events collection with props, relationships, and joins (Issue #223)
- [ ] Support intelligent modification of request based on capabilities (Issue #16)

## Foundation Components

### LLM.do - Intelligent AI Gateway
- [ ] LLM.do MVP (Issue #4)
- [ ] Router with Model Name Selection Syntax
- [ ] Integrated tool use (Issue #207)
- [ ] Clickable experience with GET (Issue #198)
- [ ] AI providers package implementation (Issues #67-70)
- [ ] Create llm.do landing page (Issue #15)
- [ ] Create llm.do documentation (Issue #17)
- [ ] Integrate `getModel` into llm.do for proxied chat completions (Issue #45)

### Database.do - AI-enriched Data
- [ ] Extract simple `db` interface from `clickable-apis` (Issue #217)
- [ ] Extract `db` and `payload` deps (Issue #218)
- [ ] Payload VSCode extension to view/edit Payload collections (Issue #146)

### Evals.do - Measure & Improve
- [ ] Define evaluation framework for AI functions
- [ ] Implement comparison tools between models

### Integrations.do - Connect Your Apps
- [ ] Create GitHub app with `.ai` folder repo access (Issue #226)
- [ ] Create GitHub app for issues (Issue #111)

## API Experience

### APIs.do - Clickable Developer Experiences
- [ ] Create `clickable-apis` convenience API wrapper (Issue #28)
- [ ] Define api header object shape (Issue #106)
- [ ] Define `user` header object shape (Issue #107)
- [ ] Figure out root/home API shape (Issue #108)
- [ ] Figure out pattern for value prop (Issue #109)
- [ ] Work through hierarchy definition (Issue #112)
- [ ] Create OAuth Server (Issue #141)
- [ ] Add `?domains` flag and link to toggle domains in links (Issue #204)
- [ ] Ensure all relative links work locally and on preview hostnames (Issue #103)
- [ ] Ensure `https://functions.do/api` is equal to `/functions` (Issue #222)
- [ ] Implement `api` header object (Issue #219)
- [ ] Implement `user` footer object (Issue #220)
- [ ] Evaluate Better Auth vs AuthJS (Issue #37)

## SDK Development

### SDK General
- [ ] Generate types and sync config with backend API (Epic Issue #225)
- [ ] Create base typegen CLI for all .do SDKs (Issue #227)
- [ ] Create sync logic to track/sync local `.ai/*` file changes (Issue #228)

## Documentation & Website

### Docs
- [ ] Create initial structure for docs (Issue #142)
- [ ] JSON viewer plugins/config (Issue #110)
- [ ] Ensure domain routing logic (Issue #203)
- [ ] Fix search box error (Issue #187)
- [ ] Update docs layout (Issue #84)
- [ ] Initial Docs (Issue #82)
- [ ] Add Cline rules memory bank (Issue #54)

### Website
- [ ] Initial website (Issue #81)
- [ ] LandingPage Component (Issue #83)
- [ ] BlogLayout Component (Issue #85)
- [ ] BlogPost Component (Issue #86)
- [ ] Implement Icons/Favicons (Issue #88)
- [ ] Optimize SEO Metadata (Issue #89)
- [ ] Add robots.txt support for each domain (Issue #90)
- [ ] Add dynamic OpenGraph (Issue #91)
- [ ] Add sitemap.xml for each domain (Issue #96)
- [ ] Create /privacy page (Issue #97)
- [ ] Create /terms page (Issue #98)
- [ ] Create /pricing page (Issue #99)

## Infrastructure

### Domain Routing
- [ ] Domain Routing (Epic Issue #100)
- [ ] Implement clickable-apis link generation logic (Issue #102)

### Analytics & Monitoring
- [ ] Integrate PostHog for analytics & session recording (Issue #92)
- [ ] Integrate Sentry for server and client crash reporting (Issue #93)
- [ ] Integrate Google Analytics (Issue #94)
- [ ] Add support for llms.txt on each domain (Issue #95)
- [ ] Integrate Analytics (Issue #87)

## Development Priorities

### Phase 1: Core Foundation (Current Focus)
- Functions.do structured outputs and MVP
- LLM.do router and MVP
- APIs.do clickable experience
- Basic documentation structure

### Phase 2: Event System
- Triggers.do implementation
- Actions.do implementation
- Searches.do implementation
- Workflows.do integration and MVP

### Phase 3: Advanced Features
- Agents.do MVP
- Integrations expansion
- SDK improvements
- Full documentation

### Phase 4: Scaling & Optimization
- Analytics integration
- Performance improvements
- Extended model support
- Enterprise features

## Key Gaps and Focus Areas

Based on the current backlog analysis, the following areas need additional focus:

1. **Testing Infrastructure** - Limited issues related to testing frameworks and practices
2. **Searches.do Implementation** - Minimal issues defined for this core primitive
3. **Evals.do Development** - Few concrete issues for evaluation frameworks
4. **Performance Optimization** - Limited focus on performance metrics and improvements
5. **Security Implementation** - Few issues addressing security concerns
6. **Enterprise Features** - Limited definition of enterprise-specific requirements

These gaps should be addressed in future planning sessions to ensure comprehensive development coverage.

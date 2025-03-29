# AI Primitives Roadmap

This roadmap outlines the planned features and development priorities for the AI Primitives platform, which provides composable building blocks for building enterprise-grade AI applications. For a detailed list of all open issues organized hierarchically, please refer to the [BACKLOG.md](./BACKLOG.md) file.

## Core Primitives

### Functions.do - Inputs to Structured Outputs

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

### Workflows.do - Business-as-Code

- [ ] Figure out proper Task/Workflow handling (Issue #125)
- [ ] Revisit executeFunction design for upserts (Issue #126)
- [ ] AI functions package integration (Issues #55-66)

### Agents.do - Autonomous Digital Workers

- [ ] Agents.do MVP (Epic Issue #221)
- [ ] Deep research from GitHub issues (Issue #180)
- [ ] Prevent duplicate agents being created (Issue #255)

## Event System

### Triggers.do - Start Business Processes

- [ ] Configure action collection (Issue #118)
- [ ] Expose possible triggers (Issue #117)
- [ ] Ingest integration triggers (Issue #119)
- [ ] Expose clickable API of triggers (Issue #120)
- [ ] Test Composio triggers (Issue #171)

### Searches.do - Provide Context & Understanding

- [ ] Define search capabilities and integration points
- [ ] **GAP**: No specific issues assigned to this component

### Actions.do - Impact the External World

- [ ] Configure action collection (Issue #114)
- [ ] Expose possible actions (Issue #113)
- [ ] Ingest integration actions (Issue #115)
- [ ] Expose clickable API of actions (Issue #116)
- [ ] Update events collection with props, relationships, and joins (Issue #223)

## Foundation Components

### LLM.do - Intelligent AI Gateway

- [ ] Router with Model Name Selection Syntax
- [ ] Integrated tool use (Issue #207)
- [ ] Clickable experience with GET (Issue #198)
- [ ] AI providers package implementation (Issues #67-70)
- [ ] Come up with new package name for `ai-models` (Issue #179)

### Database.do - AI-enriched Data

- [ ] Add email provider (Issue #133)
- [ ] Extract simple `db` interface from `clickable-apis` (Issue #217)

### Evals.do - Measure & Improve

- [ ] Define evaluation framework for AI functions
- [ ] Implement comparison tools between models
- [ ] **GAP**: No specific issues assigned to this component

### Integrations.do - Connect Your Apps

- [ ] Create GitHub app with `.ai` folder repo access (Issue #226)
- [ ] Create GitHub app for issues (Issue #111)

## API Experience

### APIs.do - Clickable Developer Experiences

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
- [ ] Extract `db` and `payload` deps (Issue #218)

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

## Phased Implementation

### Phase 1: Core Foundation (Soft Launch - Due April 7, 2025)

- Functions.do structured outputs
- LLM.do router
- APIs.do clickable experience
- Basic documentation
- **Priority Focus Areas:**
  - Complete Functions.do core features
  - Implement basic LLM.do functionality
  - Establish clickable API foundations
  - Create initial documentation structure

### Phase 2: Event System (Public Launch - Due May 5, 2025)

- Triggers.do implementation
- Actions.do implementation
- Searches.do implementation
- Workflows.do integration
- **Priority Focus Areas:**
  - Develop the Searches.do component (currently no assigned issues)
  - Complete the integration between Workflows and the Event System
  - Implement the initial version of the Agents.do MVP

### Phase 3: Advanced Features

- Agents.do MVP
- Integrations expansion
- SDK improvements
- Full documentation
- **Priority Focus Areas:**
  - Develop the Evals.do component (currently no assigned issues)
  - Expand integrations capabilities
  - Implement comprehensive analytics and monitoring

### Phase 4: Scaling & Optimization

- Analytics integration
- Performance improvements
- Extended model support
- Enterprise features

## Identified Gaps

The following areas have been identified as gaps in the current collection of issues:

1. **Searches.do Component:** No specific issues are currently assigned to this critical component of the Event System. New issues should be created to define and implement search capabilities.

2. **Evals.do Component:** While mentioned in the architecture, no specific implementation issues exist for this evaluation framework.

3. **Testing Infrastructure:** Limited issues related to comprehensive testing of components, especially for AI functions, workflows, and agents.

4. **Documentation Coverage:** While there are issues for initial documentation, more specific issues for comprehensive documentation of each component would be beneficial.

5. **Deployment & DevOps:** Limited issues related to deployment processes, CI/CD, and operational concerns.

6. **Performance Monitoring:** Few issues specifically addressing performance benchmarking and optimization.

7. **Security & Compliance:** No specific issues addressing security concerns, authentication mechanisms (beyond OAuth), or compliance requirements.

8. **Error Handling:** Limited focus on standardized error handling and recovery mechanisms across components.

## Next Steps

Based on the identified gaps, the following areas should be prioritized for the next batch of issues:

1. Create specific issues for implementing the Searches.do component
2. Develop the Evals.do evaluation framework with concrete implementation tasks
3. Establish comprehensive testing strategies for all components
4. Expand documentation coverage with component-specific documentation tasks
5. Define security and compliance requirements and implementation tasks

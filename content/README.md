# AI Primitives TODO List

This document consolidates todos and backlog items from the drivly/ai repository.

## Documentation

- [ ] Align documentation navigation in _meta.js with strategic vision in README.md
- [ ] Ensure consistent terminology across all documentation files
- [ ] Remove ".do" domain suffixes from documentation file names per guidelines
- [ ] Create documentation style guide to ensure consistency
- [ ] Complete missing content in placeholder files
- [ ] Add more code examples to existing documentation
- [ ] Improve getting started guides for each component
- [ ] Add troubleshooting sections to all documentation

## Core Primitives

### Functions.do
- [ ] Develop clickable API
- [ ] Develop API implementation
- [ ] Develop SDK implementation
- [ ] Develop e2e tests for SDK & API
- [ ] Develop unit tests for SDK
- [ ] Define types.ts for SDK
- [ ] Write README for SDK with usage examples
- [ ] Define initial API for SDK
- [ ] Fix the executeFunctions typing
- [ ] Revisit executeFunction design for upserts
- [ ] Properly handle cached responses/actions
- [ ] Support saved prompts
- [ ] Support saved schemas
- [ ] Expose initial function
- [ ] Support async iterators and streaming
- [ ] Support model/config/prompt overrides
- [ ] Handle markdown content
- [ ] Handle code content
- [ ] Support TextArray functions

### Workflows.do
- [ ] Implement package.json
- [ ] Develop clickable API
- [ ] Develop API implementation
- [ ] Develop SDK implementation
- [ ] Develop e2e tests for SDK & API
- [ ] Develop unit tests for SDK
- [ ] Define types.ts for SDK
- [ ] Write README for SDK with usage examples
- [ ] Define initial API for SDK
- [ ] Define type of the callback
- [ ] Flesh out sdk/workflows.do/README.md

### Agents.do
- [ ] Develop clickable API
- [ ] Develop API implementation
- [ ] Develop SDK implementation
- [ ] Develop e2e tests for SDK & API
- [ ] Develop unit tests for SDK
- [ ] Define types.ts for SDK
- [ ] Implement package.json
- [ ] Write README for SDK with usage examples
- [ ] Define initial API for SDK
- [ ] Prevent duplicate agents being created
- [ ] Create Devin session on GitHub label event
- [ ] Deep research from GitHub issues

## Event System

### Triggers.do
- [ ] Create /api/triggers endpoint
- [ ] Test Composio triggers
- [ ] Expose clickable API of triggers
- [ ] Ingest integration triggers
- [ ] Configure action collection
- [ ] Expose possible triggers

### Searches.do
- [ ] Fix documentation search box errors

### Actions.do
- [ ] Create /api/actions endpoint
- [ ] Expose clickable API of actions
- [ ] Ingest integration actions
- [ ] Configure action collection
- [ ] Expose possible actions
- [ ] Fix actions upsert

## Foundation Components

### Database.do
- [ ] Develop clickable API
- [ ] Develop API implementation
- [ ] Develop SDK implementation
- [ ] Develop e2e tests for SDK & API
- [ ] Develop unit tests for SDK
- [ ] Define types.ts for SDK
- [ ] Implement package.json
- [ ] Write README for SDK with usage examples
- [ ] Define initial API for SDK
- [ ] Create seed script to setup database

### LLM.do
- [ ] Develop SDK
- [ ] Integrated tool use
- [ ] Clickable experience with GET
- [ ] Add support for llms.txt on each domain
- [ ] Use OpenAI provider as fallback for all other models
- [ ] Integrate getModel into llm.do for proxied chat completions
- [ ] Create llm.do documentation
- [ ] Create llm.do landing page

### Evals.do
- [ ] Develop clickable API
- [ ] Develop API implementation
- [ ] Develop SDK implementation
- [ ] Develop e2e tests for SDK & API
- [ ] Develop unit tests for SDK
- [ ] Define types.ts for SDK
- [ ] Implement package.json
- [ ] Write README for SDK with usage examples
- [ ] Define initial API for SDK
- [ ] Auto-generate schemas from no_schema output
   
### Integrations.do
- [ ] Develop clickable API
- [ ] Develop API implementation
- [ ] Develop SDK implementation
- [ ] Develop e2e tests for SDK & API
- [ ] Develop unit tests for SDK
- [ ] Define types.ts for SDK
- [ ] Implement package.json
- [ ] Write README for SDK with usage examples
- [ ] Define initial API for SDK

## Infrastructure

- [ ] Setup GitHub action to run pnpm build
- [ ] Update node versions and GitHub actions to node 22
- [ ] Setup github action to run pnpm test
- [ ] Ensure all SDKs use apis.do for the base API client, fetcher, auth
- [ ] Ensure all SDKs extend the CLI functionality from apis.do
- [ ] Implement consistent structure across all SDKs
- [ ] Add comprehensive tests for all SDKs

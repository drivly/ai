# SDKs TODO List

This document outlines the status and required actions for each SDK in the `sdks/` directory.

## apis.do

- [x] Base API client implementation
- [x] CLI functionality
- [x] Types definition
- [ ] Complete CLI implementation (current methods are placeholders)
- [ ] Add tests for all API methods
- [ ] Improve error handling

## agents.do

- [x] Depends on apis.do
- [x] Basic API client implementation
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Add streaming support for agent execution

## database.do

- [x] Depends on apis.do
- [x] Basic implementation
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Improve type definitions

## evals.do

- [x] Depends on apis.do
- [x] Client implementation
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Add evaluation result visualization tools

## functions.do

- [x] Depends on apis.do
- [x] API client implementation
- [x] Tests for API methods
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add streaming support for function execution

## gpt.do

- [ ] Missing apis.do dependency in package.json
- [ ] Incomplete implementation (TODO comment in code)
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Implement streaming support

## integrations.do

- [ ] Missing package.json
- [ ] Missing implementation files
- [ ] Create basic structure following other SDKs
- [ ] Implement API client using apis.do
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests

## llm.do

- [x] Depends on apis.do
- [x] Basic implementation
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Add streaming support for completions

## mcp.do

- [ ] Missing apis.do dependency in package.json
- [ ] Incomplete implementation
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Define clear purpose and functionality

## models.do

- [x] Depends on apis.do
- [x] API client implementation
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Add model comparison and selection tools

## sdks.do

- [x] Depends on apis.do
- [x] Basic implementation with CLI
- [ ] Complete implementation of SDK management features
- [ ] Add comprehensive tests
- [ ] Add SDK generation and scaffolding tools

## tasks.do

- [x] Depends on apis.do
- [x] Basic implementation
- [ ] Add CLI functionality extending apis.do CLI
- [ ] Add comprehensive tests
- [ ] Add task scheduling and monitoring features

## workflows.do

- [x] Depends on apis.do, functions.do, database.do
- [x] Implementation with CLI
- [ ] Add comprehensive tests
- [ ] Add workflow visualization tools
- [ ] Add workflow debugging features

## General Improvements Needed Across All SDKs

1. **Consistent Structure**
   - Ensure all SDKs follow the same structure and patterns
   - Each SDK should have a similar API surface

2. **CLI Extensions**
   - All SDKs should extend the base CLI from apis.do
   - Implement domain-specific CLI commands

3. **Documentation**
   - Ensure all SDKs have comprehensive README.md files
   - Add usage examples for each SDK

4. **Testing**
   - Add unit tests for all SDKs
   - Add integration tests where applicable

5. **Type Definitions**
   - Ensure all SDKs have proper TypeScript type definitions
   - Use consistent type naming conventions

6. **Error Handling**
   - Implement consistent error handling across all SDKs
   - Add proper error messages and error types

7. **Streaming Support**
   - Add streaming support for applicable operations
   - Ensure consistent streaming API across SDKs

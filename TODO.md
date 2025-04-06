# AI Primitives TODO List

## Documentation

This section outlines the documentation gaps and required improvements across the repository.

### Documentation Structure

- [ ] Align documentation navigation in \_meta.js with strategic vision in README.md
- [ ] Ensure consistent terminology across all documentation files
- [ ] Remove ".do" domain suffixes from documentation file names per guidelines
- [ ] Create documentation style guide to ensure consistency

### SDK Documentation

- [ ] Create comprehensive README files for all SDKs with usage examples
- [ ] Document integration patterns between SDKs
- [ ] Add CLI usage documentation for all SDKs
- [ ] Ensure all SDK documentation follows the same structure and format

### Architecture Documentation

- [ ] Add detailed implementation guidance to ARCHITECTURE.md
- [ ] Document technical details of component relationships
- [ ] Add specific implementation examples for data flows
- [ ] Create diagrams for collection relationships and data models

### Content Documentation

- [ ] Complete missing content in placeholder files
- [ ] Add more code examples to existing documentation
- [ ] Improve getting started guides for each component
- [ ] Add troubleshooting sections to all documentation

## SDKs

This section outlines the status and required actions for each SDK in the `sdks/` directory.

### General SDK Requirements

- [ ] Ensure all SDKs use apis.do for the base API client, fetcher, auth
- [ ] Ensure all SDKs extend the CLI functionality from apis.do
- [ ] Implement consistent structure across all SDKs
- [ ] Add comprehensive tests for all SDKs
- [ ] Improve documentation for all SDKs

### SDK-Specific Tasks

- [ ] Complete gpt.do implementation using apis.do
- [ ] Create package.json and implementation for integrations.do
- [ ] Add apis.do dependency to mcp.do
- [ ] Complete CLI implementation for all SDKs
- [ ] Add streaming support for applicable SDKs

See [SDKs TODO List](./sdks/TODO.md) for detailed status and required actions for each SDK.

## executeFunction

This section outlines the implementation gaps that need to be addressed in the executeFunction task.

### Typing Issues

- [ ] Fix typing for executeFunction (Issue #127)
  - Current implementation uses `any` type: `export const executeFunction = async ({ input, req, payload }: any) => {`
  - Should be properly typed as `TaskHandler<'executeFunction'>`
  - Remove the commented-out typed declaration: `// export const executeFunction: TaskHandler<'executeFunction'> = async ({ input, req }) => {`

### Caching

- [ ] Handle cached responses/actions properly (Issue #124)
  - Current implementation has basic caching but needs improvement
  - Need to implement proper cache invalidation strategy
  - Add cache expiration mechanism

### Schema Validation

- [ ] Improve schema validation handling
  - Current implementation adds validation errors to the object rather than rejecting invalid outputs
  - Need to implement proper error handling for schema validation failures
  - Consider adding schema validation options (strict mode vs. lenient mode)

### Concurrency Control

- [ ] Integrate p-queue to limit concurrency (Issue #66)
  - No concurrency control currently implemented
  - Need to prevent overloading LLM APIs with too many simultaneous requests
  - Implement queue management for function execution

### Streaming Support

- [ ] Support async iterators and streaming (Issue #64)
  - Current implementation doesn't support streaming responses
  - Add support for streaming responses from LLMs
  - Implement async iterators for handling streaming data

### Function Execution Design

- [ ] Revisit executeFunction design for upserts (Issue #126)
  - Current upsert logic needs improvement
  - Refactor the hash-based upsert mechanism
  - Consider alternative approaches to function result caching

### Task/Workflow Handling

- [ ] Figure out proper Task/Workflow handling (Issue #125)
  - Improve integration with Payload CMS jobs queue
  - Define clear boundaries between tasks and workflows
  - Implement proper error handling and retry logic for tasks

### Configuration Support

- [ ] Support ai.config.ts config definitions (Issue #65)
  - Add support for configuration files
  - Implement configuration loading and validation
  - Allow for environment-specific configurations

### Function Type Support

- [ ] Handle markdown content (Issue #130)

  - Improve markdown generation and parsing
  - Add support for MDAST (Markdown Abstract Syntax Tree)

- [ ] Handle code content (Issue #131)

  - Improve code generation and execution
  - Add support for multiple programming languages
  - Implement proper error handling for code execution

- [ ] Support TextArray functions (Issue #132)
  - Improve handling of list output from markdown ordered lists
  - Refine parsing logic for ordered lists

### Error Handling

- [ ] Improve error handling
  - Add comprehensive error handling for network requests
  - Implement proper error reporting and logging
  - Add retry mechanisms for transient errors

### Model/Config/Prompt Overrides

- [ ] Support model/config/prompt overrides (Issue #58)
  - Allow overriding model selection at runtime
  - Support configuration overrides
  - Implement prompt template overrides

### Actions Integration

- [ ] Fix actions upsert (Issue #134)
  - Current implementation has issues with action upserts
  - Improve hash-based lookup and upsert mechanism
  - Ensure proper relationship between actions and functions

### Metadata and Linking

- [ ] Set type on args (thing as subject) (Issue #135)

  - Improve type handling for function arguments
  - Ensure proper typing for subject in actions

- [ ] Link to generation for full request/response (Issue #136)
  - Add proper linking to generation records
  - Improve traceability between function calls and their results

### Performance Optimization

- [ ] Optimize hash generation and lookups
  - Current implementation may have performance issues with large objects
  - Consider alternative hashing strategies for large inputs/outputs

### Testing

- [ ] Add comprehensive tests for executeFunction
  - Unit tests for different function types
  - Integration tests with the Payload CMS jobs queue
  - Performance tests for concurrent execution

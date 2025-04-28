# AI Functions Package TODO

- [x] Initial package setup

  - [x] Create package.json with dependencies
  - [x] Configure TypeScript
  - [x] Set up build system with tsup
  - [x] Set up testing with Vitest

- [x] Core Implementation

  - [x] Issue #56: Support `no-schema` with Proxy
    - [x] Implement Proxy handler for arbitrary function calls
    - [x] Pass function name and args as prompt to generateObject
    - [x] Support output: 'no-schema' when no schema provided
  - [x] Issue #57: Support simple schema with descriptions
    - [x] Implement schema handling with descriptions
    - [x] Integrate with generateObject
  - [x] Issue #58: Support model/config/prompt overrides
    - [x] Implement configuration override mechanism
    - [x] Support model selection
    - [x] Support prompt customization

- [x] Additional Features

  - [x] Implement `list` tagged template function using generateObject
  - [x] Implement `markdown` tagged template function using generateText
  - [ ] Add streaming support

- [x] Documentation and Testing
  - [x] Update README.md with usage examples
  - [x] Write unit tests for all features
  - [x] Add support for AI_GATEWAY environment variable
  - [x] Convert mocked tests to integration tests using real providers
  - [ ] Add JSDoc comments
  - [ ] Create additional usage examples

## Future Enhancements

- [ ] Add streaming support for template literals
- [ ] Implement caching for AI responses
- [ ] Add support for additional AI providers
- [ ] Create more specialized functions for common tasks
- [ ] Add support for function calling

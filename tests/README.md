# Tests

This directory contains tests for the AI Primitives project.

## Test Structure

- [x] API Tests: Tests for API endpoints (`/tests/api/`)
- [x] E2E Tests: End-to-end tests using Playwright (`/tests/e2e/`)
- [x] Unit Tests: Tests for individual functions and components (partial coverage)

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run only E2E tests
pnpm test:e2e
```

## Test Environment

Tests use the `IS_TEST_ENV` environment variable instead of modifying `NODE_ENV` directly. This allows tests to run in various environments including Vercel deployments.

## Mocking

Tests include fallback mechanisms when services are not available, making them suitable for CI/CD pipelines and Vercel deployments.

## Current Test Coverage

### Unit Test Coverage

| Package/Directory | Implementation Files | Test Files | Coverage % |
|-------------------|----------------------|------------|------------|
| pkgs/ (packages)  | 81                   | 4          | 4.9%       |
| sdks/ (SDKs)      | 20+                  | 12         | ~60%       |
| collections/      | 43                   | 0          | 0%         |
| tasks/            | 3+                   | 3          | ~100%      |
| lib/              | 1+                   | 1          | ~100%      |

### E2E Test Coverage

| Feature Area      | Test Files | Status    |
|-------------------|------------|-----------|
| Admin Interface   | 1          | Partial   |
| Documentation     | 1          | Partial   |
| API Endpoints     | 7+         | Partial   |
| SDK Integration   | 4+         | Partial   |

## Skipped Tests

The following tests are currently skipped and need implementation:

1. **AI Functions Package** (`pkgs/ai-functions/test/ai.test.ts`):
   - Entire test suite is skipped with `describe.skip('AI Functions', () => {...})`
   - Tests basic AI function capabilities, template literals, schema validation

2. **Functions.do SDK** (`sdks/functions.do/index.test.ts`):
   - `it.skip('should support basic tagged template usage', async () => {...})`
   - `it.skip('should support configuration with tagged templates', async () => {...})`
   - `it.skip('should call remove with correct parameters', async () => {...})` (in `src/index.test.ts`)

3. **Composio Webhook** (`tests/api/webhooks/composio.test.ts`):
   - `it.skip('should process valid webhook and store event', async () => {...})`

4. **E2E Tests**:
   - Some E2E tests conditionally skip based on environment variables (CI/browser availability)

## Test Coverage Gaps

The following areas need additional test coverage:

1. **Collections**: No tests for any of the 43 collection files
2. **Packages**: Very limited test coverage (4.9%)
3. **API Endpoints**: Several endpoints have limited or no test coverage
4. **Integration Tests**: Limited coverage for cross-component integration

## Test Assignment Recommendations

1. **High Priority**:
   - Add tests for critical collections (Functions, Workflows, Agents)
   - Implement skipped tests for AI Functions package
   - Add tests for remaining API endpoints

2. **Medium Priority**:
   - Add tests for remaining collections
   - Increase package test coverage
   - Add more comprehensive E2E tests

3. **Low Priority**:
   - Add performance tests
   - Add stress/load tests

# Tests

This directory contains tests for the AI Primitives project.

## Test Structure

- [x] API Tests: Tests for API endpoints (`/tests/api/`)
- [x] E2E Tests: End-to-end tests using Playwright (`/tests/e2e/`)
- [ ] Unit Tests: Tests for individual functions and components (coming soon)

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

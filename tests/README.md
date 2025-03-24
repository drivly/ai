# Tests

This directory contains tests for the AI Primitives project.

## Test Structure

- `api/`: API tests for endpoints
- `e2e/`: End-to-end tests using Playwright
- `setup.ts`: Global test setup file

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run E2E tests only
pnpm test:e2e
```

## Test Coverage

- [x] API Tests
  - [x] Root endpoint (`/`) returns JSON
- [x] E2E Tests
  - [x] Admin page (`/admin`) shows login screen
  - [x] Documentation page (`/docs`) loads correctly

## Adding New Tests

1. Create a new test file in the appropriate directory
2. Follow the existing test patterns
3. Run the tests to ensure they pass

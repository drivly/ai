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

## E2E Test Plan for Payload Admin Interface

The E2E tests for the Payload admin interface focus on the core platform components: Functions, Actions, and Things.

### Core Test Flow

The E2E tests follow this core flow to test the platform's fundamental functionality:

1. **Functions (Core of Platform)**
   - Create and test different function types with focus on:
     - Code Functions (with TypeScript code editor)
     - Generation Functions (with schema definition)
   - Verify function configuration and relationships

2. **Actions (Execution of Functions)**
   - Create Actions that trigger Function execution
   - Test the complete execution flow from Action creation to Function execution
   - Verify task creation and processing

3. **Things (Data - Instances of Nouns)**
   - Create Nouns as data types
   - Create Things as instances of Nouns
   - Test YAML/JSON data representation
   - Verify relationships with Actions (as subject/object)

### Detailed Test Script

```typescript
// Authentication and setup
- Login with test credentials (test@example.com/test)
- Navigate to admin dashboard

// 1. FUNCTIONS TESTING (Core of Platform)
- Navigate to Functions collection
- Create a Code-type Function
  - Set name="TestCodeFunction"
  - Set type="Code"
  - Add TypeScript code in code editor:
    ```typescript
    export default async function(input) {
      return {
        result: `Processed: ${input.data}`,
        timestamp: new Date().toISOString()
      };
    }
    ```
  - Save and verify creation
  - Verify task creation for code processing

- Create a Generation-type Function
  - Set name="TestGenerationFunction"
  - Set type="Generation"
  - Set format="Object"
  - Add schema in YAML editor:
    ```yaml
    properties:
      result:
        type: string
      confidence:
        type: number
    ```
  - Save and verify creation

// 2. ACTIONS TESTING (Execution of Functions)
- Navigate to Nouns collection
- Create a test Noun
  - Set name="TestNoun"
  - Save and verify creation

- Navigate to Things collection
- Create a Thing based on the Noun
  - Set name="TestThing"
  - Set type=TestNoun
  - Add YAML data:
    ```yaml
    data: "test input"
    ```
  - Save and verify creation

- Navigate to Verbs collection
- Create/select a Verb
  - Set name="Process"
  - Save and verify creation

- Navigate to Actions collection
- Create a new Action
  - Select subject=TestThing
  - Select verb=Process
  - Select function=TestCodeFunction
  - Save and verify creation
  - Verify function execution triggered
  - Check for task creation in tasks collection
  - Verify object Thing creation after execution

// 3. FULL WORKFLOW TESTING
- Test complete workflow:
  1. Create a Code Function that processes input
  2. Create a Noun for data categorization
  3. Create a Thing (instance of Noun) with test data
  4. Create an Action using the Function and Thing as subject
  5. Verify execution completes
  6. Verify result Thing is created as object
  7. Check Generations collection for execution record

// 4. RELATIONSHIP VERIFICATION
- Verify Function → Actions relationship
  - Navigate to Function detail page
  - Check "Executions" tab shows related Actions

- Verify Thing → Actions relationships
  - Navigate to Thing detail page
  - Check "Subject Of" tab shows Actions where Thing is subject
  - Check "Object Of" tab shows Actions where Thing is object

// 5. ERROR HANDLING & EDGE CASES
- Test validation errors
  - Submit Function without required name
  - Test invalid code syntax in Code Function
  - Test invalid YAML in Thing data
```

### Implementation Approach

The implementation will:

1. Use the existing test structure and authentication approach
2. Create helper functions for common operations (login, navigation, CRUD)
3. Focus on testing the complete flow from Function → Action → Thing
4. Add detailed assertions to verify each step of the process
5. Include proper cleanup to remove test data after tests

### Test Success Criteria

The tests will be considered successful if they can:

1. Create and configure Functions of different types
2. Create Actions that trigger Function execution
3. Verify the complete execution flow works correctly
4. Confirm relationships between collections are maintained
5. Validate that error handling works as expected

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

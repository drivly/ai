# [evals.do](https://evals.do)

[![npm version](https://img.shields.io/npm/v/evals.do.svg)](https://www.npmjs.com/package/evals.do)
[![npm downloads](https://img.shields.io/npm/dm/evals.do.svg)](https://www.npmjs.com/package/evals.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md)
[![Minified Size](https://img.shields.io/bundlephobia/min/evals.do)](https://bundlephobia.com/package/evals.do)
[![Discord](https://img.shields.io/discord/1014897323584794655?label=Discord&logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)

Evaluation tools for AI components, functions, workflows, and agents. Based on [evalite](https://github.com/mattpocock/evalite) with cloud storage integration.

## Installation

```bash
npm install evals.do
# or
yarn add evals.do
# or
pnpm add evals.do
```

## Usage

```typescript
import { evals, EvalsClient } from 'evals.do'

// Use the default client
const test = await evals.createTest({
  name: 'My Test',
  input: { prompt: 'Hello, world!' },
  expected: { response: 'Hi there!' },
})

// Or create a custom client
const customClient = new EvalsClient({
  baseUrl: 'https://custom-evals.do',
  apiKey: 'your-api-key',
  storeLocally: true,
  storeRemotely: true,
  dbPath: './my-evals.db',
})

// Create and run tests
const tests = await Promise.all([
  customClient.createTest({
    name: 'Test 1',
    input: { prompt: 'Tell me a joke' },
    expected: { type: 'joke' },
  }),
  customClient.createTest({
    name: 'Test 2',
    input: { prompt: 'What is the capital of France?' },
    expected: { answer: 'Paris' },
  }),
])

// Define a task executor
const executor = {
  execute: async (input: any) => {
    // Call your AI function, workflow, or agent here
    return { response: `Processed: ${input.prompt}` }
  },
}

// Define metrics
const metrics = {
  accuracy: {
    calculate: (result: any, expected: any) => {
      // Implement your accuracy metric here
      return result.response === expected.response ? 1 : 0
    },
  },
}

// Run evaluation
const results = await customClient.evaluate(executor, tests, {
  metrics,
  concurrency: 1,
  timeout: 30000,
})

console.log(`Evaluation complete: ${results.id}`)
console.log(`Results: ${JSON.stringify(results.results, null, 2)}`)
```

### Evaluating Functions with Different Models and Prompts

You can use the `Eval` method to test different models and prompt variations for a function:

```typescript
import { evals } from 'evals.do'

// Evaluate a function with different model and prompt variations
const evalResults = await evals.Eval({
  name: 'summarizeDocument',
  schema: {
    input: 'string',
    output: 'string',
  },
  models: ['gpt-4o', 'gpt-3.5-turbo'],
  prompts: [
    {
      name: 'concise',
      system: 'Summarize the document in 3 bullet points.',
      temperature: 0.2,
    },
    {
      name: 'detailed',
      system: 'Provide a comprehensive summary of the document.',
      temperature: 0.7,
    },
  ],
})

console.log(`Evaluation results by model:`, evalResults.models)
```

## API Reference

### `EvalsClient`

The main client for creating and running evaluations.

#### Constructor

```typescript
new EvalsClient(options?: EvalsOptions)
```

Options:

- `baseUrl`: The URL of the evals.do API (default: 'https://evals.do')
- `apiKey`: Your API key for authentication
- `storeLocally`: Whether to store data locally (default: true)
- `storeRemotely`: Whether to store data remotely (default: true)
- `dbPath`: Path to the local SQLite database (default: './node_modules/evalite/.evalite.db')

#### Methods

- `createTest(test: Partial<Test>): Promise<Test>` - Create a new test
- `getTest(id: string): Promise<Test | null>` - Get a test by ID
- `createResult(result: Partial<Result>): Promise<Result>` - Create a new result
- `getResult(id: string): Promise<Result | null>` - Get a result by ID
- `createRun(run: Partial<TestRun>): Promise<TestRun>` - Create a new test run
- `getRun(id: string): Promise<TestRun | null>` - Get a run by ID
- `evaluate<T, R>(executor: TaskExecutor<T, R>, tests: Test[], options?: EvaluationOptions): Promise<TestRun>` - Run an evaluation
- `Eval(config: FunctionEvalConfig): Promise<Record<string, any>>` - Evaluate a function with different model and prompt variations

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md) for more details.

## License

[MIT](https://opensource.org/licenses/MIT)

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem

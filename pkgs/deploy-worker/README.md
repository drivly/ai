# deploy-worker

[![npm version](https://img.shields.io/npm/v/deploy-worker.svg)](https://www.npmjs.com/package/deploy-worker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A TypeScript package for validating, testing, bundling, and deploying Cloudflare Workers.

## Installation

```bash
npm install deploy-worker
```

## Usage

```typescript
import { deployWorker } from 'deploy-worker'

const worker = {
  code: `
    export default {
      async fetch(request, env, ctx) {
        return new Response('Hello World!');
      }
    }
  `,
  tests: `
    import { describe, it, expect } from 'vitest';
    
    describe('Worker', () => {
      it('should return Hello World', async () => {
        const response = await worker.fetch(new Request('https://example.com'));
        const text = await response.text();
        expect(text).toBe('Hello World!');
      });
    });
  `,
  metadata: {
    main_module: 'worker.js',
    compatibility_date: '2023-05-18',
    bindings: [
      {
        type: 'plain_text',
        name: 'GREETING',
        text: 'Hello World!',
      },
    ],
  },
}

// Deploy the worker
const result = await deployWorker(worker)
console.log(result)
```

## API

### deployWorker(worker: Worker): Promise<DeployResult>

Validates, tests, bundles, and deploys a Cloudflare Worker.

#### Parameters

- `worker`: A Worker object containing:
  - `code`: TypeScript code for the worker
  - `tests`: Unit tests to run in Vitest
  - `metadata`: Cloudflare Worker metadata object

#### Returns

A Promise that resolves to a DeployResult object containing:

- `success`: Boolean indicating if the deployment was successful
- `errors`: Array of errors if any
- `deploymentUrl`: URL of the deployed worker if successful

## Environment Variables

The following environment variables are required:

- `CF_ACCOUNT_ID`: Cloudflare account ID
- `CF_API_TOKEN`: Cloudflare API token
- `CF_NAMESPACE_ID`: Cloudflare Workers for Platforms namespace ID

## License

MIT

## Dependencies

- [esbuild](https://www.npmjs.com/package/esbuild) - JavaScript bundler
- [isolated-vm](https://www.npmjs.com/package/isolated-vm) - Secure sandbox for running tests
- [typescript](https://www.npmjs.com/package/typescript) - TypeScript compiler
- [vitest](https://www.npmjs.com/package/vitest) - Testing framework

# ai-models

[![npm version](https://img.shields.io/npm/v/ai-models.svg)](https://www.npmjs.com/package/ai-models)
[![license](https://img.shields.io/npm/l/ai-models.svg)](https://github.com/drivly/ai/blob/main/pkgs/ai-models/LICENSE)

Capability and priority-based model selection for AI SDKs.

## Features

- Parse model identifiers in the format `provider/author/model:capabilities`
- Select models based on required capabilities
- Prioritize preferred models in selection

## Usage

```ts
import { getModel } from 'ai-models';

// Select a model by name
const model = getModel('gpt-4.5-preview');

// Select a model by capabilities
const model = getModel('any', { 
  requiredCapabilities: ['code', 'reasoning', 'online'],
  preferredModels: ['gpt-4o', 'claude-3-opus']
});
```

## Dependencies

This package has no external dependencies and requires Node.js 18 or higher.

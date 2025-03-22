# ai-providers

[![npm version](https://img.shields.io/npm/v/ai-providers.svg)](https://www.npmjs.com/package/ai-providers)
[![license](https://img.shields.io/npm/l/ai-providers.svg)](https://github.com/drivly/ai/blob/main/pkgs/ai-providers/LICENSE)

Provider router for AI models including OpenAI, Anthropic, and Google.

## Features

- Route requests to appropriate providers based on model name
- Support for OpenAI, Anthropic, and Google
- Fallback to OpenAI-compatible proxies (LLM.do, OpenRouter)
- Works with `ai-models` for capability-based selection

## Usage

```ts
import { models } from 'ai-providers';

// Direct usage
const result = await models.generateText({
  model: 'gpt-4.5-preview',
  prompt: 'Write a blog post about the future of work',
});

// Get model instance
const model = models.get('gpt-4.5-preview');
const result = await model.generateText('Write a blog post about the future of work');
```

## Dependencies

This package depends on `ai-models` and requires Node.js 18 or higher.

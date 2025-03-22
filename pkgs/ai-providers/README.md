# @drivly/ai-providers

[![npm version](https://img.shields.io/npm/v/@drivly/ai-providers.svg)](https://www.npmjs.com/package/@drivly/ai-providers)
[![license](https://img.shields.io/npm/l/@drivly/ai-providers.svg)](https://github.com/drivly/ai/blob/main/pkgs/ai-providers/LICENSE)

Provider router for AI models including OpenAI, Anthropic, and Google.

## Features

- Route requests to appropriate providers based on model name
- Support for OpenAI, Anthropic, and Google
- Fallback to OpenAI-compatible proxies (LLM.do, OpenRouter)
- Works with `@drivly/ai-models` for capability-based selection

## Usage

```ts
import { models } from '@drivly/ai-providers';

// Direct usage
const result = await models.generateText({
  model: 'gpt-4.5-preview',
  prompt: 'Write a blog post about the future of work',
});

// Get model instance
const model = models.get('gpt-4.5-preview');
const result = await model.generateText('Write a blog post about the future of work');
```

## Provider Support

The package includes support for the following providers:

- **OpenAI**: GPT-4, GPT-4o, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Ultra
- **LLM.do**: Fallback provider for any unsupported models

## Dependencies

This package depends on `@drivly/ai-models` and requires Node.js 18 or higher.

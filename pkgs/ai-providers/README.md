# ai-providers

[![npm version](https://img.shields.io/npm/v/ai-providers.svg)](https://www.npmjs.com/package/ai-providers)
[![license](https://img.shields.io/npm/l/ai-providers.svg)](https://github.com/drivly/ai/blob/main/pkgs/ai-providers/LICENSE)

Provider router for AI models including OpenAI, Anthropic, and Google. Compatible with Vercel AI SDK.

## Features

- Route requests to appropriate providers based on model name
- Support for OpenAI, Anthropic, and Google
- Fallback to OpenAI-compatible proxies (LLM.do, OpenRouter)
- Fully compatible with Vercel AI SDK

## Usage

```ts
import { models } from 'ai-providers';
import { generateText } from 'ai';

// Get a model and use with Vercel AI SDK
const model = models('gpt-4.5-preview');
const result = await generateText({ 
  model, 
  prompt: 'Write a blog post about the future of work'
});

// Use with different providers
const claudeModel = models('claude-3-opus');
const claudeResult = await generateText({
  model: claudeModel,
  prompt: 'Write a blog post about the future of work'
});
```

## Provider Support

The package includes support for the following providers:

- **OpenAI**: GPT-4, GPT-4o, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Ultra
- **LLM.do**: Fallback provider for any unsupported models

## Dependencies

This package requires the Vercel AI SDK (`ai`) and the provider packages (`@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`). It requires Node.js 18 or higher.

# ai-functions

[![npm version](https://badge.fury.io/js/ai-functions.svg)](https://www.npmjs.com/package/ai-functions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful TypeScript library for building AI-powered applications with template literals and structured outputs. Uses `ai` SDK with the `llm.do` provider and `frontier` meta-model by default.

## Features

- **Dynamic AI Functions**: Use any function name with the `ai` proxy (Issue #56)
- **Template Literals**: Generate content using template literals
- **No-Schema Support**: Generate unstructured text responses without schema validation (Issue #56)
- **Schema Support**: Validate AI responses with Zod schemas and descriptions (Issue #57)
- **List Generation**: Generate lists of items with the `list` function
- **Markdown Generation**: Generate markdown content with the `markdown` function
- **Model Configuration**: Override model, temperature, and other settings (Issue #58)
- **Environment Awareness**: Automatically uses AI_GATEWAY environment variable when available
- **Rapid Development**: Keep the leaky abstractions of AI models & prompting outside of the application code

## Installation

```bash
pnpm add ai-functions
```

## Usage

### Basic Usage

```typescript
import { ai, list, markdown } from 'ai-functions'

// Generate text using template literals
const text = await ai`Write a short story about a robot`

// Generate a list of items
const items = await list`List 5 programming languages`

// Generate markdown content
const markdown = await markdown`Create a README for a TypeScript library`
```

### No Schema

```typescript
import { ai } from 'ai-functions'

const storyBrand = await ai.defineLeanCanvas({ guide: 'Vercel' })
```

### Dynamic Function Calls

```typescript
import { ai } from 'ai-functions'

// Call any function name with parameters
const categories = await ai.categorizeProduct({
  name: 'Product name',
  description: 'Product description'
})

// Parameters are used to generate a schema for validation
const blogPost = await ai.writeBlogPost({
  title: 'Blog post title',
  keywords: 'comma, separated, keywords',
  tone: 'professional'
})
```

### With Schema

```typescript
import { ai } from 'ai-functions'
import { z } from 'zod'

// Define a schema for validation
const schema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string())
})

// Generate content with schema validation
const post = await ai`Write a blog post about AI`({
  schema,
  temperature: 0.7
})

// Complex schema example
const storyBrand = await ai.createStoryBrand({ guide: 'Cloudflare' }, {
  hero: 'the customer and what they want',
  problem: {
    external: 'tangible external challenge the hero faces',
    internal: 'emotional/psychological frustration caused by the external problem',
    philosophical: 'why this problem is unjust or wrong at a deeper level',
    villain: 'the antagonist or source of the problem',
  },
  guide: 'how the company positions itself as an empathetic, authoritative guide',
  plan: ['clear, actionable steps the guide provides to solve the problem'],
  callToAction: {
    direct: 'primary action the hero should take (buy now, sign up, etc.)',
    transitional: 'lower-commitment action to build trust (download guide, free trial, etc.)',
  },
  stakes: `what the hero risks losing if they don't act`,
  failure: `negative consequences if the hero doesn't follow the plan`,
  success: 'positive outcome the hero will experience after following the plan',
  transformation: 'how the hero changes from beginning to end of their journey',
  brandScript: 'condensed version of the entire StoryBrand narrative',
})
```

### Configuration

```typescript
import { ai } from 'ai-functions'

// Override model, temperature, and other settings
const text = await ai`Write a poem about the ocean`({
  model: 'gpt-4o',
  temperature: 0.9,
  maxTokens: 500
})

// Advanced configuration with system prompt
const functionDefinition = await ai.developFunction({ name: 'fizzBuzz' }, {
  type: 'Typescript type for the function with JSDoc comments',
  tests: 'Vitest unit tests (assume the function is already in scope, along with `describe`, `it`, and `expect`)',
  code: 'Typescript code implementing the function',
}, {
  system: 'You are an expert Typescript developer. Your formatting preferences are { tabWidth: 2, singleQuote: true, semi: false }',
  model: 'o3-mini-high',
  temperature: 1.0,
})
```

## License

MIT

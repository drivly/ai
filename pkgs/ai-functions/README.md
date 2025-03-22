# ai-functions

[![npm version](https://badge.fury.io/js/ai-functions.svg)](https://www.npmjs.com/package/ai-functions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful TypeScript library for building AI-powered applications with template literals and structured outputs. Uses `ai` SDK with the `llm.do` provider and `frontier` meta-model by default.

## Features

- Rapidly develop AI-powered applications
- Keep the leaky abstractions of AI models & prompting outside of the application code
- Prototype without a defined schema to see what the AI returns
- 


## Installation

```bash
pnpm add ai-functions
```

## Usage

### No Schema

```typescript
import { ai } from 'ai-functions'

const storyBrand = await ai.defineLeanCanvas({ guide: 'Vercel' })
```

### With Schema

```typescript
import { ai } from 'ai-functions'

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

## Passing Settings

```typescript
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


# AI Functions

> **Elegant, type-safe AI functions that deliver predictable results**

## Overview

AI Functions is a TypeScript library that provides strongly-typed interfaces to AI capabilities, transforming unpredictable AI outputs into reliable, deterministic components for your applications. It enables you to create elegant, type-safe interfaces to AI capabilities that seamlessly integrate with your existing codebase.

## Features

- **Dynamic AI Functions**: Use any function name with the `ai` proxy
- **Template Literals**: Generate content using template literals
- **No-Schema Support**: Generate unstructured text responses without schema validation
- **Schema Support**: Validate AI responses with Zod schemas and descriptions
- **List Generation**: Generate lists of items with the `list` function
- **Markdown Generation**: Generate markdown content with the `markdown` function
- **Model Configuration**: Override model, temperature, and other settings
- **Environment Awareness**: Automatically uses AI_GATEWAY environment variable when available
- **Multiple Invocation Patterns**: Choose the syntax that fits your coding style
- **Type-Safe Interfaces**: Get predictable, structured outputs that match your schemas
- **Elegant API Design**: Clean, intuitive interfaces that prioritize developer experience

## Installation

```bash
npm install @drivly/ai-functions
```

## Usage

### Basic Usage

```typescript
import { ai } from '@drivly/ai-functions'

// Generate text using template literals
const text = await ai`Write a short story about a robot`

// Generate a list of items
const items = await list`List 5 programming languages`

// Generate markdown content
const markdown = await markdown`
Create a README for a TypeScript library
`
```

## Creating Custom Functions with `AI`

The `AI` function provides an elegant way to define custom AI functions with type-safe schemas:

```typescript
import { AI } from '@drivly/ai-functions'

// Define custom AI functions with type-safe schemas
export const ai = AI({
  // Book Proposal Generator
  createBookProposal: {
    title: 'proposed title of the book',
    subtitle: 'proposed subtitle of the book',
    author: 'name of the author',
    targetAudience: ['primary audience segments for the book'],
    marketAnalysis: 'analysis of the current market for this type of book',
    competitiveBooks: ['list of similar books in the market'],
    uniqueSellingPoints: ['what makes this book different and valuable'],
    keyTakeaways: ['main insights readers will gain'],
    marketingPotential: 'assessment of marketing opportunities',
    coverDescription: 'visual description of potential cover design',
    estimatedWordCount: 'approximate word count for the entire book',
    estimatedTimeToComplete: 'timeline for completing the manuscript',
    summary: 'one paragraph summary of the book concept',
  },
})
```

## Business Applications

AI Functions enables elegant solutions for common business challenges:

```typescript
import { ai } from '@drivly/ai-functions'

// Generate a StoryBrand framework with a single function call
const storyBrand = await ai.storyBrand({ guide: 'aws.amazon.com' })

console.log(storyBrand)
// {
//   productName: 'AWS',
//   hero: 'Businesses looking to innovate and scale their operations efficiently',
//   problem: {
//     external: 'Managing complex IT infrastructure is costly and time-consuming',
//     internal: 'Fear of falling behind competitors technologically',
//     philosophical: 'Believing innovation should be accessible to all businesses',
//     villain: 'Legacy infrastructure constraints and technical debt'
//   },
//   guide: 'AWS positions itself as an experienced guide with unparalleled expertise in cloud solutions',
//   plan: ['Start with a free tier to explore services',
//          'Consult with AWS solutions architects',
//          'Implement scalable infrastructure based on business needs',
//          'Optimize costs with pay-as-you-go model'],
//   callToAction: 'Sign up for AWS Free Tier today',
//   success: 'Businesses innovate faster, reduce costs, and scale globally without infrastructure limitations',
//   failure: 'Companies struggle with outdated infrastructure, higher costs, and inability to compete in the digital economy',
//   messagingExamples: ['Build on the broadest and deepest cloud platform',
//                       'Innovate faster with the right tools for every workload',
//                       'Pay only for what you use with no upfront costs']
// }
```

### Dynamic Function Calls

```typescript
import { ai } from '@drivly/ai-functions'

// Call any function name with parameters
const categories = await ai.categorizeProduct({
  name: 'Product name',
  description: 'Product description',
})

// Parameters are used to generate a schema for validation
const blogPost = await ai.writeBlogPost({
  title: 'Blog post title',
  keywords: 'comma, separated, keywords',
  tone: 'professional',
})
```

You can also use function calls with schema for structured output:

```typescript
import { ai } from '@drivly/ai-functions'

// Function call with schema for structured output
const leanCanvas = await ai.leanCanvas(
  { company: 'Cloudflare' },
  {
    productName: 'name of the product or service',
    problem: ['top 3 problems the product solves'],
    solution: ['top 3 solutions the product offers'],
    uniqueValueProposition: 'clear message that states the benefit of your product',
    unfairAdvantage: 'something that cannot be easily copied or bought',
    customerSegments: ['list of target customer segments'],
    keyMetrics: ['list of key numbers that tell you how your business is doing'],
    channels: ['path to customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
  },
)
```

### Schema Support

```typescript
import { ai } from '@drivly/ai-functions'
import { z } from 'zod'

// Define a schema for validation
const schema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
})

// Generate content with schema validation
const post = await ai`Write a blog post about AI`({
  schema,
  temperature: 0.7,
})
```

### Configuration

```typescript
import { ai } from '@drivly/ai-functions'

// Override model, temperature, and other settings
const text = await ai`Write a poem about the ocean`({
  model: 'gpt-4o',
  temperature: 0.9,
  maxTokens: 500,
})
```

## License

MIT

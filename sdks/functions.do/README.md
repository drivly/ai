# [functions.do](https://functions.do) - Strongly-Typed AI Functions

[![npm version](https://img.shields.io/npm/v/functions.do.svg)](https://www.npmjs.com/package/functions.do)
[![npm downloads](https://img.shields.io/npm/dm/functions.do.svg)](https://www.npmjs.com/package/functions.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

> **Elegant, type-safe AI functions that deliver predictable results**

## Overview

Functions.do is a core primitive of the [.do](https://dotdo.ai) ecosystem, providing strongly-typed AI functions that transform unpredictable AI capabilities into reliable, deterministic components for your applications. As a foundational building block, it enables you to create elegant, type-safe interfaces to AI capabilities that seamlessly integrate with your existing codebase. For comprehensive documentation, see the [docs directory](./docs/).

## The Challenge

Integrating AI into production systems presents several challenges:

- **Unpredictability**: AI outputs vary, making testing and maintenance difficult
- **Schema Enforcement**: Ensuring AI outputs conform to expected structures
- **Model Selection**: Choosing the right model for each specific task
- **Prompt Engineering**: Creating effective prompts that produce consistent results
- **Type Safety**: Maintaining strong typing across AI interactions

## The Solution

Functions.do creates a clean separation between AI capabilities and application code through an elegant, strongly-typed interface that:

- **Simplifies AI Integration**: Use AI capabilities with the simplicity of function calls
- **Enforces Type Safety**: Get predictable, structured outputs that match your schemas
- **Abstracts Complexity**: Hide model selection, prompt engineering, and configuration details
- **Enables Iteration**: Improve AI performance without changing application code

## Installation

```bash
npm install functions.do
# or
yarn add functions.do
# or
pnpm add functions.do
```

## Key Features

- **Zero-Boilerplate Integration**: Use AI capabilities with minimal code
- **Type-Safe Interfaces**: Get predictable, structured outputs that match your schemas
- **Multiple Invocation Patterns**: Choose the syntax that fits your coding style
- **Schema Enforcement**: Ensure AI outputs conform to your expected data structures
- **Model Abstraction**: Switch between AI models without changing application code
- **Request Throttling**: Control concurrent API requests with configurable limits
- **Elegant API Design**: Clean, intuitive interfaces that prioritize developer experience
- **Research Capabilities**: Perform deep research with specialized functions

## Elegant API Design

The functions.do SDK exports two main components with a focus on simplicity:

- `ai`: A flexible proxy for invoking AI functions with minimal syntax
- `AI`: A function for defining schemas and creating custom AI functions

## Usage Examples

### Using the `ai` Proxy

The `ai` export supports multiple elegant invocation patterns:

#### Tagged Template Literals

```typescript
import { ai } from 'functions.do'

// Simple, intuitive syntax
const summary = await ai`Summarize this article: ${articleText}`

// With configuration
const translation = await ai({ model: 'grok-3' })`Translate to French: ${text}`
```

#### Function Invocation

```typescript
import { ai } from 'functions.do'

// Simple function call without schema
const storyBrand = await ai.storyBrand({ company: 'Vercel' })

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

// Function call with schema and configuration
const blogTitles = await ai.listBlogPostTitles({ topic: 'the future of work' }, ['list SEO-optimized titles'], { model: 'gpt-4.5' })
```

### Creating Custom Functions with `AI`

The `AI` function provides an elegant way to define custom AI functions with specific schemas:

```typescript
import { AI } from 'functions.do'

// Define custom AI functions with type-safe schemas
export const ai = AI({
  // Book Proposal Generator
  createBookProposal: {
    _model: 'claude-3.7-sonnet', // Configuration properties use `_` prefix
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

Functions.do enables elegant solutions for common business challenges:

### StoryBrand Framework

```typescript
import { ai } from 'functions.do'

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

### Content Generation

```typescript
import { ai } from 'functions.do'

// Generate blog post titles with a single function call
const results = await ai.writeBlogPostTitles({
  topic: 'automating business workflows with LLMs',
  audience: 'executives',
  count: 10,
})

console.log(results)
// {
//   blogPostTitles: [
//     '10 Steps to Automate Your Business Workflows with LLMs',
//     'The Executive's Guide to LLM-Powered Process Automation',
//     'Transforming Executive Decision-Making with AI Workflows',
//     'How LLMs Are Revolutionizing C-Suite Productivity',
//     'Strategic Implementation of LLMs: An Executive Roadmap',
//     'Competitive Advantage Through Intelligent Automation',
//     'Measuring ROI on LLM Integration in Enterprise Workflows',
//     'From Boardroom to Automation: The Executive's LLM Playbook',
//     'Scaling Business Operations with AI-Driven Workflow Solutions',
//     'Future-Proofing Your Business with Intelligent LLM Systems'
//   ]
// }
```

### Business Analysis

```typescript
import { AI } from 'functions.do'

// Define custom business analysis functions
const ai = AI({
  createLeanCanvas: {
    problems: ['top 3 problems the business solves'],
    customerSegments: ['target customers and users for the product'],
    uniqueValueProposition: 'clear message that states why you are different',
    solutions: ['outline of the solutions to the identified problems'],
    unfairAdvantage: 'something that cannot be easily copied or bought',
    revenueStreams: ['revenue model, lifetime value, revenue, gross margin'],
    costStructure: ['customer acquisition costs', 'distribution costs', 'hosting'],
    keyMetrics: ['key activities you measure (acquisition, retention, referrals)'],
    channels: ['path to customers (inbound, outbound, viral)'],
    earlyAdopters: 'characteristics of the ideal early adopter',
  },
})

// Generate a lean canvas with a single function call
const results = await ai.createLeanCanvas({ domain: 'aws.amazon.com' })
```

## Elegant Configuration

Functions.do provides simple ways to customize AI behavior while maintaining clean code:

```typescript
import { ai } from 'functions.do'

// Generate landing page content with elegant configuration
const landingPage = await ai.generateLandingPage(
  // Input data
  {
    brand: 'Functions.do',
    idea: 'AI-powered Functions-as-a-Service',
  },
  // Output schema
  {
    headline: 'attention-grabbing headline that clearly states value proposition',
    subheadline: 'supporting statement that adds clarity to the headline',
    productDescription: 'concise explanation of what the product does',
    keyFeatures: ['list of main features or benefits'],
    socialProof: ['testimonials, user counts, or other trust indicators'],
    callToAction: 'primary button text and action',
  },
  // Configuration options
  {
    model: 'anthropic/claude-3.7-sonnet:thinking',
    system: 'You are an expert at generating marketing copy for startups',
    temperature: 1.0,
    seed: 1741452228,
  },
)
```

## Function Types

functions.do supports multiple function types for different use cases:

1. **Generation Functions** - AI-powered functions that generate output based on input and prompts

   - Format options: Object, ObjectArray, Text, TextArray, Markdown, Code
   - Example: Content generation, data transformations, creative tasks

2. **Research Functions** - Specialized functions for deep research capabilities

   - Example: Topic research, company analysis, personal background research
   - Integrated with research.do for comprehensive research capabilities:

     ```typescript
     const researchResult = await ai.research({
       topic: 'Quantum computing advancements',
       depth: 'deep',
       format: 'markdown',
     })

     const companyInfo = await ai.researchCompany({
       company: 'Tesla',
     })
     ```

3. **Code Functions** - Functions that execute predefined code

   - Example: Custom data processing, calculations, specialized transformations

4. **Human Functions** - Tasks assigned to specific human users or roles

   - Example: Manual review tasks, approval processes, expert input
   - Supports Slack Blocks schema for rich interactive messages:
     ```typescript
     const humanFeedback = await ai.humanFeedback({
       title: 'Product Feedback Request',
       blocks: {
         productType: 'API',
         customer: 'enterprise developers',
         solution: 'simplified AI integration',
         description: 'Streamlined API for AI function integration',
       },
       options: ['Approve', 'Reject'],
       freeText: true,
     })
     ```

5. **Agent Functions** - Functions that delegate to autonomous agents
   - Example: Persistent tasks, continuous monitoring, complex workflows

## Creating Functions Programmatically

When creating a function via the SDK, you can specify the type and related properties:

```typescript
const myFunction = await functionsClient.create({
  name: 'analyzeData',
  type: 'Generation',
  format: 'Object',
  schema: {
    /* your schema here */
  },
  prompt: 'Analyze the following data and extract key insights',
})
```

## Testing

The SDK includes both unit tests and end-to-end tests.

### Running Unit Tests

Unit tests verify the SDK's functionality without requiring API access:

```bash
pnpm test
```

### Running End-to-End Tests

E2E tests verify integration with the actual API and require an API key:

```bash
# Set API key as environment variable
export FUNCTIONS_DO_API_KEY=your_api_key

# Run e2e tests
pnpm test:e2e
```

End-to-end tests will be skipped if no API key is provided.

## Integration with the [.do](https://dotdo.ai) Ecosystem

Functions.do is a core primitive of the [.do](https://dotdo.ai) ecosystem, designed to work seamlessly with other .do services:

- **[apis.do](https://apis.do)** - The foundational SDK and unified API Gateway
- **[research.do](https://research.do)** - Deep research capabilities powered by functions.do
- **[workflows.do](https://workflows.do)** - Business process orchestration
- **[agents.do](https://agents.do)** - Autonomous digital workers
- **[database.do](https://database.do)** - AI-native data layer

## License

[MIT](https://opensource.org/licenses/MIT)

## Request Throttling

Functions.do provides built-in request throttling to manage concurrent API requests:

```typescript
import { FunctionsClient } from 'functions.do'

// Initialize client with custom concurrency limit
const client = new FunctionsClient({
  apiKey: 'your_api_key',
  concurrency: 10, // Default is 50 if not specified
})

// Dynamically adjust concurrency limit
client.setConcurrencyLimit(20)

// Wait for all queued requests to complete
await client.waitForAll()
```

The throttling system automatically queues requests when the concurrency limit is reached, ensuring optimal performance without overwhelming the API.

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the [.do](https://dotdo.ai) ecosystem
- [p-queue](https://www.npmjs.com/package/p-queue) - Promise queue with concurrency control

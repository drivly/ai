# Functions.do Usage Examples

This document provides practical examples of using Functions.do in various scenarios, demonstrating different invocation patterns and function types.

## Tagged Template Literals

Tagged template literals provide an elegant, intuitive syntax for invoking AI functions.

### Basic Usage

```typescript
import { ai } from 'functions.do'

// Simple, intuitive syntax
const summary = await ai`Summarize this article: ${articleText}`

// With configuration
const translation = await ai({ model: 'grok-3' })`Translate to French: ${text}`
```

### Multiple Inputs

```typescript
import { ai } from 'functions.do'

// Multiple inputs in a template
const comparison = await ai`Compare ${productA} and ${productB} based on ${criteria}`
```

## Function Invocation

Function invocation patterns provide a more structured approach with explicit arguments.

### Simple Function Call

```typescript
import { ai } from 'functions.do'

// Simple function call without schema
const storyBrand = await ai.storyBrand({ company: 'Vercel' })
```

### Function Call with Schema

```typescript
import { ai } from 'functions.do'

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
    keyMetrics: ['key numbers that tell you how your business is doing'],
    channels: ['path to customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
  },
)
```

### Function Call with Schema and Configuration

```typescript
import { ai } from 'functions.do'

// Function call with schema and configuration
const blogTitles = await ai.listBlogPostTitles(
  { topic: 'the future of work' },
  ['list SEO-optimized titles'],
  { model: 'gpt-4.5' }
)
```

## Creating Custom Functions with `AI`

The `AI` function provides an elegant way to define custom AI functions with specific schemas.

### Basic Custom Function

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

### Multiple Custom Functions

```typescript
import { AI } from 'functions.do'

// Define multiple custom functions
const ai = AI({
  generateBusinessEmail: {
    subject: 'email subject line',
    body: 'email body text',
    tone: 'tone of the email (formal, friendly, etc.)',
  },
  
  createMarketingCampaign: {
    campaignName: 'name of the marketing campaign',
    targetAudience: ['description of the target audience segments'],
    keyMessages: ['key messages for the campaign'],
    channels: ['marketing channels to use'],
    budget: 'estimated budget for the campaign',
    timeline: 'timeline for the campaign execution',
    successMetrics: ['metrics to measure campaign success'],
  },
})
```

## Business Applications

Functions.do enables elegant solutions for common business challenges.

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
```

## Configuration Options

Functions.do provides simple ways to customize AI behavior while maintaining clean code.

### Configuration Object

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

Functions.do supports multiple function types for different use cases.

### Generation Functions

AI-powered functions that generate output based on input and prompts.

```typescript
import { functionsClient } from 'functions.do'

const myGenerationFunction = await functionsClient.create({
  name: 'analyzeData',
  type: 'Generation',
  format: 'Object',
  schema: {
    insights: 'key insights from the data',
    trends: ['notable trends identified'],
    recommendations: ['actionable recommendations based on data'],
  },
  prompt: 'Analyze the following data and extract key insights, trends, and provide actionable recommendations',
})
```

### Code Functions

Functions that execute predefined code.

```typescript
import { functionsClient } from 'functions.do'

const myCodeFunction = await functionsClient.create({
  name: 'calculateMetrics',
  type: 'Code',
  code: `
    const averageValue = input.values.reduce((sum, val) => sum + val, 0) / input.values.length;
    const maxValue = Math.max(...input.values);
    const minValue = Math.min(...input.values);
    
    return {
      average: averageValue,
      max: maxValue,
      min: minValue,
      range: maxValue - minValue,
    };
  `,
})
```

### Human Functions

Tasks assigned to specific human users or roles.

```typescript
import { ai } from 'functions.do'

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

### Agent Functions

Functions that delegate to autonomous agents.

```typescript
import { functionsClient } from 'functions.do'

const myAgentFunction = await functionsClient.create({
  name: 'monitorSystem',
  type: 'Agent',
  agent: 'system-monitor',
})
```

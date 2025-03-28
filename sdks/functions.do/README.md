# functions.do

AI is transforming businesses but integrating LLMs into existing systems presents challenges due to the clash between AI's non-deterministic nature and traditional software's deterministic characteristics.

Key challenges include:

- **Reliability**: AI's unpredictable outputs complicate testing and maintenance
- **Accuracy**: Models can hallucinate or produce incorrect information
- **Model Selection**: Balancing capabilities, speed, and cost across rapidly evolving models
- **Prompt Engineering**: More art than science, difficult to standardize
- **Configuration**: Complex parameter interactions require careful tuning

## The Solution

functions.do creates a clean separation between AI capabilities and application code through strongly-typed interfaces that hide model complexities, enabling:

- Rapid prototyping of AI applications
- Continuous improvement without disrupting application code
- Comprehensive evaluation and optimization strategies

## Installation

```bash
npm install functions.do
# or
yarn add functions.do
# or
pnpm add functions.do
```

## API Overview

The functions.do SDK exports two main components:

- `ai`: A flexible proxy for invoking AI functions with various patterns
- `AI`: A function for defining schemas and creating custom AI functions

## Usage Examples

### Using the `ai` Proxy

The `ai` export is a versatile proxy that supports multiple invocation patterns:

#### Tagged Template Literals

```typescript
import { ai } from 'functions.do'

// Basic usage
const result = await ai`Summarize this article: ${articleText}`

// With configuration
const configuredResult = await ai({ model: 'grok-3' })`Translate this to French: ${text}`
```

#### Function Invocation

```typescript
import { ai } from 'functions.do'

// Simple function call without schema
const storyBrand = await ai.storyBrand({ company: 'Vercel' })

// Function call with schema (structured output)
const leanCanvas = await ai.leanCanvas({ company: 'Cloudflare' }, {
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
  recommendations: ['list of recommendations based on the analysis'],
})

// Function call with schema and AI configuration
const blogTitles = await ai.listBlogPostTitles(
  { topic: 'the future of work post-API' },
  ['list SEO-optimized titles'],
  { model: 'gpt-4.5' }
)
```

### Using the `AI` Function

The `AI` function allows you to define custom AI functions with specific schemas:

```typescript
import { AI } from 'functions.do'

// Define a custom AI function with book proposal schema
export const ai = AI({
  // Book Proposal - Initial concept and outline
  createBookProposal: {
    _model: 'claude-3.7-sonnet', // config props are pre-pended with `_`
    title: 'proposed title of the book',
    subtitle: 'proposed subtitle of the book',
    author: 'name of the author',
    targetAudience: ['primary audience segments for the book'],
    marketAnalysis: 'analysis of the current market for this type of book',
    competitiveBooks: ['list of similar books in the market'],
    uniqueSellingPoints: ['what makes this book different and valuable'],
    keyTakeaways: ['main insights readers will gain'],
    marketingPotential: 'assessment of marketing opportunities',
    coverDescription: 'visual description of the layout and image of the book cover',
    estimatedWordCount: 'approximate word count for the entire book',
    estimatedTimeToComplete: 'timeline for completing the manuscript',
    summary: 'one paragraph summary of the book concept',
  }
})
```

## Real-World Examples

### StoryBrand Framework

```typescript
import { ai } from 'functions.do'

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

### Blog Post Title Generation

```typescript
import { ai } from 'functions.do'

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

### Custom Schema Definition

```typescript
import { AI } from 'functions.do'

const ai = AI({
  createLeanCanvas: {
    problems: ['top 3 problems the business solves'],
    customerSegments: ['target customers and users for the product'],
    uniqueValueProposition: 'clear and compelling message that states why you are different and worth buying',
    solutions: ['outline of the solutions to the identified problems'],
    unfairAdvantage: 'something that cannot be easily copied or bought',
    revenueStreams: ['revenue model, lifetime value, revenue, gross margin'],
    costStructure: ['customer acquisition costs', 'distribution costs', 'hosting', 'people', 'etc.'],
    keyMetrics: ['key activities you measure (acquisition, retention, referrals, etc.)'],
    channels: ['path to customers (inbound, outbound, viral, etc.)'],
    earlyAdopters: 'characteristics of the ideal early adopter',
  },
})

const results = await ai.createLeanCanvas({ domain: 'aws.amazon.com' })
```

## Advanced Configuration

You can override system settings for specific function calls:

```typescript
import { ai } from 'functions.do'

const landingPage = await ai.generateLandingPage(
  {
    brand: 'Functions.do',
    idea: 'AI-powered Functions-as-a-Service',
  },
  {
    headline: 'attention-grabbing headline that clearly states value proposition',
    subheadline: 'supporting statement that adds clarity to the headline',
    productDescription: 'concise explanation of what the product does and its benefits',
    keyFeatures: ['list of main features or benefits'],
    socialProof: ['testimonials, user counts, or other trust indicators'],
    callToAction: 'primary button text and action',
  },
  {
    model: 'anthropic/claude-3.7-sonnet:thinking',
    system: 'You are an expert at generating highly-converting marketing copy for startup landing pages',
    temperature: 1.0,
    seed: 1741452228,
  }
)
```

## Function Types

functions.do supports multiple function types for different use cases:

1. **Generation Functions** - AI-powered functions that generate output based on input and prompts
   - Format options: Object, ObjectArray, Text, TextArray, Markdown, Code
   - Example: Content generation, data transformations, creative tasks

2. **Code Functions** - Functions that execute predefined code
   - Example: Custom data processing, calculations, specialized transformations

3. **Human Functions** - Tasks assigned to specific human users or roles
   - Example: Manual review tasks, approval processes, expert input

4. **Agent Functions** - Functions that delegate to autonomous agents
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

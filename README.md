# [.do](https://dotdo.ai) Business-as-Code

While the cloud enabled Software-as-Software, AI is unlocking [Services-as-Software](https://services.do).

### [Functions.do](https://functions.do) Generate Objects without a Schema

```ts
import { ai } from 'functions.do'

const brand = await ai.storyBrand({ idea: 'Auto Loan Underwriting Services-as-Software' })
```

### [Functions.do](https://functions.do) Generate Text

```ts
const brand = await ai`write a blog post introducing ${idea} and how it will be delivered by ${brand}`
```


### [Functions.do](https://functions.do) Generate Lists

```ts
const titles = await ai.list`${count} possible blog post titles related to ${idea}`

titles.forEach(title => ai`write a blog post starting with "# ${title}"`)
```

### [Functions.do](https://functions.do) Generate Objects with a Type-safe Schema

```ts
import { AI } from 'functions.do'

const ai = AI({
  leanCanvas: {
    productName: 'name of the product or service',
    problem: ['top 3 problems the product solves'],
    solution: ['top 3 solutions the product offers'],
    uniqueValueProposition: 'clear message that states the benefit of your product',
    unfairAdvantage: 'something that cannot be easily copied or bought',
    customerSegments: ['list of target customer segments'],
    keyMetrics: ['list of key numbers that tell you how your business is doing'],
    channels: ['path to acquire customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
  },
})

const businessModel = await ai.leanCanvas({ idea: 'Auto Loan Underwriting Services-as-Software' })
```

### [Agents.do](https://agents.do) Research & Web Browsing

```ts
import { browse, research } from 'agents.do'

const { directories } = await research`website directories for ${topic}`({ directories: [String] })

directories.forEach(directory => browse`${directory}.  Request Agents.do to be added to the directory.`)
```


### [Humans.do](https://humans.do) Tasks in a Workflow

```ts
import { human } from 'humans.do'

const ceo = human({ email: 'sam@openai.com' })

ceo.approveRelease({ product: 'GPT-5' })
```

### [Evals.do](https://evals.do) Measure AI Model Performance

```ts
import { Eval, JSONDiff } from 'evals.do'
import { models } from 'models.do'

Eval('W-2 OCR', {

  // compare different models
  models: models({ capability: 'vision' }),

  // calculate all variations of inputs
  inputs: async () => cartesian({
    image:[1, 2, 3, 4, 5, 6], 
    blur:[0, 1, 2, 3], 
    res:[512, 768, 1536, 2000, 3072],
  }).map(({image, blur, res}) => ({ image: `https://…/w2_img${image}_blur${blur}_res${res}.jpg` })),

  // run 3 times for each input
  seeds: 3, 
  prompt: 'Extract the data from the image.',
  temperature: 0,
  expected: expectedOutput,
  schema : W2,
  scorers : [JSONDiff],             
})
```

### [Experiments.do](https://experiments.do) Rapid Evaluation & Iteration

```ts
import { ai } from 'functions.do'
import { db } from 'database.do'
import { Battle } from 'evals.do'
import { Experiment } from 'experiments.do'

Experiment({
  models: [
    'openai/gpt-4.1',
    'openai/gpt-4.1-mini',
    'openai/gpt-4.5-preview',
    'google/gemini-2.5-pro-preview-03-25',
    'google/gemini-2.5-flash-preview',
    'google/gemini-2.0-flash',
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3.5-sonnet',
    'meta-llama/llama-4-maverick',
    'meta-llama/llama-4-scout',
    'x-ai/grok-3-beta',
    'x-ai/grok-3-mini-beta',
  ],
  temperature: [0.7, 0.8, 0.9, 1],
  system: [
    'You are an expert at writing compelling and SEO-optimized site content',
    'You are an expert at content marketing for idea-stage startups',
    'You are a YC Group Partner having office hours with one of your startups',
  ],
  inputs: db.ideas.find({ status: 'waitlist' }),
  task: ai.generateLandingPage({
    hero: {
      headline: 'compelling & conversion optimized headline (7-10 words)',
      subhead: 'compelling & conversion optimized subhead (1-2 sentences)',
      badge: '3-word eyebrow text above hero headline',
    },
    benefits: [{
      title: '3-4 word high-level overview of the benefit',
      description: '2 sentence detailed description',
    }],
    faqs: [{
      question: '6-8 word question',
      answer: '2-3 sentence answer',
    }],
  })
  scorer: [Battle],
})
```

### [Agents.do](https://agents.do) Autonomous Work

```typescript
import { AI } from 'workflows.do'

export default AI({
  onUserSignup: async ({ ai, api, db, event }) => {
    const { name, email, company } = event

    // Enrich content details with lookup from external data sources
    const enrichedContact = await api.apollo.search({ name, email, company })
    const socialProfiles = await api.peopleDataLabs.findSocialProfiles({ name, email, company })
    const githubProfile = socialProfiles.github ? await api.github.profile({ name, email, company, profile: socialProfiles.github }) : undefined

    // Using the enriched contact details, do deep research on the company and personal background
    const companyProfile = await ai.researchCompany({ company })
    const personalProfile = await ai.researchPersonalBackground({ name, email, enrichedContact })
    const socialActivity = await ai.researchSocialActivity({ name, email, enrichedContact, socialProfiles })
    const githubActivity = githubProfile ? await ai.summarizeGithubActivity({ name, email, enrichedContact, githubProfile }) : undefined

    // Schedule a highly personalized sequence of emails to optimize onboarding and activation
    const emailSequence = await ai.personalizeEmailSequence({ name, email, company, personalProfile, socialActivity, companyProfile, githubActivity })
    await api.scheduleEmails({ emailSequence })

    // Summarize everything, save to the database, and post to Slack
    const details = { enrichedContact, socialProfiles, githubProfile, companyProfile, personalProfile, socialActivity, githubActivity, emailSequence }
    const summary = await ai.summarizeContent({ length: '3 sentences', name, email, company, ...details })
    const { url } = await db.users.create({ name, email, company, summary, ...details })
    await api.slack.postMessage({ channel: '#signups', content: { name, email, company, summary, url } })
  },
})
```

## [Functions.do](https://functions.do) - Rapid AI Function Prototyping

The `ai` object lets you call any arbitrary function like `ai.researchCompany({ company })`, `ai.summarizeContent({ content })`, `ai.doSomething({ task: 'write a snake game in HTML & vanilla JavaScript' })` and an object will be returned. This can be very helpful during development or to even just see what is the schema that the AI wants to return. Additionally, [functions.do](https://functions.do) can observe the schemas returned over time, and will automatically propose possible schemas to lock in a guaranteed return type.

```typescript
import { ai } from 'functions.do'

const titles = await ai.listBlogPostTitles({ topic: 'AGI Wrappers', tone: 'Clickbait Meme' })
const research = await ai.researchCompany({ company }, { model: 'perplexity/sonar-deep-research' }) // specify a particular model
```

## [Functions.do](https://functions.do) - Structured AI Outputs

We believe that your business and application code should not be complicated by the leaky abstractions of AI frameworks. With new models being released daily, you shouldn't put the model, prompts, or settings (like temperature, topP, topK, etc) in your code as the only thing that matters to your application is the return type of the output. On the backend, [functions.do](https://functions.do) will handle evaluating the model selection, experimenting with prompt engineering, and configuring the settings optimized for your model and use case, as well by specifying the business priorities. Do you want the most intelligent model no matter how expensive or slow it is? Do you need the lowest latency of time-to-first-token, the highest throughput of tokens per second, or the lowest cost? Or do you want the best frontier model under a specific price point? [Functions.do](https://functions.do) will handle all of this for you.

```typescript
import { AI } from 'functions.do'

const ai = AI({
  leanCanvas: {
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
  },
})

const brand = await ai.storyBrand({
  idea: 'Agentic Workflow Platform',
  icp: 'Alpha Devs & Empowered CTOs',
})

console.log(brand)
// {
//   storyBrand: {
//     hero: {
//       identity: 'Alpha developers and empowered CTOs',
//       desire: 'To effortlessly build and deploy intelligent, scalable, agent-driven workflows'
//     },
//     problem: {
//       external: 'Current workflow solutions lack flexibility, autonomy, and speed.',
//       internal: 'Frustrated by bottlenecks, repetitive tasks, and slow development cycles.',
//       philosophical: 'Innovative developers and CTOs deserve tools designed to empower, not constrain.',
//       villain: 'Leaky abstractions',
//     },
//     guide: {
//       empathy: 'We understand the frustration of wasting your team\'s talent on mundane tasks.',
//       authority: 'Workflows.do is trusted by leading tech teams to automate millions of critical tasks with ease.'
//     },
//     plan: {
//       step1: 'Design workflows easily with our intuitive, agentic builder.',
//       step2: 'Deploy seamlessly to a scalable, fully-managed runtime.',
//       step3: 'Monitor and optimize workflows with powerful observability tools.'
//     },
//     callToAction: {
//       direct: 'Request Early Access',
//       transitional: 'Learn More'
//     },
//     failure: [
//       'Remain stuck with inefficient manual workflows.',
//       'Lose competitive advantage due to slower innovation.',
//       'Experience burnout and high turnover of talented developers.'
//     ],
//     success: [
//       'Launch sophisticated workflows quickly, without friction.',
//       'Free your team from repetitive tasks to focus on high-value innovation.',
//       'Accelerate your organization\'s growth and competitive edge.'
//     ],
//     transformation: {
//       from: 'Overwhelmed by rigid, manual processes slowing innovation',
//       to: 'Empowered to rapidly deploy autonomous workflows that drive innovation and growth'
//     },
//     oneLiner: 'Workflows.do empowers alpha devs and visionary CTOs to effortlessly create autonomous workflows, unlocking next-level productivity and innovation.'
//   }
// }
```

Even though [functions.do](https://functions.do) will manage the model selection, prompt engineering, and settings optimization for you, by specifying business priorities, you can still store the configuration and prompts in your codebase with our CLI and/or Github integration. A folder called `.ai` can be created in the root of your project and contain the configuration and prompts for your functions.

You can call:

```bash
# Initialize a new project
npx functions.do init

# Pull your configuration and prompts from the functions.do cloud
npx functions.do pull

# Push your configuration and prompts to the functions.do cloud
npx functions.do push
```

Here is the format of the local `.ai/functions.ts` file (and it will also generate a `.ai/functions.d.ts` file):

```typescript
import { AI } from 'functions.do'

export default AI({
  ...
})
```

## [APIs.do](https://apis.do) - Clickable Developer Experiences

By visiting https://apis.do in a browser with a [JSON Plugin](https://apis.do/docs#browser-plugins), you can explore all available APIs and their capabilities without having to deal with complex API documentation, curl commands, or verbose SDK implementations. The elegant, clickable interface provides a seamless developer experience.

```json
{
  "api": {
    "name": "apis.do",
    "description": "Economically valuable work delivered through simple APIs",
    "home": "https://apis.do",
    "login": "https://apis.do/login",
    "signup": "https://apis.do/signup",
    "admin": "https://apis.do/admin",
    "docs": "https://apis.do/docs",
    "repo": "https://github.com/drivly/ai",
    "with": "https://apis.do",
    "from": "https://agi.do"
  },
  "ai": {
    "Functions - Typesafe Results without Complexity": "https://functions.do/api",
    "Workflows - Reliably Execute Business Processes": "https://workflows.do/api",
    "Agents - Deploy & Manage Autonomous Digital Workers": "https://agents.do/api"
  },
  "data": {
    "Nouns - Categories or Types of Things": "https://nouns.do",
    "Verbs - Actions That Can Be Performed": "https://verbs.do",
    "Resources - Instances of Nouns in Your System": "https://resources.do",
    "Actions - Subject-Predicate-Object Relationships": "https://actions.do"
  },
  "events": {
    "Triggers - Initiate workflows based on events": "https://triggers.do",
    "Searches - Query and retrieve data": "https://searches.do",
    "Actions - Perform tasks within workflows": "https://actions.do"
  },
  "core": {
    "LLM - Intelligent AI Gateway": "https://llm.do",
    "Evals - Evaluate Functions, Workflows, and Agents": "https://evals.do",
    "Analytics - Economically Validate Workflows": "https://analytics.do",
    "Experiments - Economically Validate Workflows": "https://experiments.do",
    "Database - AI Native Data Access (Search + CRUD)": "https://database.do",
    "Integrations - Connect External APIs and Systems": "https://integrations.do"
  },
  "user": {
    "email": "agents@agi.do"
  }
}
```

## [Agents.do](https://agents.do) - Autonomous Digital Workers

Agents.do provides a powerful framework for creating, deploying, and managing autonomous digital workers that can perform complex tasks with minimal human intervention. These agents can handle routine operations, make decisions based on predefined criteria, and adapt to changing conditions.

```typescript
import { Agent } from 'agents.do'

// Create a customer support agent
const customerSupportAgent = Agent({
  name: 'Amy',
  role: 'Customer Support Agent',
  job: 'Handles customer inquiries and resolves common issues',
  url: 'https://amy.do',
  integrations: ['chat', 'slack', 'email', 'zendesk', 'shopify'],
  triggers: ['onTicketCreated', 'onMessageReceived'],
  searches: ['FAQs', 'Tickets', 'Orders', 'Products', 'Customers'],
  actions: ['sendMessage', 'updateOrder', 'refundOrder', 'resolveTicket', 'escalateTicket'],
  kpis: ['ticketResponseTime', 'ticketResolutionTime', 'ticketEscalationRate', 'customerSatisfaction'],
})
```

## [Integrations.do](https://integrations.do) - Connect Your Apps

Integrations.do provides a seamless way to connect your AI applications with external systems, APIs, and services. It enables you to extend your workflows with powerful integrations that enhance functionality and automate processes across your entire tech stack.

## [Triggers.do](https://triggers.do) - Start Business Processes

Triggers.do provides a powerful framework for initiating workflows based on various events. It enables you to create event-driven architectures that respond automatically to changes in your business environment, ensuring timely execution of critical processes.

## [Searches.do](https://searches.do) - Provide Context & Understanding

Searches.do provides a unified interface for powerful data retrieval across various sources. It enables you to find relevant information quickly and efficiently, providing the context needed for intelligent decision-making in your AI applications.

## [Actions.do](https://actions.do) - Impact the External World

Actions.do provides a powerful framework for defining and executing operations that interact with external systems. It enables you to create reusable, composable actions that can be triggered from your workflows to create real-world impact.

## [Nouns.do](https://nouns.do) - Entities in Your Business

Nouns.do provides a powerful framework for defining and managing the entities that make up your business domain. It enables you to create a structured representation of your business objects and their relationships.

## [Verbs.do](https://verbs.do) - Represent Potential Actions

Verbs.do provides a powerful framework for defining and managing the actions that can be performed within your business domain. It enables you to create a structured representation of operations that connect entities and drive business processes.

## Core Data Model

Our platform is built on a semantic data model inspired by basic English grammar, making it intuitive and approachable:

- **[Nouns](https://nouns.do)** - Categories or types of things in your system (like Customer, Product, Order)
- **[Verbs](https://verbs.do)** - Actions that can be performed (like Create, Update, Delete)
- **[Resources](https://resources.do)** - Specific instances of Nouns (a particular Customer, Product, or Order)
- **[Actions](https://actions.do)** - Relationships between Resources in Subject-Predicate-Object format

This simple but powerful model follows the natural language pattern of Subject-Predicate-Object (like "Customer purchased Product"). Every Action in the system connects a Subject (a Resource) with an Object (another Resource) through a Predicate (a Verb), creating a semantic triple that represents a meaningful business event or relationship.

## [Resources.do](https://resources.do) - Instances of Nouns

Resources.do provides a powerful framework for modeling and managing specific instances of Nouns in your business domain. It enables you to create, track, and manipulate the actual entities that your business interacts with.

## [Database.do](https://database.do) - AI-enriched Data

```typescript
import { DB } from 'database.do'

const db = DB({
  posts: {
    title: 'text',
    content: 'richtext',
    status: 'Draft | Published | Archived', // Select field with predefined options
    contentType: 'Text | Markdown | Code | Object | Schema', // Another select field example
    tags: 'tags[]',
    author: 'authors',
  },
  tags: {
    name: 'text',
    posts: '<-posts.tags', // Join field to posts (reverse relation)
  },
  authors: {
    name: 'text',
    email: 'email',
    role: 'Admin | Editor | Writer', // Select field with predefined options
    posts: '<-posts.author', // Join field to posts (reverse relation)
  },
})
```

## [Events.do](https://events.do) - Track Business Events

Events.do provides a powerful framework for tracking, analyzing, and responding to business events across your organization. It enables you to create a comprehensive event-driven architecture that captures valuable data about user actions, system operations, and business processes.

```typescript
import { track } from 'events.do'

// Track a user signup event
await track('UserSignup', {
  email: 'user@example.com',
  referrer: 'google',
  campaign: 'spring_promo',
  device: 'mobile',
  browser: 'chrome',
})
```

## [Experiments.do](https://experiments.do) - Iterate & Improve

Experiments.do provides a powerful framework for testing hypotheses, measuring outcomes, and iteratively improving your AI applications. It enables you to run controlled experiments to validate ideas, optimize performance, and make data-driven decisions.

## [Benchmarks.do](https://benchmarks.do) - Compare Models

Benchmarks.do provides a powerful framework for evaluating and comparing AI models across various dimensions. It enables you to make informed decisions about which models to use for different tasks based on objective performance metrics.

## [Evals.do](https://evals.do) - Measure & Improve

Evals.do provides a powerful framework for evaluating the performance and quality of your AI applications. It enables you to systematically assess model outputs, function results, and workflow outcomes to ensure they meet your business requirements.

## [Traces.do](https://traces.do) - Debug & Understand

Traces.do provides a powerful framework for capturing, visualizing, and analyzing the execution of your AI applications. It enables you to understand how your functions, workflows, and agents operate, making it easier to debug issues and optimize performance.

## [LLM.do](https://llm.do) - Intelligent AI Gateway

LLM.do provides a powerful gateway for routing AI requests to the optimal language models based on capabilities, cost, and performance requirements. It enables you to leverage the best AI models for each specific task without being locked into a single provider.

## [Analytics.do](https://analytics.do) - Measure Business Impact

Analytics.do provides a powerful framework for measuring and analyzing the business impact of your AI applications. It enables you to track key metrics, visualize performance trends, and make data-driven decisions about your AI investments.

## [AGI.do](https://agi.do) Economically Valuable Work

AGI.do provides a powerful framework for creating and deploying advanced AI systems that can perform economically valuable work across various domains. It enables you to build sophisticated AI applications that deliver measurable business value through automation, optimization, and intelligent decision-making.

# [.do](https://dotdo.ai) Business-as-Code

While the cloud enabled Software-as-Software, AI is unlocking [Services-as-Software](https://services.do).

### [Functions.do](https://functions.do) Generate Objects without a Schema

```ts
import { ai } from 'functions.do'

const brand = ai.storyBrand({ idea: 'Auto Loan Underwriting Services-as-Software' })
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

const businessModel = ai.leanCanvas({ idea: 'Auto Loan Underwriting Services-as-Software' })
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

Eval('W-2 OCR', {

  // compare different models
  models: [
    'openai/o3',
    'openai/o4-mini',
    'openai/o4-mini-high',
    'openai/gpt-4.1',
    'openai/gpt-4.1-mini',
    'openai/gpt-4.1-nano',
    'google/gemini-2.5-pro-preview-03-25',
    'google/gemini-2.5-flash-preview:thinking',
    'google/gemini-2.5-flash-preview',
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3.7-sonnet:thinking',
    'meta-llama/llama-4-maverick',
    'meta-llama/llama-4-scout',
    'x-ai/grok-3-beta',
    'x-ai/grok-3-mini-beta',
  ],
  

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
import { Agent } from 'agents.do'

// Create a customer support agent
const amy = Agent({
  name: 'Amy',
  url: 'https://amy.do',
  role: 'Customer Support Agent',
  objective: 'Handles customer inquiries and resolves common issues',
  keyResults: ['ticketResponseTime', 'ticketResolutionTime', 'customerSatisfaction'],
  integrations: ['chat', 'slack', 'email', 'zendesk', 'shopify'],
  triggers: ['onTicketCreated', 'onMessageReceived'],
  searches: ['FAQs', 'Tickets', 'Orders', 'Products', 'Customers'],
  actions: ['sendMessage', 'updateOrder', 'refundOrder', 'resolveTicket', 'escalateTicket'],
})
```

### [Workflows.do](https://workflows.do) Scheduled Functions

```typescript
import { every } from 'workflows.do'

every('hour during business hours', async () => {
  const ideas = await db.ideas.find({ status: 'launched' })
  await db.ideas.updateMany({ status: 'launched' }, { status: 'launched' })
})
```

### [Workflows.do](https://workflows.do) Respond to Events

```typescript
import { on } from 'workflows.do'

on('User.Signup', async (event, { ai, api, db }) => {
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
})
```

### [Database.do](https://database.do) Schemaless Collections

```typescript
import { db } from 'database.do'

await db.ideas.create({ idea, businessModel, status: 'waitlist' })

const launchedIdeas = await db.ideas.find({ status: 'launched' })
```

### [Database.do](https://database.do) Integrated Embeddings & Vector Search

```typescript
import { db } from 'database.do'

const ideas = await db.ideas.search('automotive finance')
```

### [Database.do](https://database.do) Schemas & Relationships

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

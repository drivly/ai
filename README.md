# [Workflows.do](https://workflows.do) Business-as-Code


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


## [Functions.do](https://functions.do) Inputs to Structured Outputs

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
  }

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

<details>
## Hello from the inside
</details>

## [APIs.do](https://apis.do) Clickable Developer Experiences

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
  "things": {
    "Nouns - People, Places, Things, and Ideas": "https://nouns.do",
    "Verbs - The Actions Performed to and by Nouns": "https://verbs.do"
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
    "email": "me@agi.do"
  }
}
```



## [Agents.do](https://agents.do) Autonomous Digital Workers

Agents.do provides a powerful framework for creating, deploying, and managing autonomous digital workers that can perform complex tasks with minimal human intervention. These agents can handle routine operations, make decisions based on predefined criteria, and adapt to changing conditions.

```typescript
import { Agent } from 'agents.do'

// Create a customer support agent
const customerSupportAgent = Agent({
  name: 'CustomerSupportAgent',
  description: 'Handles customer inquiries and resolves common issues',
  
  // Define the agent's capabilities
  capabilities: {
    answerProductQuestions: true,
    handleReturns: true,
    escalateToHuman: true
  },
  
  // Define the agent's knowledge base
  knowledgeBase: {
    productCatalog: true,
    faqDatabase: true,
    returnPolicies: true
  },
  
  // Define the agent's behavior
  behavior: async ({ input, context, tools }) => {
    // Analyze the customer inquiry
    const intent = await tools.classifyIntent(input)
    
    // Handle different types of inquiries
    switch (intent) {
      case 'product-question':
        return await tools.answerProductQuestion(input)
      case 'return-request':
        return await tools.handleReturnRequest(input, context.customer)
      case 'complex-issue':
        return await tools.escalateToHuman(input, context.customer)
      default:
        return await tools.generateGenericResponse(input)
    }
  }
})

// Deploy the agent
await customerSupportAgent.deploy()
```

## [Integrations.do](https://integrations.do) Connect Your Apps

Integrations.do provides a seamless way to connect your AI applications with external systems, APIs, and services. It enables you to extend your workflows with powerful integrations that enhance functionality and automate processes across your entire tech stack.

## [Triggers.do](https://triggers.do) Start Business Processes

Triggers.do provides a powerful framework for initiating workflows based on various events. It enables you to create event-driven architectures that respond automatically to changes in your business environment, ensuring timely execution of critical processes.

```typescript
import { defineTrigger } from 'triggers.do'

// Define a webhook trigger for new orders
const newOrderTrigger = defineTrigger({
  name: 'NewOrderWebhook',
  type: 'webhook',
  description: 'Triggers when a new order is created in the e-commerce system',
  
  // Define the endpoint configuration
  endpoint: {
    path: '/webhooks/new-order',
    method: 'POST',
    auth: {
      type: 'api-key',
      headerName: 'X-API-Key'
    }
  },
  
  // Define the payload schema
  schema: {
    type: 'object',
    properties: {
      orderId: { type: 'string', required: true },
      customerId: { type: 'string', required: true },
      items: { 
        type: 'array', 
        items: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            quantity: { type: 'number' },
            price: { type: 'number' }
          }
        }
      },
      totalAmount: { type: 'number', required: true },
      shippingAddress: { type: 'object', required: true }
    }
  },
  
  // Transform the payload before passing to the workflow
  transform: async (payload) => {
    return {
      order: payload,
      timestamp: new Date().toISOString()
    }
  },
  
  // Define the target workflow
  target: {
    workflow: 'processNewOrder',
    version: 'latest'
  }
})
```

## [Searches.do](https://searches.do) Provide Context & Understanding

Searches.do provides a unified interface for powerful data retrieval across various sources. It enables you to find relevant information quickly and efficiently, providing the context needed for intelligent decision-making in your AI applications.

```typescript
import { defineSearch } from 'searches.do'

// Define a knowledge base search
const knowledgeBaseSearch = defineSearch({
  name: 'KnowledgeBaseSearch',
  description: 'Searches the company knowledge base for relevant articles',
  
  // Define the search parameters
  parameters: {
    query: {
      type: 'string',
      required: true,
      description: 'The search query'
    },
    filters: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        dateRange: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date' },
            end: { type: 'string', format: 'date' }
          }
        }
      },
      required: false,
      description: 'Optional filters to narrow search results'
    },
    limit: {
      type: 'number',
      default: 10,
      description: 'Maximum number of results to return'
    }
  },
  
  // Define the search implementation
  implementation: async ({ query, filters, limit }) => {
    // Perform vector search on the knowledge base
    const results = await db.knowledgeBase.search({
      query,
      filters,
      limit
    })
    
    // Format and return the results
    return {
      items: results.map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        url: item.url,
        category: item.category,
        tags: item.tags,
        relevanceScore: item.score
      })),
      totalCount: results.totalCount
    }
  }
})
```

## [Actions.do](https://actions.do) Impact the External World

Actions.do provides a powerful framework for defining and executing operations that interact with external systems. It enables you to create reusable, composable actions that can be triggered from your workflows to create real-world impact.

```typescript
import { defineAction } from 'actions.do'

// Define an email action
const sendEmailAction = defineAction({
  name: 'SendEmail',
  description: 'Sends an email to a specified recipient',
  
  // Define the input parameters
  input: {
    to: {
      type: 'string',
      format: 'email',
      required: true,
      description: 'Recipient email address'
    },
    subject: {
      type: 'string',
      required: true,
      description: 'Email subject line'
    },
    body: {
      type: 'string',
      required: true,
      description: 'Email body content (supports HTML)'
    },
    cc: {
      type: 'array',
      items: { type: 'string', format: 'email' },
      required: false,
      description: 'CC recipients'
    },
    bcc: {
      type: 'array',
      items: { type: 'string', format: 'email' },
      required: false,
      description: 'BCC recipients'
    },
    attachments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          filename: { type: 'string' },
          content: { type: 'string', format: 'base64' },
          contentType: { type: 'string' }
        }
      },
      required: false,
      description: 'File attachments'
    }
  },
  
  // Define the output schema
  output: {
    messageId: {
      type: 'string',
      description: 'Unique identifier for the sent email'
    },
    status: {
      type: 'string',
      enum: ['sent', 'queued', 'failed'],
      description: 'Status of the email delivery'
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'When the email was sent'
    }
  },
  
  // Define the action implementation
  implementation: async (input, context) => {
    // Send the email using the configured email provider
    const result = await context.services.email.send({
      to: input.to,
      subject: input.subject,
      body: input.body,
      cc: input.cc,
      bcc: input.bcc,
      attachments: input.attachments
    })
    
    // Return the result
    return {
      messageId: result.messageId,
      status: result.status,
      timestamp: new Date().toISOString()
    }
  }
})
```

## [Nouns.do](https://nouns.do) Entities in Your Business

Nouns.do provides a powerful framework for defining and managing the entities that make up your business domain. It enables you to create a structured representation of your business objects and their relationships.

```typescript
import { defineNoun } from 'nouns.do'

// Define a Customer entity
const Customer = defineNoun({
  name: 'Customer',
  description: 'A person or organization that purchases products or services',
  
  // Define the properties of a Customer
  properties: {
    name: {
      type: 'string',
      required: true,
      description: 'Full name of the customer'
    },
    email: {
      type: 'string',
      format: 'email',
      required: true,
      unique: true,
      description: 'Primary email address'
    },
    type: {
      type: 'string',
      enum: ['individual', 'business'],
      default: 'individual',
      description: 'Type of customer'
    },
    status: {
      type: 'string',
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
      description: 'Current status of the customer'
    }
  },
  
  // Define relationships to other entities
  relationships: {
    orders: {
      type: 'hasMany',
      target: 'Order',
      foreignKey: 'customerId',
      description: 'Orders placed by this customer'
    }
  }
})
```

## [Verbs.do](https://verbs.do) Represent Potential Actions

Verbs.do provides a powerful framework for defining and managing the actions that can be performed within your business domain. It enables you to create a structured representation of operations that connect entities and drive business processes.

```typescript
import { defineVerb } from 'verbs.do'

// Define a Purchase verb
const Purchase = defineVerb({
  name: 'Purchase',
  description: 'Represents the action of buying a product or service',
  
  // Define the subject and object of this verb
  subject: {
    type: 'Customer',
    description: 'The customer making the purchase'
  },
  object: {
    type: 'Product',
    description: 'The product being purchased'
  },
  
  // Define additional parameters for this verb
  parameters: {
    quantity: {
      type: 'number',
      required: true,
      minimum: 1,
      description: 'Number of items to purchase'
    },
    paymentMethod: {
      type: 'string',
      enum: ['credit_card', 'paypal', 'bank_transfer'],
      required: true,
      description: 'Method of payment'
    }
  },
  
  // Define the result of this verb
  result: {
    type: 'Order',
    description: 'The order created from this purchase'
  }
})
```

## [Things.do](https://things.do) Physical and Virtual Objects

Things.do provides a powerful framework for modeling and managing both physical and virtual objects in your business domain. It enables you to create a structured representation of the tangible and intangible assets that your business interacts with.

```typescript
import { defineThing } from 'things.do'

// Define a Product thing
const Product = defineThing({
  name: 'Product',
  description: 'A physical or digital item that can be purchased',
  
  // Define the properties of a Product
  properties: {
    name: {
      type: 'string',
      required: true,
      description: 'Name of the product'
    },
    description: {
      type: 'string',
      required: true,
      description: 'Detailed description of the product'
    },
    price: {
      type: 'number',
      required: true,
      minimum: 0,
      description: 'Current price of the product'
    },
    isDigital: {
      type: 'boolean',
      default: false,
      description: 'Whether this is a digital product'
    }
  }
})
```


## [Database.do](https://database.do) AI-enriched Data

```typescript
import { DB } from 'database.do'

const db = DB({
  posts: {
    title: 'text',
    content: 'richtext',
    status: 'Draft | Published | Archived', // Select field with predefined options
    contentType: 'Text | Markdown | Code | Object | Schema', // Another select field example
    tags: 'tags[]',
    author: 'authors'
  },
  tags: {
    name: 'text',
    posts: '<-posts.tags'  // Join field to posts (reverse relation)
  },
  authors: {
    name: 'text',
    email: 'email',
    role: 'Admin | Editor | Writer', // Select field with predefined options
    posts: '<-posts.author'  // Join field to posts (reverse relation)
  }
})
```

## [Events.do](https://events.do) Track Business Events

Events.do provides a powerful framework for tracking, analyzing, and responding to business events across your organization. It enables you to create a comprehensive event-driven architecture that captures valuable data about user actions, system operations, and business processes.

```typescript
import { trackEvent, defineEventType } from 'events.do'

// Define a custom event type
const UserSignupEvent = defineEventType({
  name: 'UserSignup',
  description: 'Triggered when a new user signs up',
  
  // Define the event schema
  schema: {
    userId: {
      type: 'string',
      required: true,
      description: 'Unique identifier for the user'
    },
    email: {
      type: 'string',
      format: 'email',
      required: true,
      description: 'User email address'
    },
    source: {
      type: 'string',
      enum: ['website', 'mobile_app', 'partner_referral', 'other'],
      required: true,
      description: 'Source of the signup'
    },
    plan: {
      type: 'string',
      enum: ['free', 'basic', 'premium', 'enterprise'],
      required: true,
      description: 'Selected subscription plan'
    },
    metadata: {
      type: 'object',
      required: false,
      description: 'Additional information about the signup'
    }
  }
})

// Track a user signup event
await trackEvent({
  type: 'UserSignup',
  data: {
    userId: 'usr_123456789',
    email: 'user@example.com',
    source: 'website',
    plan: 'premium',
    metadata: {
      referrer: 'google',
      campaign: 'spring_promo',
      device: 'mobile',
      browser: 'chrome'
    }
  }
})
```

## [Experiments.do](https://experiments.do) Iterate & Improve

Experiments.do provides a powerful framework for testing hypotheses, measuring outcomes, and iteratively improving your AI applications. It enables you to run controlled experiments to validate ideas, optimize performance, and make data-driven decisions.

```typescript
import { defineExperiment, runExperiment } from 'experiments.do'

// Define an experiment to test different product recommendation algorithms
const recommendationExperiment = defineExperiment({
  name: 'ProductRecommendationAlgorithms',
  description: 'Compare different algorithms for product recommendations',
  
  // Define the variants to test
  variants: [
    {
      name: 'collaborative-filtering',
      description: 'Collaborative filtering based on user behavior',
      weight: 0.33 // 33% of traffic
    },
    {
      name: 'content-based',
      description: 'Content-based filtering using product attributes',
      weight: 0.33 // 33% of traffic
    },
    {
      name: 'hybrid-approach',
      description: 'Hybrid approach combining collaborative and content-based',
      weight: 0.34 // 34% of traffic
    }
  ],
  
  // Define the metrics to track
  metrics: [
    {
      name: 'click_through_rate',
      description: 'Percentage of users who click on recommendations',
      goal: 'maximize'
    },
    {
      name: 'conversion_rate',
      description: 'Percentage of users who purchase recommended products',
      goal: 'maximize',
      primary: true // This is the primary metric for determining success
    },
    {
      name: 'average_order_value',
      description: 'Average value of orders with recommended products',
      goal: 'maximize'
    },
    {
      name: 'recommendation_latency',
      description: 'Time to generate recommendations in milliseconds',
      goal: 'minimize'
    }
  ],
  
  // Define the audience for the experiment
  audience: {
    filters: [
      { field: 'user.visits', operator: 'greaterThan', value: 3 },
      { field: 'user.lastVisit', operator: 'withinLast', value: '30d' }
    ]
  },
  
  // Define the duration of the experiment
  duration: {
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2023-06-30T23:59:59Z'
  }
})

// Run the experiment for a specific user
const { variant, experimentId } = await runExperiment({
  name: 'ProductRecommendationAlgorithms',
  user: {
    id: 'usr_123456789',
    visits: 10,
    lastVisit: '2023-05-29T14:23:45Z'
  }
})

// Generate recommendations based on the assigned variant
let recommendations
switch (variant) {
  case 'collaborative-filtering':
    recommendations = await generateCollaborativeRecommendations(userId)
    break
  case 'content-based':
    recommendations = await generateContentBasedRecommendations(userId)
    break
  case 'hybrid-approach':
    recommendations = await generateHybridRecommendations(userId)
    break
}

// Track metrics for the experiment
await trackExperimentMetric({
  experimentId,
  variant,
  userId: 'usr_123456789',
  metrics: {
    click_through_rate: 0.15,
    conversion_rate: 0.08,
    average_order_value: 85.50,
    recommendation_latency: 120
  }
})
```

## [Benchmarks.do](https://benchmarks.do) Compare Models

Benchmarks.do provides a powerful framework for evaluating and comparing AI models across various dimensions. It enables you to make informed decisions about which models to use for different tasks based on objective performance metrics.

```typescript
import { defineBenchmark, runBenchmark } from 'benchmarks.do'

// Define a benchmark for text summarization
const TextSummarizationBenchmark = defineBenchmark({
  name: 'TextSummarizationBenchmark',
  description: 'Evaluates model performance on text summarization tasks',
  
  // Define the models to benchmark
  models: [
    {
      name: 'gpt-4',
      provider: 'openai',
      version: '2023-03-15',
      parameters: {
        temperature: 0.0,
        max_tokens: 150
      }
    },
    {
      name: 'claude-3-opus',
      provider: 'anthropic',
      version: '2023-01-01',
      parameters: {
        temperature: 0.0,
        max_tokens: 150
      }
    },
    {
      name: 'gemini-pro',
      provider: 'google',
      version: '2023-12-01',
      parameters: {
        temperature: 0.0,
        max_output_tokens: 150
      }
    }
  ],
  
  // Define the metrics to evaluate
  metrics: [
    {
      name: 'rouge-1',
      description: 'ROUGE-1 score (unigram overlap)',
      implementation: 'rouge',
      parameters: { type: '1' }
    },
    {
      name: 'rouge-2',
      description: 'ROUGE-2 score (bigram overlap)',
      implementation: 'rouge',
      parameters: { type: '2' }
    },
    {
      name: 'bertscore',
      description: 'BERTScore (semantic similarity)',
      implementation: 'bertscore'
    },
    {
      name: 'latency',
      description: 'Response time in milliseconds',
      implementation: 'timer'
    },
    {
      name: 'cost',
      description: 'Estimated cost in USD',
      implementation: 'cost-calculator'
    }
  ]
})

// Run the benchmark
const results = await runBenchmark('TextSummarizationBenchmark')
```

## [Evals.do](https://evals.do) Measure & Improve

Evals.do provides a powerful framework for evaluating the performance and quality of your AI applications. It enables you to systematically assess model outputs, function results, and workflow outcomes to ensure they meet your business requirements.

```typescript
import { defineEval, runEval } from 'evals.do'

// Define an evaluation for a customer support response generator
const CustomerSupportEval = defineEval({
  name: 'CustomerSupportResponseQuality',
  description: 'Evaluates the quality of AI-generated customer support responses',
  
  // Define the dimensions to evaluate
  dimensions: [
    {
      name: 'accuracy',
      description: 'Correctness of the information provided',
      weight: 0.3,
      rubric: [
        { score: 1, description: 'Contains significant factual errors' },
        { score: 2, description: 'Contains minor factual errors' },
        { score: 3, description: 'Mostly accurate with some omissions' },
        { score: 4, description: 'Completely accurate and comprehensive' }
      ]
    },
    {
      name: 'helpfulness',
      description: 'How well the response addresses the customer\'s issue',
      weight: 0.3,
      rubric: [
        { score: 1, description: 'Does not address the customer\'s issue' },
        { score: 2, description: 'Partially addresses the issue' },
        { score: 3, description: 'Addresses the main issue but lacks detail' },
        { score: 4, description: 'Fully addresses the issue with clear steps' }
      ]
    },
    {
      name: 'tone',
      description: 'Appropriateness of tone and language',
      weight: 0.2,
      rubric: [
        { score: 1, description: 'Inappropriate or unprofessional tone' },
        { score: 2, description: 'Neutral but impersonal tone' },
        { score: 3, description: 'Professional and somewhat empathetic' },
        { score: 4, description: 'Professional, empathetic, and engaging' }
      ]
    },
    {
      name: 'clarity',
      description: 'Clarity and readability of the response',
      weight: 0.2,
      rubric: [
        { score: 1, description: 'Confusing and difficult to understand' },
        { score: 2, description: 'Somewhat clear but with jargon or complexity' },
        { score: 3, description: 'Clear but could be more concise' },
        { score: 4, description: 'Crystal clear and easy to understand' }
      ]
    }
  ],
  
  // Define the evaluation method
  evaluationMethod: 'human', // Options: 'human', 'ai', 'hybrid'
  
  // Define the dataset to evaluate
  dataset: {
    name: 'customer_support_samples',
    size: 100,
    source: 'production_logs'
  }
})

// Run the evaluation on a specific response
const evalResult = await runEval({
  evalName: 'CustomerSupportResponseQuality',
  input: {
    customerQuery: 'How do I reset my password?',
    generatedResponse: 'To reset your password, please follow these steps:\n1. Go to the login page\n2. Click on "Forgot Password"\n3. Enter your email address\n4. Check your email for a reset link\n5. Click the link and enter a new password\n\nIf you don\'t receive the email within a few minutes, please check your spam folder or contact our support team for further assistance.'
  }
})

console.log('Evaluation Result:', evalResult)
// {
//   overallScore: 3.7,
//   dimensionScores: {
//     accuracy: 4.0,
//     helpfulness: 4.0,
//     tone: 3.0,
//     clarity: 3.5
//   },
//   feedback: 'The response is accurate and helpful, providing clear steps. The tone could be more empathetic by acknowledging the user\'s frustration with password issues.',
//   recommendations: [
//     'Add a brief empathetic statement at the beginning',
//     'Consider adding information about password requirements'
//   ]
// }
```

## [Traces.do](https://traces.do) Debug & Understand

Traces.do provides a powerful framework for capturing, visualizing, and analyzing the execution of your AI applications. It enables you to understand how your functions, workflows, and agents operate, making it easier to debug issues and optimize performance.

```typescript
import { startTrace, endTrace, addTraceEvent } from 'traces.do'

// Use tracing in a workflow
import { AI } from 'workflows.do'

export default AI({
  onCustomerSupport: async ({ ai, api, db, event }) => {
    // Start a new trace
    const trace = startTrace({
      name: 'CustomerSupportWorkflow',
      input: event,
      metadata: {
        customerId: event.customerId,
        category: event.category
      }
    })
    
    try {
      // Add an event to the trace
      addTraceEvent({
        traceId: trace.id,
        name: 'ClassifyQuery',
        category: 'processing',
        metadata: { query: event.query }
      })
      
      // Classify the customer query
      const classification = await ai.classifyQuery({
        query: event.query,
        categories: ['product-question', 'technical-issue', 'billing-inquiry', 'other']
      })
      
      // Add the classification result to the trace
      addTraceEvent({
        traceId: trace.id,
        name: 'QueryClassified',
        category: 'result',
        metadata: { classification }
      })
      
      // Generate a response based on the classification
      const response = await ai.generateSupportResponse({
        query: event.query,
        classification
      })
      
      // End the trace successfully
      endTrace({
        traceId: trace.id,
        status: 'success',
        output: response
      })
      
      return response
    } catch (error) {
      // End the trace with an error
      endTrace({
        traceId: trace.id,
        status: 'error',
        error: {
          message: error.message,
          stack: error.stack
        }
      })
      
      throw error
    }
  }
})
```

## [LLM.do](https://llm.do) Intelligent AI Gateway

LLM.do provides a powerful gateway for routing AI requests to the optimal language models based on capabilities, cost, and performance requirements. It enables you to leverage the best AI models for each specific task without being locked into a single provider.

```typescript
import { LLM } from 'llm.do'

// Create an LLM instance with default configuration
const llm = LLM()

// Generate text with automatic model selection
const response = await llm.generate({
  prompt: 'Explain quantum computing in simple terms',
  maxTokens: 200
})

console.log(response)
// "Quantum computing uses the principles of quantum mechanics to process information..."

// Generate text with specific capabilities
const codeResponse = await llm.generate({
  prompt: 'Write a function that calculates the Fibonacci sequence',
  capabilities: ['code', 'reasoning'],
  maxTokens: 300
})

console.log(codeResponse)
// "```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  ..."
```

## [Analytics.do](https://analytics.do) Measure Business Impact

Analytics.do provides a powerful framework for measuring and analyzing the business impact of your AI applications. It enables you to track key metrics, visualize performance trends, and make data-driven decisions about your AI investments.

```typescript
import { trackMetric, createDashboard } from 'analytics.do'

// Track a business metric
await trackMetric({
  name: 'recommendation_conversion',
  value: 1,
  metadata: {
    userId: 'usr_123456789',
    productId: 'prod_987654321',
    revenue: 99.99
  }
})

// Create a sales performance dashboard
const salesDashboard = await createDashboard({
  name: 'Sales Performance Dashboard',
  description: 'Overview of AI-driven sales performance metrics',
  
  // Define the widgets
  widgets: [
    {
      type: 'kpi',
      name: 'Total Recommendations',
      metric: 'recommendations_generated',
      aggregation: 'count'
    },
    {
      type: 'kpi',
      name: 'Recommendation Clicks',
      metric: 'recommendation_click',
      aggregation: 'count'
    },
    {
      type: 'timeSeries',
      name: 'Daily Conversions',
      metrics: ['recommendation_click', 'recommendation_purchase'],
      aggregation: 'count',
      groupBy: 'day'
    }
  ]
})
```

## [AGI.do](https://agi.do) Economically Valuable Work

AGI.do provides a powerful framework for creating and deploying advanced AI systems that can perform economically valuable work across various domains. It enables you to build sophisticated AI applications that deliver measurable business value through automation, optimization, and intelligent decision-making.

```typescript
import { AGI } from 'agi.do'

// Create an AGI instance for a specific business domain
const businessAGI = AGI({
  domain: 'business-operations',
  capabilities: [
    'market-analysis',
    'financial-forecasting',
    'process-optimization',
    'decision-support'
  ],
  integrations: [
    'salesforce',
    'hubspot',
    'quickbooks',
    'slack'
  ]
})

// Use the AGI to analyze market trends
const marketAnalysis = await businessAGI.analyzeMarket({
  industry: 'software',
  segment: 'enterprise',
  timeframe: 'next-quarter',
  competitors: ['competitor-a', 'competitor-b', 'competitor-c'],
  metrics: ['growth-rate', 'market-share', 'customer-acquisition-cost']
})

// Use the AGI to optimize business processes
const processOptimization = await businessAGI.optimizeProcess({
  process: 'customer-onboarding',
  currentSteps: [
    { name: 'initial-contact', duration: '2d' },
    { name: 'requirements-gathering', duration: '5d' },
    { name: 'proposal-creation', duration: '3d' },
    { name: 'contract-negotiation', duration: '7d' },
    { name: 'account-setup', duration: '2d' },
    { name: 'training', duration: '5d' }
  ],
  constraints: [
    { type: 'resource', value: 'sales-team-capacity' },
    { type: 'quality', value: 'customer-satisfaction' }
  ],
  optimizationGoal: 'reduce-time-to-value'
})
```


## Versioning Strategy

This repository uses [Changesets](https://github.com/changesets/changesets) for managing versions and publishing packages.

- Packages in the `sdks` folder are versioned together. When one SDK needs a version update, all SDKs get the same version.
- Packages in the `pkgs` folder are versioned independently based on changes.

### Adding a changeset

To add a changeset, run:

```bash
pnpm changeset
```

This will guide you through the process of creating a changeset file that describes your changes.

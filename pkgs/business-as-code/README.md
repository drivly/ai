[![npm version](https://img.shields.io/npm/v/business-as-code.svg)](https://www.npmjs.com/package/business-as-code)
[![npm downloads](https://img.shields.io/npm/dm/business-as-code.svg)](https://www.npmjs.com/package/business-as-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

# business-as-code

> Build, define, launch, experiment, iterate, and grow your business entirely in code.

## Overview

Business-as-Code represents a revolutionary approach to defining, operating, and scaling businesses. It moves beyond traditional methods by enabling the entire business lifecycle—from initial concept and strategy to execution and iteration—to be managed through clean, structured, and executable code.

This paradigm builds upon core primitives like Functions, Workflows, and Agents, allowing complex business logic, processes, and even autonomous operations to be codified. By treating the business itself as a software system, we unlock unprecedented levels of agility, transparency, experimentation, and optimization.

Drawing inspiration from the principles outlined in the [Manifesto](/docs/manifesto) and leveraging the foundational [Primitives](/docs/primitives) of the [.do](https://dotdo.ai) ecosystem, `business-as-code` provides the framework to transform strategic objectives into measurable outcomes through code.

## Declarative vs. Imperative Approaches

The `business-as-code` package supports two complementary approaches to defining and executing business logic:

### Declarative Approach

Define your business at a high level using objectives and key results (OKRs). The system, powered by AI, determines the optimal implementation strategy. This approach is ideal for setting strategic direction and allowing flexibility in execution.

```typescript
import { Business } from 'business-as-code'

const myBusiness = Business({
  name: 'TechInnovators',
  vision: 'Democratize AI for small businesses',
  objectives: {
    customerSuccess: {
      description: 'Create delighted customers who achieve their goals',
      keyResults: [
        'Achieve 95% customer satisfaction score by Q4',
        'Reduce average support ticket resolution time by 30% within 6 months',
        'Increase customer retention rate to 85% year-over-year',
      ],
    },
    productInnovation: {
      description: 'Continuously deliver cutting-edge AI solutions',
      keyResults: ['Launch 3 new major features based on customer feedback this year', 'Secure 2 patents for novel AI algorithms', 'Increase R&D investment by 15% annually'],
    },
    // More objectives...
  },
})

// Let the AI determine and execute the best approach to achieve the objectives
await myBusiness.execute()
```

### Imperative Approach

Define specific processes step-by-step using workflows. This approach provides fine-grained control over execution and is suitable for well-defined, repeatable tasks. It leverages the patterns established in [Workflows.do](https://workflows.do).

```typescript
import { Workflow } from 'workflows.do' // Assuming Workflow comes from workflows.do

const customerOnboarding = Workflow({
  name: 'CustomerOnboarding',

  onCustomerSignup: async ({ ai, api, db, event }) => {
    const { name, email, company } = event

    // Step 1: Enrich contact details using Integrations.do
    const enrichedContact = await api.apollo.search({ name, email, company })

    // Step 2: Analyze company background using Functions.do
    const companyProfile = await ai.researchCompany({ company: enrichedContact.companyName || company })

    // Step 3: Personalize welcome email using Functions.do
    const welcomeEmail = await ai.personalizeWelcomeEmail({
      name,
      companyProfile,
    })

    // Step 4: Send email using Integrations.do
    await api.sendgrid.sendEmail({
      to: email,
      subject: 'Welcome to TechInnovators!', // Hardcoded name for example clarity
      body: welcomeEmail.content,
    })

    // Step 5: Create user record in Database.do
    await db.users.create({
      name,
      email,
      company: enrichedContact.companyName || company,
      enrichedData: enrichedContact,
    })

    // Step 6: Notify team via Slack using Integrations.do
    await api.slack.postMessage({
      channel: '#signups',
      content: `New signup: ${name} from ${company}`,
    })
  },
})
```

### Integration Between Approaches

The true power emerges when combining both approaches. Define high-level business goals declaratively, and implement specific, critical processes imperatively within the same framework.

```typescript
const combinedBusiness = Business({
  name: 'HybridSolutions',
  vision: '...',
  objectives: {
    /* ... */
  },

  // Define specific workflows imperatively
  workflows: {
    customerOnboarding, // Reuse the imperative workflow defined above
    // Add other critical workflows...
  },

  // Define autonomous agents
  agents: {
    // Agents can leverage both declarative goals and imperative workflows
  },
})

// Execute the business, allowing AI to manage undeclared processes
// while respecting the defined imperative workflows.
await combinedBusiness.launch()
```

## Core Primitives

Business-as-Code builds upon a foundation of powerful, composable primitives inherited from the [.do](https://dotdo.ai) ecosystem:

- **[Functions](/docs/functions)**: The atomic units of work. They can be deterministic code, AI-driven generation, autonomous agent tasks, or even human actions, all with strongly-typed inputs and outputs.
- **[Workflows](/docs/workflows)**: Orchestrate Functions into reliable, repeatable business processes. They combine different function types (Code, Generative, Agent, Human) to achieve specific outcomes aligned with business goals.
- **[Agents](/docs/agents)**: Autonomous digital workers driven by goals and measured by key results. They execute tasks, interact within workflows, and leverage Functions and external integrations.

These primitives provide the building blocks for codifying every aspect of a business.

## Business Model Components

Define key aspects of your business model directly in code. This allows for a structured, version-controlled representation of your strategy, integrating frameworks like Lean Canvas or StoryBrand.

```typescript
import { Business } from 'business-as-code'
import { LeanCanvas, StoryBrand } from 'business-model-components' // Hypothetical import

const myStartup = Business({
  name: 'AgileAI',
  vision: 'Empower teams with AI-driven project management',
  objectives: {
    /* ... */
  },

  // Define business model using structured components
  businessModel: {
    leanCanvas: LeanCanvas({
      problem: ['Inefficient project tracking', 'Poor resource allocation'],
      solution: 'AI-powered platform for automated task management and prediction',
      keyMetrics: ['Daily active users', 'Project completion rate'],
      uniqueValueProposition: 'Effortless project management with predictive insights',
      unfairAdvantage: 'Proprietary predictive algorithms',
      channels: ['Direct sales', 'Content marketing'],
      customerSegments: ['Software development teams', 'Marketing agencies'],
      costStructure: ['Cloud hosting', 'R&D salaries', 'Sales commissions'],
      revenueStreams: ['SaaS subscription tiers', 'Premium support'],
    }),
    storyBrand: StoryBrand({
      character: 'Project Managers',
      problem: 'Overwhelmed by complexity and delays',
      plan: 'Implement AgileAI for streamlined workflows',
      success: 'Effortless project delivery and happy teams',
      failure: 'Continued chaos and missed deadlines',
    }),
    // Add other relevant model components...
  },

  workflows: {
    /* ... */
  },
  agents: {
    /* ... */
  },
})

await myStartup.launch()
```

## Experimentation and Iteration

Business-as-Code enables rapid experimentation directly within your operational framework. Test hypotheses, measure results, and iterate on your strategies and processes using code.

```typescript
import { Business, Experiment, Workflow } from 'business-as-code' // Assuming Workflow is exported here or import from 'workflows.do'

const experimentalBusiness = Business({
  name: 'GrowthHackers Inc.',
  vision: '...',
  objectives: {
    userAcquisition: {
      description: 'Maximize new user signups',
      keyResults: ['Increase weekly signups by 20% in Q3'],
    },
  },
  // ... other definitions
})

// Define an experiment to test different onboarding flows
const onboardingExperiment = Experiment({
  name: 'Onboarding Flow Test',
  hypothesis: 'A simplified onboarding flow will increase signup conversion rate.',
  variants: {
    control: {
      // Current implementation (defined elsewhere or implicitly handled)
      workflow: 'standardOnboardingWorkflow',
    },
    simplified: {
      // New variant defined imperatively
      workflow: Workflow({
        name: 'SimplifiedOnboarding',
        onUserVisit: async ({ ai, api, event }) => {
          // Minimal steps for quick signup
          const { email } = event
          await api.auth.createAccount({ email })
          await api.sendgrid.sendEmail({ to: email, template: 'quick_welcome' })
          // ... fewer steps than control
        },
      }),
    },
  },
  metrics: ['signupConversionRate', 'timeToSignup'],
  trafficSplit: { control: 0.5, simplified: 0.5 },
  targetObjective: experimentalBusiness.objectives.userAcquisition,
})

// Add the experiment to the business definition
experimentalBusiness.addExperiment(onboardingExperiment)

// Launch the business with the experiment running
await experimentalBusiness.launch()

// Later, analyze results (assuming analysis functions exist)
// const results = await experimentalBusiness.analyzeExperiment('Onboarding Flow Test')
// console.log(results)
```

## Real-World Examples

Here's a comprehensive example demonstrating how to define a SaaS business using the `business-as-code` framework:

```typescript
import { Business, Workflow, Agent, Function } from 'business-as-code' // Assuming all primitives are exported
import { Database } from 'database.do' // Assuming Database comes from database.do
import { API } from 'apis.do' // Assuming API comes from apis.do

// Define core business logic components first (Workflows, Agents, Functions)

// Example: Lead Generation Workflow
const leadGeneration = Workflow({
  name: 'LeadGeneration',
  onWebsiteVisit: async ({ ai, api, db, event }) => {
    const { visitorId, pageUrl } = event
    // Track visit
    await db.events.log({ type: 'website_visit', visitorId, pageUrl })

    // If visitor shows interest (e.g., downloads whitepaper)
    if (event.action === 'download_whitepaper') {
      const leadData = await api.hubspot.findContact({ email: event.email }) // Use Integrations.do
      if (!leadData) {
        await api.hubspot.createContact({ email: event.email, name: event.name })
        await api.slack.postMessage({ channel: '#leads', content: `New lead: ${event.name} (${event.email})` })
      }
    }
  },
})

// Example: Customer Support Agent
const supportAgent = Agent({
  name: 'SupportAgent',
  goal: 'Resolve customer support tickets efficiently and effectively',
  keyResults: ['Maintain average first response time under 1 hour', 'Achieve customer satisfaction score (CSAT) of 90%+'],
  onTicketReceived: async ({ ai, api, db, ticket }) => {
    // Analyze ticket content
    const analysis = await ai.analyzeSupportTicket({ content: ticket.description })

    // Find relevant documentation using Functions.do
    const relevantDocs = await ai.findRelevantDocs({ query: analysis.topic })

    // Draft response
    const draftResponse = await ai.draftSupportResponse({
      query: ticket.description,
      context: relevantDocs,
    })

    // Post response (or assign to human if needed)
    await api.zendesk.updateTicket({ id: ticket.id, comment: draftResponse.content })
  },
})

// Define the complete SaaS business
const saasCompany = Business({
  name: 'DataInsights',
  vision: 'Make data analytics accessible to non-technical teams',

  objectives: {
    growth: {
      description: 'Achieve market leadership in SMB analytics',
      keyResults: ['Acquire 1000 paying customers by end of year', 'Reach $1M ARR within 18 months'],
    },
    product: {
      description: 'Deliver an intuitive and powerful analytics platform',
      keyResults: ['Achieve a Net Promoter Score (NPS) of 50+', 'Reduce onboarding time to under 30 minutes'],
    },
  },

  // Integrate defined workflows
  workflows: {
    leadGeneration,
    customerOnboarding, // Reuse from earlier example
    // Add billing, feature-request workflows etc.
  },

  // Integrate defined agents
  agents: {
    supportAgent,
    // Add sales outreach agent, data analysis agent etc.
  },

  // Define the core data model using Database.do concepts
  dataModel: {
    users: Database.collection({
      /* ... schema ... */
    }),
    organizations: Database.collection({
      /* ... schema ... */
    }),
    datasets: Database.collection({
      /* ... schema ... */
    }),
    reports: Database.collection({
      /* ... schema ... */
    }),
    // Define relationships, indexes etc.
  },

  // Define core functions the business relies on
  functions: {
    // Example: A function to generate insights from data
    generateReportInsights: Function({
      name: 'GenerateReportInsights',
      input: { reportId: 'string' },
      output: { insights: 'string[]' },
      run: async ({ input, ai, db }) => {
        const reportData = await db.reports.find({ id: input.reportId })
        // Complex AI logic to derive insights...
        const insights = await ai.analyzeDataAndGenerateInsights({ data: reportData })
        return { insights }
      },
    }),
    // Add other core business functions
  },
})

// Launch the business operations
await saasCompany.launch()

console.log(`Business '${saasCompany.name}' launched successfully.`) // Note: Backticks are fine for template literals
```

## Getting Started

### Installation

To install the `business-as-code` package, use your preferred package manager:

```bash
pnpm add business-as-code # Using pnpm (recommended for this monorepo)
# or
npm install business-as-code
# or
yarn add business-as-code
```

### Basic Usage

1.  **Import necessary components**: Start by importing `Business` and other primitives like `Workflow`, `Agent`, or `Function` as needed.
2.  **Define your Business**: Use the `Business()` constructor, providing a name, vision, and objectives.
3.  **Codify Components**: Define your core workflows, agents, data models, and functions using the respective primitives.
4.  **Integrate Components**: Add your defined workflows, agents, etc., into the `Business` definition.
5.  **Launch**: Call the `.launch()` method on your business instance to start its operations.

```typescript
import { Business } from 'business-as-code'

// 1. Define the business high-level goals
const mySimpleBusiness = Business({
  name: 'My First Coded Business',
  vision: 'To automate simple tasks',
  objectives: {
    taskAutomation: {
      description: 'Automate one repetitive task this quarter',
      keyResults: ['Successfully automate task X by end of Q3'],
    },
  },
  // Add simple workflows or functions if needed
})

// 2. Launch the business
async function start() {
  await mySimpleBusiness.launch()
  console.log('Business launched!')
}

start()
```

This basic structure provides the starting point for building more complex, fully codified businesses. Explore the examples above and the documentation for individual primitives ([Functions](/docs/functions), [Workflows](/docs/workflows), [Agents](/docs/agents)) to learn more.

## License

MIT

## Foundational Primitives

Business-as-Code builds upon and orchestrates the core primitives of the [.do](https://dotdo.ai) ecosystem:

- [apis.do](https://www.npmjs.com/package/apis.do) - The foundational SDK for all integrations.
- [functions.do](https://www.npmjs.com/package/functions.do) - AI-powered Functions-as-a-Service.
- [workflows.do](https://www.npmjs.com/package/workflows.do) - Elegant business process orchestration.
- [agents.do](https://www.npmjs.com/package/agents.do) - Autonomous AI workers.
- [database.do](https://www.npmjs.com/package/database.do) - AI Native Data Access.
- Other `.do` services as needed (Events, Analytics, etc.)

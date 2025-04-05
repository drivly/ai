# [Workflows.do](https://workflows.do) - Elegant Business Process Orchestration

[![npm version](https://img.shields.io/npm/v/workflows.do.svg)](https://www.npmjs.com/package/workflows.do)
[![npm downloads](https://img.shields.io/npm/dm/workflows.do.svg)](https://www.npmjs.com/package/workflows.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

> **Orchestrate business processes with elegant simplicity**

## Installation

```bash
npm install workflows.do
# or
yarn add workflows.do
# or
pnpm add workflows.do
```

## Overview

Workflows.do is the integration hub of the [.do](https://dotdo.ai) ecosystem, seamlessly connecting all SDKs into elegant business processes. Built on the foundation of [APIs.do](https://apis.do), it orchestrates Functions.do, Agents.do, Database.do, and all other .do services through a simple, unified interface.

With Workflows.do, you can:

- Orchestrate elegant business processes with minimal code
- Seamlessly integrate all [.do](https://dotdo.ai) services in a single workflow
- Connect AI functions, databases, and external APIs with type safety
- Create event-driven processes that respond to business triggers
- Build complex, multi-step processes with simple, readable code

## Elegant Integration

Workflows.do seamlessly integrates all [.do](https://dotdo.ai) services into elegant business processes:

```typescript
import { AI } from 'workflows.do'

// Create a workflow that integrates multiple .do services
export default AI({
  onUserSignup: async (event, { ai, api, db }) => {
    const { name, email, company } = event

    // Integrate with external APIs through Integrations.do
    const enrichedContact = await api.apollo.search({ name, email, company })
    const socialProfiles = await api.peopleDataLabs.findSocialProfiles({ name, email, company })
    
    // Leverage Functions.do for AI-powered analysis
    const companyProfile = await ai.researchCompany({ company })
    const personalProfile = await ai.researchPersonalBackground({ name, email, enrichedContact })
    
    // Create personalized content with Functions.do
    const emailSequence = await ai.personalizeEmailSequence({ 
      name, email, company, personalProfile, companyProfile 
    })
    
    // Store data with Database.do
    const { url } = await db.users.create({ 
      name, email, company, 
      profiles: { company: companyProfile, personal: personalProfile },
      emailSequence
    })
    
    // Trigger notifications through Events.do
    await api.slack.postMessage({ 
      channel: '#signups', 
      content: { name, email, company, url } 
    })
  },
})
```

## Type-Safe Function Schemas

Workflows.do provides elegant, type-safe function schemas that integrate seamlessly with Functions.do:

```typescript
export const ai = AI({
  // Define a complex workflow that orchestrates multiple .do services
  createPublication: async ({ ai, db, api, args }) => {
    // Step 1: Generate initial content with Functions.do
    const proposal = await ai.createContentProposal(args)
    const outline = await ai.createContentOutline({ proposal })
    
    // Step 2: Generate sections in parallel for efficiency
    const sections = await Promise.all(
      outline.sections.map(async (section) => {
        return ai.writeSection({
          title: proposal.title,
          sectionTitle: section.title,
        })
      })
    )
    
    // Step 3: Enhance content with media using Integrations.do
    const media = await api.dalle.generateImages({
      prompt: `Images for ${proposal.title}`,
      count: outline.sections.length
    })
    
    // Step 4: Review and refine with Functions.do
    const review = await ai.reviewContent({
      title: proposal.title,
      sections
    })
    
    // Step 5: Store in Database.do
    const { id } = await db.publications.create({
      title: proposal.title,
      sections,
      media,
      review
    })
    
    // Step 6: Publish through Integrations.do
    const published = await api.publishing.publish({
      id,
      channels: args.channels
    })
    
    // Step 7: Track with Analytics.do
    await api.analytics.trackPublication({
      id,
      type: 'content',
      channels: args.channels
    })
    
    return {
      id,
      title: proposal.title,
      sections,
      media,
      published
    }
  },

  // Content proposal schema - integrated with Functions.do
  createContentProposal: {
    title: 'proposed title of the content',
    audience: ['target audience segments'],
    goals: ['business objectives for this content'],
    keyPoints: ['main points to communicate'],
    format: 'content format (blog, whitepaper, video script, etc.)',
    tone: 'desired tone and style',
    length: 'approximate word count or duration',
    callToAction: 'desired reader/viewer action',
    summary: 'brief summary of the content concept',
  },

  // Content outline schema - integrated with Functions.do
  createContentOutline: {
    title: 'content title',
    introduction: 'brief description of the introduction',
    sections: [
      {
        title: 'section title',
        summary: 'brief description of section content',
        keyPoints: ['main points to cover in this section'],
      }
    ],
    conclusion: 'brief description of the conclusion',
    estimatedLength: 'estimated total length',
  },

  // Section writing schema - integrated with Functions.do
  writeSection: {
    title: 'content title',
    sectionTitle: 'section title',
    content: 'fully written content for the section',
    keyTakeaways: ['key points readers should remember'],
    mediaRecommendations: ['suggestions for supporting media'],
  },

  // Content review schema - integrated with Functions.do
  reviewContent: {
    title: 'content title',
    sections: ['array of section content'],
    strengths: ['content strengths'],
    improvements: ['suggested improvements'],
    audienceAlignment: 'how well content meets audience needs',
    goalAlignment: 'how well content achieves business goals',
    recommendations: ['specific recommendations for improvement'],
  },
})
```

## The Integration Hub

Workflows.do serves as the central integration hub for the entire [.do](https://dotdo.ai) ecosystem, connecting:

1. **Functions.do** - AI function execution
2. **Database.do** - Data storage and retrieval
3. **Agents.do** - Autonomous AI workers
4. **Integrations.do** - External API connections
5. **Events.do** - Business event tracking
6. **Analytics.do** - Performance measurement
7. **Triggers.do** - Workflow initiation
8. **Actions.do** - External world impact

This seamless integration enables you to create elegant business processes that leverage the full power of the [.do](https://dotdo.ai) platform with minimal code.
```

## Elegant API Design

Workflows.do provides a simple, elegant API that makes it easy to orchestrate complex business processes:

```typescript
// Create a workflow with the AI function
const workflow = AI({
  // Your workflow definition here
})
```

### Context Object

Each workflow receives a powerful context object that provides access to the entire [.do](https://dotdo.ai) ecosystem:

- `ai`: Access to Functions.do for AI-powered capabilities
- `api`: Integration with external services through Integrations.do
- `db`: Data storage and retrieval through Database.do

## Composable Architecture

A key strength of Workflows.do is its **composable architecture**:

1. **Workflows as Functions** - Workflows can be called like any other function
2. **Nested Workflows** - Complex workflows can be built from simpler ones
3. **Cross-Service Integration** - Seamlessly connect all [.do](https://dotdo.ai) services
4. **Human-AI Collaboration** - Combine AI and human workers in the same process

This elegant design enables you to build sophisticated business processes from simple, reusable components.

## Integrated Function Types

Workflows.do seamlessly integrates all four function types from the [.do](https://dotdo.ai) ecosystem:

### 1. AI Functions

```typescript
// Integrate with Functions.do for AI-powered capabilities
const summary = await ai.summarizeContent({ 
  content: longText, 
  maxLength: 200 
})
```

### 2. Integration Functions

```typescript
// Connect with external services through Integrations.do
const customerData = await api.salesforce.getCustomer({
  email: customer.email
})
```

### 3. Agent Functions

```typescript
// Leverage autonomous agents through Agents.do
const researchResults = await ai.researchAgent.execute({
  topic: "Competitive Analysis",
  depth: "Comprehensive"
})
```

### 4. Human Functions

```typescript
// Incorporate human workers into your workflows
const approval = await api.humans.requestApproval({
  document: proposal,
  approvers: ["manager@company.com"],
  deadline: "24h"
})
```

## Seamless Tool Integration

Workflows.do enables seamless integration between workflows and other [.do](https://dotdo.ai) services:

```typescript
// An agent using workflows as tools
import { Agent } from 'agents.do'

const salesAgent = Agent({
  name: 'SalesAssistant',
  tools: [
    // Workflows are available as tools for agents
    workflows.qualifyLead,
    workflows.generateProposal,
    workflows.scheduleDemo
  ]
})
```

This integration creates a unified ecosystem where business processes can be accessed by both AI systems and human users.

## Real-World Integration Examples

### Content Marketing Workflow

```typescript
import { AI } from 'workflows.do'

// Create an integrated content marketing workflow
export default AI({
  createContentCampaign: async (event, { ai, api, db }) => {
    const { topic, audience, channels } = event

    // Research phase using Functions.do
    const marketResearch = await ai.researchMarketTrends({ topic, audience })
    const competitorAnalysis = await ai.analyzeCompetitorContent({ topic })
    
    // Content creation using Functions.do
    const contentStrategy = await ai.createContentStrategy({ 
      topic, audience, marketResearch, competitorAnalysis 
    })
    
    // Generate content pieces in parallel
    const contentPieces = await Promise.all(
      contentStrategy.pieces.map(async (piece) => {
        return ai.createContent({
          type: piece.type,
          topic: piece.topic,
          audience,
          tone: piece.tone,
          length: piece.length
        })
      })
    )
    
    // Generate visuals using Integrations.do
    const visuals = await api.dalle.generateImages({
      prompts: contentPieces.map(p => `Visual for ${p.title}`),
      style: "professional"
    })
    
    // Store in Database.do
    const campaign = await db.campaigns.create({
      topic,
      audience,
      strategy: contentStrategy,
      content: contentPieces.map((piece, i) => ({
        ...piece,
        visual: visuals[i]
      }))
    })
    
    // Schedule distribution using Integrations.do
    const schedule = await api.marketing.scheduleContent({
      campaignId: campaign.id,
      channels,
      startDate: new Date()
    })
    
    // Set up analytics tracking using Analytics.do
    await api.analytics.createCampaignTracking({
      campaignId: campaign.id,
      channels,
      goals: ['engagement', 'conversion']
    })
    
    return {
      campaignId: campaign.id,
      content: contentPieces,
      schedule,
      trackingUrl: `https://analytics.do/campaigns/${campaign.id}`
    }
  }
})
```

### Customer Experience Workflow

```typescript
import { AI } from 'workflows.do'

// Create an integrated customer experience workflow
export default AI({
  enhanceCustomerExperience: async (event, { ai, api, db }) => {
    const { customerId, interactionType } = event
    
    // Retrieve customer data from Database.do
    const customer = await db.customers.findOne({ id: customerId })
    
    // Enrich customer profile using Integrations.do
    const enrichedProfile = await api.clearbit.enrichCompany({
      domain: customer.company.domain
    })
    
    // Analyze customer journey using Functions.do
    const journeyAnalysis = await ai.analyzeCustomerJourney({
      customer,
      enrichedProfile,
      interactionHistory: await db.interactions.find({ customerId })
    })
    
    // Generate personalized recommendations using Functions.do
    const recommendations = await ai.createPersonalizedRecommendations({
      customer,
      journeyAnalysis,
      interactionType
    })
    
    // Update customer record in Database.do
    await db.customers.update(customerId, {
      enrichedProfile,
      journeyAnalysis,
      recommendations,
      lastUpdated: new Date()
    })
    
    // Trigger appropriate actions based on interaction type
    if (interactionType === 'support') {
      // Notify support team through Events.do
      await api.slack.postMessage({
        channel: '#customer-support',
        content: {
          customerId,
          name: customer.name,
          recommendations: recommendations.supportActions
        }
      })
    } else if (interactionType === 'sales') {
      // Create follow-up tasks in CRM through Integrations.do
      await api.salesforce.createTasks({
        customerId,
        tasks: recommendations.salesActions.map(a => ({
          title: a.title,
          description: a.description,
          dueDate: a.timeframe
        }))
      })
    }
    
    return {
      customerId,
      recommendations,
      nextSteps: recommendations[interactionType + 'Actions']
    }
  }
})
```

## License

MIT

## Integration Foundation

Workflows.do is built on [APIs.do](https://apis.do), the foundational SDK of the [.do](https://dotdo.ai) ecosystem, providing seamless integration with all .do services through a unified, elegant interface.
- [functions.do](https://www.npmjs.com/package/functions.do) - AI-powered Functions-as-a-Service
- [database.do](https://www.npmjs.com/package/database.do) - AI Native Data Access
- [durable-objects-nosql](https://www.npmjs.com/package/durable-objects-nosql) - NoSQL database for Cloudflare Workers

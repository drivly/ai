# Functions.do Integration Guide

This guide explains how Functions.do integrates with other services in the [.do](https://dotdo.ai) ecosystem, providing examples and best practices for creating cohesive applications.

## Functions.do in the .do Ecosystem

Functions.do is a core primitive of the [.do](https://dotdo.ai) ecosystem, designed to work seamlessly with other .do services:

- **[apis.do](https://apis.do)** - The foundational SDK and unified API Gateway
- **[workflows.do](https://workflows.do)** - Business process orchestration
- **[agents.do](https://agents.do)** - Autonomous digital workers
- **[database.do](https://database.do)** - AI-native data layer

## Integration with apis.do

Functions.do is built on top of apis.do, which provides the unified API Gateway for all .do services.

```typescript
import { FunctionsClient } from 'functions.do'
import { API } from 'apis.do'

// Functions.do uses apis.do under the hood
const functionsClient = new FunctionsClient()

// You can also use the low-level APIs if needed
const api = new API()
const functionsList = await api.get('/v1/functions')
```

## Integration with workflows.do

Functions.do and workflows.do are designed to work together. You can use Functions.do to define the individual steps in a workflow.

```typescript
import { AI } from 'functions.do'
import { Workflow } from 'workflows.do'

// Define AI functions
const ai = AI({
  analyzeSentiment: {
    sentiment: 'positive, negative, or neutral',
    score: 'sentiment score from -1.0 to 1.0',
    keyPhrases: ['notable phrases that contributed to the sentiment'],
  },
  
  generateResponse: {
    subject: 'email subject line',
    body: 'email response text',
    tone: 'tone of the response (empathetic, professional, etc.)',
  },
})

// Use these functions in a workflow
const customerSupportWorkflow = Workflow({
  name: 'customerSupportProcess',
  
  steps: {
    analyzeCustomerEmail: async (context) => {
      const sentiment = await ai.analyzeSentiment({ text: context.email.body })
      return { sentiment, ...context }
    },
    
    generateResponse: async (context) => {
      const response = await ai.generateResponse({
        originalEmail: context.email,
        sentiment: context.sentiment,
        customerHistory: context.customerHistory,
      })
      return { response, ...context }
    },
    
    sendResponse: async (context) => {
      // Integration with external email system
      // ...
      return { status: 'sent', ...context }
    },
  },
  
  sequence: ['analyzeCustomerEmail', 'generateResponse', 'sendResponse'],
})
```

## Integration with agents.do

Functions.do can be used to provide capabilities to autonomous agents defined with agents.do.

```typescript
import { AI } from 'functions.do'
import { Agent } from 'agents.do'

// Define AI functions
const ai = AI({
  summarizeContent: {
    summary: 'concise summary of the content',
    keyPoints: ['main points from the content'],
  },
  
  suggestRelatedTopics: {
    topics: ['related topics based on the content'],
    relevance: ['explanation of why each topic is relevant'],
  },
})

// Create an agent that uses these functions
const researchAgent = Agent({
  name: 'researchAssistant',
  description: 'An agent that assists with research by finding and analyzing information',
  
  capabilities: {
    // Reference functions.do capabilities
    summarizeContent: ai.summarizeContent,
    suggestRelatedTopics: ai.suggestRelatedTopics,
    
    // Agent-specific capabilities
    searchWeb: async (query) => {
      // Implementation for web search
      // ...
    },
    
    createResearchReport: async (data) => {
      // Implementation for creating a report
      // ...
    },
  },
  
  defaultGoal: 'Conduct thorough research on a topic and produce a comprehensive report',
})
```

## Integration with database.do

Functions.do can work with database.do to process and transform data stored in the AI-native data layer.

```typescript
import { AI } from 'functions.do'
import { Database } from 'database.do'

// Initialize database client
const db = new Database()

// Define AI functions for data processing
const ai = AI({
  enrichCustomerData: {
    interests: ['inferred customer interests based on behavior'],
    segmentation: 'customer segment classification',
    lifetimeValuePrediction: 'predicted customer lifetime value',
  },
})

// Example: Process customers from database
async function enrichCustomerDatabase() {
  // Fetch customers from database
  const customers = await db.customers.findMany()
  
  // Process each customer with AI function
  const enrichedCustomers = await Promise.all(
    customers.map(async (customer) => {
      const enrichment = await ai.enrichCustomerData({
        profile: customer,
        transactions: customer.transactions,
        interactions: customer.interactions,
      })
      
      // Return customer with enrichment data
      return {
        ...customer,
        enrichment,
      }
    })
  )
  
  // Update database with enriched data
  for (const customer of enrichedCustomers) {
    await db.customers.update({
      where: { id: customer.id },
      data: { enrichment: customer.enrichment },
    })
  }
  
  return enrichedCustomers
}
```

## Business Use Cases

Here are some common business use cases that demonstrate the integration of Functions.do with other .do services:

### Customer Support Automation

```typescript
import { AI } from 'functions.do'
import { Workflow } from 'workflows.do'
import { Agent } from 'agents.do'
import { Database } from 'database.do'

// Define AI functions
const ai = AI({
  classifyTicket: {
    category: 'ticket category (billing, technical, feature request, etc.)',
    priority: 'ticket priority (low, medium, high, urgent)',
    sentiment: 'customer sentiment (positive, neutral, negative)',
  },
  
  generateResponse: {
    subject: 'email subject line',
    body: 'email response text',
    nextSteps: ['recommended next steps for the customer'],
  },
})

// Create a workflow
const supportWorkflow = Workflow({
  name: 'customerSupportProcess',
  
  steps: {
    classifyIncomingTicket: async (context) => {
      const classification = await ai.classifyTicket({ text: context.ticket.description })
      return { classification, ...context }
    },
    
    routeTicket: async (context) => {
      // Route based on classification
      if (context.classification.priority === 'urgent') {
        return { route: 'humanAgent', ...context }
      }
      return { route: 'aiAgent', ...context }
    },
    
    handleWithAI: async (context) => {
      const response = await ai.generateResponse({
        ticket: context.ticket,
        classification: context.classification,
      })
      return { response, ...context }
    },
    
    updateDatabase: async (context) => {
      // Update ticket in database
      await db.tickets.update({
        where: { id: context.ticket.id },
        data: {
          classification: context.classification,
          response: context.response,
          status: 'resolved',
        },
      })
      return { status: 'completed', ...context }
    },
  },
  
  sequence: [
    'classifyIncomingTicket',
    'routeTicket',
    { if: 'context.route === "aiAgent"', then: 'handleWithAI' },
    'updateDatabase',
  ],
})
```

## Integration Patterns and Best Practices

### Composing Functions into Workflows

When integrating Functions.do with workflows.do, follow these best practices:

1. **Single Responsibility**: Each function should have a single, well-defined responsibility
2. **Clear Input/Output Contracts**: Define clear schemas for function inputs and outputs
3. **Error Handling**: Include proper error handling in workflows that use functions
4. **Idempotency**: Design functions to be idempotent when possible
5. **Statelessness**: Keep functions stateless and store state in the workflow context

### Providing Capabilities to Agents

When integrating Functions.do with agents.do:

1. **Capability Granularity**: Define granular functions that agents can compose
2. **Descriptive Names**: Use clear, descriptive names for functions that agents will use
3. **Comprehensive Documentation**: Provide detailed descriptions for agent-accessible functions
4. **Progressive Disclosure**: Start with simple functions and progressively add complexity

### Working with Data

When integrating Functions.do with database.do:

1. **Batch Processing**: Process data in batches when working with large datasets
2. **Caching**: Cache function results when appropriate to reduce API calls
3. **Data Validation**: Validate data before and after function processing
4. **Incremental Updates**: Design for incremental updates rather than full reprocessing

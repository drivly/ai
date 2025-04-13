# [agents.do](https://agents.do) - Autonomous Digital Workers

[![npm version](https://img.shields.io/npm/v/agents.do.svg)](https://www.npmjs.com/package/agents.do)
[![npm downloads](https://img.shields.io/npm/dm/agents.do.svg)](https://www.npmjs.com/package/agents.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

> **Elegant, autonomous digital workers that accomplish valuable tasks**

## Overview

Agents.do is a core primitive of the [.do](https://dotdo.ai) ecosystem, providing a powerful framework for creating, deploying, and managing autonomous digital workers. These agents perform complex tasks with minimal human intervention, handling routine operations, making decisions based on predefined criteria, and adapting to changing conditions.

```typescript
import { Agent, openai } from 'agents.do'

// Create an elegant customer support agent with minimal configuration
const customerSupportAgent = new Agent({
  name: 'Amy',
  role: 'Customer Support Agent',
  job: 'Handles customer inquiries and resolves common issues',
  url: 'https://amy.do',
  // Seamless integration with other services
  integrations: ['chat', 'slack', 'email', 'zendesk', 'shopify'],
  // Event-driven automation
  triggers: ['onTicketCreated', 'onMessageReceived'],
  // Contextual data access
  searches: ['FAQs', 'Tickets', 'Orders', 'Products', 'Customers'],
  // Powerful action capabilities
  actions: ['sendMessage', 'updateOrder', 'refundOrder', 'resolveTicket', 'escalateTicket'],
  // Business impact measurement
  kpis: ['ticketResponseTime', 'ticketResolutionTime', 'customerSatisfaction'],
})
```

## Key Features

- **Autonomous Operation** - Agents work independently with minimal human oversight
- **Multi-Service Integration** - Seamless connections with all [.do](https://dotdo.ai) services
- **Event-Driven Architecture** - Responsive to triggers from various systems
- **Contextual Intelligence** - Access to relevant data through searches
- **Action Capabilities** - Ability to perform meaningful operations
- **Business Impact Measurement** - Built-in KPI tracking and optimization
- **Elegant Configuration** - Simple, declarative setup with minimal code

## Installation

```bash
npm install agents.do
# or
yarn add agents.do
# or
pnpm add agents.do
```

## Elegant API Design

### Creating an Agent Client

```typescript
import { Agents } from 'agents.do'

// Simple initialization with default settings
const agents = new Agents()

// Or with custom configuration
const agents = new Agents({
  apiKey: process.env.AGENTS_API_KEY,
  baseUrl: process.env.AGENTS_API_URL || 'https://agents.do',
})
```

### Creating an Agent

```typescript
// Create a sales assistant agent with minimal configuration
const agent = await agents.create({
  name: 'SalesAssistant',
  description: 'Helps qualify leads and schedule demos',
  // Integration with functions.do
  functions: ['qualifyLead', 'scheduleMeeting'],
  // Integration with workflows.do
  workflows: ['leadQualification', 'demoScheduling'],
  systemPrompt: 'You are a helpful sales assistant focused on qualifying leads and scheduling demos.',
})
```

### Interacting with Agents

```typescript
// Ask an agent a question with relevant context
const response = await agents.ask('agent-id', 'What are your available meeting times this week?', {
  // Provide contextual information
  timezone: 'America/New_York',
  calendar: {
    availableTimes: ['2023-06-15T10:00:00', '2023-06-15T14:00:00', '2023-06-16T11:00:00'],
  },
})

// Receive structured, actionable responses
console.log(response.data)
// {
//   availableTimes: [
//     { date: '2023-06-15', time: '10:00 AM EDT', timestamp: '2023-06-15T10:00:00' },
//     { date: '2023-06-15', time: '2:00 PM EDT', timestamp: '2023-06-15T14:00:00' },
//     { date: '2023-06-16', time: '11:00 AM EDT', timestamp: '2023-06-16T11:00:00' },
//   ],
//   recommendation: '2023-06-15T14:00:00',
//   message: 'I have several available times this week. Would 2:00 PM EDT on Thursday work for you?'
// }
```

### Using the `do` Function

The `do` function provides a flexible way to interact with agents:

```typescript
import { do, Agent } from 'agents.do'

// Standalone function with normal call syntax
const result = await do('agent-id')('How can I help you?')

// Standalone function with template literals
const name = 'John'
const result = await do('agent-id')`Hello ${name}, how can I help?`

// Agent method with normal call syntax
const agent = new Agent({ name: 'assistant' })
const result = await agent.do('How can I help you?')

// Agent method with template literals
const name = 'John'
const result = await agent.do`Hello ${name}, how can I help?`

// Objects and functions are automatically serialized
const user = { name: 'John', email: 'john@example.com' }
const result = await agent.do`Process this user: ${user}`
```

### Managing Agents

```typescript
// Elegant agent lifecycle management
// List all agents with pagination
const agents = await agents.list({ limit: 10, page: 1 })

// Get a specific agent by ID
const agent = await agents.get('agent-id')

// Update an agent with minimal configuration
await agents.update('agent-id', {
  description: 'Updated description',
  systemPrompt: 'New system prompt',
})

// Delete an agent when no longer needed
await agents.delete('agent-id')
```

## Elegant API Reference

### Agents Client

The main client for interacting with the agents.do API provides a clean, intuitive interface:

```typescript
// Simple client initialization
new Agents(options?: {
  apiKey?: string
  baseUrl?: string
})
```

#### Core Methods

The Agents client provides elegant methods for managing and interacting with agents:

- `ask<T>(agentId: string, question: string, context?: any): Promise<AgentResponse<T>>`  
  Ask an agent a question with optional context for more relevant responses.

- `create(agentConfig: AgentConfig): Promise<Agent>`  
  Create a new agent with minimal configuration.

- `list(params?: { limit?: number; page?: number }): Promise<AgentList>`  
  List all agents with simple pagination controls.

- `get(agentId: string): Promise<Agent>`  
  Get a specific agent by ID with complete configuration.

- `update(agentId: string, data: Partial<AgentConfig>): Promise<Agent>`  
  Update an existing agent with partial configuration changes.

- `delete(agentId: string): Promise<void>`  
  Delete an agent when no longer needed.

### Type-Safe Configuration

Agents.do provides elegant, type-safe configuration options:

```typescript
// Clean, intuitive configuration interface
interface AgentConfig {
  name: string // Required agent name
  description?: string // Optional description
  functions?: string[] // Functions.do integration
  workflows?: string[] // Workflows.do integration
  tools?: string[] // Available tools
  systemPrompt?: string // Base instructions
  baseModel?: string // Default AI model
  [key: string]: any // Extensible properties
}
```

### Structured Responses

Agents return clean, structured responses for predictable integration:

```typescript
// Type-safe response format
interface AgentResponse<T = any> {
  data: T // Strongly-typed response data
  meta?: {
    // Optional metadata
    duration?: number // Processing time
    [key: string]: any // Additional metadata
  }
}
```

## Multi-Model Support

Agents.do elegantly supports multiple AI models through a simple, consistent interface:

```typescript
import { Agent, openai, anthropic } from 'agents.do'

// Create an OpenAI-powered agent with minimal configuration
const openaiAgent = new Agent({
  name: 'ConciseHelper',
  instructions: 'You are a helpful assistant that answers questions concisely.',
  model: openai('gpt-4'), // Simple model selection
})

// Create an Anthropic-powered agent with the same elegant interface
const anthropicAgent = new Agent({
  name: 'DetailedHelper',
  instructions: 'You are a helpful assistant that answers questions thoroughly.',
  model: anthropic('claude-3-opus'),
})

// Interact with agents using a consistent interface
const response = await openaiAgent.chat('What is the capital of France?')
console.log(response) // Paris
```

## Seamless Integration with the [.do](https://dotdo.ai) Ecosystem

Agents.do elegantly integrates with other [.do](https://dotdo.ai) services, creating a powerful, composable architecture:

```typescript
import { Agent, openai } from 'agents.do'
import { AI } from 'functions.do'

// Define AI functions using functions.do
const ai = AI({
  // Generation function - uses AI to analyze sentiment
  analyzeCustomerSentiment: {
    text: 'string',
    sentiment: 'Positive | Neutral | Negative',
    score: 'number',
    keyPhrases: 'string[]',
  },

  // Code function - deterministic data processing
  calculateRefundAmount: {
    orderTotal: 'number',
    daysLate: 'number',
    refundPercentage: 'number',
  },

  // Human function - involves human judgment
  escalateToHumanSupport: {
    customerId: 'string',
    issue: 'string',
    priority: 'High | Medium | Low',
  },

  // Agentic function - delegates to another agent
  investigateComplexIssue: {
    customerId: 'string',
    orderHistory: 'any[]',
    issueDescription: 'string',
  },
})

// Create an agent that leverages the entire .do ecosystem
const customerServiceAgent = new Agent({
  name: 'CustomerServiceBot',
  description: 'Handles customer service inquiries',
  // Integration with functions.do
  functions: ['analyzeCustomerSentiment', 'calculateRefundAmount', 'escalateToHumanSupport', 'investigateComplexIssue'],
  // Integration with workflows.do
  workflows: ['refundProcessWorkflow', 'orderTrackingWorkflow'],

  // Event handler for new messages
  onNewMessage: async ({ message, customer }) => {
    // Use functions.do for sentiment analysis
    const sentiment = await ai.analyzeCustomerSentiment({ text: message })

    // Intelligent routing based on sentiment
    if (sentiment.sentiment === 'Negative' && sentiment.score < 0.3) {
      // Escalate to human support when needed
      return await ai.escalateToHumanSupport({
        customerId: customer.id,
        issue: message,
        priority: 'High',
      })
    }

    // Trigger workflows.do for order-related issues
    if (message.includes('order') && message.includes('refund')) {
      // Execute the refund workflow
      return await ai.refundProcessWorkflow({
        customerId: customer.id,
        orderIds: customer.recentOrders.map((order) => order.id),
      })
    }

    // Generate AI response for standard inquiries
    return {
      action: 'respond',
      message: await ai.generateResponse({
        customerMessage: message,
        customerHistory: customer.history,
        sentiment,
      }),
    }
  },
})
```

## The [.do](https://dotdo.ai) Ecosystem

Agents.do is a core primitive of the [.do](https://dotdo.ai) ecosystem, designed to work seamlessly with other .do services:

- **[apis.do](https://apis.do)** - The foundational SDK and unified API Gateway
- **[functions.do](https://functions.do)** - Strongly-typed AI functions
- **[workflows.do](https://workflows.do)** - Business process orchestration
- **[database.do](https://database.do)** - AI-native data layer
- **[triggers.do](https://triggers.do)** - Event-driven process initiation
- **[searches.do](https://searches.do)** - Contextual data retrieval
- **[actions.do](https://actions.do)** - External system operations

## Examples

Check out the [examples directory](https://github.com/drivly/ai/tree/main/examples) for more usage examples.

## License

[MIT](https://opensource.org/licenses/MIT)

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the [.do](https://dotdo.ai) ecosystem

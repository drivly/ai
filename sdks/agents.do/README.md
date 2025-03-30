# [agents.do](https://agents.do) Autonomous Digital Workers

[![npm version](https://img.shields.io/npm/v/agents.do.svg)](https://www.npmjs.com/package/agents.do)
[![npm downloads](https://img.shields.io/npm/dm/agents.do.svg)](https://www.npmjs.com/package/agents.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

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

## Installation

```bash
npm install agents.do
# or
yarn add agents.do
# or
pnpm add agents.do
```

## Usage

### Creating an Agent Client

```typescript
import { Agents } from 'agents.do'

// Initialize with default settings (uses https://agents.do as base URL)
const agents = new Agents()

// Or with custom configuration
const agents = new Agents({
  apiKey: process.env.AGENTS_API_KEY,
  baseUrl: process.env.AGENTS_API_URL || 'https://custom-agents-api.example.com',
})
```

### Creating an Agent

```typescript
const agent = await agents.create({
  name: 'SalesAssistant',
  description: 'Helps qualify leads and schedule demos',
  functions: ['qualifyLead', 'scheduleMeeting'],
  workflows: ['leadQualification', 'demoScheduling'],
  systemPrompt: 'You are a helpful sales assistant focused on qualifying leads and scheduling demos.',
})
```

### Asking an Agent a Question

```typescript
const response = await agents.ask('agent-id', 'What are your available meeting times this week?', {
  // Optional context
  timezone: 'America/New_York',
  calendar: {
    availableTimes: ['2023-06-15T10:00:00', '2023-06-15T14:00:00', '2023-06-16T11:00:00'],
  },
})

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

### Managing Agents

```typescript
// List all agents
const agents = await agents.list({ limit: 10, page: 1 })

// Get a specific agent
const agent = await agents.get('agent-id')

// Update an agent
await agents.update('agent-id', {
  description: 'Updated description',
  systemPrompt: 'New system prompt',
})

// Delete an agent
await agents.delete('agent-id')
```

## API Reference

### Agents

The main client for interacting with the agents.do API.

```typescript
new Agents(options?: {
  apiKey?: string
  baseUrl?: string
})
```

#### Methods

- `ask<T>(agentId: string, question: string, context?: any): Promise<AgentResponse<T>>`
  Ask an agent a question with optional context.

- `create(agentConfig: AgentConfig): Promise<any>`
  Create a new agent.

- `list(params?: { limit?: number; page?: number }): Promise<any>`
  List all agents with pagination.

- `get(agentId: string): Promise<any>`
  Get a specific agent by ID.

- `update(agentId: string, data: Partial<AgentConfig>): Promise<any>`
  Update an existing agent.

- `delete(agentId: string): Promise<any>`
  Delete an agent.

### AgentConfig

Configuration options when creating or updating an agent.

```typescript
interface AgentConfig {
  name: string
  description?: string
  functions?: string[]
  workflows?: string[]
  tools?: string[]
  systemPrompt?: string
  baseModel?: string
  [key: string]: any
}
```

### AgentResponse

The response format when asking an agent a question.

```typescript
interface AgentResponse<T = any> {
  data: T
  meta?: {
    duration?: number
    [key: string]: any
  }
}
```

## Integration with Functions and Workflows

Agents can leverage Functions and Workflows to perform complex tasks:

```typescript
import { Agent } from 'agents.do'
import { AI } from 'functions.do'

// Define AI functions
const ai = AI({
  analyzeCustomerSentiment: {
    text: 'string',
    sentiment: 'Positive | Neutral | Negative',
    score: 'number',
    keyPhrases: 'string[]',
  },
})

// Create an agent that uses functions
const customerServiceAgent = Agent({
  name: 'CustomerServiceBot',
  description: 'Handles customer service inquiries',
  functions: ['analyzeCustomerSentiment'],

  // Handler for new messages
  onNewMessage: async ({ message, customer }) => {
    // Analyze sentiment
    const sentiment = await ai.analyzeCustomerSentiment({ text: message })

    // Route based on sentiment
    if (sentiment.sentiment === 'Negative' && sentiment.score < 0.3) {
      return {
        action: 'escalate',
        reason: `Detected negative sentiment (${sentiment.score}): ${sentiment.keyPhrases.join(', ')}`,
      }
    }

    // Handle the inquiry
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

## Examples

Check out the [examples directory](https://github.com/drivly/ai/tree/main/examples) for more usage examples.

## License

[MIT](https://opensource.org/licenses/MIT)

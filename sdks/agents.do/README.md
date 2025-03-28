# [agents.do](https://agents.do)

[![npm version](https://img.shields.io/npm/v/agents.do.svg)](https://www.npmjs.com/package/agents.do)
[![npm downloads](https://img.shields.io/npm/dm/agents.do.svg)](https://www.npmjs.com/package/agents.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)

## Autonomous Digital Workers for Your Business

Agents.do is a powerful SDK for building, deploying, and managing autonomous AI agents that can perform complex tasks and workflows on behalf of your business. It provides a simple, declarative way to define agent capabilities, behaviors, and integrations with external systems.

## Features

- **Autonomous Execution**: Create agents that can work independently to accomplish tasks
- **Multi-Agent Collaboration**: Enable agents to work together to solve complex problems
- **Tool Integration**: Connect agents to external tools, APIs, and data sources
- **Memory & Context Management**: Maintain state and context across agent interactions
- **Observability & Control**: Monitor agent activities and intervene when necessary
- **Type-Safe Development**: Full TypeScript support for reliable development experience
- **Scalable Infrastructure**: Run agents on a fully-managed, scalable cloud platform

## Installation

```bash
npm install agents.do
# or
yarn add agents.do
# or
pnpm add agents.do
```

## Quick Start

```typescript
import { createAgent } from 'agents.do'

// Define a customer support agent
const supportAgent = createAgent({
  name: 'SupportAssistant',
  description: 'Handles customer support inquiries and resolves common issues',

  // Define the agent's capabilities
  capabilities: {
    answerProductQuestions: async ({ query, productId }) => {
      // Retrieve product information and answer questions
      const productInfo = await api.products.get(productId)
      return ai.generateProductAnswer({ query, productInfo })
    },

    troubleshootIssue: async ({ description, customerInfo }) => {
      // Analyze the issue and provide troubleshooting steps
      const solution = await ai.troubleshoot({
        issueDescription: description,
        productInfo: await api.products.getByCustomer(customerInfo.id),
        knowledgeBase: 'support-articles',
      })
      return solution
    },

    escalateToHuman: async ({ ticketId, reason }) => {
      // Create an escalation ticket for human support
      await api.zendesk.createEscalation({
        ticketId,
        reason,
        priority: reason.includes('urgent') ? 'high' : 'medium',
      })
      return { status: 'escalated', estimatedResponse: '1 business day' }
    },
  },

  // Define how the agent should handle different types of events
  handlers: {
    onNewSupportRequest: async ({ agent, event }) => {
      const { customerId, query } = event

      // Get customer information
      const customerInfo = await api.customers.get(customerId)

      // Analyze the query to determine intent
      const intent = await ai.classifyIntent({
        query,
        categories: ['product-question', 'technical-issue', 'billing-inquiry', 'other'],
      })

      // Handle the request based on intent
      switch (intent) {
        case 'product-question':
          return agent.capabilities.answerProductQuestions({
            query,
            productId: customerInfo.recentProducts[0],
          })

        case 'technical-issue':
          return agent.capabilities.troubleshootIssue({
            description: query,
            customerInfo,
          })

        case 'billing-inquiry':
          // Billing inquiries are always handled by humans
          return agent.capabilities.escalateToHuman({
            ticketId: event.ticketId,
            reason: 'Billing inquiry requires human verification',
          })

        default:
          // Try to handle with general knowledge or escalate
          const canHandle = await ai.canHandleQuery({ query })
          if (canHandle) {
            return ai.generateResponse({ query })
          } else {
            return agent.capabilities.escalateToHuman({
              ticketId: event.ticketId,
              reason: 'Query outside of agent capabilities',
            })
          }
      }
    },
  },
})

// Deploy the agent
await supportAgent.deploy()
```

## Core Concepts

### Agents

Agents are autonomous digital workers that can perform tasks, make decisions, and interact with external systems. Each agent has a specific purpose, capabilities, and behaviors.

```typescript
import { defineAgent } from 'agents.do'

const researchAgent = defineAgent({
  name: 'MarketResearcher',
  description: 'Conducts market research and competitive analysis',

  // Define the agent's memory configuration
  memory: {
    type: 'vectorstore',
    collections: ['market-data', 'competitor-analysis', 'industry-trends'],
  },

  // Define the tools the agent can use
  tools: ['web-search', 'data-analysis', 'document-retrieval', 'report-generation'],

  // Define the agent's capabilities
  capabilities: {
    // Implementation of agent capabilities
    // ...
  },
})
```

### Multi-Agent Systems

Create systems of multiple agents that collaborate to solve complex problems:

```typescript
import { AgentSystem } from 'agents.do'

const customerSuccessSystem = AgentSystem({
  name: 'CustomerSuccessTeam',
  description: 'A team of agents that work together to ensure customer success',

  agents: {
    onboardingSpecialist: {
      // Agent that specializes in customer onboarding
      // ...
    },

    productExpert: {
      // Agent that provides detailed product knowledge
      // ...
    },

    accountManager: {
      // Agent that manages ongoing customer relationships
      // ...
    },

    supportSpecialist: {
      // Agent that handles technical support issues
      // ...
    },
  },

  workflows: {
    newCustomerOnboarding: {
      // Define how agents collaborate during customer onboarding
      // ...
    },

    quarterlyReview: {
      // Define how agents collaborate for quarterly business reviews
      // ...
    },
  },
})
```

### Agent Memory

Agents can maintain memory across interactions:

```typescript
import { defineMemory } from 'agents.do'

const customerSupportMemory = defineMemory({
  type: 'hybrid',

  // Short-term memory for the current conversation
  shortTerm: {
    type: 'conversation',
    maxTokens: 4000,
  },

  // Long-term memory for persistent knowledge
  longTerm: {
    type: 'vectorstore',
    collections: ['customer-interactions', 'resolved-issues'],
  },

  // Define how information moves between memory types
  retention: {
    strategy: 'importance-based',
    importanceEvaluator: async (memory) => {
      // Logic to determine memory importance
      // ...
      return importanceScore
    },
  },
})
```

### Agent Tools

Connect agents to external tools and APIs:

```typescript
import { defineTool } from 'agents.do'

const salesforceTool = defineTool({
  name: 'salesforce',
  description: 'Interact with Salesforce CRM',

  // Define the actions available through this tool
  actions: {
    createLead: async ({ name, email, company, source }) => {
      // Implementation for creating a lead in Salesforce
      // ...
      return { leadId, status: 'created' }
    },

    updateOpportunity: async ({ opportunityId, status, amount }) => {
      // Implementation for updating an opportunity
      // ...
      return { success: true, opportunityId }
    },

    queryContacts: async ({ filters }) => {
      // Implementation for querying contacts
      // ...
      return contacts
    },
  },
})
```

## Advanced Usage

### Agent Supervision

Monitor and control agent behavior:

```typescript
import { AgentSupervisor } from 'agents.do'

const supervisor = AgentSupervisor({
  agents: [customerSupportAgent, salesAgent, marketingAgent],

  // Define monitoring rules
  monitoring: {
    // Log all agent actions
    logging: {
      level: 'info',
      destinations: ['console', 'cloudwatch'],
    },

    // Set up alerts for specific conditions
    alerts: [
      {
        condition: (action) => action.type === 'external-api-call' && action.cost > 10,
        handler: async (action, agent) => {
          await notifyAdmin(`High-cost action by ${agent.name}: $${action.cost}`)
        },
      },
    ],
  },

  // Define intervention policies
  interventions: {
    // Automatically pause agent if it makes too many API calls
    rateLimiting: {
      maxApiCalls: 100,
      timeWindow: '1h',
      action: 'pause-agent',
    },

    // Require human approval for high-risk actions
    approvals: {
      conditions: [(action) => action.risk === 'high', (action) => action.type === 'financial-transaction' && action.amount > 1000],
      approvalProcess: 'human-in-the-loop',
    },
  },
})
```

### Agent Learning

Enable agents to improve over time:

```typescript
import { AgentLearning } from 'agents.do'

const learningConfig = AgentLearning({
  agent: customerSupportAgent,

  // Define learning sources
  sources: {
    // Learn from human feedback
    feedback: {
      collectFrom: ['customer-ratings', 'support-team-reviews'],
      processStrategy: 'reinforcement-learning',
    },

    // Learn from successful interactions
    examples: {
      collectFrom: 'successful-resolutions',
      selectionCriteria: (interaction) => interaction.customerSatisfaction > 4.5,
      maxExamples: 1000,
    },
  },

  // Define how often to update the agent
  schedule: {
    frequency: 'weekly',
    evaluationMetrics: ['accuracy', 'customer-satisfaction', 'resolution-time'],
  },
})
```

## API Reference

### Core Functions

- `createAgent(config)`: Primary function to create a new agent
- `defineAgent(config)`: Alternative way to define an agent's configuration
- `AgentSystem(config)`: Create a system of collaborating agents
- `defineTool(config)`: Create a tool for agent use
- `defineMemory(config)`: Configure an agent's memory system
- `AgentSupervisor(config)`: Create a supervisor to monitor agents
- `AgentLearning(config)`: Configure how agents learn and improve

### Agent Configuration

- `name`: The name of the agent
- `description`: A description of what the agent does
- `capabilities`: Functions the agent can perform
- `handlers`: How the agent responds to events
- `memory`: Configuration for the agent's memory
- `tools`: Tools the agent can use
- `model`: The underlying AI model configuration

### Memory Types

- `conversation`: Short-term memory for ongoing conversations
- `vectorstore`: Long-term memory for knowledge storage
- `episodic`: Memory for specific events or interactions
- `semantic`: Memory for concepts and relationships
- `procedural`: Memory for how to perform tasks

## Examples

Check out the [examples directory](https://github.com/drivly/ai/tree/main/examples) for more usage examples.

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md) for more details.

## License

[MIT](https://opensource.org/licenses/MIT)

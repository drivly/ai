# [workflows.do](https://workflows.do)

[![npm version](https://img.shields.io/npm/v/workflows.do.svg)](https://www.npmjs.com/package/workflows.do)
[![npm downloads](https://img.shields.io/npm/dm/workflows.do.svg)](https://www.npmjs.com/package/workflows.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)

## Business-as-Code: Declarative Workflow Automation

Workflows.do is a powerful SDK for building, deploying, and managing enterprise-grade AI workflows. It enables developers to define complex business processes as code, with built-in support for AI-driven decision making, integrations with external services, and autonomous execution.

## Features

- **Declarative Workflow Definition**: Define complex business processes with a simple, declarative syntax
- **AI-Powered Automation**: Leverage AI for intelligent decision making within your workflows
- **Seamless Integrations**: Connect to external APIs and services with pre-built connectors
- **Event-Driven Architecture**: Trigger workflows based on events from various sources
- **Scalable Execution**: Run workflows on a fully-managed, scalable infrastructure
- **Comprehensive Observability**: Monitor and debug workflows with detailed logs and traces
- **Type-Safe Development**: Full TypeScript support for reliable development experience

## Installation

```bash
npm install workflows.do
# or
yarn add workflows.do
# or
pnpm add workflows.do
```

## Quick Start

```typescript
import { AI } from 'workflows.do'

export default AI({
  onUserSignup: async ({ ai, api, db, event }) => {
    const { name, email, company } = event

    // Enrich contact details with lookup from external data sources
    const enrichedContact = await api.apollo.search({ name, email, company })

    // Using the enriched contact details, do deep research on the company
    const companyProfile = await ai.researchCompany({ company })

    // Schedule a personalized email sequence
    const emailSequence = await ai.personalizeEmailSequence({
      name,
      email,
      company,
      companyProfile,
    })
    await api.scheduleEmails({ emailSequence })

    // Save to database and notify team
    const summary = await ai.summarizeContent({
      length: '3 sentences',
      name,
      email,
      company,
      companyProfile,
    })
    await db.users.create({ name, email, company, summary, companyProfile })
    await api.slack.postMessage({
      channel: '#signups',
      content: { name, email, company, summary },
    })
  },
})
```

## Core Concepts

### Workflows

Workflows are the central building blocks in workflows.do. A workflow is a collection of steps that are executed in a specific order to accomplish a business task.

```typescript
import { defineWorkflow } from 'workflows.do'

const onboardingWorkflow = defineWorkflow({
  name: 'Customer Onboarding',
  description: 'Process for onboarding new customers',

  // Define the workflow steps
  steps: {
    collectInformation: {
      action: 'collectCustomerInfo',
      next: 'validateInformation',
    },
    validateInformation: {
      action: 'validateCustomerInfo',
      next: {
        valid: 'setupAccount',
        invalid: 'requestCorrections',
      },
    },
    requestCorrections: {
      action: 'sendCorrectionRequest',
      next: 'collectInformation',
    },
    setupAccount: {
      action: 'createCustomerAccount',
      next: 'sendWelcomeEmail',
    },
    sendWelcomeEmail: {
      action: 'sendWelcomeEmail',
      next: 'complete',
    },
    complete: {
      type: 'terminal',
      result: 'Customer successfully onboarded',
    },
  },

  // Define the triggers that can start this workflow
  triggers: ['newCustomerSignup', 'manualOnboarding'],
})
```

### AI Integration

Workflows.do seamlessly integrates with AI capabilities, allowing you to incorporate intelligent decision-making into your workflows:

```typescript
import { AI } from 'workflows.do'

export const analyzeCustomerFeedback = AI({
  onFeedbackReceived: async ({ ai, api, db, event }) => {
    const { customerId, feedback } = event

    // Use AI to analyze sentiment and extract key points
    const analysis = await ai.analyzeFeedback({
      feedback,
      extractTopics: true,
      determineSentiment: true,
    })

    // Route feedback based on sentiment
    if (analysis.sentiment === 'negative' && analysis.urgency === 'high') {
      await api.zendesk.createUrgentTicket({
        customerId,
        feedback,
        analysis,
      })
      await api.slack.notifyTeam({
        channel: '#customer-escalations',
        message: `Urgent negative feedback from customer ${customerId}`,
      })
    }

    // Store analysis for reporting
    await db.feedbackAnalytics.create({
      customerId,
      feedback,
      analysis,
      timestamp: new Date(),
    })

    return { status: 'processed', analysis }
  },
})
```

### API Integration

Connect your workflows to external services and APIs:

```typescript
import { defineIntegration } from 'workflows.do'

// Define a Salesforce integration
const salesforceIntegration = defineIntegration({
  name: 'salesforce',

  // Define the actions available through this integration
  actions: {
    createLead: async ({ name, email, company, source }) => {
      // Implementation details for creating a lead in Salesforce
      // ...
      return { leadId, status: 'created' }
    },

    updateOpportunity: async ({ opportunityId, status, amount }) => {
      // Implementation details for updating an opportunity
      // ...
      return { success: true, opportunityId }
    },
  },

  // Define the events this integration can emit
  events: ['leadCreated', 'opportunityUpdated', 'dealClosed'],
})
```

## Advanced Usage

### Error Handling

Workflows.do provides robust error handling capabilities:

```typescript
import { defineWorkflow } from 'workflows.do'

const paymentProcessingWorkflow = defineWorkflow({
  name: 'Process Payment',

  steps: {
    validatePaymentDetails: {
      action: 'validatePayment',
      next: 'processPayment',
      onError: 'handleValidationError',
    },

    processPayment: {
      action: 'chargeCustomer',
      next: 'sendReceipt',
      onError: 'handlePaymentError',
      retry: {
        maxAttempts: 3,
        backoff: 'exponential',
        initialDelay: 1000, // ms
      },
    },

    handleValidationError: {
      action: 'notifyCustomerOfInvalidDetails',
      next: 'complete',
    },

    handlePaymentError: {
      action: 'processPaymentFailure',
      next: 'complete',
    },

    sendReceipt: {
      action: 'emailReceipt',
      next: 'complete',
    },

    complete: {
      type: 'terminal',
    },
  },
})
```

### Parallel Execution

Execute steps in parallel for improved performance:

```typescript
import { defineWorkflow } from 'workflows.do'

const orderFulfillmentWorkflow = defineWorkflow({
  name: 'Order Fulfillment',

  steps: {
    receiveOrder: {
      action: 'validateOrder',
      next: 'parallel',
    },

    parallel: {
      type: 'parallel',
      branches: {
        payment: 'processPayment',
        inventory: 'checkInventory',
        notification: 'notifyTeam',
      },
      next: 'shipOrder',
      joinCondition: 'all', // Wait for all branches to complete
    },

    processPayment: {
      action: 'chargeCustomer',
      next: 'complete',
    },

    checkInventory: {
      action: 'reserveInventory',
      next: 'complete',
    },

    notifyTeam: {
      action: 'sendOrderNotification',
      next: 'complete',
    },

    shipOrder: {
      action: 'createShippingLabel',
      next: 'complete',
    },

    complete: {
      type: 'terminal',
    },
  },
})
```

## API Reference

### Core Functions

- `AI(config)`: Create an AI-powered workflow
- `defineWorkflow(config)`: Define a new workflow
- `defineIntegration(config)`: Create an integration with external services
- `defineTrigger(config)`: Define an event trigger for workflows
- `defineAction(config)`: Create a reusable action for workflow steps

### Workflow Configuration

- `name`: The name of the workflow
- `description`: A description of what the workflow does
- `steps`: The steps that make up the workflow
- `triggers`: Events that can start this workflow
- `timeout`: Maximum execution time for the workflow

### Step Types

- `action`: Execute a specific action
- `decision`: Branch based on a condition
- `parallel`: Execute multiple branches in parallel
- `wait`: Pause execution for a specified time or event
- `terminal`: End the workflow execution

## Examples

Check out the [examples directory](https://github.com/drivly/ai/tree/main/examples) for more usage examples.

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md) for more details.

## License

[MIT](https://opensource.org/licenses/MIT)

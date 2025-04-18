# integrations.do

[![npm version](https://img.shields.io/npm/v/integrations.do.svg)](https://www.npmjs.com/package/integrations.do)
[![npm downloads](https://img.shields.io/npm/dm/integrations.do.svg)](https://www.npmjs.com/package/integrations.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)

Modern businesses rely on numerous specialized tools and platforms, but integrating these systems often requires significant development effort, creating data silos and workflow inefficiencies.

Key challenges include:

- **Connectivity**: Building and maintaining custom integrations between disparate systems
- **Data Synchronization**: Ensuring consistent data across multiple platforms
- **Workflow Automation**: Creating reliable processes that span multiple services
- **Authentication**: Managing credentials and access tokens securely
- **Maintenance**: Keeping integrations functional as APIs evolve

## The Solution

integrations.do provides a unified interface for connecting applications and automating workflows across services through a simple, declarative API that:

- Eliminates the need for custom integration code
- Standardizes authentication and data transformation
- Enables event-driven workflows across platforms
- Provides monitoring and error handling capabilities

## Installation

```bash
npm install integrations.do
# or
yarn add integrations.do
# or
pnpm add integrations.do
```

## API Overview

The integrations.do SDK exports four main components:

- `integrations`: A flexible client for managing connections between applications
- `Integration`: A function for defining custom integration configurations
- `triggers`: A collection of event triggers for integration workflows
- `actions`: A collection of predefined operations for integrated services

## Usage Examples

### Using the `integrations` Client

The `integrations` client provides methods for working with various integration categories:

#### Connecting Applications

```typescript
import { integrations } from 'integrations.do'

// Connect to a service
const githubConnection = await integrations.connect('github', {
  authType: 'oauth',
  credentials: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
})

// Use the connection
const repos = await githubConnection.listRepositories()
```

#### Setting Up Triggers

```typescript
import { integrations } from 'integrations.do'

// Create a webhook trigger for GitHub events
const trigger = await integrations.createTrigger({
  type: 'webhook',
  source: 'github',
  event: 'push',
  filter: {
    branch: 'main',
  },
  action: async (event) => {
    console.log('New push to main branch:', event.data)
    // Perform actions in response to the event
  },
})

// Enable the trigger
await trigger.enable()
```

#### Defining Actions

```typescript
import { integrations } from 'integrations.do'

// Create a reusable action
const createIssueAction = await integrations.createAction({
  name: 'createGitHubIssue',
  description: 'Creates a new issue in a GitHub repository',
  source: 'github',
  operation: 'createIssue',
  inputSchema: {
    repository: 'full repository name (owner/repo)',
    title: 'issue title',
    body: 'issue description',
    labels: ['optional array of label names'],
  },
})

// Execute the action
const result = await createIssueAction.execute({
  repository: 'drivly/ai',
  title: 'Implement new feature',
  body: 'We need to implement the new feature described in the spec',
  labels: ['enhancement'],
})
```

### Using the `Integration` Function

The `Integration` function allows you to define custom integration configurations:

```typescript
import { Integration } from 'integrations.do'

// Define a custom Slack integration
const slackIntegration = Integration({
  name: 'slack',
  description: 'Integration with Slack messaging platform',

  // Authentication methods
  auth: {
    oauth: {
      authorizationUrl: 'https://slack.com/oauth/v2/authorize',
      tokenUrl: 'https://slack.com/api/oauth.v2.access',
      scope: ['chat:write', 'channels:read'],
    },
    apiKey: {
      headerName: 'Authorization',
      prefix: 'Bearer ',
    },
  },

  // Available operations
  operations: {
    sendMessage: {
      description: 'Send a message to a Slack channel',
      inputSchema: {
        channel: 'channel ID or name',
        text: 'message text',
        blocks: 'optional rich layout blocks',
      },
      execute: async (inputs, auth) => {
        // Implementation details
      },
    },
    createChannel: {
      description: 'Create a new Slack channel',
      inputSchema: {
        name: 'channel name',
        isPrivate: 'whether the channel is private',
      },
      execute: async (inputs, auth) => {
        // Implementation details
      },
    },
  },

  // Event triggers
  triggers: {
    messageReceived: {
      description: 'Triggered when a new message is posted',
      setupWebhook: async (config, auth) => {
        // Setup webhook endpoint
      },
    },
    channelCreated: {
      description: 'Triggered when a new channel is created',
      setupWebhook: async (config, auth) => {
        // Setup webhook endpoint
      },
    },
  },
})
```

## Integration Categories

integrations.do supports various integration categories:

### Communication & Collaboration

- **Slack**: Team messaging and collaboration
- **Microsoft Teams**: Enterprise communication platform
- **Discord**: Community chat and voice communication
- **Zoom**: Video conferencing and meetings

### Project Management

- **GitHub**: Code hosting and project management
- **JIRA**: Issue tracking and project management
- **Asana**: Task and project management
- **Trello**: Visual project management

### Marketing & CRM

- **Salesforce**: Customer relationship management
- **HubSpot**: Marketing, sales, and service platform
- **Mailchimp**: Email marketing platform
- **Intercom**: Customer messaging platform

### Data & Analytics

- **Google Analytics**: Web analytics service
- **Segment**: Customer data platform
- **Amplitude**: Product analytics
- **Mixpanel**: User behavior analytics

### Development Tools

- **Vercel**: Frontend deployment platform
- **Netlify**: Web hosting and automation platform
- **AWS**: Cloud computing services
- **Cloudflare**: Web infrastructure and security

## Trigger Types

integrations.do supports various trigger mechanisms to notify your system of events:

1. **Webhooks**: HTTP POST requests sent to a publicly accessible URL

   - Example: Receive notifications when a GitHub issue is created
   - Ideal for asynchronous event handling

2. **Websockets**: Persistent, real-time connections for immediate data delivery

   - Example: Live chat message notifications
   - Suitable for applications requiring low-latency communication

3. **Scheduled**: Time-based triggers for recurring operations

   - Example: Run a report every Monday at 9 AM

4. **Manual**: User-initiated triggers for on-demand workflows
   - Example: Button click to start a data synchronization process

## Action Types

Actions represent operations that can be performed on integrated systems:

1. **Create**: Add new resources

   - Example: Create a Jira ticket, add a calendar event

2. **Read**: Retrieve information

   - Example: Get customer details from CRM, fetch repository stats

3. **Update**: Modify existing resources

   - Example: Update task status, edit document content

4. **Delete**: Remove resources

   - Example: Archive completed tasks, remove calendar events

5. **Custom**: Specialized operations
   - Example: Send Slack message, deploy website

## Advanced Configuration

You can customize integration behavior with advanced options:

```typescript
import { integrations } from 'integrations.do'

// Configure a connection with advanced options
const salesforceConnection = await integrations.connect('salesforce', {
  authType: 'oauth',
  credentials: {
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
  },
  options: {
    version: '54.0',
    environment: 'sandbox',
    timeout: 30000,
    retryConfig: {
      maxRetries: 3,
      initialDelayMs: 1000,
    },
    transformResponse: (data) => {
      // Custom transformation logic
      return transformedData
    },
  },
})
```

## Testing

The SDK includes both unit tests and end-to-end tests.

### Running Unit Tests

Unit tests verify the SDK's functionality without requiring API access:

```bash
pnpm test
```

### Running End-to-End Tests

E2E tests verify integration with actual services and require credentials:

```bash
# Set credentials as environment variables
export GITHUB_CLIENT_ID=your_client_id
export GITHUB_CLIENT_SECRET=your_client_secret

# Run e2e tests
pnpm test:e2e
```

End-to-end tests will be skipped if required credentials are not provided.

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem

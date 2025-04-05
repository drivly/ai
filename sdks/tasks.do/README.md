# tasks.do

[![npm version](https://img.shields.io/npm/v/tasks.do.svg)](https://www.npmjs.com/package/tasks.do)
[![npm downloads](https://img.shields.io/npm/dm/tasks.do.svg)](https://www.npmjs.com/package/tasks.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)

Human-in-the-loop workflows enabling powerful task management with the Tasks & Queue collections.

## The Challenge

Building effective human-in-the-loop workflows presents several challenges:

- **Task Assignment**: Efficiently routing tasks to the right humans based on roles and skills
- **Queue Management**: Organizing and prioritizing tasks for optimal workflow
- **Status Tracking**: Monitoring task progress and completion
- **Dependency Management**: Handling task dependencies and subtasks
- **Integration**: Connecting human tasks with automated processes

## The Solution

tasks.do provides a clean, type-safe interface for creating and managing human-in-the-loop workflows:

- Create and assign tasks to humans based on roles
- Organize tasks into queues for efficient processing
- Track task status and dependencies
- Seamlessly integrate with Functions.do and Workflows.do

## Installation

```bash
npm install tasks.do
# or
yarn add tasks.do
# or
pnpm add tasks.do
```

## API Overview

The tasks.do SDK exports two main components:

- `tasks`: A client for interacting with tasks and queues
- `Tasks`: A function for defining custom task types and schemas

## Usage Examples

### Human Feedback

Request human feedback with a simple schema:

```typescript
import { tasks } from 'tasks.do'

const feedback = await tasks.requestHumanFeedback({
  title: 'Product Feedback Request',
  description: 'Please provide feedback on this product concept',
  blocks: {
    productType: 'API',
    customer: 'enterprise developers',
    solution: 'simplified AI integration',
    description: 'Streamlined API for AI function integration'
  },
  options: ['Approve', 'Reject'],
  freeText: true,
  channel: 'product-feedback',
  mentions: ['U123456', 'U789012']
})
```

### Basic Task Management

```typescript
import { tasks } from 'tasks.do'

// Create a new task
const newTask = await tasks.create({
  title: 'Review content for accuracy',
  description: 'Please review this article for factual accuracy and clarity',
  status: 'todo',
  queue: 'content-review'
})

// Assign a task to a user
const assignedTask = await tasks.assign(newTask.id, {
  users: ['user-123'],
  roles: ['editor']
})

// Update task status
const updatedTask = await tasks.updateStatus(newTask.id, 'in-progress')

// Complete a task
const completedTask = await tasks.complete(newTask.id, {
  notes: 'Content reviewed and approved with minor edits'
})
```

### Working with Queues

```typescript
import { tasks } from 'tasks.do'

// Create a new queue
const newQueue = await tasks.queues.create({
  name: 'Content Review',
  role: 'editor'
})

// Get tasks in a queue
const queueTasks = await tasks.queues.getTasks(newQueue.id)

// Claim the next task from a queue
const nextTask = await tasks.queues.claimNext(newQueue.id, 'user-123')
```

### Human Function Integration

```typescript
import { tasks } from 'tasks.do'
import { ai } from 'functions.do'

// Create a workflow with a human-in-the-loop step
const result = await ai.generateAndReviewContent({
  topic: 'AI Ethics',
  length: '1000 words',
  tone: 'academic'
}, {
  // This will be handled by a human function
  humanReview: async (content) => {
    // Create a task for human review
    const reviewTask = await tasks.create({
      title: 'Review AI-generated content',
      description: 'Please review this AI-generated content for accuracy and quality',
      status: 'todo',
      queue: 'content-review',
      data: { content }
    })
    
    // Wait for the task to be completed
    const completedTask = await tasks.waitForCompletion(reviewTask.id)
    
    // Return the human feedback
    return completedTask.data.feedback
  }
})
```

## Advanced Features

### Task Dependencies

```typescript
import { tasks } from 'tasks.do'

// Create a parent task
const parentTask = await tasks.create({
  title: 'Publish new website',
  status: 'todo'
})

// Create subtasks with dependencies
const designTask = await tasks.create({
  title: 'Design homepage',
  parent: parentTask.id,
  status: 'todo'
})

const developTask = await tasks.create({
  title: 'Develop homepage',
  parent: parentTask.id,
  dependentOn: [designTask.id],
  status: 'todo'
})

// Get all subtasks
const subtasks = await tasks.getSubtasks(parentTask.id)

// Get task dependencies
const dependencies = await tasks.getDependencies(developTask.id)
```

### Webhook Notifications

```typescript
import { tasks } from 'tasks.do'

// Register a webhook for task status changes
const webhook = await tasks.webhooks.register({
  url: 'https://example.com/task-webhook',
  events: ['task.created', 'task.updated', 'task.completed']
})

// Unregister a webhook
await tasks.webhooks.unregister(webhook.id)
```

## Slack Blocks Schema

The SDK provides a simple schema for defining Slack Block interactions:

```typescript
interface SlackBlockSchema {
  title: string
  description: string
  options?: string[]
  freeText?: boolean
  platform?: 'slack' | 'teams' | 'discord'
  timeout?: number
  channel?: string
  mentions?: string[]
}
```

This schema can be used with both Human and Agent task types to create rich interactive messages across different platforms.

## Testing

The SDK includes both unit tests and end-to-end tests.

### Running Unit Tests

Unit tests verify the SDK's functionality without requiring API access:

```bash
pnpm test
```

### Running End-to-End Tests

E2E tests verify integration with the actual API and require an API key:

```bash
# Set API key as environment variable
export TASKS_DO_API_KEY=your_api_key

# Run e2e tests
pnpm test:e2e
```

End-to-end tests will be skipped if no API key is provided.

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem

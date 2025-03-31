# tasks.do

[![npm version](https://img.shields.io/npm/v/tasks.do.svg)](https://www.npmjs.com/package/tasks.do)
[![npm downloads](https://img.shields.io/npm/dm/tasks.do.svg)](https://www.npmjs.com/package/tasks.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/a87bSRvJkx)

Tasks.do provides a simple, elegant abstraction for human-in-the-loop interactions, enabling seamless integration of human feedback into your AI workflows.

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

- `tasks`: A pre-configured client for interacting with the Tasks API
- `Tasks`: A class for creating custom task clients

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
  options: [
    { value: 'approve', label: 'Approve' },
    { value: 'reject', label: 'Reject' }
  ],
  freeText: true
})
```

### Creating and Running Tasks

```typescript
import { tasks } from 'tasks.do'

// Create a new task
const task = await tasks.createTask({
  name: 'Review Document',
  type: 'Human',
  description: 'Review and approve the document',
  blocks: {
    productType: 'Document',
    customer: 'legal team',
    solution: 'contract review',
    description: 'Legal document requiring review and approval'
  }
})

// Run a task
const result = await tasks.runTask(task.id, {
  documentUrl: 'https://example.com/document.pdf'
})
```

## Advanced Configuration

You can create a custom Tasks client with specific configuration:

```typescript
import { Tasks } from 'tasks.do'

const customTasks = new Tasks({
  apiKey: 'your-api-key',
  headers: {
    'X-Custom-Header': 'custom-value'
  }
})

const tasks = await customTasks.listTasks()
```

## Slack Blocks Schema

The SDK provides a simple schema for defining Slack Block interactions:

```typescript
interface SlackBlockSchema {
  title: string
  description: string
  options?: Array<{ value: string; label: string }>
  freeText?: boolean
  platform?: 'slack' | 'teams' | 'discord'
  timeout?: number
}
```

This schema can be used with both Human and Agent task types to create rich interactive messages across different platforms.

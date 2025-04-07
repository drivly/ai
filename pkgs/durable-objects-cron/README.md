# durable-objects-cron

CRON scheduling interface for Cloudflare Worker Durable Objects.

## Installation

```bash
npm install durable-objects-cron
# or
yarn add durable-objects-cron
# or
pnpm add durable-objects-cron
```

## Usage

This package provides a simple interface for scheduling and executing tasks using Cloudflare Worker Durable Objects' alarm capabilities.

### Basic Example

```typescript
import { createCronDurableObject } from 'durable-objects-cron'

// Create a Durable Object class with cron capabilities
export class MyCronDurableObject extends createCronDurableObject({
  defaultHandler: async (task) => {
    console.log(`Executing task ${task.id} with data:`, task.data)
    // Perform your task logic here
  },
}) {}

// In your Worker
export default {
  async fetch(request, env) {
    const id = env.MY_CRON_DURABLE_OBJECT.newUniqueId()
    const obj = env.MY_CRON_DURABLE_OBJECT.get(id)

    // Schedule a task to run every 5 minutes
    if (request.url.includes('/schedule')) {
      return obj.fetch(
        new Request('http://cron/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cron: '*/5 * * * *',
            options: {
              id: 'my-task',
              data: { foo: 'bar' },
            },
          }),
        }),
      )
    }

    // List all scheduled tasks
    if (request.url.includes('/tasks')) {
      return obj.fetch(new Request('http://cron/tasks'))
    }

    // Cancel a task
    if (request.url.includes('/cancel')) {
      return obj.fetch(
        new Request('http://cron/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: 'my-task' }),
        }),
      )
    }

    return new Response('Not found', { status: 404 })
  },
}

// In your wrangler.toml
// [durable_objects]
// bindings = [
//   { name = "MY_CRON_DURABLE_OBJECT", class_name = "MyCronDurableObject" }
// ]
```

### Advanced Usage with Task-Specific Handlers

```typescript
import { createCronDurableObject } from 'durable-objects-cron'

// Create a Durable Object class with task-specific handlers
export class MyCronDurableObject extends createCronDurableObject({
  handlers: {
    'backup:': async (task) => {
      console.log(`Running backup task ${task.id}`)
      // Backup logic here
    },
    'notification:': async (task) => {
      console.log(`Sending notification ${task.id}`)
      // Notification logic here
    },
  },
  defaultHandler: async (task) => {
    console.log(`Executing default task ${task.id}`)
    // Default task logic here
  },
}) {}
```

## API

### `createCronDurableObject(options)`

Creates a new Durable Object class with cron capabilities.

#### Options

- `defaultHandler`: Function that handles all tasks without a specific handler
- `handlers`: Record mapping task ID prefixes to handler functions

### `CronDurableObject` Methods

#### `schedule(cron, options)`

Schedules a task to be executed according to a cron expression.

- `cron`: Cron expression (e.g., `*/5 * * * *` for every 5 minutes)
- `options`:
  - `id`: Optional unique identifier for the task
  - `data`: Optional data to be passed to the task when it executes

Returns a `ScheduleResult` with the task ID and next execution time.

#### `cancel(id)`

Cancels a scheduled task.

- `id`: ID of the task to cancel

Returns a boolean indicating whether the task was found and canceled.

#### `getTask(id)`

Gets a scheduled task by ID.

- `id`: ID of the task to get

Returns the task or null if not found.

#### `listTasks()`

Lists all scheduled tasks.

Returns an array of scheduled tasks.

## License

MIT

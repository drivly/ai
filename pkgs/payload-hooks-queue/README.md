# Payload Hooks Queue

A plugin for Payload CMS that simplifies queueing collection hooks as background tasks or workflows.

## Installation

```bash
npm install payload-hooks-queue
```

## Usage

```typescript
import { buildConfig } from 'payload'
import { createHooksQueuePlugin } from 'payload-hooks-queue'

export default buildConfig({
  // ... other config
  plugins: [
    createHooksQueuePlugin({
      // TypeScript-friendly collection.hook pattern
      'nouns.afterChange': 'enrichNoun',
      'verbs.afterChange': ['enrichVerb', 'notifyVerbChange'],
      'things.beforeChange': ['validateThing'],
      'things.afterChange': [
        'enrichThing',
        {
          slug: 'notifyThingChange',
          input: {
            notificationType: 'email',
            recipients: ['admin@example.com'],
          },
        },
      ],
      'things.beforeDelete': 'archiveThing',
      'things.afterDelete': 'notifyThingDelete',

      // Traditional syntax is still supported
      collections: {
        // Run a specific task on nouns collection changes
        nouns: 'enrichNoun',

        // Run multiple tasks on changes to the verbs collection (array syntax)
        verbs: ['enrichVerb', 'notifyVerbChange'],

        // Wildcard to run tasks on all collections
        '*': 'logAllChanges',

        // Detailed configuration for a specific collection
        things: {
          // Run before the item is created or updated
          beforeChange: ['validateThing'],
          // Run after the item is created or updated
          afterChange: [
            // Simple string syntax
            'enrichThing',
            // Detailed task config with explicit input
            {
              slug: 'notifyThingChange',
              input: {
                notificationType: 'email',
                recipients: ['admin@example.com'],
              },
            },
          ],
          // Run before the item is deleted
          beforeDelete: ['archiveThing'],
          // Run after the item is deleted
          afterDelete: ['notifyThingDelete'],
        },
      },

      // Global hooks run for all collections
      global: {
        afterChange: ['logAllChanges'],
      },

      // Exclude specific collections from global hooks
      excludeFromGlobal: ['sensitiveCollection', 'highVolumeCollection'],
    }),
  ],
})
```

## API Options

### Simple String Syntax

The simplest way to configure a hook is to use a string, which represents the name of a task or workflow to run:

```typescript
collections: {
  'nouns': 'enrichNoun'
}
```

By default, this runs the task after a document is created or updated, passing the entire document as input.

### Array Syntax

To run multiple tasks, use an array of strings:

```typescript
collections: {
  'verbs': ['enrichVerb', 'notifyVerbChange']
}
```

### Detailed Configuration

For more control, use the detailed configuration syntax:

```typescript
collections: {
  'things': {
    beforeChange: ['validateThing'],
    afterChange: [
      'enrichThing',
      {
        slug: 'notifyThingChange',
        input: {
          // Custom input that will be merged with document data
          notificationType: 'email'
        }
      }
    ]
  }
}
```

### Wildcard Collections

Use the `'*'` key to match all collections:

```typescript
collections: {
  '*': 'logAllChanges'
}
```

### Global Hooks

Global hooks run for all collections in addition to collection-specific hooks:

```typescript
global: 'auditAllChanges'
```

You can also use array syntax or detailed configuration for global hooks.

## Hook Types

The plugin supports four hook types:

- `beforeChange`: Runs before a document is created or updated
- `afterChange`: Runs after a document is created or updated
- `beforeDelete`: Runs before a document is deleted
- `afterDelete`: Runs after a document is deleted

## Task Input

By default, the entire document data is passed to the task. You can also specify custom input:

```typescript
{
  slug: 'notifyChange',
  input: {
    notificationType: 'email'
  }
}
```

The task will receive:

```javascript
{
  // Custom input
  notificationType: 'email',

  // Document data (if no custom input fields conflict)
  ...documentData,

  // Always included
  context: {
    collection: 'collectionName',
    operation: 'create' | 'update' | 'delete',
    data: documentData,
    originalDoc: previousVersionOfDocument
  }
}
```

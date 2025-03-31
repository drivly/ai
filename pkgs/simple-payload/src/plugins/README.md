# Payload Hooks Plugin

A plugin for Payload CMS that allows hooking into collection operations and triggering tasks or workflows.

## Installation

```bash
npm install simple-payload
```

## Usage

```typescript
import { buildConfig } from 'payload'
import { createHooksPlugin } from 'simple-payload'

export default buildConfig({
  // ... other config
  plugins: [
    createHooksPlugin({
      // Configure hooks for specific collections
      collections: {
        // Configure hooks for the 'nouns' collection
        nouns: {
          // Run after a noun is created or updated
          afterChange: [
            // Execute a task
            {
              slug: 'executeFunction',
              input: {
                functionName: 'enrichNoun',
                args: {
                  // Args will be merged with hook context
                }
              }
            },
            // Or use a direct handler function
            async ({ collection, operation, data }) => {
              console.log(`${operation} operation on ${collection}:`, data)
              // Custom logic here
            }
          ]
        },
        // Configure hooks for the 'verbs' collection
        verbs: {
          afterChange: [
            {
              slug: 'executeFunction',
              input: {
                functionName: 'enrichVerb',
                args: {}
              }
            }
          ]
        }
      },
      // Configure global hooks for all collections
      globalHooks: {
        afterChange: [
          async ({ collection, operation, data }) => {
            console.log(`Global: ${operation} operation on ${collection}:`, data)
          }
        ]
      }
    })
  ]
})
```

## Options

The plugin supports the following hook types:
- `beforeChange`: Triggered before a document is created or updated
- `afterChange`: Triggered after a document is created or updated
- `beforeDelete`: Triggered before a document is deleted
- `afterDelete`: Triggered after a document is deleted

For each hook, you can provide:
1. A task configuration with:
   - `slug`: The task slug to execute
   - `input`: The task input data

2. Or a handler function with the signature:
   ```typescript
   async ({ collection, operation, data, originalDoc, req }) => {
     // Custom logic here
   }
   ```

## Hook Context

When using a task configuration, the hook context is automatically added to the task input with the following properties:
- `collection`: The collection slug
- `operation`: The operation type ('create', 'update', or 'delete')
- `data`: The document data
- `originalDoc`: The original document (for update and delete operations)

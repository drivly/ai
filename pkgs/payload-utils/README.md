# @ai-primitives/payload-utils

Utilities for working with Payload CMS in various JavaScript environments including NextJS and Cloudflare Workers.

## Installation

```bash
npm install @ai-primitives/payload-utils
# or
pnpm add @ai-primitives/payload-utils
# or
yarn add @ai-primitives/payload-utils
```

## Usage

### NextJS

```typescript
import { API } from '@ai-primitives/payload-utils'
import { getPayload } from 'payload'
import configPromise from 'payload.config'

export const handler = API(getPayload, configPromise, async (req, ctx) => {
  // Access the enhanced context
  const { db, user, params } = ctx

  // Use the db proxy for easy collection access
  const items = await db.items.find({ limit: 10 })

  return { items }
})
```

### Cloudflare Workers

```typescript
import { createCloudflareApiHandler } from '@ai-primitives/payload-utils'
import { getPayload } from 'payload'
import configPromise from 'payload.config'

const handler = createCloudflareApiHandler(getPayload, configPromise, async (req, ctx) => {
  // Access the enhanced context
  const { db, user, params } = ctx

  // Use the db proxy for easy collection access
  const items = await db.items.find({ limit: 10 })

  return { items }
})

export default {
  fetch: (request) => handler(request, {}),
}
```

## Features

- Compatible with both NextJS and Cloudflare Workers
- Provides a simplified API for Payload CMS database operations
- Automatically handles request authentication and parsing
- Consistent error handling
- Type-safe with TypeScript

## License

MIT

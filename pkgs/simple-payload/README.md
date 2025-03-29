# Simple Payload

A lightweight package for interfacing with Payload CMS, supporting both direct Node.js usage and REST API-based access for edge runtimes.

## Usage

### Node.js Runtime

```typescript
import { createNodePayloadClient } from 'simple-payload/node'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })
const db = createNodePayloadClient(payload)
```

### Edge Runtime

```typescript
import { createEdgePayloadClient } from 'simple-payload/edge'

const db = createEdgePayloadClient({
  apiUrl: 'https://your-payload-api.example.com',
  apiKey: 'your-api-key',
})
```

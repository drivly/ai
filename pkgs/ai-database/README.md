# ai-database

Direct interface to Payload CMS with database.do compatibility.

## Installation

```bash
npm install ai-database
# or
yarn add ai-database
# or
pnpm add ai-database
```

## Usage

### Node.js Environment

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'
import { DB } from 'ai-database'

// Initialize with Payload instance
const payload = await getPayload({ config })
const db = DB({ payload })

// Use the same interface as database.do
const posts = await db.posts.find({ 
  where: { status: 'published' },
  limit: 10
})

const post = await db.posts.findOne('post-123')
```

### Edge Environment

```typescript
import { DB } from 'ai-database'

// Initialize with REST API URL
const db = DB({ 
  apiUrl: 'https://your-payload-api.com/api',
  apiKey: 'your-api-key'
})

// Use the same interface as database.do
const posts = await db.posts.find({ 
  where: { status: 'published' },
  limit: 10
})

const post = await db.posts.findOne('post-123')
```

## API

The API is compatible with `database.do`, providing the same methods for each collection:

- `find(options?)`: Find documents in the collection
- `findOne(id)`: Find a single document by ID
- `create(data)`: Create a new document
- `update(id, data)`: Update an existing document
- `delete(id)`: Delete a document
- `search(query, options?)`: Search for documents

## Environment-specific Adapters

For more control over environment-specific initialization:

```typescript
import { createNodeClient, createEdgeClient } from 'ai-database/adapters'

// Node.js
const nodeDb = createNodeClient({ payload })

// Edge
const edgeDb = createEdgeClient({ 
  apiUrl: 'https://your-payload-api.com/api' 
})
```

## License

MIT

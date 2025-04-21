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
  limit: 10,
})

const post = await db.posts.findOne('post-123')
```

### Edge Environment

```typescript
import { DB } from 'ai-database'

// Initialize with REST API URL
const db = DB({
  apiUrl: 'https://your-payload-api.com/api',
  apiKey: 'your-api-key',
})

// Use the same interface as database.do
const posts = await db.posts.find({
  where: { status: 'published' },
  limit: 10,
})

const post = await db.posts.findOne('post-123')
```

### Generating Embeddings

```typescript
import { generateEmbedding, calculateSimilarity } from 'ai-database'

// Generate embeddings for text
const result = await generateEmbedding('Text to embed')

if (result.success) {
  console.log('Embedding:', result.embedding)
  console.log('Model used:', result.model)

  // Calculate similarity between two embeddings
  const embedding1 = result.embedding[0]
  const embedding2 = await generateEmbedding('Similar text').then((r) => r.embedding?.[0])

  if (embedding1 && embedding2) {
    const similarity = calculateSimilarity(embedding1, embedding2)
    console.log('Similarity score:', similarity)
  }
}
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
  apiUrl: 'https://your-payload-api.com/api',
})
```

## Embedding Functions

- `generateEmbedding(text, options?)`: Generate embeddings for text using the AI SDK
- `calculateSimilarity(embedding1, embedding2)`: Calculate cosine similarity between two embeddings

## License

MIT

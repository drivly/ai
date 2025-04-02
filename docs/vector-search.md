# Vector Search for Things Collection

This document explains how to use the vector search functionality for the Things collection in the Drivly AI platform.

## Overview

The vector search implementation allows for semantic search of Things using OpenAI embeddings. This enables finding relevant Things based on meaning rather than just keyword matching.

## Features

- **Vector Embeddings**: Each Thing document is automatically embedded using OpenAI's text-embedding-3-large model
- **Vector Search**: Search Things by semantic similarity using vector embeddings
- **Hybrid Search**: Combine vector search with traditional text search for better results
- **Automatic Embedding Generation**: Embeddings are automatically generated when Things are created or updated

## How It Works

1. When a Thing is created or updated, an embedding is automatically generated using OpenAI's text-embedding-3-large model
2. The embedding is stored in the Thing document's `embedding` field
3. A vector index on the `embedding` field enables efficient similarity search
4. Search queries are also embedded and compared against the stored embeddings

## Usage

### Vector Search

To perform a vector search:

```typescript
import { searchThings } from '../tasks/searchThings'

// Search for Things similar to the query
const results = await searchThings('artificial intelligence applications', 10)
```

### Hybrid Search

To perform a hybrid search (combining vector and text search):

```typescript
import { hybridSearchThings } from '../tasks/searchThings'

// Search for Things using both vector and text search
const results = await hybridSearchThings('machine learning models', 10)
```

### Using the Searches Collection

The Searches collection has been updated to support vector search:

1. Create a new Search document with:

   - `name`: Name for the search
   - `query`: Search query text
   - `searchType`: Select 'vector' or 'hybrid'

2. The system will automatically:
   - Generate an embedding for the query
   - Perform the search
   - Store the results in the Search document

## Setup

### Vector Index Creation

To create the vector index for the Things collection:

```bash
node scripts/createVectorIndex.ts
```

### Generate Embeddings for Existing Things

To generate embeddings for all existing Thing documents:

```bash
node scripts/generateAllEmbeddings.ts
```

## Technical Details

- Embedding model: text-embedding-3-large
- Vector dimensions: 256
- Similarity metric: cosine
- MongoDB vector index: 'vector_index'

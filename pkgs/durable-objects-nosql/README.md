# Durable Objects NoSQL

MongoDB-style NoSQL interface for Cloudflare Worker Durable Objects.

## Overview

This package provides a MongoDB-style NoSQL interface for Cloudflare Worker Durable Objects' built-in SQLite storage. It allows you to use familiar MongoDB-like syntax to interact with your Durable Object's storage, making it easier to work with structured data.

## Installation

```bash
npm install durable-objects-nosql
# or
yarn add durable-objects-nosql
# or
pnpm add durable-objects-nosql
```

## Usage

```typescript
import { DurableObjectsNoSQL } from 'durable-objects-nosql'

export class MyDurableObject implements DurableObject {
  private db: DurableObjectsNoSQL

  constructor(state: DurableObjectState, env: Env) {
    // Initialize the NoSQL interface with the Durable Object's storage
    this.db = new DurableObjectsNoSQL(state.storage)
  }

  async fetch(request: Request): Promise<Response> {
    // Use MongoDB-style syntax to interact with your data

    // Insert a document
    await this.db.users.insertOne({
      name: 'John Doe',
      email: 'john@example.com',
      admin: true,
    })

    // Find documents
    const adminUsers = await this.db.users.find({ admin: true }).toArray()

    // Find documents with query operators
    const recentPosts = await this.db.blogPosts
      .find({
        createdAt: { $gt: new Date(Date.now() - 86400000) },
      })
      .toArray()

    return new Response(JSON.stringify({ adminUsers, recentPosts }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
```

## Features

- MongoDB-style syntax for interacting with Durable Object storage
- Support for common MongoDB operations: `find()`, `findOne()`, `insertOne()`, `insertMany()`, `updateOne()`, `updateMany()`, `deleteOne()`, `deleteMany()`
- Support for MongoDB query operators: `$eq`, `$gt`, `$gte`, `$lt`, `$lte`, `$ne`, `$in`, `$nin`, `$and`, `$or`, `$not`
- Support for MongoDB update operators: `$set`, `$unset`, `$inc`, `$push`, `$pull`
- Automatic schema creation and management
- Efficient storage using a single SQLite table with collection, id, and data columns
- Consistent SQL-based implementation for all operations

```typescript
// Example of bulk operations
// These operations use consistent SQL-based storage under the hood
await this.db.users.insertMany([
  { name: 'Jane Smith', email: 'jane@example.com', admin: false },
  { name: 'Bob Johnson', email: 'bob@example.com', admin: true },
])

// Update multiple documents
await this.db.users.updateMany({ admin: true }, { $set: { role: 'administrator' } })

// Delete multiple documents
await this.db.users.deleteMany({ admin: false })
```

## API Reference

### DurableObjectsNoSQL

The main class that provides the MongoDB-style interface.

```typescript
class DurableObjectsNoSQL {
  constructor(storage: DurableObjectStorage)

  // Access a collection
  get collection(name: string): Collection

  // Collection accessor (e.g., db.users)
  [collectionName: string]: Collection
}
```

### Collection

Represents a collection of documents.

```typescript
class Collection {
  // Find documents matching a query
  find(query?: object): Cursor

  // Find a single document
  findOne(query?: object): Promise<object | null>

  // Insert a single document
  insertOne(document: object): Promise<{ id: string }>

  // Insert multiple documents
  insertMany(documents: object[]): Promise<{ ids: string[] }>

  // Update a single document
  updateOne(query: object, update: object): Promise<{ matchedCount: number; modifiedCount: number }>

  // Update multiple documents
  updateMany(query: object, update: object): Promise<{ matchedCount: number; modifiedCount: number }>

  // Delete a single document
  deleteOne(query: object): Promise<{ deletedCount: number }>

  // Delete multiple documents
  deleteMany(query: object): Promise<{ deletedCount: number }>
}
```

### Cursor

Represents a cursor for iterating over query results.

```typescript
class Cursor {
  // Convert cursor to array of documents
  toArray(): Promise<object[]>

  // Get the first document in the cursor
  first(): Promise<object | null>

  // Count the number of documents in the cursor
  count(): Promise<number>

  // Limit the number of documents returned
  limit(n: number): Cursor

  // Skip a number of documents
  skip(n: number): Cursor

  // Sort the documents
  sort(sortSpec: object): Cursor
}
```

## License

MIT

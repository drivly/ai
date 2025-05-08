# mdxdb

[![npm version](https://img.shields.io/npm/v/mdxdb.svg)](https://www.npmjs.com/package/mdxdb)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> MDX-based database that treats MDX files as collections with database.do interface

`mdxdb` is a package that allows you to work with MDX files as a database using the database.do interface. It provides a clean interface for database operations with local MDX files or Payload CMS, storing document data in MDX frontmatter or a Payload CMS database.

## Features

- **Dual Backend Support** - Works with both filesystem and Payload CMS backends
- **Local MDX Files** - Works with local MDX files instead of remote API calls
- **Payload CMS Integration** - Seamlessly integrates with Payload CMS for database operations
- **Standardized Collections** - Supports four standard collections: Types, Resources, Relationships, and Users
- **List + CRUD Operations** - Full support for database operations on both backends
- **API Compatibility** - Maintains API compatibility with `database.do`
- **Configurable** - Supports options like backend selection, base path, and file extension
- **Minimal Dependencies** - Only depends on `gray-matter` for frontmatter parsing, with Payload as an optional peer dependency

## Installation

```bash
# Using npm
npm install mdxdb

# Using yarn
yarn add mdxdb

# Using pnpm
pnpm add mdxdb

# Optional: Install Payload CMS for Payload backend support
pnpm add payload
```

## Quick Start

### Filesystem Backend (Default)

```typescript
import { DB } from 'mdxdb'

// Initialize with filesystem backend (default)
const db = DB({
  basePath: './content', // Base directory for MDX files
  fileExtension: '.mdx', // File extension for MDX files
  createDirectories: true, // Create directories if they don't exist
})

// Create a new resource
const resource = await db.resources.create({
  name: 'Example Resource',
  description: 'This is a sample resource created with mdxdb',
  type: 'article',
  content: 'This is the content of the resource',
})

// Query resources with filtering
const articles = await db.resources.find({
  where: {
    type: 'article',
  },
})

// Get a resource by ID
const singleResource = await db.resources.findOne(resource.id)

// Update a resource
await db.resources.update(resource.id, {
  name: 'Updated Resource Name',
})

// Delete a resource
await db.resources.delete(resource.id)
```

### Payload CMS Backend

```typescript
import { initializePayloadDB } from 'mdxdb'
import { buildConfig } from 'payload/config'
import { collections } from 'mdxdb'

// Create Payload config with the standard collections
const payloadConfig = buildConfig({
  collections: [
    collections.types,
    collections.resources,
    collections.relationships,
    collections.users,
  ],
  // ... other Payload config options
})

// Initialize with Payload backend
const db = await initializePayloadDB(payloadConfig)

// Use the same database.do interface
const resource = await db.resources.create({
  name: 'Example Resource',
  description: 'This is a sample resource created with Payload backend',
  type: 'article',
  content: 'This is the content of the resource',
})

// All other operations work the same way as with the filesystem backend
```

## Standard Collections

`mdxdb` provides four standardized collections:

### Types

Represents entity types and action types (replaces Nouns and Verbs).

```typescript
{
  name: string,
  description: string,
  schema: object,
  hash: string,
  singular: string, // Singular form like "User"
  plural: string,   // Plural form like "Users"
  action: string,   // Active tense like "Create"
  activity: string, // Gerund like "Creating"
}
```

### Resources

Represents entities and objects in the system.

```typescript
{
  name: string,
  description: string,
  sqid: string,
  hash: string,
  type: string, // Reference to a Type
  data: object,
  embedding: object,
  content: string,
}
```

### Relationships

Represents connections between resources using a subject-verb-object pattern.

```typescript
{
  subject: string, // Reference to a Resource
  verb: string,    // Reference to a Type
  object: string,  // Reference to a Resource
  hash: string,
}
```

### Users

Represents user accounts with authentication support.

```typescript
{
  name: string,
  email: string,
  image: string,
  role: 'user' | 'admin' | 'superAdmin',
  emailVerified: boolean,
}
```

## API Reference

### DB Configuration

Initialize the database client with optional configuration:

```typescript
import { DB } from 'mdxdb'

// Filesystem backend (default)
const db = DB({
  backend?: 'filesystem', // Optional, defaults to 'filesystem'
  basePath?: string, // Optional, defaults to './content'
  fileExtension?: string, // Optional, defaults to '.mdx'
  createDirectories?: boolean, // Optional, defaults to true
})

// Payload CMS backend
const db = DB({
  backend: 'payload',
  payload: payloadInstance, // Required when backend is 'payload'
})
```

### Initialize Payload DB

For convenience, you can use the `initializePayloadDB` function to create a database client with the Payload backend:

```typescript
import { initializePayloadDB } from 'mdxdb'

const db = await initializePayloadDB(payloadConfig)
```

### Collection Methods

All collection methods work the same way for both backends, providing a consistent interface.

#### db.{collection}.find(options?)

Retrieves multiple documents from a collection with optional filtering, sorting, and pagination.

```typescript
const results = await db.resources.find({
  where: {
    type: 'article',
  },
  sort: 'createdAt:desc',
  limit: 10,
  page: 1,
})
```

#### db.{collection}.findOne(id)

Retrieves a single document by its ID.

```typescript
const document = await db.resources.findOne('document-id')
```

#### db.{collection}.create(data)

Creates a new document in the collection.

```typescript
const newDocument = await db.resources.create({
  name: 'New Resource',
  description: 'This is a new resource',
  type: 'article',
  content: 'This is the content',
})
```

#### db.{collection}.update(id, data)

Updates an existing document by its ID.

```typescript
const updatedDocument = await db.resources.update('document-id', {
  name: 'Updated Name',
})
```

#### db.{collection}.delete(id)

Deletes a document by its ID.

```typescript
await db.resources.delete('document-id')
```

#### db.{collection}.search(query, options?)

Performs a text search across documents in a collection.

```typescript
const searchResults = await db.resources.search('search term', {
  limit: 20,
  sort: 'relevance:desc',
})
```

## Dependencies

- [gray-matter](https://github.com/jonschlinkert/gray-matter) - For parsing MDX frontmatter
- [payload](https://payloadcms.com/) - Optional peer dependency for Payload CMS backend

## License

MIT

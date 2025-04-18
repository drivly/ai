# mdxdb

[![npm version](https://img.shields.io/npm/v/mdxdb.svg)](https://www.npmjs.com/package/mdxdb)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> MDX-based database that treats MDX files as collections with database.do interface

`mdxdb` is a package that allows you to work with MDX files as a database using the database.do interface. It provides a clean interface for database operations with local MDX files, storing document data in MDX frontmatter.

## Features

- **Local MDX Files** - Works with local MDX files instead of remote API calls
- **Filesystem Storage** - Stores document data in MDX frontmatter
- **List + CRUD Operations** - Full support for database operations on the filesystem
- **API Compatibility** - Maintains API compatibility with `database.do`
- **Configurable** - Supports options like base path and file extension
- **Zero Dependencies** - Only depends on `gray-matter` for frontmatter parsing

## Installation

```bash
# Using npm
npm install mdxdb

# Using yarn
yarn add mdxdb

# Using pnpm
pnpm add mdxdb
```

## Quick Start

```typescript
import { DB } from 'mdxdb'

// Initialize with custom configuration
const db = DB({
  basePath: './content', // Base directory for MDX files
  fileExtension: '.mdx', // File extension for MDX files
  createDirectories: true, // Create directories if they don't exist
})

// Create a new post
const post = await db.posts.create({
  title: 'Getting Started with mdxdb',
  content: 'This is a sample post created with mdxdb',
  status: 'Published',
  tags: ['mdx', 'tutorial'],
  author: 'author123',
})

// Query posts with filtering
const publishedPosts = await db.posts.find({
  where: {
    status: 'Published',
    author: 'author123',
  },
})

// Get a post by ID
const singlePost = await db.posts.findOne(post.id)

// Update a post
await db.posts.update(post.id, {
  title: 'Updated Title',
})

// Delete a post
await db.posts.delete(post.id)
```

## API Reference

### DB Configuration

Initialize the database client with optional configuration:

```typescript
import { DB } from 'mdxdb'

const db = DB({
  basePath?: string, // Optional, defaults to './content'
  fileExtension?: string, // Optional, defaults to '.mdx'
  createDirectories?: boolean, // Optional, defaults to true
})
```

### Collection Methods

#### db.{collection}.find(options?)

Retrieves multiple documents from a collection with optional filtering, sorting, and pagination.

```typescript
const results = await db.posts.find({
  where: {
    status: 'Published',
    author: 'author123',
  },
  sort: 'createdAt:desc',
  limit: 10,
  page: 1,
})
```

#### db.{collection}.findOne(id)

Retrieves a single document by its ID.

```typescript
const document = await db.posts.findOne('document-id')
```

#### db.{collection}.create(data)

Creates a new document in the collection.

```typescript
const newDocument = await db.posts.create({
  title: 'New Post',
  content: 'This is a new post',
})
```

#### db.{collection}.update(id, data)

Updates an existing document by its ID.

```typescript
const updatedDocument = await db.posts.update('document-id', {
  title: 'Updated Title',
})
```

#### db.{collection}.delete(id)

Deletes a document by its ID.

```typescript
await db.posts.delete('document-id')
```

#### db.{collection}.search(query, options?)

Performs a text search across documents in a collection.

```typescript
const searchResults = await db.posts.search('search term', {
  limit: 20,
  sort: 'relevance:desc',
})
```

## Dependencies

- [gray-matter](https://github.com/jonschlinkert/gray-matter) - For parsing MDX frontmatter

## License

MIT

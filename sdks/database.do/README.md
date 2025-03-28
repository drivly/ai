# [database.do](https://database.do)

[![npm version](https://img.shields.io/npm/v/database.do.svg?style=flat-square)](https://www.npmjs.org/package/database.do)
[![npm downloads](https://img.shields.io/npm/dm/database.do.svg?style=flat-square)](https://npmjs.org/package/database.do)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/database.do.svg?style=flat-square)](https://github.com/drivly/ai/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![Discord](https://img.shields.io/discord/1234567890?style=flat-square&label=Discord&logo=discord&logoColor=white)](https://discord.gg/drivly)

> AI-Native Data Access SDK for seamless database operations with MongoDB, PostgreSQL, and SQLite

`database.do` is a powerful SDK that simplifies database operations with an intuitive, declarative API. It provides a seamless interface for creating database schemas, managing relationships, and performing CRUD operations with built-in AI capabilities.

## Features

- **Simple, Declarative API** - Define your schema with a clean, intuitive syntax
- **Automatic Relationships** - Easily define and manage relationships between collections
- **AI-Native** - Built with AI-first principles for intelligent data operations
- **Multiple Database Support** - Works with MongoDB, PostgreSQL, and SQLite
- **Admin UI Included** - Automatic admin interface for managing your data
- **REST API** - Full List + CRUD operations available through a REST API
- **Type Safety** - Full TypeScript support with inferred types from your schema
- **Advanced Querying** - Powerful filtering, sorting, and pagination capabilities
- **Authentication & Authorization** - Built-in security features

## Installation

```bash
# Using npm
npm install database.do

# Using yarn
yarn add database.do

# Using pnpm
pnpm add database.do
```

## Quick Start

```typescript
import { DB } from 'database.do'

// Define your database schema
const db = DB({
  posts: {
    title: 'text',
    content: 'richtext',
    status: 'Draft | Published | Archived', // Select field with predefined options
    contentType: 'Text | Markdown | Code | Object | Schema', // Another select field example
    tags: 'tags[]',
    author: 'authors',
  },
  tags: {
    name: 'text',
    posts: '<-posts.tags', // Join field to posts (reverse relation)
  },
  authors: {
    name: 'text',
    email: 'email',
    role: 'Admin | Editor | Writer', // Select field with predefined options
    posts: '<-posts.author', // Join field to posts (reverse relation)
  },
})

// Create a new post
const post = await db.posts.create({
  title: 'Getting Started with database.do',
  content: 'This is a sample post created with database.do SDK',
  status: 'Published',
  contentType: 'Markdown',
  tags: ['database', 'tutorial'],
  author: 'author123',
})

// Query posts with filtering
const publishedPosts = await db.posts.find({
  status: 'Published',
  author: 'author123',
})

// Update a post
await db.posts.update(post.id, {
  title: 'Updated Title',
})

// Delete a post
await db.posts.delete(post.id)
```

## Usage Examples

### Defining Schema with Relationships

```typescript
import { DB } from 'database.do'

const db = DB({
  products: {
    name: 'text',
    description: 'richtext',
    price: 'number',
    category: 'categories',
    tags: 'tags[]',
    isAvailable: 'boolean',
  },
  categories: {
    name: 'text',
    description: 'text',
    products: '<-products.category',
  },
  tags: {
    name: 'text',
    products: '<-products.tags',
  },
  orders: {
    customer: 'customers',
    products: 'products[]',
    status: 'Pending | Processing | Shipped | Delivered | Cancelled',
    orderDate: 'date',
    totalAmount: 'number',
  },
  customers: {
    name: 'text',
    email: 'email',
    orders: '<-orders.customer',
  },
})
```

### Advanced Querying

```typescript
// Find products with pagination and sorting
const products = await db.products.find(
  {
    price: { gt: 100 },
    isAvailable: true,
    category: 'electronics',
  },
  {
    limit: 10,
    page: 1,
    sort: { price: 'desc' },
  },
)

// Find with complex filters
const results = await db.posts.find({
  $or: [{ status: 'Published' }, { author: 'author123' }],
  $and: [{ createdAt: { gt: new Date('2023-01-01') } }, { tags: { contains: 'featured' } }],
})
```

### Populating Related Data

```typescript
// Get posts with author and tags populated
const posts = await db.posts.find(
  {},
  {
    populate: ['author', 'tags'],
  },
)

// Get a single post with all relations populated
const post = await db.posts.findOne(
  { id: 'post123' },
  {
    populate: true, // Populate all relations
  },
)
```

## API Reference

### DB(schema)

Creates a new database instance with the specified schema.

```typescript
const db = DB(schema, options?)
```

#### Schema Definition

The schema is an object where each key represents a collection and its value defines the fields:

```typescript
{
  collectionName: {
    fieldName: fieldType
  }
}
```

Field types can be:

- Primitive types: `'text'`, `'richtext'`, `'number'`, `'boolean'`, `'date'`, `'email'`
- Enum types: `'Option1 | Option2 | Option3'`
- Relation types: `'collectionName'` (single relation) or `'collectionName[]'` (multiple relations)
- Reverse relations: `'<-collectionName.fieldName'`

#### Collection Methods

Each collection in the schema gets the following methods:

- `find(filter?, options?)` - Find multiple documents
- `findOne(filter, options?)` - Find a single document
- `create(data)` - Create a new document
- `update(id, data)` - Update an existing document
- `delete(id)` - Delete a document
- `count(filter?)` - Count documents matching a filter

## Implementation Details

Behind the scenes, `database.do` uses [Payload CMS](https://payloadcms.com) to create a database schema:

- **MongoDB** support via Mongoose
- **PostgreSQL** and **SQLite** support via Drizzle ORM
- Automatic Admin UI generation
- REST API with full List + CRUD operations
- Authentication and authorization
- Media handling
- Webhooks and more

## Related Projects

- [functions.do](https://functions.do) - Typesafe AI Functions
- [workflows.do](https://workflows.do) - Business Process Automation
- [agents.do](https://agents.do) - Autonomous Digital Workers
- [apis.do](https://apis.do) - Clickable Developer Experiences

## License

MIT © [Drivly](https://driv.ly)

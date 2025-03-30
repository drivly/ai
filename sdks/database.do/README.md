# [database.do](https://database.do)

[![npm version](https://img.shields.io/npm/v/database.do.svg?style=flat-square)](https://www.npmjs.org/package/database.do)
[![npm downloads](https://img.shields.io/npm/dm/database.do.svg?style=flat-square)](https://npmjs.org/package/database.do)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/database.do.svg?style=flat-square)](https://github.com/drivly/ai/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![Discord](https://img.shields.io/discord/1234567890?style=flat-square&label=Discord&logo=discord&logoColor=white)](https://discord.gg/drivly)

> AI-Native Data Access SDK for seamless database operations with MongoDB, PostgreSQL, and SQLite

`database.do` is a powerful SDK that simplifies database operations with an intuitive API. It provides a seamless interface for managing collections and performing CRUD operations with built-in AI capabilities, all while maintaining zero dependencies except for `apis.do`.

## Features

- **Simple, Intuitive API** - Clean and straightforward methods for database operations
- **Flexible Schema Support** - Works with both schema-less and defined schema types
- **AI-Native** - Built with AI-first principles for intelligent data operations
- **Multiple Database Support** - Works with MongoDB, PostgreSQL, and SQLite
- **Admin UI Included** - Automatic admin interface for managing your data
- **REST API** - Full List + CRUD operations available through a REST API
- **Type Safety** - Full TypeScript support with strongly-typed interfaces
- **Advanced Querying** - Powerful filtering, sorting, and pagination capabilities
- **Authentication & Authorization** - Built-in security features
- **Zero Dependencies** - Only depends on `apis.do` for API communication
- **Lightweight** - Minimal footprint for both browser and Node.js environments

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
import { DatabaseClient } from 'database.do'

// Initialize the database client
const db = new DatabaseClient({
  baseUrl: 'https://database.do', // Optional, defaults to https://database.do
  apiKey: 'YOUR_API_KEY_HERE', // Optional, for authenticated requests
})

// Create a new post
const post = await db.create('posts', {
  title: 'Getting Started with database.do',
  content: 'This is a sample post created with database.do SDK',
  status: 'Published',
  contentType: 'Markdown',
  tags: ['database', 'tutorial'],
  author: 'author123',
})

// Query posts with filtering
const publishedPosts = await db.find('posts', {
  where: {
    status: 'Published',
    author: 'author123',
  },
})

// Get a post by ID
const singlePost = await db.findOne('posts', post.id)

// Update a post
await db.update('posts', post.id, {
  title: 'Updated Title',
})

// Delete a post
await db.delete('posts', post.id)
```

## Usage Examples

### Schema-less Usage

The database.do SDK supports schema-less operations, allowing you to work with collections without predefined schemas:

```typescript
import { DatabaseClient } from 'database.do'

// Initialize the database client
const db = new DatabaseClient()

// Create documents in any collection without predefined schema
const product = await db.create('products', {
  name: 'Smart Speaker',
  description: 'Voice-controlled smart speaker with AI assistant',
  price: 99.99,
  category: 'electronics',
  tags: ['smart-home', 'audio', 'voice-control'],
  isAvailable: true,
  // Add any fields you need without schema constraints
  dimensions: {
    height: 15,
    width: 10,
    depth: 10,
  },
  features: ['voice-control', 'multi-room-audio', 'smart-home-integration'],
})

// Create a customer
const customer = await db.create('customers', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  // Add any fields without schema constraints
  preferences: {
    notifications: true,
    theme: 'dark',
  },
})

// Create an order with flexible structure
const order = await db.create('orders', {
  customer: customer.id,
  products: [product.id],
  status: 'Processing',
  orderDate: new Date(),
  totalAmount: 99.99,
  // Add any additional fields as needed
  shippingAddress: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
  },
  paymentMethod: 'credit_card',
})
```

### Working with Defined Schemas

When working with a defined schema (created through the database.do admin interface or API), you get additional benefits like validation and relationships:

```typescript
import { DatabaseClient } from 'database.do'

const db = new DatabaseClient()

// Create documents that conform to your defined schema
// The server will validate the data against your schema
const product = await db.create('products', {
  name: 'Smart Display',
  description: 'Touch-screen smart display with voice assistant',
  price: 149.99,
  category: 'electronics', // References the categories collection
  tags: ['smart-home', 'display'], // References the tags collection
  isAvailable: true,
})

// The schema ensures data consistency and relationships
const order = await db.create('orders', {
  customer: 'customer-id', // References the customers collection
  products: ['product-id-1', 'product-id-2'], // References the products collection
  status: 'Processing', // Enum value defined in schema
  orderDate: new Date(),
  totalAmount: 249.98,
})
```

### Advanced Querying

```typescript
import { DatabaseClient } from 'database.do'

const db = new DatabaseClient()

// Find products with pagination and sorting
const products = await db.find('products', {
  where: {
    price: { gt: 100 },
    isAvailable: true,
    category: 'electronics',
  },
  limit: 10,
  page: 1,
  sort: 'price:desc',
})

// Find with complex filters
const results = await db.find('posts', {
  where: {
    $or: [
      { status: 'Published' }, 
      { author: 'author123' }
    ],
    $and: [
      { createdAt: { gt: new Date('2023-01-01').toISOString() } }, 
      { tags: { contains: 'featured' } }
    ],
  },
})

// Search functionality
const searchResults = await db.search('products', 'smart speaker', {
  limit: 20,
  sort: 'relevance:desc',
})
```

### Working with Related Data

```typescript
import { DatabaseClient } from 'database.do'

const db = new DatabaseClient()

// Get posts with related data
const posts = await db.find('posts', {
  populate: ['author', 'tags'],
})

// Get a single order with customer data
const order = await db.findOne('orders', 'order123')
const customer = await db.findOne('customers', order.customer)

// Get all orders for a customer
const customerOrders = await db.find('orders', {
  where: {
    customer: customer.id,
  },
})
```

## API Reference

### DatabaseClient

The main client for interacting with the database.

```typescript
import { DatabaseClient } from 'database.do'

const db = new DatabaseClient({
  baseUrl?: string, // Optional, defaults to 'https://database.do'
  apiKey?: string,  // Optional, for authenticated requests
})
```

### Methods

#### find(collection, options?)

Retrieves multiple documents from a collection with optional filtering, sorting, and pagination.

```typescript
interface QueryOptions {
  where?: Record<string, any>  // Filter criteria
  sort?: string | string[]     // Sorting options
  limit?: number               // Number of results per page
  page?: number                // Page number
  select?: string | string[]   // Fields to include
  populate?: string | string[] // Relations to populate
}

const results = await db.find('collection', options)
```

#### findOne(collection, id)

Retrieves a single document by its ID.

```typescript
const document = await db.findOne('collection', 'document-id')
```

#### create(collection, data)

Creates a new document in the collection.

```typescript
const newDocument = await db.create('collection', {
  field1: 'value1',
  field2: 'value2',
  // ...
})
```

#### update(collection, id, data)

Updates an existing document by its ID.

```typescript
const updatedDocument = await db.update('collection', 'document-id', {
  field1: 'new value',
  // ...
})
```

#### delete(collection, id)

Deletes a document by its ID.

```typescript
await db.delete('collection', 'document-id')
```

#### search(collection, query, options?)

Performs a text search across documents in a collection.

```typescript
const searchResults = await db.search('collection', 'search term', {
  limit: 20,
  sort: 'relevance:desc',
})
```

## Schema Support

`database.do` offers two approaches to working with data:

### Schema-less Mode

In schema-less mode, you can:
- Create collections and documents on-the-fly
- Add any fields to your documents without constraints
- Evolve your data model organically as your application grows
- Store JSON documents with nested objects and arrays
- Avoid upfront schema design when requirements are fluid

### Defined Schema Mode

With defined schemas, you gain:
- Data validation against your schema
- Relationship management between collections
- Type safety with TypeScript interfaces generated from your schema
- Admin UI fields customized to your schema
- API endpoints that respect your schema constraints
- Improved data consistency and integrity

You can define schemas through the database.do admin interface or API, and then use the SDK to interact with your data according to those schemas.

## Implementation Details

Behind the scenes, `database.do` uses [Payload CMS](https://payloadcms.com) to provide a powerful database solution:

- **MongoDB** support via Mongoose
- **PostgreSQL** and **SQLite** support via Drizzle ORM
- Automatic Admin UI generation
- REST API with full List + CRUD operations
- Authentication and authorization
- Media handling
- Webhooks and more

The SDK itself is designed to be lightweight with zero dependencies except for `apis.do`, making it suitable for both browser and Node.js environments. It communicates with the database.do service through a RESTful API, abstracting away the complexity of direct database interactions.

## Related Projects

- [functions.do](https://functions.do) - Typesafe AI Functions
- [workflows.do](https://workflows.do) - Business Process Automation
- [agents.do](https://agents.do) - Autonomous Digital Workers
- [apis.do](https://apis.do) - Clickable Developer Experiences
- [models.do](https://models.do) - AI Model Management
- [llm.do](https://llm.do) - Large Language Model Gateway

## Environment Compatibility

`database.do` is designed to work seamlessly in various JavaScript environments:

- **Browser** - Works in modern browsers without polyfills
- **Node.js** - Compatible with Node.js 18+ using native fetch
- **Edge Functions** - Optimized for serverless and edge environments
- **React Native** - Works with React Native applications

## License

MIT © [Drivly](https://driv.ly)

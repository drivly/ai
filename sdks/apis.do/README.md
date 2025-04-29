# [APIs.do](https://apis.do) - The Foundation of the .do Ecosystem

[![npm version](https://img.shields.io/npm/v/apis.do.svg)](https://www.npmjs.com/package/apis.do)
[![npm downloads](https://img.shields.io/npm/dm/apis.do.svg)](https://www.npmjs.com/package/apis.do)
[![License](https://img.shields.io/npm/l/apis.do.svg)](https://github.com/drivly/ai/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

> **Elegant APIs for economically valuable work**

## Overview

APIs.do is the foundational SDK and unified API Gateway for the entire [.do](https://dotdo.ai) ecosystem. As the core building block, it provides the essential infrastructure upon which all other .do services are built. This lightweight, zero-dependency SDK delivers a simple, type-safe interface to interact with Functions.do, Workflows.do, Agents.do, and all other .do services through a consistent, elegantly designed API.

## 🌟 Key Features

- **Foundation of the .do Ecosystem** - The core SDK upon which all other .do services are built
- **Zero Dependencies** - Lightweight implementation with no external runtime dependencies
- **Universal Gateway** - Single, elegant entry point to all `.do` services and domains
- **Extreme Simplicity** - Clean, intuitive API design that prioritizes developer experience
- **Type Safety** - Full TypeScript support with generics for end-to-end type safety
- **Cross-Platform** - Seamlessly works in Node.js, browsers, and edge environments
- **Elegant Authentication** - Simple, secure API key-based authentication
- **Comprehensive Error Handling** - Clear, actionable error information

## 🚀 Installation

```bash
# Using npm
npm install apis.do

# Using yarn
yarn add apis.do

# Using pnpm
pnpm add apis.do
```

## 🔍 The [.do](https://dotdo.ai) Ecosystem

As the foundation of the [.do](https://dotdo.ai) ecosystem, APIs.do provides elegant, unified access to all services:

```json
{
  "ai": {
    "Functions - Typesafe AI Results": "https://functions.do/api",
    "Workflows - Business Process Orchestration": "https://workflows.do/api",
    "Agents - Autonomous Digital Workers": "https://agents.do/api"
  },
  "events": {
    "Triggers - Event-Driven Process Initiation": "https://triggers.do",
    "Searches - Contextual Data Retrieval": "https://searches.do",
    "Actions - External System Operations": "https://actions.do"
  },
  "core": {
    "LLM - Intelligent AI Gateway": "https://llm.do",
    "Database - AI-Native Data Layer": "https://database.do",
    "Integrations - External System Connections": "https://integrations.do",
    "Analytics - Business Impact Measurement": "https://analytics.do",
    "Evals - Quality Assessment": "https://evals.do",
    "Experiments - Controlled Testing": "https://experiments.do"
  }
}
```

## 📋 Quick Start

The elegance of APIs.do is evident in its minimal, intuitive interface:

```typescript
import { API } from 'apis.do'

// Initialize with a single line
const api = new API({ apiKey: 'your-api-key' })

// Access any collection with simple, consistent patterns
const users = await api.users.find()
const user = await api.users.get('user-id')
const newUser = await api.users.create({ name: 'Jane Doe', email: 'jane@example.com' })
const updatedUser = await api.users.update('user-id', { status: 'active' })
await api.users.delete('user-id')

// The same elegant pattern works across all .do services
const functions = await api.functions.find()
const workflows = await api.workflows.find({ status: 'active' })
const agents = await api.agents.find({ type: 'assistant' })
```

## 🧩 Unified Collection Access

As the foundation of the [.do](https://dotdo.ai) ecosystem, APIs.do provides elegant, consistent access to all collections:

### AI Primitives

- `functions` - Typesafe AI functions that deliver predictable results
- `workflows` - Elegant business process orchestration
- `agents` - Autonomous digital workers that accomplish tasks

### Core Data Model

- `things` - Business entities with properties and relationships
- `nouns` - Entity types and categories
- `verbs` - Actions and relationships between entities

### Event System

- `triggers` - Event-driven process initiation
- `searches` - Contextual data retrieval
- `actions` - External system operations

### Observability

- `generations` - Before/after state records
- `events` - System event tracking
- `traces` - Execution path visualization

### Integrations

- `integrations` - External system connections
- `integration-triggers` - External event sources
- `integration-actions` - External system operations

## 📊 Type-Safe Elegance

APIs.do provides full TypeScript support with a clean, intuitive interface:

```typescript
import { API } from 'apis.do'
import type { Function, Workflow, Agent, Thing, Action } from 'apis.do/types'

// Simple initialization
const api = new API({ apiKey: process.env.DO_API_KEY })

// Create an AI function with type safety
const createFunction = async () => {
  return await api.functions.create({
    name: 'Product Description Generator',
    type: 'Generation',
    format: 'Object',
    schema: {
      productType: 'string',
      customer: 'string',
      solution: 'string',
      description: 'string',
    },
    prompt: 'Generate a product description based on the input',
  })
}

// Access workflows with the same elegant pattern
const getActiveWorkflows = async () => {
  return await api.workflows.find({ status: 'active' })
}

// Create data entities with consistent patterns
const createCustomer = async (data: Partial<Thing>) => {
  return await api.things.create({
    name: data.name,
    type: 'customer',
    data,
  })
}

// Query relationships with intuitive filtering
const getCustomerPurchases = async (customerId: string) => {
  return await api.actions.find({
    subject: customerId,
    verb: 'purchased',
  })
}
```

## 🔧 Elegant Advanced Features

Even advanced features maintain the same elegant simplicity:

### Powerful Search & Filtering

```typescript
// Natural language search across collections
const searchResults = await api.users.search('active customers in California')

// Structured filtering with intuitive syntax
const activeUsers = await api.users.find({ status: 'active', 'profile.location.state': 'CA' }, { limit: 10, sort: '-createdAt' })
```

### Direct API Access

When needed, access the underlying API directly with the same elegant patterns:

```typescript
// Direct GET requests
const data = await api.get('/api/custom-endpoint')

// Direct POST requests with the same consistent interface
const response = await api.post('/api/custom-endpoint', { key: 'value' })
```

## 🔄 The Foundation of the [.do](https://dotdo.ai) Ecosystem

As the core SDK, APIs.do provides the foundation for all other .do services:

```typescript
import { API } from 'apis.do'
import type { Function, Workflow, Agent, Thing, Action } from 'apis.do/types'

// One client to access the entire ecosystem
const api = new API({ apiKey: process.env.DO_API_KEY })

// Execute AI functions with a simple, consistent interface
const generateContent = async (prompt: string) => {
  return api.functions.execute('content-generator', { prompt })
}

// Orchestrate business processes with the same elegant pattern
const processOrder = async (orderId: string) => {
  return api.workflows.trigger('order-fulfillment', { orderId })
}

// Delegate tasks to autonomous agents
const researchTopic = async (topic: string) => {
  return api.agents.ask('research-assistant', { question: `Research ${topic}` })
}

// Create relationships between business entities
const recordPurchase = async (customerId: string, productId: string) => {
  return api.actions.create({
    subject: customerId,
    verb: 'purchased',
    object: productId,
  })
}
```

## 📊 Elegant Business Solutions

The foundational nature of APIs.do enables elegant solutions to complex business problems:

```typescript
import { API } from 'apis.do'
import type { Thing, Function, Agent } from 'apis.do/types'

// One client for the entire ecosystem
const api = new API({ apiKey: process.env.DO_API_KEY })

async function createBusinessInsights(companyId: string) {
  // Access company data with a simple, consistent pattern
  const company = await api.things.get(companyId)

  // Query sales data with intuitive filtering
  const salesData = await api.things.find(
    {
      type: 'sale',
      'data.companyId': companyId,
      'data.date': { $gte: '2023-01-01' },
    },
    { sort: '-createdAt', limit: 100 },
  )

  // Execute AI analysis with the same elegant interface
  const analysis = await api.functions.execute('sales-trend-analyzer', {
    sales: salesData,
    timeframe: 'quarterly',
  })

  // Get AI-powered recommendations
  const recommendations = await api.agents.ask('business-advisor', {
    question: 'What are the top 3 strategic actions for this company?',
    context: { company, salesData, analysis },
  })

  // Create a dashboard entity
  const dashboard = await api.things.create({
    name: `${company.name} Strategic Dashboard`,
    type: 'dashboard',
    data: {
      company: companyId,
      analysis,
      recommendations: recommendations.suggestions,
    },
  })

  // Create a relationship between entities
  await api.actions.create({
    subject: companyId,
    verb: 'has',
    object: dashboard.id,
  })

  return dashboard
}
```

## 📘 API Reference

### Client Initialization

```typescript
const api = new API({
  baseUrl?: string, // Default: 'https://apis.do'
  apiKey?: string,  // Your API key
  headers?: Record<string, string> // Additional headers
})
```

### Core Methods

| Method                                                   | Description           |
| -------------------------------------------------------- | --------------------- |
| `get<T>(path: string, params?: QueryParams): Promise<T>` | Make a GET request    |
| `get<T>(collection: string, id: string): Promise<T>`     | Get an item by ID     |
| `post<T>(path: string, data: any): Promise<T>`           | Make a POST request   |
| `put<T>(path: string, data: any): Promise<T>`            | Make a PUT request    |
| `patch<T>(path: string, data: any): Promise<T>`          | Make a PATCH request  |
| `delete<T>(path: string): Promise<T>`                    | Make a DELETE request |

### Collection Methods

| Method                                                                                         | Description                |
| ---------------------------------------------------------------------------------------------- | -------------------------- |
| `list<T>(collection: string, params?: QueryParams): Promise<ListResponse<T>>`                  | List items in a collection |
| `getById<T>(collection: string, id: string): Promise<T>`                                       | Get an item by ID          |
| `create<T>(collection: string, data: Partial<T>): Promise<T>`                                  | Create a new item          |
| `update<T>(collection: string, id: string, data: Partial<T>): Promise<T>`                      | Update an item             |
| `replace<T>(collection: string, id: string, data: T): Promise<T>`                              | Replace an item            |
| `remove<T>(collection: string, id: string): Promise<T>`                                        | Delete an item             |
| `search<T>(collection: string, query: string, params?: QueryParams): Promise<ListResponse<T>>` | Search within a collection |

### Query Parameters

| Parameter  | Type                  | Description                                  |
| ---------- | --------------------- | -------------------------------------------- |
| `limit`    | `number`              | Maximum number of items to return            |
| `page`     | `number`              | Page number for pagination                   |
| `sort`     | `string \| string[]`  | Sort fields (prefix with `-` for descending) |
| `where`    | `Record<string, any>` | Filter conditions                            |
| `select`   | `string \| string[]`  | Fields to include in the response            |
| `populate` | `string \| string[]`  | Relations to populate                        |

## ❌ Error Handling

The SDK provides detailed error information when API requests fail:

```typescript
try {
  const user = await api.getById('users', 'non-existent-id')
} catch (error) {
  if (error.status === 404) {
    console.error('User not found')
  } else if (error.status === 401) {
    console.error('Authentication failed - please check your API key')
  } else {
    console.error('API Error:', error.message)
  }
}
```

## 🔒 Authentication

APIs.do supports multiple authentication methods, with different recommendations based on your environment:

### Browser Authentication (Recommended for Client-Side Code)

For browser environments, OAuth-based authentication is strongly recommended for security:

```typescript
// Browser environment - no explicit credentials needed
// Uses secure cookies from OAuth authentication
const api = new API()

// Handle authentication errors by redirecting to login
try {
  const data = await api.list('products')
} catch (error) {
  if (error.status === 401) {
    // Redirect to OAuth login with return URL
    window.location.href = 'https://apis.do/login?redirect=' + encodeURIComponent(window.location.href)
  }
}
```

The OAuth flow works as follows:
1. User is redirected to `https://apis.do/login`
2. User authenticates using the authorization code flow
3. Secure, HttpOnly cookies are set with credentials
4. Cookies are automatically sent with subsequent API requests
5. No credentials are exposed in client-side code

### Secure Cookie Requirements

For cross-domain cookie authentication to work properly:
- Cookies must have the `HttpOnly` flag to prevent JavaScript access
- Cookies must have the `Secure` flag to ensure HTTPS-only transmission
- Cookies must use appropriate `SameSite` attributes (typically 'None' with Secure flag)
- Your application domain must be registered as an allowed origin

### Server-Side Authentication

For server-side environments, API key authentication is recommended:

```typescript
// API Key Authentication (recommended for server-side)
const api = new API({
  apiKey: 'your-api-key',
})

// Custom Header Authentication
const api = new API({
  headers: {
    'X-Custom-Auth': 'custom-token',
  },
})

// OAuth Token (alternative for server-side)
const api = new API({
  headers: {
    Authorization: `Bearer ${oauthToken}`,
  },
})
```

### CLI Authentication

The CLI provides a browser-based authentication flow:

```bash
# Login via browser
apis.do login

# Login with an existing API key
apis.do login YOUR_API_KEY

# Logout and remove stored credentials
apis.do logout
```

When using `apis.do login` without a token, the CLI will:

1. Open your default browser to the login page
2. Allow you to authenticate with your account
3. Generate a machine-specific API key
4. Securely store the key for future CLI use

The stored API key is automatically used for all subsequent CLI commands.

## 📐 TypeScript Support

The SDK provides built-in types for all collections in the platform, giving you full type safety:

```typescript
import { API } from 'apis.do'
import type { Function, Workflow, Agent, Thing, Action, Verb, Noun, Generation } from 'apis.do/types'

const api = new API({
  apiKey: process.env.APIS_DO_API_KEY,
})

// Now you get full type safety with platform collections
const functions = await api.functions.find()
functions.forEach((func) => console.log(func.name, func.type))

// Create with type checking
const newFunction = await api.functions.create({
  name: 'Summarize Text',
  type: 'Generation',
  format: 'Text',
  prompt: 'Summarize the following text:',
})

// TypeScript will catch errors like this:
const invalidFunction = await api.functions.create({
  name: 'Invalid Function',
  type: 'Unknown', // Error: Type '"Unknown"' is not assignable to type '"Generation" | "Code" | "Human" | "Agent"'
})

// You can also define your own custom types
interface CustomThing {
  id: string
  name: string
  customField: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

// And use them with the SDK
const customThings = await api.things.find({ type: 'custom' })
```

## 🌐 Browser Usage

APIs.do works seamlessly in browser environments using secure OAuth authentication:

```html
<script type="module">
  import { API } from 'https://cdn.jsdelivr.net/npm/apis.do/dist/index.js'

  const api = new API({
    // No explicit API key - uses cookies from OAuth authentication
  })

  // NOTE: User must first log in via OAuth at https://apis.do/login
  // This will set secure cookies that will be automatically sent with API requests

  async function loadData() {
    try {
      const data = await api.list('products')
      document.getElementById('products').innerHTML = data.data.map((product) => `<li>${product.name} - $${product.price}</li>`).join('')
    } catch (error) {
      // Handle authentication errors
      if (error.status === 401) {
        window.location.href = 'https://apis.do/login?redirect=' + encodeURIComponent(window.location.href)
      }
      console.error('Failed to load products:', error)
    }
  }

  loadData()
</script>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/drivly/ai/blob/main/LICENSE) file for details.

## 🔗 Links

- [APIs.do Website](https://apis.do)
- [Documentation](https://apis.do/docs)
- [GitHub Repository](https://github.com/drivly/ai)
- [Issue Tracker](https://github.com/drivly/ai/issues)
- [NPM Package](https://www.npmjs.com/package/apis.do)

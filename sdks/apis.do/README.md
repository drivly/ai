# [APIs.do](https://apis.do) - Clickable Developer Experiences

[![npm version](https://img.shields.io/npm/v/apis.do.svg)](https://www.npmjs.com/package/apis.do)
[![npm downloads](https://img.shields.io/npm/dm/apis.do.svg)](https://www.npmjs.com/package/apis.do)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/apis.do.svg)](https://github.com/drivly/ai/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md)
[![Minified Size](https://img.shields.io/bundlephobia/min/apis.do)](https://bundlephobia.com/package/apis.do)

> **Economically valuable work delivered through simple APIs**

## Overview

APIs.do is the unified API Gateway for all domains and services in the `.do` ecosystem. This SDK provides a simple, type-safe way to interact with the entire `.do` universe, enabling seamless integration with Functions.do, Workflows.do, Agents.do, and other services through a consistent, developer-friendly interface.

## 🌟 Key Features

- **Universal Gateway** - Single entry point to all `.do` services and domains
- **Simple Authentication** - Secure API key-based authentication
- **RESTful Operations** - Complete CRUD support for all collections
- **Advanced Querying** - Powerful search, filtering, and pagination capabilities
- **Type Safety** - Full TypeScript support with generics for end-to-end type safety
- **Cross-Platform** - Works in Node.js, browsers, and edge environments
- **Minimal Dependencies** - Lightweight with zero external runtime dependencies
- **Comprehensive Error Handling** - Detailed error information and recovery options

## 🚀 Installation

```bash
# Using npm
npm install apis.do

# Using yarn
yarn add apis.do

# Using pnpm
pnpm add apis.do
```

## 🔍 The `.do` Ecosystem

APIs.do provides unified access to the entire `.do` ecosystem:

```json
{
  "ai": {
    "Functions - Typesafe Results without Complexity": "https://functions.do/api",
    "Workflows - Reliably Execute Business Processes": "https://workflows.do/api",
    "Agents - Deploy & Manage Autonomous Digital Workers": "https://agents.do/api"
  },
  "events": {
    "Triggers - Initiate workflows based on events": "https://triggers.do",
    "Searches - Query and retrieve data": "https://searches.do",
    "Actions - Perform tasks within workflows": "https://actions.do"
  },
  "core": {
    "LLM - Intelligent AI Gateway": "https://llm.do",
    "Evals - Evaluate Functions, Workflows, and Agents": "https://evals.do",
    "Analytics - Economically Validate Workflows": "https://analytics.do",
    "Experiments - Economically Validate Workflows": "https://experiments.do",
    "Database - AI Native Data Access (Search + CRUD)": "https://database.do",
    "Integrations - Connect External APIs and Systems": "https://integrations.do"
  }
}
```

## 📋 Quick Start

```typescript
import { ApiClient } from 'apis.do'

// Initialize the client
const api = new ApiClient({
  apiKey: 'your-api-key', // Optional: API key for authenticated requests
})

// Basic CRUD operations
const getUsers = async () => {
  const users = await api.list('users')
  console.log(users.data)
}

const getUserById = async (id: string) => {
  const user = await api.getById('users', id)
  console.log(user)
}

const createUser = async (userData: any) => {
  const newUser = await api.create('users', userData)
  console.log(newUser)
}

const updateUser = async (id: string, userData: any) => {
  const updatedUser = await api.update('users', id, userData)
  console.log(updatedUser)
}

const deleteUser = async (id: string) => {
  await api.remove('users', id)
  console.log('User deleted')
}
```

## 🧩 Collection Types

The APIs.do SDK provides access to all collections in the platform. Here are the main collection types available:

### AI Collections
- `functions` - AI functions with type, schema, and code/prompt
- `workflows` - Declarative state machines for orchestration
- `agents` - Autonomous digital workers

### Data Collections
- `things` - Core data entities with properties
- `nouns` - Categories or types of Things
- `verbs` - Action forms and relationships

### Event Collections
- `triggers` - Events that initiate workflows
- `searches` - Query operations for retrieving data
- `actions` - Tasks performed within workflows

### Observability Collections
- `generations` - Records of system state before/after an Action
- `events` - System events with timestamps and metadata
- `traces` - Execution traces for debugging

### Integration Collections
- `integrations` - External system connections
- `integration-triggers` - Events from external systems
- `integration-actions` - Operations on external systems

## 📊 Strongly-Typed Collection Examples

```typescript
import { ApiClient } from 'apis.do'
import type { Function, Workflow, Agent, Thing, Action, Generation } from 'apis.do/types'

const api = new ApiClient({
  apiKey: process.env.APIS_DO_API_KEY || process.env.DO_API_KEY
})

// Working with AI Functions
async function getFunctions() {
  const functions = await api.list<Function>('functions')
  return functions.data
}

async function createFunction(functionData: Partial<Function>) {
  return await api.create<Function>('functions', {
    name: 'Example Function',
    type: 'Generation',
    format: 'Object',
    schema: {
      type: 'object',
      properties: {
        result: { type: 'string' }
      }
    },
    prompt: 'Generate a response based on the input',
    ...functionData
  })
}

// Working with Workflows
async function getWorkflow(id: string) {
  return await api.getById<Workflow>('workflows', id)
}

// Working with Things (core data entities)
async function createThing(data: Partial<Thing>) {
  return await api.create<Thing>('things', {
    name: 'Example Thing',
    data: { key: 'value' },
    ...data
  })
}

// Working with Actions
async function getActions(params?: { subject?: string, verb?: string }) {
  const where: Record<string, any> = {}
  if (params?.subject) where.subject = params.subject
  if (params?.verb) where.verb = params.verb
  
  return await api.list<Action>('actions', { where })
}

// Working with Generations (observability)
async function getGenerations(actionId: string) {
  return await api.list<Generation>('generations', {
    where: { action: actionId }
  })
}
```

## 🔧 Advanced Usage

### Searching and Filtering

```typescript
// Search for users with a specific query
const searchUsers = async (query: string) => {
  const results = await api.search('users', query)
  console.log(results.data)
}

// List with filtering and pagination
const listActiveUsers = async () => {
  const activeUsers = await api.list('users', {
    where: { status: 'active' },
    limit: 10,
    page: 1,
    sort: '-createdAt',
  })
  console.log(activeUsers.data)
  console.log(`Total: ${activeUsers.meta?.total}`)
}
```

### Custom Endpoints

```typescript
// Make custom GET requests
const getCustomData = async () => {
  const data = await api.get('/api/custom-endpoint')
  console.log(data)
}

// Make custom POST requests
const postCustomData = async (data: any) => {
  const response = await api.post('/api/custom-endpoint', data)
  console.log(response)
}
```

## 🔄 Integration with `.do` Services

APIs.do seamlessly integrates with the entire `.do` ecosystem:

```typescript
import { ApiClient } from 'apis.do'
import type { Function, Workflow, Agent, Thing, Action } from 'apis.do/types'

const api = new ApiClient({
  apiKey: process.env.APIS_DO_API_KEY || process.env.DO_API_KEY
})

// Example: Using Functions.do through the API Gateway
const runFunction = async (functionId: string, inputs: any) => {
  return api.post<any>(`/api/functions/${functionId}/execute`, inputs)
}

// Example: Triggering a Workflow
const startWorkflow = async (workflowId: string, context: any) => {
  return api.post<any>(`/api/workflows/${workflowId}/trigger`, context)
}

// Example: Interacting with an Agent
const askAgent = async (agentId: string, question: string) => {
  return api.post<any>(`/api/agents/${agentId}/ask`, { question })
}

// Example: Searching for data
const searchThings = async (query: string) => {
  return api.search<Thing>('things', query)
}

// Example: Executing an action
const executeAction = async (actionId: string, params: any) => {
  return api.post<any>(`/api/actions/${actionId}/execute`, params)
}

// Example: Creating a relationship between Things using Actions
const createRelationship = async (subjectId: string, verbName: string, objectId: string) => {
  return api.create<Action>('actions', {
    subject: subjectId,
    verb: verbName,
    object: objectId
  })
}
```

## 📊 Real-World Example: AI-Powered Business Intelligence Dashboard

```typescript
import { ApiClient } from 'apis.do'
import type { Thing, Function, Agent, Action } from 'apis.do/types'

const api = new ApiClient({ apiKey: process.env.APIS_DO_API_KEY })

async function generateBusinessDashboard(companyId: string) {
  // Fetch company data from Things collection
  const company = await api.getById<Thing>('things', companyId)

  // Get recent sales data from Things collection
  const salesData = await api.list<Thing>('things', {
    where: { 
      type: 'sale', 
      'data.companyId': companyId,
      'data.date': { $gte: '2023-01-01' } 
    },
    sort: '-createdAt',
    limit: 100,
  })

  // Get the sales analysis function
  const analyzeFunction = await api.list<Function>('functions', {
    where: { name: 'analyzeSalesTrends' },
    limit: 1
  })
  
  // Execute the function to analyze sales trends
  const salesAnalysis = await api.post<any>(`/api/functions/${analyzeFunction.data[0].id}/execute`, {
    sales: salesData.data,
    timeframe: 'quarterly',
  })

  // Get the business advisor agent
  const advisorAgent = await api.list<Agent>('agents', {
    where: { name: 'businessAdvisor' },
    limit: 1
  })
  
  // Use the agent to generate recommendations
  const recommendations = await api.post<any>(`/api/agents/${advisorAgent.data[0].id}/ask`, {
    question: 'What are the top 3 actions this company should take based on recent sales data?',
    context: { 
      company, 
      salesData: salesData.data, 
      analysis: salesAnalysis 
    },
  })

  // Create a new dashboard Thing
  const dashboard = await api.create<Thing>('things', {
    name: `${company.name} Dashboard`,
    type: 'dashboard',
    data: {
      companyId,
      generatedAt: new Date().toISOString(),
      salesData: salesData.data.map(sale => sale.id),
      analysis: salesAnalysis,
      recommendations: recommendations.suggestions,
    }
  })
  
  // Create an Action to link the company to the dashboard
  await api.create<Action>('actions', {
    subject: companyId,
    verb: 'has',
    object: dashboard.id
  })
  
  return dashboard
}
```

## 📘 API Reference

### Client Initialization

```typescript
const api = new ApiClient({
  baseUrl?: string, // Default: 'https://apis.do'
  apiKey?: string,  // Your API key
  headers?: Record<string, string> // Additional headers
})
```

### Core Methods

| Method                                                   | Description           |
| -------------------------------------------------------- | --------------------- |
| `get<T>(path: string, params?: QueryParams): Promise<T>` | Make a GET request    |
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

APIs.do supports multiple authentication methods:

```typescript
// API Key Authentication (recommended)
const api = new ApiClient({
  apiKey: 'your-api-key',
})

// Custom Header Authentication
const api = new ApiClient({
  headers: {
    'X-Custom-Auth': 'custom-token',
  },
})

// OAuth Token
const api = new ApiClient({
  headers: {
    Authorization: `Bearer ${oauthToken}`,
  },
})
```

## 📐 TypeScript Support

The SDK provides built-in types for all collections in the platform, giving you full type safety:

```typescript
import { ApiClient } from 'apis.do'
import type { 
  Function, 
  Workflow, 
  Agent, 
  Thing, 
  Action, 
  Verb, 
  Noun, 
  Generation 
} from 'apis.do/types'

const api = new ApiClient({
  apiKey: process.env.APIS_DO_API_KEY
})

// Now you get full type safety with platform collections
const functions = await api.list<Function>('functions')
functions.data.forEach((func) => console.log(func.name, func.type))

// Create with type checking
const newFunction = await api.create<Function>('functions', {
  name: 'Summarize Text',
  type: 'Generation',
  format: 'Text',
  prompt: 'Summarize the following text:',
})

// TypeScript will catch errors like this:
const invalidFunction = await api.create<Function>('functions', {
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
const customThings = await api.list<CustomThing>('things', {
  where: { type: 'custom' }
})
```

## 🌐 Browser Usage

APIs.do works seamlessly in browser environments:

```html
<script type="module">
  import { ApiClient } from 'https://cdn.jsdelivr.net/npm/apis.do/dist/index.js'

  const api = new ApiClient({
    apiKey: 'your-api-key',
  })

  async function loadData() {
    try {
      const data = await api.list('products')
      document.getElementById('products').innerHTML = data.data.map((product) => `<li>${product.name} - $${product.price}</li>`).join('')
    } catch (error) {
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

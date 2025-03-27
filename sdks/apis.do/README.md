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
    sort: '-createdAt'
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
// Example: Using Functions.do through the API Gateway
const runFunction = async (functionName: string, inputs: any) => {
  return api.post(`/api/functions/${functionName}`, inputs)
}

// Example: Triggering a Workflow
const startWorkflow = async (workflowId: string, context: any) => {
  return api.post(`/api/workflows/${workflowId}/trigger`, context)
}

// Example: Interacting with an Agent
const askAgent = async (agentId: string, question: string) => {
  return api.post(`/api/agents/${agentId}/ask`, { question })
}

// Example: Searching for data
const searchData = async (query: string) => {
  return api.get(`/api/searches`, { q: query })
}

// Example: Executing an action
const executeAction = async (actionId: string, params: any) => {
  return api.post(`/api/actions/${actionId}/execute`, params)
}
```

## 📊 Real-World Example: Business Intelligence Dashboard

```typescript
import { ApiClient } from 'apis.do'

const api = new ApiClient({ apiKey: process.env.APIS_DO_KEY })

async function generateBusinessDashboard(companyId: string) {
  // Fetch company data
  const company = await api.getById('companies', companyId)
  
  // Get recent sales data
  const salesData = await api.list('sales', {
    where: { companyId, date: { $gte: '2023-01-01' } },
    sort: '-date',
    limit: 100
  })
  
  // Use Functions.do to analyze sales trends
  const salesAnalysis = await api.post('/api/functions/analyzeSalesTrends', {
    sales: salesData.data,
    timeframe: 'quarterly'
  })
  
  // Use Agents.do to generate recommendations
  const recommendations = await api.post('/api/agents/businessAdvisor/ask', {
    question: 'What are the top 3 actions this company should take based on recent sales data?',
    context: { company, salesData: salesData.data, analysis: salesAnalysis }
  })
  
  // Store the dashboard data
  return api.create('dashboards', {
    companyId,
    generatedAt: new Date().toISOString(),
    salesData: salesData.data,
    analysis: salesAnalysis,
    recommendations: recommendations.suggestions
  })
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

| Method | Description |
|--------|-------------|
| `get<T>(path: string, params?: QueryParams): Promise<T>` | Make a GET request |
| `post<T>(path: string, data: any): Promise<T>` | Make a POST request |
| `put<T>(path: string, data: any): Promise<T>` | Make a PUT request |
| `patch<T>(path: string, data: any): Promise<T>` | Make a PATCH request |
| `delete<T>(path: string): Promise<T>` | Make a DELETE request |

### Collection Methods

| Method | Description |
|--------|-------------|
| `list<T>(collection: string, params?: QueryParams): Promise<ListResponse<T>>` | List items in a collection |
| `getById<T>(collection: string, id: string): Promise<T>` | Get an item by ID |
| `create<T>(collection: string, data: Partial<T>): Promise<T>` | Create a new item |
| `update<T>(collection: string, id: string, data: Partial<T>): Promise<T>` | Update an item |
| `replace<T>(collection: string, id: string, data: T): Promise<T>` | Replace an item |
| `remove<T>(collection: string, id: string): Promise<T>` | Delete an item |
| `search<T>(collection: string, query: string, params?: QueryParams): Promise<ListResponse<T>>` | Search within a collection |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | `number` | Maximum number of items to return |
| `page` | `number` | Page number for pagination |
| `sort` | `string \| string[]` | Sort fields (prefix with `-` for descending) |
| `where` | `Record<string, any>` | Filter conditions |
| `select` | `string \| string[]` | Fields to include in the response |
| `populate` | `string \| string[]` | Relations to populate |

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
  apiKey: 'your-api-key'
})

// Custom Header Authentication
const api = new ApiClient({
  headers: {
    'X-Custom-Auth': 'custom-token'
  }
})

// OAuth Token
const api = new ApiClient({
  headers: {
    'Authorization': `Bearer ${oauthToken}`
  }
})
```

## 📐 TypeScript Support

For full type safety, you can define your data models:

```typescript
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

// Now you get full type safety
const users = await api.list<User>('users')
users.data.forEach(user => console.log(user.name))

// Create with type checking
const newUser = await api.create<User>('users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
})

// TypeScript will catch errors like this:
const invalidUser = await api.create<User>('users', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'superadmin' // Error: Type '"superadmin"' is not assignable to type '"admin" | "user"'
})
```

## 🌐 Browser Usage

APIs.do works seamlessly in browser environments:

```html
<script type="module">
  import { ApiClient } from 'https://cdn.jsdelivr.net/npm/apis.do/dist/index.js'
  
  const api = new ApiClient({
    apiKey: 'your-api-key'
  })
  
  async function loadData() {
    try {
      const data = await api.list('products')
      document.getElementById('products').innerHTML = data.data
        .map(product => `<li>${product.name} - $${product.price}</li>`)
        .join('')
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
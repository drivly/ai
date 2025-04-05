# [searches.do](https://searches.do) - Elegant Contextual Data Retrieval

[![npm version](https://img.shields.io/npm/v/searches.do.svg)](https://www.npmjs.com/package/searches.do)
[![npm downloads](https://img.shields.io/npm/dm/searches.do.svg)](https://www.npmjs.com/package/searches.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

> **Seamless access to contextual data through elegant, type-safe searches**

## Overview

Searches.do is a core primitive of the [.do](https://dotdo.ai) ecosystem, providing a clean, type-safe interface for retrieving contextual data from various sources. This SDK enables functions, workflows, and agents to access relevant information when needed, enhancing decision-making capabilities across your business processes.

## The Challenge

Contextual data retrieval presents several challenges:

- **Data Source Diversity**: Accessing information across disparate systems
- **Query Complexity**: Formulating precise queries for relevant results
- **Context Awareness**: Understanding the context of search requests
- **Result Relevance**: Delivering the most valuable information first
- **Performance**: Retrieving data quickly without compromising quality

## The Solution

Searches.do provides an elegant, type-safe interface for contextual data retrieval:

- **Unified Data Access**: Consistent patterns for accessing any data source
- **Intelligent Queries**: Simple yet powerful query capabilities
- **Context-Aware Results**: Results tailored to the specific use case
- **Relevance Optimization**: Most valuable information prioritized
- **Seamless Performance**: Fast retrieval without compromising quality

## Key Features

- **Elegant API Design** - Clean, intuitive interfaces for data retrieval
- **Type-Safe Queries** - Strongly-typed queries and results for reliable integration
- **Multi-Source Access** - Unified interface for diverse data sources
- **Context-Aware Results** - Results tailored to the specific use case
- **Seamless Integration** - Works with all [.do](https://dotdo.ai) services
- **Minimal Configuration** - Simple setup with sensible defaults

## Installation

```bash
npm install searches.do
# or
yarn add searches.do
# or
pnpm add searches.do
```

## Elegant API Design

The searches.do SDK provides a clean, intuitive interface for contextual data retrieval:

```typescript
import { Searches } from 'searches.do'

// Simple initialization with default settings
const searches = new Searches()

// Or with custom configuration
const searches = new Searches({
  apiKey: process.env.SEARCHES_API_KEY,
  baseUrl: process.env.SEARCHES_API_URL || 'https://searches.do',
})
```

### Performing Searches

```typescript
// Simple search with minimal configuration
const results = await searches.search('customers', {
  query: 'enterprise clients in healthcare',
  limit: 10,
})

// Advanced search with type-safe filters
const filteredResults = await searches.search('products', {
  query: 'wireless headphones',
  filters: {
    price: { range: [100, 300] },
    brand: { in: ['Sony', 'Bose', 'Apple'] },
    inStock: true,
  },
  sort: { field: 'rating', order: 'desc' },
  limit: 20,
})

// Access strongly-typed results
console.log(`Found ${results.total} results`)
results.items.forEach(item => {
  console.log(`${item.name}: ${item.description}`)
})
```

### Managing Search Sources

```typescript
// List available search sources
const sources = await searches.listSources()

// Get details about a specific search source
const customerSource = await searches.getSource('customers')
console.log(customerSource.schema) // View source schema
```

## Integration with the [.do](https://dotdo.ai) Ecosystem

Searches.do is designed to work seamlessly with other [.do](https://dotdo.ai) services:

```typescript
import { AI } from 'functions.do'
import { Workflow } from 'workflows.do'
import { Searches } from 'searches.do'

// Initialize services
const searches = new Searches()

// Define AI functions that use searches
const ai = AI({
  recommendProducts: async ({ customerQuery, preferences }) => {
    // Use searches.do to find relevant products
    const products = await searches.search('products', {
      query: customerQuery,
      filters: {
        category: { in: preferences.categories },
        price: { range: [preferences.minPrice, preferences.maxPrice] },
      },
      limit: 5,
    })
    
    // Process and return recommendations
    return {
      recommendations: products.items.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        rating: product.rating,
        imageUrl: product.imageUrl,
      })),
      totalMatches: products.total,
    }
  },
})

// Define a workflow that uses both functions and searches
const workflow = new Workflow({
  name: 'Customer Support',
  steps: [
    {
      name: 'Find Similar Issues',
      search: 'knowledgeBase',
      input: {
        query: '{{trigger.customerQuery}}',
        filters: {
          category: 'technical-support',
          product: '{{trigger.productId}}',
        },
      },
    },
    {
      name: 'Generate Response',
      function: 'createSupportResponse',
      input: {
        customerQuery: '{{trigger.customerQuery}}',
        similarIssues: '{{steps.findSimilarIssues.items}}',
        customerName: '{{trigger.customerName}}',
      },
    },
  ],
})
```

## The [.do](https://dotdo.ai) Ecosystem

Searches.do is a core primitive of the [.do](https://dotdo.ai) ecosystem, designed to work seamlessly with other .do services:

- **[apis.do](https://apis.do)** - The foundational SDK and unified API Gateway
- **[functions.do](https://functions.do)** - Strongly-typed AI functions
- **[workflows.do](https://workflows.do)** - Business process orchestration
- **[agents.do](https://agents.do)** - Autonomous digital workers
- **[actions.do](https://actions.do)** - External system operations
- **[triggers.do](https://triggers.do)** - Event-driven process initiation

## License

[MIT](https://opensource.org/licenses/MIT)

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the [.do](https://dotdo.ai) ecosystem

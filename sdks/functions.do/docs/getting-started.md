# Getting Started with Functions.do

This guide will help you get started with Functions.do, from installation to creating your first strongly-typed AI function.

## Installation

You can install Functions.do using your preferred package manager:

```bash
# Using npm
npm install functions.do

# Using yarn
yarn add functions.do

# Using pnpm
pnpm add functions.do
```

## Basic Configuration

Functions.do is designed to work with minimal configuration. The SDK exports two main components:

- `ai`: A flexible proxy for invoking AI functions with minimal syntax
- `AI`: A function for defining schemas and creating custom AI functions

### Creating a Functions Client

You can create a custom client instance if you need to configure API keys or endpoints:

```typescript
import { FunctionsClient } from 'functions.do'

// Create a client with default settings
const functionsClient = new FunctionsClient()

// Or with custom configuration
const customClient = new FunctionsClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-custom-endpoint.com',
})
```

## Authentication Setup

To authenticate with the Functions.do API, you need to provide an API key:

```typescript
// Using environment variable (recommended)
// Set FUNCTIONS_DO_API_KEY in your environment

// Or explicitly in code (not recommended for production)
const client = new FunctionsClient({
  apiKey: 'your-api-key',
})
```

## Your First AI Function: "Hello World"

Let's create a simple "Hello World" example using Functions.do:

### Using the `ai` Proxy (Simplest Approach)

```typescript
import { ai } from 'functions.do'

async function main() {
  // Simple invocation using tagged template literals
  const greeting = await ai`Say hello to the world`
  console.log(greeting) // "Hello, world!"

  // With input data
  const customGreeting = await ai`Say hello to ${name}`
  console.log(customGreeting) // "Hello, John!"
}

main().catch(console.error)
```

### Defining a Custom Function

```typescript
import { AI } from 'functions.do'

// Define a custom function with schema
const ai = AI({
  generateGreeting: {
    message: 'greeting message',
    recipient: 'name of the person or entity being greeted',
  },
})

async function main() {
  // Invoke the custom function
  const result = await ai.generateGreeting({ name: 'Functions.do' })
  console.log(result)
  // {
  //   message: "Hello and welcome!",
  //   recipient: "Functions.do"
  // }
}

main().catch(console.error)
```

## Next Steps

Now that you've created your first AI function, you can explore more advanced features:

- [API Reference](./api-reference.md) - Learn about all available methods and options
- [Usage Examples](./usage-examples.md) - Discover different invocation patterns and use cases
- [Integration Guide](./integration.md) - See how Functions.do works with other .do services

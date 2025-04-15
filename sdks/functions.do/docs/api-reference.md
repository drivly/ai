# Functions.do API Reference

This technical reference documents the classes, interfaces, and methods available in the Functions.do SDK.

## FunctionsClient Class

The `FunctionsClient` class is the main entry point for interacting with the Functions API programmatically.

### Constructor

```typescript
constructor(options: { apiKey?: string; baseUrl?: string } = {})
```

Creates a new FunctionsClient instance with optional configuration.

**Parameters:**
- `options.apiKey` (optional): API key for authentication
- `options.baseUrl` (optional): Base URL for the API (defaults to 'https://apis.do')

### Methods

#### run

```typescript
async run<T = any>(functionName: string, input: any, config?: AIConfig): Promise<FunctionResponse<T>>
```

Runs a function with the provided input and configuration.

**Parameters:**
- `functionName`: Name of the function to run
- `input`: Input data for the function
- `config` (optional): Configuration for the function execution

**Returns:** Promise resolving to the function response

#### create

```typescript
async create(functionDefinition: {
  name: string;
  description?: string;
  type?: 'Generation' | 'Code' | 'Human' | 'Agent';
  format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' | 'Video';
  schema?: any;
  prompt?: string;
  code?: string;
  role?: string;
  user?: string;
  agent?: string;
}): Promise<any>
```

Creates a new function with the specified definition.

**Parameters:**
- `functionDefinition`: Object containing the function definition
  - `name`: Name of the function
  - `description` (optional): Description of the function
  - `type` (optional): Type of function execution
  - `format` (optional): Output format of the function
  - `schema` (optional): JSON schema for validation
  - `prompt` (optional): Prompt template for generation functions
  - `code` (optional): Code to execute for code functions
  - `role` (optional): Role for the AI in generation functions
  - `user` (optional): User associated with the function
  - `agent` (optional): Agent to use for agent functions

**Returns:** Promise resolving to the created function

#### list

```typescript
async list(params?: { limit?: number; page?: number }): Promise<any>
```

Lists all functions with optional pagination.

**Parameters:**
- `params` (optional): Pagination parameters
  - `limit` (optional): Number of items per page
  - `page` (optional): Page number

**Returns:** Promise resolving to a list of functions

#### get

```typescript
async get(functionId: string): Promise<any>
```

Gets a function by ID.

**Parameters:**
- `functionId`: ID of the function to retrieve

**Returns:** Promise resolving to the function

#### update

```typescript
async update(functionId: string, data: any): Promise<any>
```

Updates a function.

**Parameters:**
- `functionId`: ID of the function to update
- `data`: Updated function data

**Returns:** Promise resolving to the updated function

#### delete

```typescript
async delete(functionId: string): Promise<any>
```

Deletes a function.

**Parameters:**
- `functionId`: ID of the function to delete

**Returns:** Promise resolving to the deletion result

## Interfaces

### FunctionDefinition

Defines a function that can be executed.

```typescript
interface FunctionDefinition {
  type?: 'Generation' | 'Code' | 'Human' | 'Agent';
  format?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code' | 'Video';
  schema?: any;
  prompt?: string;
  code?: string;
  role?: string;
  agent?: string;
  blocks?: SlackBlockSchema;
  [key: string]: any;
}
```

### AIConfig

Configuration options for AI execution.

```typescript
interface AIConfig {
  [key: string]: any;
}
```

### FunctionResponse<T>

Response from a function execution.

```typescript
interface FunctionResponse<T = any> {
  data: T;
  meta?: {
    duration?: number;
    modelName?: string;
    timestamp?: number;
    [key: string]: any;
  };
}
```

### SlackBlockSchema

Schema for defining interactive blocks in messaging platforms.

```typescript
interface SlackBlockSchema {
  title: string;
  description: string;
  options?: string[];
  freeText?: boolean;
  platform?: 'slack' | 'teams' | 'discord';
  timeout?: number;
  channel?: string;
  mentions?: string[];
  blocks?: SlackBlock[];
  modal?: boolean;
  components?: {
    datePicker?: boolean;
    timePicker?: boolean;
    multiSelect?: boolean;
    overflow?: boolean;
    image?: boolean;
    context?: boolean;
    divider?: boolean;
    header?: boolean;
    section?: boolean;
  };
}
```

### SlackBlock

Slack Block type for advanced UI components.

```typescript
interface SlackBlock {
  type: string;
  block_id?: string;
  [key: string]: any;
}
```

## Error Handling

The client methods throw errors if API calls fail. It's recommended to wrap your API calls in try/catch blocks:

```typescript
try {
  const result = await functionsClient.run('myFunction', { input: 'data' });
  // Handle successful result
} catch (error) {
  // Handle error
  console.error('Function execution failed:', error);
}
```

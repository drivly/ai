# AI Functions

AI Functions is a TypeScript library that provides a simple way to use AI models to generate structured data and text.

## Features

- **Dynamic AI Functions**: Use any function name with the `ai` proxy
- **Template Literals**: Generate content using template literals
- **Schema Support**: Validate AI responses with Zod schemas
- **List Generation**: Generate lists of items with the `list` function
- **Markdown Generation**: Generate markdown content with the `markdown` function
- **Model Configuration**: Override model, temperature, and other settings

## Installation

```bash
npm install @drivly/ai-functions
```

## Usage

### Basic Usage

```typescript
import { ai } from '@drivly/ai-functions'

// Generate text using template literals
const text = await ai`Write a short story about a robot`

// Generate a list of items
const items = await list`List 5 programming languages`

// Generate markdown content
const markdown = await markdown`Create a README for a TypeScript library`
```

### Dynamic Function Calls

```typescript
import { ai } from '@drivly/ai-functions'

// Call any function name with parameters
const categories = await ai.categorizeProduct({
  name: 'Product name',
  description: 'Product description'
})

// Parameters are used to generate a schema for validation
const blogPost = await ai.writeBlogPost({
  title: 'Blog post title',
  keywords: 'comma, separated, keywords',
  tone: 'professional'
})
```

### Schema Support

```typescript
import { ai } from '@drivly/ai-functions'
import { z } from 'zod'

// Define a schema for validation
const schema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string())
})

// Generate content with schema validation
const post = await ai`Write a blog post about AI`({
  schema,
  temperature: 0.7
})
```

### Configuration

```typescript
import { ai } from '@drivly/ai-functions'

// Override model, temperature, and other settings
const text = await ai`Write a poem about the ocean`({
  model: 'gpt-4o',
  temperature: 0.9,
  maxTokens: 500
})
```

## License

MIT

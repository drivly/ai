# research.do

Deep Research SDK for performing comprehensive research on any topic.

## Installation

```bash
npm install research.do
# or
yarn add research.do
# or
pnpm add research.do
```

## Usage

```typescript
import { research, ResearchClient } from 'research.do'

// Using the default client
const result = await research.research({
  topic: 'The impact of artificial intelligence on climate change',
  depth: 'deep',
  format: 'markdown',
})

// Or create a custom client
const customClient = new ResearchClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://custom-api.example.com',
})

const customResult = await customClient.research({
  topic: 'Quantum computing advancements in 2025',
  sources: ['academic', 'news', 'patents'],
  format: 'json',
})
```

## API Reference

### ResearchClient

The main client for interacting with the research.do API.

```typescript
const client = new ResearchClient(options)
```

#### Options

- `apiKey` - API key for authentication
- `baseUrl` - Base URL for API requests (default: 'https://apis.do')
- `headers` - Additional headers to include with requests

### research(params)

Perform deep research on a topic.

```typescript
const result = await client.research(params)
```

#### Parameters

- `topic` (required) - The topic to research
- `depth` - The depth of research to perform ('shallow', 'medium', 'deep')
- `sources` - Sources to include in the research (array of strings)
- `format` - Format for the research results ('markdown', 'json', 'html')
- `callback` - Callback URL to notify when research is complete

#### Response

```typescript
{
  success: boolean,
  taskId: string,
  jobId: string
}
```

## Error Handling

The SDK throws errors for invalid requests or server errors. Always use try/catch blocks to handle potential errors:

```typescript
try {
  const result = await research.research({
    topic: 'Quantum computing advancements',
  })
  console.log(result)
} catch (error) {
  console.error('Research request failed:', error.message)
}
```

## License

MIT

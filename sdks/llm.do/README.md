# llm.do AI SDK Provider

llm.do AI SDK Provider for the AI SDK.

## Installation

```bash
npm install llm.do
```

## Usage

```typescript
import { createLLMProvider } from 'llm.do'

const llm = createLLMProvider({
  apiKey: process.env.LLM_DO_API_KEY
})

const model = llm('gpt-4o')
```

## License

MIT

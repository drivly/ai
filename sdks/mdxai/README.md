# mdxai

CLI to recursively generate and edit MDX files using AI.

## Installation

```bash
npm install mdxai
# or
yarn add mdxai
# or
pnpm add mdxai
```

## Usage

### CLI

```bash
# Initialize configuration
mdxai init

# Generate new MDX file
mdxai generate path/to/file.mdx

# Edit existing MDX file
mdxai edit path/to/file.mdx

# Process multiple files
mdxai batch "content/**/*.mdx"
```

### API

```typescript
import { generateMDX, ai } from 'mdxai'

// Generate MDX content
const result = await generateMDX({
  prompt: 'Write a blog post about AI and MDX',
  type: 'BlogPosting',
  recursive: true
})

// Use AI functions
const titles = await ai.listBlogPostTitles('Generate 5 blog post titles about AI')
```

## Configuration

Configuration is stored in `.mdxai.json` in your project root. You can also set the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `AI_MODEL`: The AI model to use (default: gpt-4o-mini)
- `AI_GATEWAY`: URL for an OpenAI-compatible API gateway
- `CF_WORKERS_AI_TOKEN`: Token for Cloudflare Workers AI (when using @cf models)

## Features

- Generate new MDX files with AI
- Edit existing MDX files while preserving frontmatter
- Process multiple files with glob patterns
- Support for different content types via schema definitions
- Configurable AI model selection
- Recursive content generation

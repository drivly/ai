# mdxld

A modern TypeScript package for Markdown & MDX parsing with integrated YAML-LD frontmatter support. Parse MDX documents with type-safe YAML-LD frontmatter and optional AST support.

## Features

- 🔒 Full YAML-LD support in frontmatter with type-safe parsing
- 🔄 Support for both @ and $ property prefixes ($ preferred)
- 🌳 Optional AST parsing with common remark plugins
- 🔗 Optional Linked Data $context / $type enrichment
- 📦 Separate entry points for core and AST functionality
- 🚀 Built with TypeScript for type safety

## Usage

### Basic Usage

```typescript
import { parse, stringify } from 'mdxld'

const mdx = parse(`---
$type: 'https://mdx.org.ai/Document'
$context: 'https://schema.org'
title: 'My Document'
description: 'A sample document'
author: 'John Doe'
---

# Hello World
`)

console.log(mdx)
// Output:
// {
//   type: 'https://mdx.org.ai/Document',
//   context: 'https://schema.org',
//   data: {
//     title: 'My Document',
//     description: 'A sample document',
//     author: 'John Doe'
//   },
//   content: '# Hello World\n'
// }
```

### AST Support

For AST parsing with remark plugins:

```typescript
import { parse } from 'mdxld/ast'

const mdx = parse(`---
$type: 'https://mdx.org.ai/Document'
title: 'My Document'
---

# Hello World
`)

// Includes AST from remark parsing
console.log(mdx.ast)
```

## License

MIT © [AI Primitives](https://mdx.org.ai)

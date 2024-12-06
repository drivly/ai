# ai-database

A simple AI-native database with an elegant API, and backend provider stores for local MDX as well as Postgres, MongoDB, and Clickhouse.

The foundational document (i.e. record) concept is based on MDX, so that it can bridge human-readable structured content (YAML) with executable code (JS/TS), richly formatted content (Markdown) with support for interactive components (JSX/React). 

```mdx
---
title: My Document
tags: [ai, database]
---

export const myFunction = (a: number, b: number) => a * b

# {title}

 - idea 1
 - idea 2
 - idea 3

<Counter/>

```


## Installation

```bash
npm install ai-database
```



## Config

```typescript
// ai.config.ts

import { AIDatabaseConfig } from 'ai-database'

export const config: AIDatabaseConfig = {
  
}

```


## Types

```typescript

export type AIData = {
  '@id': string                    // The id of the document
  '@context'?: string              // The context of the document
  ns: string                       // The namespace of the document
  id: string                       // The id of the document
  mdx: string                      // The mdx of the document
  ast: {                           // The ast of the document
    // TODO: what are the types from remark?
    mdx: any 
    yml?: any
    // TODO: what are the types from the js/ts parser?
    js?: any
  }
  data: Record<string, any>        // The data of the document
}

```
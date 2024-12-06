# mdxdb

A simple database 

## Input

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

## Output

```javascript
export default {
  data: {
    title: 'My Document',
    tags: ['ai', 'database'],
  },
  content: '# My Document\n\n- idea 1\n- idea 2\n- idea 3\n\n<Counter/>',
  exports: {
    myFunction: (a: number, b: number) => a * b
  },
  Component: data => (
    <div>
      <h1>{title}</h1>
      <ul>
        <li>idea 1</li>
        <li>idea 2</li>
        <li>idea 3</li>
      </ul>
    </div>
    <Counter/>
  )
}
```
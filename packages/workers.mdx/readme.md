# workers.mdx

```bash
npx workers.mdx dev
```

```mdx
---
name: hello-world
zone: example.com
---

# Hello from {props.cf.city}, {props.cf.country}

export default new Hono().get('/api', (c) => c.json({ hello: 'hono' }))
```

```bash
npx workers.mdx deploy
```

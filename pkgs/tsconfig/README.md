# TypeScript Configuration

Shared TypeScript configurations for the drivly/ai monorepo.

## Usage

### Base Configuration

```json
{
  "extends": "tsconfig/src/base.json"
}
```

### Next.js Configuration

```json
{
  "extends": "tsconfig/src/nextjs.json"
}
```

### React/UI Configuration

```json
{
  "extends": "tsconfig/src/react.json"
}
```

### Cloudflare Worker Configuration

```json
{
  "extends": "tsconfig/src/worker.json"
}
```

Note: For Cloudflare Workers, you should also run `wrangler types` to generate the necessary type definitions.

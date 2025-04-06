# Payload OpenAPI Plugin

A plugin for Payload CMS that generates OpenAPI documentation for your collections.

## Features

- Automatically generates OpenAPI documentation for Payload CMS collections
- Customizable API title, description, and version
- Option to exclude specific collections
- Configurable documentation path

## Installation

```bash
pnpm add @drivly/payload-oapi-plugin
```

## Usage

```typescript
import { buildConfig } from 'payload'
import { payloadOapiPlugin } from '@drivly/payload-oapi-plugin'

export default buildConfig({
  // ... other config
  plugins: [
    payloadOapiPlugin({
      title: 'My API',
      description: 'API documentation for my Payload CMS',
      version: '1.0.0',
      excludeCollections: ['media'],
      path: '/api/docs',
    }),
    // ... other plugins
  ],
})
```

## Options

- `enabled`: Enable or disable OpenAPI documentation (default: `true`)
- `title`: API title (default: `'Payload CMS API'`)
- `description`: API description (default: `'API documentation for Payload CMS'`)
- `version`: API version (default: `'1.0.0'`)
- `excludeCollections`: Array of collection slugs to exclude from documentation (default: `[]`)
- `path`: Path to serve OpenAPI documentation (default: `'/api/docs'`)

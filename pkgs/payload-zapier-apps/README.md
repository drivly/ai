# Payload Zapier Apps

A package for generating Zapier integration apps for Payload CMS collections.

## Overview

This package automatically generates Zapier apps for your Payload CMS collections, allowing you to integrate your Payload CMS data with thousands of other tools and services through Zapier.

## Installation

```bash
npm install payload-zapier-apps
# or
yarn add payload-zapier-apps
# or
pnpm add payload-zapier-apps
```

## Usage

```typescript
import { generateZapierApps } from 'payload-zapier-apps'

// Generate Zapier apps with default options
await generateZapierApps()

// Generate Zapier apps with custom options
await generateZapierApps({
  collectionsPath: '/path/to/your/collections.js',
  outputDir: '/path/to/output/directory',
})
```

## Configuration

The `generateZapierApps` function accepts a configuration object with the following options:

| Option            | Type     | Description                                           | Default                                                    |
| ----------------- | -------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| `collectionsPath` | `string` | Path to the module exporting your Payload collections | `../../../collections/index.js` (relative to this package) |
| `outputDir`       | `string` | Directory where Zapier apps will be generated         | `./apps` (relative to this package)                        |

## Generated Apps

The package generates the following files for each collection:

- `index.js` - Main Zapier app file
- `authentication.js` - Authentication configuration
- `creates.js` - Create operations
- `searches.js` - List/search operations
- `gets.js` - Get operations
- `updates.js` - Update operations
- `deletes.js` - Delete operations

## Collection Format

The collections should be exported from your collections module in the following format:

```typescript
export const collections = [
  {
    slug: 'posts',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      // Additional fields...
    ],
    admin: {
      useAsTitle: 'title',
    },
  },
  // Additional collections...
]
```

## Publishing to Zapier

After generating the Zapier apps, you'll need to:

1. Navigate to each app directory
2. Install dependencies with `npm install`
3. Deploy to Zapier with `npm run deploy`

## License

MIT

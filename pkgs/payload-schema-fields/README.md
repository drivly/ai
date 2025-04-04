# Payload Schema Fields

A plugin for Payload CMS that provides schema field utilities with YAML and JSON5 support.

## Installation

```bash
npm install payload-schema-fields
```

## Usage

```typescript
import { buildConfig } from 'payload'
import { createSchemaFieldsPlugin, simplerJSON } from 'payload-schema-fields'

export default buildConfig({
  // ... other config
  plugins: [
    createSchemaFieldsPlugin({
      defaultFormat: 'yaml' // or 'json5'
    })
  ]
})
```

Then in your collections:

```typescript
import { simplerJSON } from 'payload-schema-fields'

export const MyCollection = {
  slug: 'myCollection',
  fields: [
    // ... other fields
    ...simplerJSON({
      jsonFieldName: 'data',
      codeFieldName: 'yaml',
      label: 'Schema',
      defaultFormat: 'yaml',
      editorOptions: { padding: { top: 20, bottom: 20 } }
    }),
  ]
}
```

## API Options

### simplerJSON Options

The `simplerJSON` function accepts the following options:

```typescript
type SimplerJSONOptions = {
  jsonFieldName?: string       // Name of the JSON field (default: 'shape')
  codeFieldName?: string       // Name of the code field (default: 'schemaYaml')
  label?: string               // Label for the field (default: 'Schema')
  defaultFormat?: 'yaml' | 'json5' // Format to use (default: 'yaml')
  adminCondition?: (data: any) => boolean // Condition for showing in admin
  editorOptions?: {            // Editor options
    lineNumbers?: 'on' | 'off'
    padding?: {
      top?: number
      bottom?: number
    }
  }
  hideJsonField?: boolean      // Whether to hide the JSON field (default: true)
}
```

## Features

- Supports both YAML and JSON5 formats
- Handles conversion between formats
- Provides validation
- Configurable field names, labels, and admin conditions

# Field Utilities

## simplerJSON

A utility function for creating paired schema fields:

1. A code field for editing in YAML or JSON5 format
2. A JSON field for storing the parsed data

### Usage

```typescript
import { simplerJSON } from '../../lib/fields/simplerJSON'

fields: [
  // Other fields...
  ...simplerJSON({
    jsonFieldName: 'data',
    codeFieldName: 'yaml',
    label: 'Content',
    defaultFormat: 'yaml',
  }),
  // More fields...
]
```

### Options

| Option         | Type              | Default                                                  | Description                                    |
| -------------- | ----------------- | -------------------------------------------------------- | ---------------------------------------------- |
| jsonFieldName  | string            | 'shape'                                                  | Name of the JSON field                         |
| codeFieldName  | string            | 'schemaYaml'                                             | Name of the code field                         |
| label          | string            | 'Schema'                                                 | Label for the code field                       |
| defaultFormat  | 'yaml' \| 'json5' | 'yaml'                                                   | Default format for the code field              |
| adminCondition | function          | () => true                                               | Condition for showing fields in admin UI       |
| editorOptions  | object            | { lineNumbers: 'off', padding: { top: 20, bottom: 20 } } | Editor options for the code field              |
| hideJsonField  | boolean           | true                                                     | Whether to hide the JSON field in the admin UI |

## json5Field

A convenient wrapper around `simplerJSON` that defaults to JSON5 format:

1. A code field for editing in JSON5 format
2. A JSON field for storing the parsed data

### Usage

```typescript
import { json5Field } from '../../lib/fields/json5Field'

fields: [
  // Other fields...
  ...json5Field({
    jsonFieldName: 'data',
    label: 'JSON5 Data',
  }),
  // More fields...
]
```

### Options

| Option         | Type              | Default                                                  | Description                                    |
| -------------- | ----------------- | -------------------------------------------------------- | ---------------------------------------------- |
| jsonFieldName  | string            | 'shape'                                                  | Name of the JSON field                         |
| codeFieldName  | string            | 'json5Data'                                              | Name of the code field                         |
| label          | string            | 'Schema'                                                 | Label for the code field                       |
| adminCondition | function          | () => true                                               | Condition for showing fields in admin UI       |
| editorOptions  | object            | { lineNumbers: 'off', padding: { top: 20, bottom: 20 } } | Editor options for the code field              |
| hideJsonField  | boolean           | true                                                     | Whether to hide the JSON field in the admin UI |

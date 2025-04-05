import yaml from 'yaml'
import type { Condition, Field } from 'payload'

type JSON5Interface = {
  parse: typeof JSON.parse
  stringify: (obj: unknown, options?: unknown) => string
  default?: {
    parse: typeof JSON.parse
    stringify: (obj: unknown, options?: unknown) => string
  }
}

let json5: {
  parse: typeof JSON.parse
  stringify: (obj: unknown, options?: unknown) => string
}

try {
  const importedJson5 = (await import('json5')) as JSON5Interface
  json5 = importedJson5.default || importedJson5
} catch (error) {
  console.warn('JSON5 not available, falling back to JSON')
  json5 = {
    parse: JSON.parse,
    stringify: (obj: unknown, options?: unknown) => JSON.stringify(obj, null, 2),
  }
}

type SchemaFormat = 'yaml' | 'json5'

type SimplerJSONOptions = {
  jsonFieldName?: string
  codeFieldName?: string
  label?: string

  defaultFormat?: SchemaFormat

  adminCondition?: Condition
  editorOptions?: {
    lineNumbers?: 'on' | 'off'
    padding?: {
      top?: number
      bottom?: number
    }
  }

  hideJsonField?: boolean
}

/**
 * Creates a pair of fields for schema editing:
 * 1. A code field for editing in YAML or JSON5 format
 * 2. A JSON field for storing the parsed data
 *
 * The function handles conversion between formats and validation.
 */
export const simplerJSON = ({
  jsonFieldName = 'shape',
  codeFieldName = 'schemaYaml',
  label = 'Schema',
  defaultFormat = 'yaml',
  adminCondition = () => true,
  editorOptions = {
    lineNumbers: 'off',
    padding: { top: 20, bottom: 20 },
  },
  hideJsonField = true,
}: SimplerJSONOptions = {}): Field[] => {
  const language = defaultFormat === 'yaml' ? 'yaml' : 'json'

  return [
    {
      name: codeFieldName,
      type: 'code',
      label,
      admin: {
        language,
        editorOptions,
        condition: adminCondition,
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (value && typeof value === 'string' && value.trim()) {
              try {
                let jsonData

                if (language === 'yaml') {
                  jsonData = yaml.parse(value)
                } else {
                  jsonData = json5.parse(value)
                }

                siblingData[jsonFieldName] = jsonData
              } catch (error) {
                return `Invalid ${language.toUpperCase()} format`
              }
            } else {
              siblingData[jsonFieldName] = {}
            }
            return value
          },
        ],
        afterRead: [
          ({ value, data }) => {
            if (data && data[jsonFieldName]) {
              try {
                if (language === 'yaml') {
                  return yaml.stringify(data[jsonFieldName], {
                    indent: 2,
                    lineWidth: -1, // No line wrapping
                  })
                } else {
                  return json5.stringify(data[jsonFieldName], {
                    space: 2,
                    quote: '"',
                  })
                }
              } catch (error) {
                console.error(`Error converting JSON to ${language.toUpperCase()}:`, error)
                return ''
              }
            }
            return value || ''
          },
        ],
      },
    },
    {
      name: jsonFieldName,
      type: 'json',
      admin: {
        condition: adminCondition,
        editorOptions: { padding: { top: 20, bottom: 20 } },
        hidden: hideJsonField,
      },
    },
  ] satisfies Field[]
}

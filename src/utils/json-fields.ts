/**
 * Utility functions for JSON field handling
 * Replaces functions previously imported from payload-utils
 */

type Field = {
  name: string
  type: string
  label?: string
  admin?: {
    language?: string
    condition?: (data: any) => boolean
    hidden?: boolean
    editorOptions?: any
  }
  hooks?: {
    beforeChange?: Array<(args: { value: any; data: any }) => any>
    afterRead?: Array<(args: { value: any; data: any }) => any>
  }
}

type SimplerJSONOptions = {
  jsonFieldName?: string
  codeFieldName?: string
  label?: string
  defaultFormat?: 'yaml' | 'json5'
  hideJsonField?: boolean
  adminCondition?: (data: any) => boolean
  editorOptions?: {
    lineNumbers?: 'on' | 'off'
    padding?: { top: number; bottom: number }
  }
}

export const simplerJSON = (options: SimplerJSONOptions = {}): Field[] => {
  const {
    jsonFieldName = 'shape',
    codeFieldName = 'schemaYaml',
    label = 'Schema',
    defaultFormat = 'yaml',
    hideJsonField = true,
    adminCondition,
    editorOptions = { lineNumbers: 'off', padding: { top: 20, bottom: 20 } },
  } = options

  return [
    {
      name: codeFieldName,
      type: 'code',
      label,
      admin: {
        language: defaultFormat === 'yaml' ? 'yaml' : 'json',
        condition: adminCondition,
        editorOptions,
      },
      hooks: {
        beforeChange: [
          ({ value, data }: { value: any; data: any }) => {
            if (!value || !data) return value
            try {
              if (defaultFormat === 'yaml') {
                const yaml = require('yaml')
                data[jsonFieldName] = yaml.parse(value)
              } else {
                const JSON5 = require('json5')
                data[jsonFieldName] = JSON5.parse(value)
              }
            } catch (error) {
              console.error('Error parsing schema:', error)
            }
            return value
          },
        ],
        afterRead: [
          ({ value, data }: { value: any; data: any }) => {
            if (!data || !data[jsonFieldName]) return value
            try {
              if (defaultFormat === 'yaml') {
                const yaml = require('yaml')
                return yaml.stringify(data[jsonFieldName])
              } else {
                const JSON5 = require('json5')
                return JSON5.stringify(data[jsonFieldName], null, 2)
              }
            } catch (error) {
              console.error('Error stringifying schema:', error)
              return value
            }
          },
        ],
      },
    },
    {
      name: jsonFieldName,
      type: 'json',
      admin: {
        hidden: hideJsonField,
        condition: adminCondition,
      },
    },
  ]
}

export const json5Field = (options: Omit<SimplerJSONOptions, 'defaultFormat'> = {}): Field[] => {
  return simplerJSON({
    jsonFieldName: options.jsonFieldName || 'shape',
    codeFieldName: options.codeFieldName || 'json5Data',
    label: options.label || 'JSON Data',
    defaultFormat: 'json5',
    hideJsonField: options.hideJsonField !== undefined ? options.hideJsonField : true,
    adminCondition: options.adminCondition,
    editorOptions: options.editorOptions || { lineNumbers: 'off', padding: { top: 20, bottom: 20 } },
  })
}

/**
 * Utility functions for JSON field handling
 * Replaces functions previously imported from payload-utils
 */

import type { CodeField, Condition, JSONField, TypeWithID } from 'payload'

type SimplerJSONOptions<TData extends TypeWithID = any, TSiblingData extends TypeWithID = any> = {
  jsonFieldName?: string
  codeFieldName?: string
  label?: string
  defaultFormat?: 'yaml' | 'json5'
  hideJsonField?: boolean
  adminCondition?: Condition<TData, TSiblingData>
  editorOptions?: {
    lineNumbers?: 'on' | 'off'
    padding?: { top: number; bottom: number }
  }
}

export const simplerJSON = <TData extends TypeWithID = any, TSiblingData extends TypeWithID = any>(
  options: SimplerJSONOptions<TData, TSiblingData> = {},
): [CodeField, JSONField] => {
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
          ({ value, data }) => {
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
          ({ value, data }) => {
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

export const json5Field = <TData extends TypeWithID = any, TSiblingData extends TypeWithID = any>(
  options: Omit<SimplerJSONOptions<TData, TSiblingData>, 'defaultFormat'> = {},
): [CodeField, JSONField] => {
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

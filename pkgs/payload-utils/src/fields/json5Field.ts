import { simplerJSON } from './simplerJSON'

type SchemaFormat = 'yaml' | 'json5'

type SimplerJSONOptions = {
  jsonFieldName?: string
  codeFieldName?: string
  label?: string
  defaultFormat?: SchemaFormat
  adminCondition?: any
  editorOptions?: {
    lineNumbers?: 'on' | 'off'
    padding?: {
      top?: number
      bottom?: number
    }
  }
  hideJsonField?: boolean
}

export const json5Field = (options: Omit<SimplerJSONOptions, 'defaultFormat'> = {}) => 
  simplerJSON({
    ...options,
    defaultFormat: 'json5',
    codeFieldName: options.codeFieldName || 'json5Data'
  })

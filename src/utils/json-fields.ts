/**
 * Re-export utility functions from payload-utils package
 * Using direct import from dist folder to avoid export issues
 */
import type { Field } from 'payload/types'

import { simplerJSON } from 'payload-utils/dist'

export { simplerJSON }

export const json5Field = (options: any = {}): Field[] => {
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
